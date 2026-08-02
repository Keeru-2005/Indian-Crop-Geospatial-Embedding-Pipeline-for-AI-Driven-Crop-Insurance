export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '48px 0 32px',
      background: 'var(--bg-secondary)',
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>🌾</div>
              <span style={{ fontWeight: 800, fontSize: 18 }}>
                Agri<span style={{ color: 'var(--green-400)' }}>Shield</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 12, marginLeft: 4 }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              An end-to-end AI decision-support system for Pradhan Mantri Fasal Bima Yojana (PMFBY)
              crop insurance validation. Built for the Indian agricultural context.
            </p>
          </div>

          {/* Tech stack */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--text-secondary)' }}>
              TECHNOLOGY STACK
            </div>
            {[
              'Google Earth Engine (GEE)',
              'Sentinel-1 SAR + Sentinel-2 MSI',
              'Presto Foundation Model',
              'Mamba State Space Model (SSM)',
              'Jensen FAO-56 Yield Loss Model',
              'ERA5-Land Climate Reanalysis',
            ].map(t => (
              <div key={t} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
                ◆ {t}
              </div>
            ))}
          </div>

          {/* Modules */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--text-secondary)' }}>
              SYSTEM MODULES
            </div>
            {[
              'data_engineering/ — GEE Pipeline',
              'crop_intelligence/ — Biophysical AI',
              'temporal_intelligence/ — Mamba SSM',
              'backend/ — FastAPI REST API',
              'frontend/ — React + Vite UI',
            ].map(m => (
              <div key={m} style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginBottom: 6,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {m}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Pilot Region: Andhra Pradesh (Nellore / Guntur) · Crop: Paddy · Season: Kharif 2024
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Under PMFBY · AI Decision Support — Human-in-the-Loop
          </div>
        </div>
      </div>
    </footer>
  )
}
