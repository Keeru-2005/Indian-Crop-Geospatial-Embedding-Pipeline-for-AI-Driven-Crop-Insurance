import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Metrics', href: '#metrics' },
  { label: 'Live Demo', href: '#demo' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled
        ? 'rgba(5, 13, 20, 0.92)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 0 20px rgba(34,197,94,0.4)',
          }}>🌾</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
            Agri<span style={{ color: 'var(--green-400)' }}>Shield</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 12, marginLeft: 4 }}>AI</span>
          </span>
        </a>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '6px 14px',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.target.style.color = 'var(--text-primary)'
                e.target.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                e.target.style.color = 'var(--text-secondary)'
                e.target.style.background = 'transparent'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a href="#demo" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }}>
          Try Live Demo →
        </a>
      </div>
    </nav>
  )
}
