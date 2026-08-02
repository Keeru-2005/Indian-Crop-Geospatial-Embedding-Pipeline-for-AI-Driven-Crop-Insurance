const PROBLEMS = [
  {
    icon: '🌾',
    color: 'var(--gold-500)',
    glow: 'var(--gold-glow)',
    title: 'Spatial Boundary Mixing',
    desc: 'Indian smallholder farms are often <2 hectares. At Sentinel-2\'s 10m resolution, boundary pixels mix signals from adjacent fields, roads, and trees — corrupting vegetative data.',
    fix: 'Our 64×32px central-buffer crop isolates the pure farm core.',
  },
  {
    icon: '☁️',
    color: 'var(--blue-400)',
    glow: 'var(--blue-glow)',
    title: 'Monsoon Cloud Cover',
    desc: 'Kharif (June–Nov) is India\'s main crop season and the South-West monsoon\'s peak. Thick clouds can entirely block optical sensors for weeks during critical growth stages.',
    fix: 'Sentinel-1 SAR penetrates clouds. Temporal interpolation fills optical gaps.',
  },
  {
    icon: '🚨',
    color: 'var(--red-500)',
    glow: 'var(--red-glow)',
    title: 'Crop Misreporting (Fraud)',
    desc: 'Farmers may claim expensive crops like Paddy while growing cheaper varieties, or file for Rabi Wheat during the Kharif monsoon — an agronomic impossibility.',
    fix: 'Pearson correlation template matching detects season & species mismatches.',
  },
  {
    icon: '🌡️',
    color: 'var(--orange-500)',
    glow: 'rgba(249,115,22,0.12)',
    title: 'Weather-Cause Mismatch',
    desc: 'Claiming "drought damage" requires proof. Without cross-referencing ERA5 meteorological data, fraudulent thermal or moisture cause claims go undetected.',
    fix: 'ERA5 reanalysis validates every reported peril against actual weather events.',
  },
  {
    icon: '📡',
    color: 'var(--purple-400)',
    glow: 'var(--purple-glow)',
    title: 'Observation Sparsity',
    desc: 'Orbital revisit cycles and cloud masking create irregular, sparse time-series. LSTM loses long-range memory; Transformers cost O(L²) making long crop-monitoring prohibitive.',
    fix: 'Mamba SSM achieves O(L) linear complexity with selective state gating.',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="section" style={{
      background: 'linear-gradient(180deg, transparent, rgba(15,31,53,0.5), transparent)',
    }}>
      <div className="container">
        <div className="section-label">⚠️ The Challenges</div>
        <h2 className="section-title">
          Why Crop Insurance Validation<br />
          Is <span className="highlight">Hard to Automate</span>
        </h2>
        <p className="section-subtitle" style={{ marginBottom: 56 }}>
          Five critical failure modes make satellite-based insurance verification unreliable without a
          purpose-built, multi-modal AI pipeline.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="card"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Accent bar */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: p.color,
                opacity: 0.8,
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: p.glow,
                  border: `1px solid ${p.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}>{p.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, paddingTop: 4 }}>
                  {p.title}
                </h3>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                {p.desc}
              </p>

              {/* Fix pill */}
              <div style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                color: 'var(--green-400)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>✓</span>
                <span>{p.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
