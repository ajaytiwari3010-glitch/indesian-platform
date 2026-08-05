import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const verticals = [
  { to: '/', name: 'Indesian.com', desc: 'Online commerce across all businesses.', icon: '🛒' },
  { to: '/opd', name: 'Indesian Digital OPD', desc: 'Digital outpatient care and tele-health.', icon: '🩺' },
  { to: '/energy', name: 'Indesian Energy', desc: 'Solar, storage, and clean-power systems.', icon: '⚡' },
  { to: '/agri', name: 'Indesian Agri', desc: 'Farm-sourced produce and agri-value chain.', icon: '🌾' },
  { to: '/infra', name: 'Indesian Infra', desc: 'Infrastructure and modular construction.', icon: '🏗️' },
  { to: '/technology', name: 'Indesian AI and Technology', desc: 'AI platforms, edge devices, and tooling.', icon: '🤖' },
]

const milestones = [
  { year: '2015', title: 'Founded', text: 'Indesian Group established with a focus on clean energy.' },
  { year: '2018', title: 'Agri vertical', text: 'Launched Indesian Agri with direct farmer sourcing.' },
  { year: '2020', title: 'Infra expansion', text: 'Entered modular infrastructure and construction.' },
  { year: '2022', title: 'Digital OPD', text: 'Introduced tele-health under Indesian Digital OPD.' },
  { year: '2024', title: 'AI and Technology', text: 'Unified technology arm for AI platforms and devices.' },
  { year: '2025', title: 'Indesian.com', text: 'Launched unified online commerce destination.' },
]

export default function Group() {
  useDocument(
    'Indesian Group — Diversified Indian Conglomerate',
    'Indesian Group is a diversified Indian conglomerate spanning commerce, energy, agriculture, infrastructure, digital healthcare, and technology.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">About Us</span>
          <h1>Indesian Group</h1>
          <p>
            A diversified Indian conglomerate building across commerce, energy, agriculture,
            infrastructure, digital healthcare, and technology — under one identity.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">6</div><div className="stat-label">Business verticals</div></div>
            <div className="stat"><div className="stat-num">1,200+</div><div className="stat-label">Employees</div></div>
            <div className="stat"><div className="stat-num">28</div><div className="stat-label">States served</div></div>
            <div className="stat"><div className="stat-num">₹2,400Cr</div><div className="stat-label">Group revenue (FY25)</div></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Our Businesses</span>
          <h2 className="section-title">Six verticals, one group</h2>
          <p className="section-subtitle">
            Each business operates independently while sharing the Indesian commitment to quality and trust.
          </p>
          <div className="grid grid-3">
            {verticals.map((v) => (
              <Link to={v.to} className="vertical-card" key={v.to}>
                <div className="vc-icon">{v.icon}</div>
                <h3>{v.name}</h3>
                <p>{v.desc}</p>
                <span className="vc-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Our Journey</span>
          <h2 className="section-title">A decade of building</h2>
          <div className="timeline">
            {milestones.map((m) => (
              <div className="timeline-item" key={m.year}>
                <div className="tl-year">{m.year}</div>
                <h4>{m.title}</h4>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Leadership</span>
          <h2 className="section-title">Led by builders</h2>
          <p className="section-subtitle">A leadership team with deep operational and sector expertise.</p>
          <div className="grid grid-4">
            {[
              { initials: 'AR', name: 'Aarav Reddy', role: 'Group CEO' },
              { initials: 'PS', name: 'Priya Sharma', role: 'CFO' },
              { initials: 'VK', name: 'Vikram Kapoor', role: 'COO' },
              { initials: 'MN', name: 'Meera Nair', role: 'Group CTO' },
            ].map((p) => (
              <div className="card person-card" key={p.name}>
                <div className="avatar">{p.initials}</div>
                <h4>{p.name}</h4>
                <div className="role">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Interested in the Indesian story?</h2>
            <p>Read the investor overview for financials, governance, and strategy.</p>
          </div>
          <Link to="/investor" className="btn btn-primary">Investor Overview</Link>
        </div>
      </div>
    </>
  )
}
