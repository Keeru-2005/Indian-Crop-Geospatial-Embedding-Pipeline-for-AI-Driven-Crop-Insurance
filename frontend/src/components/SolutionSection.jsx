const PILLARS = [
  {
    icon: '🛰️',
    number: '01',
    color: 'var(--blue-400)',
    glow: 'var(--blue-glow)',
    title: 'Data Engineering',
    subtitle: 'Google Earth Engine Pipeline',
    desc: 'Connects to GEE to extract 6 months of multi-spectral satellite data for any GPS coordinate in India. Outputs a temporal tensor of shape (T × H × W × 17 channels).',
    features: [
      'Sentinel-2: B2–B12 optical bands + NDVI',
      'Sentinel-1: VV/VH radar — penetrates monsoon clouds',
      'ERA5-Land: temperature & cumulative precipitation',
      'SRTM DEM: elevation & slope for terrain context',
      'Cloud gap filling via linear temporal interpolation',
      '64×32px central-buffer boundary sanitisation',
    ],
  },
  {
    icon: '🌿',
    number: '02',
    color: 'var(--green-500)',
    glow: 'var(--green-glow)',
    title: 'Crop Intelligence',
    subtitle: 'Biophysical Agronomic AI',
    desc: 'The agronomic knowledge layer. Knows the physiology of Paddy, Wheat, Cotton and Maize — expected NDVI curves, stage sensitivities, and optimal temperature windows.',
    features: [
      'FAO Crop Knowledge DB: Kharif & Rabi species',
      'Growth Stage Engine: NDVI → phenology mapping',
      'Jensen Multiplicative Yield Loss Model (FAO-56)',
      'Pearson correlation crop template matching',
      'Season mismatch → fraud detection',
      'Four-outcome decision: Approve / Partial / Audit-L / Audit-H',
    ],
  },
  {
    icon: '🤖',
    number: '03',
    color: 'var(--purple-400)',
    glow: 'var(--purple-glow)',
    title: 'Temporal Intelligence',
    subtitle: 'Mamba State Space Model',
    desc: 'The deep learning backbone. Processes the 6-month time series using Mamba\'s selective scan mechanism — learning to ignore cloud-corrupted months by gating Δt → 0.',
    features: [
      'Presto foundation model: 128-D farm embeddings',
      'Mamba SSM: linear O(L) complexity vs O(L²) Transformer',
      'Selective Δt gating — skips corrupted cloud dates',
      '93.4% accuracy on clean data; 92.4% at 50% cloud cover',
      '4-class output: Kharif/Rabi × Healthy/Stressed',
      'Pre-trained weights: mamba_paddy_pilot.pt',
    ],
  },
]

function PillarCard({ pillar }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Number watermark */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 20,
        fontSize: 72,
        fontWeight: 900,
        color: 'rgba(255,255,255,0.03)',
        lineHeight: 1,
        fontFamily: 'JetBrains Mono, monospace',
        userSelect: 'none',
      }}>{pillar.number}</div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: pillar.glow,
          border: `1px solid ${pillar.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          boxShadow: `0 0 20px ${pillar.glow}`,
        }}>{pillar.icon}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>{pillar.title}</div>
          <div style={{ fontSize: 12, color: pillar.color, fontWeight: 600 }}>{pillar.subtitle}</div>
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
        {pillar.desc}
      </p>

      {/* Feature list */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pillar.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
            <span style={{ color: pillar.color, flexShrink: 0, marginTop: 2 }}>◆</span>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const NOVELTY = [
  { icon: '🔬', title: 'Dual Deep-Learning Corroboration', desc: 'Jensen biophysical model + Mamba SSM must both agree before approving — eliminates single-model hallucinations.' },
  { icon: '🎯', title: 'Stage-Aware Sensitivity', desc: 'Damage at Paddy Flowering (Ky=1.2) is far more impactful than at Sowing (Ky=0.2). Our model knows this.' },
  { icon: '🔔', title: 'Human-in-the-Loop by Design', desc: 'AI never auto-rejects. It grades confidence & evidence — human officers review edge cases, not routine claims.' },
  { icon: '☁️', title: 'Cloud-Invariant Inference', desc: 'Mamba\'s Δt gating drops corrupted time steps to ≈ 0 state update — no other model has this selective memory.' },
]

export default function SolutionSection() {
  return (
    <section id="solution" className="section">
      <div className="container">
        <div className="section-label">✅ Our Solution</div>
        <h2 className="section-title">
          A <span className="highlight">Three-Layer AI Architecture</span><br />
          for Satellite-Based Claim Validation
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 56 }}>
          Each layer solves a different part of the problem — combined, they form a
          7-point biophysical validation framework specific to Indian agriculture.
        </p>

        <div className="grid-3" style={{ marginBottom: 56 }}>
          {PILLARS.map((p, i) => <PillarCard key={i} pillar={p} />)}
        </div>

        {/* Novelty section */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '36px 32px',
        }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: 'var(--gold-400)' }}>
            ⭐ Key Novelty Contributions
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
            What makes this system scientifically distinct from prior work
          </p>
          <div className="grid-4">
            {NOVELTY.map((n, i) => (
              <div key={i} style={{ borderLeft: '2px solid var(--green-700)', paddingLeft: 16 }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{n.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{n.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{n.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
