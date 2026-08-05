import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const solutions = [
  { icon: '☀️', title: 'Rooftop Solar', desc: 'Residential and commercial rooftop systems with end-to-end installation.' },
  { icon: '🔋', title: 'Energy Storage', desc: 'Battery systems for backup, load-shifting, and off-grid use.' },
  { icon: '🏭', title: 'Industrial Power', desc: 'Distributed generation and captive power for industry.' },
  { icon: '🌐', title: 'Microgrids', desc: 'Community and rural microgrid development and operation.' },
  { icon: '📈', title: 'Energy Management', desc: 'Monitoring and optimisation software for energy assets.' },
  { icon: '🔌', title: 'EV Charging', desc: 'Charging infrastructure for homes, fleets, and highways.' },
]

export default function Energy() {
  useDocument(
    'Indesian Energy — Solar, Storage & Clean Power',
    'Indesian Energy delivers solar systems, battery storage, microgrids, and EV charging for homes, industry, and communities.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Clean Power</span>
          <h1>Indesian Energy</h1>
          <p>
            Solar, storage, and clean-power systems for homes, businesses, and communities —
            engineered for India's energy transition.
          </p>
          <div className="hero-actions">
            <a href="#solutions" className="btn btn-primary">Explore Solutions</a>
            <Link to="/partner" className="btn btn-secondary">Become a Partner</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">480 MW</div><div className="stat-label">Capacity deployed</div></div>
            <div className="stat"><div className="stat-num">22k</div><div className="stat-label">Rooftop installs</div></div>
            <div className="stat"><div className="stat-num">14</div><div className="stat-label">States active</div></div>
            <div className="stat"><div className="stat-num">6.2L</div><div className="stat-label">Tons CO₂ saved/yr</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="solutions" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Solutions</span>
          <h2 className="section-title">Power across the spectrum</h2>
          <p className="section-subtitle">From a single rooftop to a community microgrid, we design and operate clean-power systems.</p>
          <div className="grid grid-3">
            {solutions.map((s) => (
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
          <span className="eyebrow">Why Indesian Energy</span>
          <h2 className="section-title">Built for India's transition</h2>
          <div className="grid grid-2">
            <div>
              <ul className="feature-list">
                <li>End-to-end design, installation, and maintenance.</li>
                <li>Financing and subsidy guidance for residential solar.</li>
                <li>Performance guarantees with 25-year warranties.</li>
                <li>Real-time monitoring from the Indesian Energy app.</li>
              </ul>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/4320449/pexels-photo-4320449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Solar energy trackers installed in a green field"
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
            <h2>Power your home or business</h2>
            <p>Talk to our team about solar, storage, and EV charging.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Get a Quote</Link>
        </div>
      </div>
    </>
  )
}
