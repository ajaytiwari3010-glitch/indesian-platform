import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const offerings = [
  { icon: '🌾', title: 'Grains & Pulses', desc: 'Sourced directly from farmer collectives across India.' },
  { icon: '🫒', title: 'Cold-Pressed Oils', desc: 'Traditional, chemical-free oil extraction.' },
  { icon: '🥬', title: 'Fresh Produce', desc: 'Farm-to-table vegetables with cold-chain logistics.' },
  { icon: '🧂', title: 'Spices', desc: 'Single-origin spices processed in small batches.' },
  { icon: '📦', title: 'Agri-Inputs', desc: 'Seeds, bio-fertilizers, and tools for farmers.' },
  { icon: '🚚', title: 'Supply Chain', desc: 'Procurement, storage, and distribution infrastructure.' },
]

export default function Agri() {
  useDocument(
    'Indesian Agri — Farm-Sourced Agriculture & Produce',
    'Indesian Agri connects farmers to markets with fair-trade sourcing of grains, oils, produce, and spices across India.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Agriculture</span>
          <h1>Indesian Agri</h1>
          <p>
            From farm to shelf. We source directly from farmer collectives, process with care,
            and deliver clean, traceable produce across India.
          </p>
          <div className="hero-actions">
            <a href="#offerings" className="btn btn-primary">Explore Products</a>
            <Link to="/partner" className="btn btn-secondary">For Farmers</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">40k+</div><div className="stat-label">Farmers partnered</div></div>
            <div className="stat"><div className="stat-num">18</div><div className="stat-label">States sourced from</div></div>
            <div className="stat"><div className="stat-num">320+</div><div className="stat-label">SKUs live</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Fair-trade sourcing</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="offerings" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">What We Offer</span>
          <h2 className="section-title">From the field to your home</h2>
          <p className="section-subtitle">A full agriculture value chain — sourcing, processing, and retail.</p>
          <div className="grid grid-3">
            {offerings.map((o) => (
              <div className="card" key={o.title}>
                <div className="vc-icon">{o.icon}</div>
                <h3>{o.title}</h3>
                <p className="muted">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <img
                src="https://images.pexels.com/photos/13888402/pexels-photo-13888402.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Lush rows of green rice plants in a field"
                style={{ borderRadius: 'var(--radius-lg)', width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            <div>
              <span className="eyebrow">Our Promise</span>
              <h2 className="section-title">Fair to farmers, clean for you</h2>
              <ul className="feature-list">
                <li>Direct sourcing — no exploitative middlemen.</li>
                <li>Transparent pricing shared with every farmer collective.</li>
                <li>Cold-chain logistics to preserve freshness.</li>
                <li>Full traceability from farm to package.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Are you a farmer or supplier?</h2>
            <p>Join the Indesian Agri network and reach customers nationwide.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Partner With Us</Link>
        </div>
      </div>
    </>
  )
}
