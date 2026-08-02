const STEPS = [
  {
    num: '1',
    icon: '📋',
    color: 'var(--blue-400)',
    title: 'Claim Submitted',
    subtitle: 'Farmer Input',
    desc: 'Farmer declares: crop type, GPS coordinates, incident date, and cause of loss (Drought, Extreme Heat, Excess Rainfall).',
    detail: 'Inputs: Crop · Region · Date · Cause',
  },
  {
    num: '2',
    icon: '🛰️',
    color: 'var(--green-400)',
    title: 'GEE Data Pull',
    subtitle: 'DataEngineering Layer',
    desc: 'Google Earth Engine pulls 6 months of Sentinel-1, Sentinel-2, and ERA5 data for the GPS location. Cloud gaps are filled via temporal interpolation.',
    detail: 'Output: (6 × 64×64 × 17) Tensor',
  },
  {
    num: '3',
    icon: '🔵',
    color: 'var(--purple-400)',
    title: 'Presto Encoding',
    subtitle: 'Foundation Model',
    desc: 'The Presto foundation model compresses each monthly observation into a rich 128-dimensional embedding vector capturing the farm\'s geospatial fingerprint.',
    detail: 'Output: 128-D Embedding per Month',
  },
  {
    num: '4',
    icon: '🤖',
    color: 'var(--purple-500)',
    title: 'Mamba Classification',
    subtitle: 'Temporal SSM',
    desc: 'The Mamba SSM processes the full 6-month sequence. Its selective Δt mechanism automatically ignores cloudy/corrupted dates and outputs a health classification.',
    detail: 'Output: Class + Confidence Score',
  },
  {
    num: '5',
    icon: '🌱',
    color: 'var(--gold-500)',
    title: 'Agronomic Validation',
    subtitle: 'Crop Intelligence Layer',
    desc: 'The phenology engine maps NDVI to growth stage. The Jensen Yield Loss model computes exact % damage. Fraud checks compare satellite-observed vs. claimed patterns.',
    detail: 'Output: Yield Loss % + Fraud Flags',
  },
  {
    num: '6',
    icon: '✅',
    color: 'var(--green-500)',
    title: 'AI Decision Report',
    subtitle: 'Final Output',
    desc: 'Both AI models must corroborate before approval. A biological evidence narrative + human auditor action items are generated for every claim outcome.',
    detail: 'Approve · Partial · Audit-L · Audit-H',
  },
]

export default function PipelineSection() {
  return (
    <section id="pipeline" className="section" style={{ background: 'rgba(15,31,53,0.3)' }}>
      <div className="container">
        <div className="section-label">⚙️ System Pipeline</div>
        <h2 className="section-title">
          From Claim Submission to<br />
          <span className="highlight">AI-Verified Decision</span>
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 64 }}>
          Every insurance claim flows through a deterministic 6-step pipeline — each step
          adding a layer of evidence before the final recommendation.
        </p>

        {/* Pipeline flow */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            left: 28,
            top: 56,
            bottom: 56,
            width: 2,
            background: 'linear-gradient(to bottom, var(--blue-400), var(--green-400), var(--purple-400), var(--purple-500), var(--gold-500), var(--green-500))',
            opacity: 0.3,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 24,
                alignItems: 'flex-start',
                position: 'relative',
              }}>
                {/* Step number + icon */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)`,
                  border: `1px solid ${step.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                  zIndex: 1,
                  boxShadow: `0 0 16px ${step.color}20`,
                }}>{step.icon}</div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '18px 22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 20,
                  flexWrap: 'wrap',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = step.color + '40'
                    e.currentTarget.style.background = 'var(--bg-card-hover)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--bg-card)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11,
                        color: step.color,
                        fontWeight: 700,
                        background: `${step.color}15`,
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}>Step {step.num}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.subtitle}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                  <div style={{
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: 'JetBrains Mono, monospace',
                    whiteSpace: 'nowrap',
                  }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud types */}
        <div style={{
          marginTop: 56,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 32,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: 'var(--text-primary)' }}>
            🔍 What the System Flags as Fraud
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { flag: 'Crop Season Mismatch', eg: 'Wheat claimed during June (Kharif monsoon)', icon: '📅' },
              { flag: 'NDVI Template Mismatch', eg: 'Cotton NDVI profile claimed as Paddy', icon: '📈' },
              { flag: 'Weather Cause Mismatch', eg: '"Drought" but ERA5 shows normal rainfall', icon: '🌧️' },
              { flag: 'Mamba vs Jensen Conflict', eg: 'Model says healthy; Jensen says stressed', icon: '⚔️' },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 10,
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#fca5a5', marginBottom: 4 }}>{f.flag}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>e.g. {f.eg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
