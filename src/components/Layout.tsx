import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Shop', end: true },
  { to: '/group', label: 'Group' },
  { to: '/opd', label: 'Digital OPD' },
  { to: '/energy', label: 'Energy' },
  { to: '/agri', label: 'Agri' },
  { to: '/infra', label: 'Infra' },
  { to: '/technology', label: 'Technology' },
  { to: '/investor', label: 'Investors' },
  { to: '/partner', label: 'Partner' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">I</span>
            Indesian
          </Link>
          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="navbar-cta">
            <Link to="/partner" className="btn btn-primary" style={{ padding: '9px 18px' }}>
              Partner With Us
            </Link>
          </div>
          <button
            className="navbar-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <span className="brand-mark">I</span>
                Indesian Group
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--neutral-400)', maxWidth: 300 }}>
                A diversified Indian conglomerate building across commerce, energy,
                agriculture, infrastructure, and technology.
              </p>
            </div>
            <div>
              <h4>Businesses</h4>
              <ul className="footer-links">
                <li><Link to="/">Indesian.com</Link></li>
                <li><Link to="/opd">Indesian Digital OPD</Link></li>
                <li><Link to="/energy">Indesian Energy</Link></li>
                <li><Link to="/agri">Indesian Agri</Link></li>
                <li><Link to="/infra">Indesian Infra</Link></li>
                <li><Link to="/technology">Indesian AI and Technology</Link></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link to="/group">Indesian Group</Link></li>
                <li><Link to="/investor">Investor Overview</Link></li>
                <li><Link to="/partner">Partner With Us</Link></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul className="footer-links">
                <li><a href="mailto:hello@indesian.com">hello@indesian.com</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">X (Twitter)</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Indesian Group. All rights reserved.</span>
            <span>indesian.com</span>
          </div>
        </div>
      </footer>
    </>
  )
}
