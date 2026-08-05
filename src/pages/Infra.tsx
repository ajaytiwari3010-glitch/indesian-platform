import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const services = [
  { icon: '🏗️', title: 'Modular Construction', desc: 'Prefabricated buildings for speed and scalability.' },
  { icon: '🛣️', title: 'Roads & Civil Works', desc: 'Road, drainage, and civil infrastructure projects.' },
  { icon: '🏢', title: 'Commercial Spaces', desc: 'Turnkey commercial and industrial buildings.' },
  { icon: '💧', title: 'Water & Sanitation', desc: 'Water supply, treatment, and sanitation systems.' },
  { icon: '⚡', title: 'Power Infrastructure', desc: 'Transmission and distribution networks.' },
  { icon: '🏘️', title: 'Affordable Housing', desc: 'Quality housing at scale for growing communities.' },
]

export default function Infra() {
  useDocument(
    'Indesian Infra — Infrastructure & Modular Construction',
    'Indesian Infra builds modular construction, roads, water systems, power infrastructure, and affordable housing across India.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Infrastructure</span>
          <h1>Indesian Infra</h1>
          <p>
            Building the backbone of India. Modular construction, roads, water systems, and
            power infrastructure — delivered with engineering rigour and speed.
          </p>
          <div className="hero-actions">
            <a href="#services" className="btn btn-primary">Explore Capabilities</a>
            <Link to="/partner" className="btn btn-secondary">Work With Us</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">180+</div><div className="stat-label">Projects delivered</div></div>
            <div className="stat"><div className="stat-num">12</div><div className="stat-label">States active</div></div>
            <div className="stat"><div className="stat-num">4.2M</div><div className="stat-label">Sq ft built</div></div>
            <div className="stat"><div className="stat-num">9,800</div><div className="stat-label">People employed</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="services" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Capabilities</span>
          <h2 className="section-title">Engineering, built right</h2>
          <p className="section-subtitle">From foundations to finishes — we deliver infrastructure end-to-end.</p>
          <div className="grid grid-3">
            {services.map((s) => (
              <div className="card" key={s.title}>
                <div className="vc-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p className="muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Our Approach</span>
              <h2 className="section-title">Speed without compromise</h2>
              <ul className="feature-list">
                <li>Modular, factory-built components for faster delivery.</li>
                <li>In-house design, engineering, and project management.</li>
                <li>Safety-first culture with zero-harm targets.</li>
                <li>Sustainable materials and waste-reduction practices.</li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/13758319/pexels-photo-13758319.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Construction site with modern buildings"
                style={{ borderRadius: 'var(--radius-lg)', width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Have a project in mind?</h2>
            <p>Partner with Indesian Infra for your next build.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Partner With Us</Link>
        </div>
      </div>
    </>
  )
}
