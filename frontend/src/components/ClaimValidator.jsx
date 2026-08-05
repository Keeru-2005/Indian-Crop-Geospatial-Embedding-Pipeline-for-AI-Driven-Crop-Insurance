import { useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_URL = 'http://localhost:8000'

// MVP Pilot is Guntur/Nellore, Andhra Pradesh ONLY.
// The GEE pipeline extracted tensors for these exact coordinates.
// Adding more regions requires running gee_timeseries_pipeline.py
// for each new GPS point and saving the tensor to disk.
const PILOT_REGION = {
  label: 'Andhra Pradesh — Nellore / Guntur District',
  lat: '16.5062° N',
  lon: '80.6480° E',
  note: 'MVP Pilot · Kharif 2024',
}

const CROPS = [
  { value: 'Paddy',     label: 'Paddy (Rice)', season: 'Kharif (Jun–Nov)' },
  { value: 'Wheat',     label: 'Wheat',        season: 'Rabi (Dec–May)' },
  { value: 'Cotton',    label: 'Cotton',       season: 'Kharif (Jun–Nov)' },
  { value: 'Maize',     label: 'Maize (Corn)', season: 'Kharif (Jun–Oct)' },
]

const CAUSES = [
  'Drought',
  'Extreme Heat',
  'Excess Rainfall',
  'Pest/Disease',
]

// Map backend decision → display config
const DECISION_CONFIG = {
  RECOMMEND_APPROVE: {
    label: 'AI RECOMMENDS: APPROVE',
    sub: 'Strong biophysical evidence supports this claim.',
    color: 'var(--green-500)',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.3)',
    icon: '✅',
    badgeClass: 'badge-approve',
  },
  RECOMMEND_APPROVE_PARTIAL: {
    label: 'AI RECOMMENDS: PARTIAL APPROVAL',
    sub: 'Moderate stress validated. Reduced payout recommended.',
    color: 'var(--gold-400)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    icon: '⚡',
    badgeClass: 'badge-partial',
  },
  RECOMMEND_AUDIT_HIGH_PRIORITY: {
    label: 'ESCALATE: HIGH-PRIORITY AUDIT',
    sub: 'Active fraud signals detected. Immediate field inspection required.',
    color: '#f87171',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    icon: '🚨',
    badgeClass: 'badge-audit-high',
  },
  RECOMMEND_AUDIT_LOW_PRIORITY: {
    label: 'RECOMMEND: ROUTINE AUDIT',
    sub: 'No strong biophysical anomaly detected. Standard review required.',
    color: 'var(--orange-400)',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.3)',
    icon: '⚠️',
    badgeClass: 'badge-audit-low',
  },
}

// ── Confidence ring SVG ──────────────────────────────────────────────────────
function ConfidenceRing({ value, color }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = circ * value
  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: 'JetBrains Mono, monospace' }}>
          {Math.round(value * 100)}%
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Confidence</div>
      </div>
    </div>
  )
}

// ── NDVI mini-chart ──────────────────────────────────────────────────────────
function NdviChart({ ndvi, timestamps }) {
  const data = ndvi.map((v, i) => ({
    month: timestamps?.[i]?.slice(0, 7) ?? `M${i + 1}`,
    NDVI: parseFloat(v.toFixed(3)),
  }))
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
        <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: '#64748b' }} />
        <Tooltip
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: 'var(--text-primary)' }}
        />
        <Line type="monotone" dataKey="NDVI" stroke="var(--green-400)" strokeWidth={2} dot={{ r: 3, fill: 'var(--green-400)' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Results panel ────────────────────────────────────────────────────────────
function ResultPanel({ result }) {
  const cfg = DECISION_CONFIG[result.validation_decision] ?? DECISION_CONFIG.RECOMMEND_AUDIT_LOW_PRIORITY

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Decision banner */}
      <div style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 16,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 48 }}>{cfg.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: cfg.color, marginBottom: 4 }}>
            {cfg.label}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{cfg.sub}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            Claim ID: <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{result.claim_id}</code>
          </div>
        </div>
        <ConfidenceRing value={result.confidence_score} color={cfg.color} />
      </div>

      {/* Key metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {[
          { label: 'Reported Crop', value: result.reported_crop, icon: '🌾' },
          { label: 'Incident Stage', value: result.incident_stage, icon: '📅' },
          { label: 'Est. Yield Loss', value: `${result.estimated_yield_loss_pct?.toFixed(1)}%`, icon: '📉' },
          { label: 'Stage Sensitivity', value: `Ky = ${result.stage_sensitivity?.toFixed(1) ?? 'N/A'}`, icon: '⚡' },
          { label: 'Crop Match', value: result.crop_misreporting_detected ? `❌ ${result.detected_crop_match}` : '✅ Confirmed', icon: '🔍' },
          { label: 'Season', value: result.season?.toUpperCase() ?? '—', icon: '🗓️' },
        ].map((m, i) => (
          <div key={i} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* NDVI chart */}
      {result.observed_ndvi_profile?.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📈 Observed NDVI Time Series</div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
            Greenness index for the satellite-observed farm patch (0 = bare soil, 1 = dense vegetation)
          </p>
          <NdviChart ndvi={result.observed_ndvi_profile} timestamps={result.satellite_timestamps} />
        </div>
      )}

      {/* Biological evidence */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '18px 20px',
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🔬 AI Biological Evidence Narrative</div>
        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          fontStyle: 'italic',
          borderLeft: `3px solid ${cfg.color}`,
          paddingLeft: 16,
        }}>
          {result.biological_evidence || 'No narrative generated.'}
        </p>
      </div>

      {/* Auditor action items */}
      {result.human_auditor_action_items?.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 20px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            👤 Recommended Actions for Human Adjuster
          </div>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.human_auditor_action_items.map((item, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ── Main Validator component ─────────────────────────────────────────────────
export default function ClaimValidator() {
  const [form, setForm] = useState({
    farmer_name: 'Raju Reddy',
    crop_type: 'Paddy',
    incident_date: '2024-09-15',
    cause_of_loss: 'Drought',
    farm_area_ha: 2.5,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const selectedCrop = CROPS.find(c => c.value === form.crop_type)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setResult(null)
    setError(null)
  }

  const runPayload = async (payload) => {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const fullPayload = { ...payload, region: 'andhra_pradesh' }
      const { data } = await axios.post(`${API_URL}/validate-claim`, fullPayload, { timeout: 120000 })
      setResult(data)
    } catch (err) {
      const msg = err.response?.data?.detail ?? err.message
      setError(`Backend Error: ${msg}.\n\nEnsure FastAPI backend is running on http://localhost:8000 (run: python backend/app.py)`)
    } finally {
      setLoading(false)
    }
  }

  const handlePreset = (presetType) => {
    let p = { farmer_name: 'Raju Reddy', crop_type: 'Paddy', incident_date: '2024-09-15', cause_of_loss: 'Drought', farm_area_ha: 2.5 }
    if (presetType === 'misreport') {
      p = { farmer_name: 'Sita Ramaiah', crop_type: 'Wheat', incident_date: '2024-08-10', cause_of_loss: 'Drought', farm_area_ha: 1.8 }
    } else if (presetType === 'heat') {
      p = { farmer_name: 'Venkat Rao', crop_type: 'Cotton', incident_date: '2024-10-05', cause_of_loss: 'Extreme Heat', farm_area_ha: 3.2 }
    }
    setForm(p)
    runPayload(p)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runPayload(form)
  }

  return (
    <section id="demo" className="section" style={{ background: 'rgba(15,31,53,0.4)', paddingTop: 40 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="section-label">🚀 Interactive AI Claim Verification</div>
            <h2 className="section-title" style={{ marginBottom: 4 }}>
              Automated <span className="highlight">Insurance Claim Auditor</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Submit a farm claim to evaluate satellite NDVI, ERA5 weather stress, and Mamba SSM phenology in real-time.
            </p>
          </div>

          {/* Quick Demo Preset Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => handlePreset('valid')}
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: 'var(--green-400)',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🌾 Valid Claim Preset
            </button>
            <button
              onClick={() => handlePreset('misreport')}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🚨 Fraud / Misreporting Preset
            </button>
            <button
              onClick={() => handlePreset('heat')}
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: 'var(--gold-400)',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⚠️ Weather Mismatch Preset
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 28, alignItems: 'start' }}>
          {/* ── Form ── */}
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Insurance Claim Form</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
              Fill all fields and submit to run the AI pipeline
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Farmer Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Raju Reddy"
                  value={form.farmer_name}
                  onChange={e => handleChange('farmer_name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Crop Type</label>
                <select
                  className="form-select"
                  value={form.crop_type}
                  onChange={e => handleChange('crop_type', e.target.value)}
                >
                  {CROPS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {selectedCrop && (
                  <div style={{ fontSize: 12, color: 'var(--green-400)', marginTop: 4 }}>
                    📅 Season: {selectedCrop.season}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Farm Region</label>
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                    📍 {PILOT_REGION.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {PILOT_REGION.lat} &nbsp;·&nbsp; {PILOT_REGION.lon}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--green-600)', marginTop: 2 }}>
                    {PILOT_REGION.note} — only region with extracted satellite tensors
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Incident Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.incident_date}
                    onChange={e => handleChange('incident_date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Farm Area (ha)</label>
                  <input
                    className="form-input"
                    type="number"
                    min={0.1}
                    max={100}
                    step={0.1}
                    value={form.farm_area_ha}
                    onChange={e => handleChange('farm_area_ha', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reported Cause of Loss</label>
                <select
                  className="form-select"
                  value={form.cause_of_loss}
                  onChange={e => handleChange('cause_of_loss', e.target.value)}
                >
                  {CAUSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <><span className="spinner" /> Running AI Pipeline...</>
                ) : (
                  '🚀 Validate Claim'
                )}
              </button>
            </form>

            {/* Pipeline status */}
            {loading && (
              <div style={{
                marginTop: 20,
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 10,
                padding: '14px 16px',
                fontSize: 12,
                color: 'var(--green-400)',
                lineHeight: 2,
              }}>
                {['↳ Loading satellite tensor...', '↳ Applying boundary sanitisation...', '↳ Running Mamba SSM classifier...', '↳ Computing Jensen yield loss model...', '↳ Generating biological evidence report...'].map((s, i) => (
                  <div key={i} style={{ opacity: 0.8, animationDelay: `${i * 0.3}s` }}>{s}</div>
                ))}
              </div>
            )}
          </div>

          {/* ── Results ── */}
          <div>
            {!result && !error && !loading && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border)',
                borderRadius: 20,
                padding: '64px 32px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🛰️</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--text-secondary)' }}>
                  Waiting for Claim Submission
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                  Fill out the form and click <strong style={{ color: 'var(--text-primary)' }}>Validate Claim</strong>.
                  <br />The AI pipeline will run in seconds and the full validation report will appear here.
                </p>
              </div>
            )}

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 14,
                padding: '20px 24px',
                color: '#fca5a5',
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}>
                <strong>⚠️ Error:</strong><br />{error}
              </div>
            )}

            {result && <ResultPanel result={result} />}
          </div>
        </div>
      </div>
    </section>
  )
}
