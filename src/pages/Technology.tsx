import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const platforms = [
  { icon: '🤖', title: 'Indesian AI Platform', desc: 'Foundation models and APIs tailored for Indian languages and contexts.' },
  { icon: '📡', title: 'Edge AI Devices', desc: 'On-device compute modules for vision, voice, and sensing.' },
  { icon: '🏠', title: 'Smart-Home Suite', desc: 'Connected devices and hubs for the modern Indian home.' },
  { icon: '☁️', title: 'Cloud & Data', desc: 'Secure cloud infrastructure and data pipelines for enterprises.' },
  { icon: '🔒', title: 'Cybersecurity', desc: 'Threat monitoring, compliance, and zero-trust tooling.' },
  { icon: '🛠️', title: 'Developer Tools', desc: 'SDKs, APIs, and platforms for builders and partners.' },
]

export default function Technology() {
  useDocument(
    'Indesian AI and Technology — Platforms, Edge & Cloud',
    'Indesian AI and Technology builds AI platforms, edge devices, smart-home suites, and developer tools for India and beyond.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Technology</span>
          <h1>Indesian AI and Technology</h1>
          <p>
            The technology arm of the Indesian Group. We build AI platforms, edge devices,
            and developer tools that power every Indesian business — and yours.
          </p>
          <div className="hero-actions">
            <a href="#platforms" className="btn btn-primary">Explore Platforms</a>
            <Link to="/partner" className="btn btn-secondary">Build With Us</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">12</div><div className="stat-label">Indian languages</div></div>
            <div className="stat"><div className="stat-num">4M+</div><div className="stat-label">API calls / day</div></div>
            <div className="stat"><div className="stat-num">99.95%</div><div className="stat-label">Platform uptime</div></div>
            <div className="stat"><div className="stat-num">60+</div><div className="stat-label">Engineers & researchers</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="platforms" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Platforms & Products</span>
          <h2 className="section-title">Built for India, built for scale</h2>
          <p className="section-subtitle">From foundation models to edge devices — technology that works for every Indesian business.</p>
          <div className="grid grid-3">
            {platforms.map((p) => (
              <div className="card" key={p.title}>
                <div className="vc-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p className="muted">{p.desc}</p>
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
                src="https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Server racks in a modern data center"
                style={{ borderRadius: 'var(--radius-lg)', width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            <div>
              <span className="eyebrow">Why Our Stack</span>
              <h2 className="section-title">Reliable, local, and secure</h2>
              <ul className="feature-list">
                <li>AI models trained on Indian data and languages.</li>
                <li>Edge-first architecture for low-latency, offline use.</li>
                <li>Enterprise-grade security and compliance.</li>
                <li>Open APIs and SDKs for partners and developers.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Build with Indesian AI</h2>
            <p>Integrate our platforms or co-build new products with us.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Partner With Us</Link>
        </div>
      </div>
    </>
  )
}
