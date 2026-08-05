import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const businessLinks = [
  { to: '/group', label: 'Indesian Group' },
  { to: '/', label: 'Indesian.com' },
  { to: '/opd', label: 'Indesian Digital OPD' },
  { to: '/energy', label: 'Indesian Energy' },
  { to: '/agri', label: 'Indesian Agri' },
  { to: '/infra', label: 'Indesian Infra' },
]

const topNavItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/group', label: 'Group' },
  { to: '/technology', label: 'Technology' },
  { to: '/partner', label: 'Partner' },
  { to: '/investor', label: 'Investor' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [bizOpen, setBizOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-xl text-slate-900" onClick={() => setOpen(false)}>
            <span className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center text-white font-extrabold">I</span>
            Indesian
          </Link>

          <ul className="hidden lg:flex items-center gap-0.5">
            {topNavItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li
              className="relative"
              onMouseEnter={() => setBizOpen(true)}
              onMouseLeave={() => setBizOpen(false)}
            >
              <button className="nav-link flex items-center gap-1" aria-expanded={bizOpen}>
                Businesses
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {bizOpen && (
                <div className="absolute top-full left-0 pt-1 w-64">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2">
                    {businessLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          </ul>

          <Link to="/partner" className="hidden lg:inline-flex btn btn-primary px-4 py-2 text-sm">
            Partner With Us
          </Link>

          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <span className="w-5 h-0.5 bg-slate-700 rounded" />
            <span className="w-5 h-0.5 bg-slate-700 rounded" />
            <span className="w-5 h-0.5 bg-slate-700 rounded" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container-page py-4 flex flex-col gap-1">
            {topNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Businesses</div>
            {businessLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="nav-link pl-4">
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
