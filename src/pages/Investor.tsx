import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const highlights = [
  { icon: '📈', title: 'Consistent Growth', desc: 'Group revenue up 28% year-on-year across six verticals.' },
  { icon: '🏛️', title: 'Strong Governance', desc: 'Independent board oversight and audited financials.' },
  { icon: '🌱', title: 'Sustainable Focus', desc: 'Over 60% of revenue from clean-energy and agri businesses.' },
  { icon: '🧩', title: 'Diversified Risk', desc: 'Six verticals across resilient sectors of the economy.' },
]

const financials = [
  { metric: 'Group Revenue', fy24: '₹1,870 Cr', fy25: '₹2,400 Cr' },
  { metric: 'EBITDA', fy24: '₹220 Cr', fy25: '₹310 Cr' },
  { metric: 'Net Profit', fy24: '₹118 Cr', fy25: '₹172 Cr' },
  { metric: 'Total Assets', fy24: '₹3,900 Cr', fy25: '₹4,650 Cr' },
]

export default function Investor() {
  useDocument(
    'Investor Overview — Indesian Group',
    'Financial performance, governance, and strategy for investors in the Indesian Group.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Investors</span>
          <h1>Investor Overview</h1>
          <p>
            A transparent view of the Indesian Group — financial performance, governance,
            and the strategy driving our next phase of growth.
          </p>
          <div className="hero-actions">
            <a href="#financials" className="btn btn-primary">View Financials</a>
            <Link to="/partner" className="btn btn-secondary">Contact IR</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">28%</div><div className="stat-label">Revenue growth YoY</div></div>
            <div className="stat"><div className="stat-num">12.9%</div><div className="stat-label">EBITDA margin</div></div>
            <div className="stat"><div className="stat-num">₹2,400Cr</div><div className="stat-label">FY25 revenue</div></div>
            <div className="stat"><div className="stat-num">6</div><div className="stat-label">Business verticals</div></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Why Indesian</span>
          <h2 className="section-title">A diversified, sustainable portfolio</h2>
          <p className="section-subtitle">Six resilient verticals, one disciplined operator.</p>
          <div className="grid grid-4">
            {highlights.map((h) => (
              <div className="card" key={h.title}>
                <div className="vc-icon">{h.icon}</div>
                <h3>{h.title}</h3>
                <p className="muted">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="financials" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Financial Performance</span>
          <h2 className="section-title">Key figures</h2>
          <p className="section-subtitle">Audited consolidated figures (in INR Crore).</p>
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>FY 2024</th>
                  <th>FY 2025</th>
                </tr>
              </thead>
              <tbody>
                {financials.map((f) => (
                  <tr key={f.metric}>
                    <td style={{ fontWeight: 600 }}>{f.metric}</td>
                    <td>{f.fy24}</td>
                    <td style={{ color: 'var(--primary-700)', fontWeight: 700 }}>{f.fy25}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: '0.82rem', marginTop: 12 }}>
            Figures are illustrative and shown for demonstration purposes.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Governance</span>
          <h2 className="section-title">Independent oversight</h2>
          <div className="grid grid-4">
            {[
              { initials: 'AR', name: 'Aarav Reddy', role: 'Chair & Group CEO' },
              { initials: 'SK', name: 'Sanjay Khanna', role: 'Independent Director' },
              { initials: 'RT', name: 'Rita Thomas', role: 'Independent Director' },
              { initials: 'PS', name: 'Priya Sharma', role: 'CFO' },
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
            <h2>Want to invest or learn more?</h2>
            <p>Reach out to our investor relations team.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Contact Us</Link>
        </div>
      </div>
    </>
  )
}
