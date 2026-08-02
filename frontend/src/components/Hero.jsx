import { useEffect, useRef } from 'react'

const STATS = [
  { value: '92.42%', label: 'Accuracy Under 50% Cloud Cover', icon: '☁️' },
  { value: '100%',   label: 'Payout Recall — No Valid Claim Denied', icon: '✅' },
  { value: '128-D',  label: 'Presto Foundation Embeddings', icon: '🧠' },
  { value: '150',    label: 'Claims Validated in Benchmark', icon: '📋' },
]

function StatCard({ stat, delay }) {
  return (
    <div style={{
      background: 'rgba(15, 31, 53, 0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '20px 24px',
      backdropFilter: 'blur(12px)',
      animation: `fadeInUp 0.6s ease ${delay}ms both`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 4,
      }}>{stat.value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{stat.label}</div>
    </div>
  )
}

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 80,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Grid bg */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 40, paddingBottom: 80 }}>
        {/* Label */}
        <div className="section-label" style={{ animation: 'fadeInUp 0.5s ease both' }}>
          <span>🛰️</span> Indian Crop Insurance · AI Decision Support
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 900,
          lineHeight: 1.08,
          marginBottom: 24,
          animation: 'fadeInUp 0.6s ease 100ms both',
          maxWidth: 820,
        }}>
          Protecting Indian Farmers<br />
          with <span className="highlight">Satellite AI</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18,
          color: 'var(--text-secondary)',
          maxWidth: 600,
          lineHeight: 1.75,
          marginBottom: 36,
          animation: 'fadeInUp 0.6s ease 200ms both',
        }}>
          An end-to-end multi-modal AI pipeline that validates crop insurance claims
          using <strong style={{ color: 'var(--text-primary)' }}>Sentinel-1/2 satellite imagery</strong>,
          {' '}<strong style={{ color: 'var(--text-primary)' }}>Presto geospatial embeddings</strong>, and a
          {' '}<strong style={{ color: 'var(--text-primary)' }}>Mamba State Space Model</strong> — even through
          monsoon cloud cover.
        </p>

        {/* CTA row */}
        <div style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          marginBottom: 64,
          animation: 'fadeInUp 0.6s ease 300ms both',
        }}>
          <a href="#demo" className="btn-primary">
            🚀 Try Live Claim Validator
          </a>
          <a href="#pipeline" className="btn-secondary">
            See How It Works ↓
          </a>
        </div>

        {/* Stats grid */}
        <div className="grid-4" style={{ animation: 'fadeInUp 0.6s ease 400ms both' }}>
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} delay={i * 80} />
          ))}
        </div>

        {/* Tech tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 40,
          animation: 'fadeInUp 0.6s ease 500ms both',
        }}>
          {['Sentinel-1 SAR','Sentinel-2','Google Earth Engine','Presto Foundation Model',
            'Mamba SSM','Jensen Yield Loss Model','ERA5 Weather','PMFBY India'].map(tag => (
            <span key={tag} style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '4px 12px',
              borderRadius: 100,
              fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
