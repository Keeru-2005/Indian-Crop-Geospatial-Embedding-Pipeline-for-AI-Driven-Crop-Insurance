import { useState, useEffect } from 'react'

const NAV_TABS = [
  { id: 'auditor', label: '🛡️ Claim Auditor' },
  { id: 'metrics', label: '📊 Validation Metrics' },
  { id: 'pipeline', label: '⚡ AI Pipeline' },
  { id: 'framework', label: '📜 7-Point Framework' },
]

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(5, 13, 20, 0.95)' : 'rgba(10, 22, 40, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('auditor')}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 0 20px rgba(34,197,94,0.4)',
          }}>🌾</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Agri<span style={{ color: 'var(--green-400)' }}>Shield</span> <span style={{ color: 'var(--gold-400)', fontWeight: 600, fontSize: 12 }}>AI</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Crop Insurance Validation Platform</div>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <nav style={{
          display: 'flex',
          background: 'rgba(15, 31, 53, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
        }}>
          {NAV_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.3))' : 'transparent',
                  color: isActive ? 'var(--green-400)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Live System Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '12px',
          color: 'var(--green-400)',
          fontWeight: 600,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--green-400)',
            boxShadow: '0 0 10px var(--green-400)',
          }} />
          Mamba SSM Online
        </div>
      </div>
    </header>
  )
}
