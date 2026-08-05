import { useState } from 'react'
import { useDocument } from '../hooks/useDocument'

const partnerTypes = [
  { icon: '🛒', title: 'Sellers & Suppliers', desc: 'List products on Indesian.com and reach customers nationwide.' },
  { icon: '🩺', title: 'Doctors & Clinics', desc: 'Join the Indesian Digital OPD network and consult online.' },
  { icon: '🌾', title: 'Farmers & Agri', desc: 'Supply produce directly with fair-trade pricing.' },
  { icon: '⚡', title: 'Energy Installers', desc: 'Become a certified Indesian Energy installation partner.' },
  { icon: '🏗️', title: 'Contractors', desc: 'Work with Indesian Infra on projects across India.' },
  { icon: '🔌', title: 'Technology', desc: 'Integrate with Indesian AI and Technology platforms.' },
]

export default function Partner() {
  useDocument(
    'Partner With Us — Indesian Group',
    'Partner with the Indesian Group across commerce, healthcare, energy, agriculture, infrastructure, and technology.',
  )
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', type: 'Sellers & Suppliers', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Partnerships</span>
          <h1>Partner With Us</h1>
          <p>
            Build with the Indesian Group. Whether you sell, supply, install, or consult —
            there's a partnership model for you.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Ways to Partner</span>
          <h2 className="section-title">A model for every business</h2>
          <p className="section-subtitle">Choose the partnership that fits what you do.</p>
          <div className="grid grid-3">
            {partnerTypes.map((p) => (
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
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Get in Touch</span>
              <h2 className="section-title">Tell us about you</h2>
              <p className="muted" style={{ marginBottom: 24 }}>
                Fill in the form and our partnerships team will get back to you within two business days.
              </p>
              <ul className="feature-list">
                <li>Dedicated onboarding support for every partner.</li>
                <li>Access to the Indesian platform and customer base.</li>
                <li>Transparent terms and timely payments.</li>
              </ul>
            </div>

            <div className="card">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✓</div>
                  <h3>Thank you, {form.name || 'partner'}!</h3>
                  <p className="muted" style={{ marginTop: 8 }}>
                    We've received your interest. Our team will reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={inputStyle}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={inputStyle}
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Company</label>
                      <input
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        style={inputStyle}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Partnership Type</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        style={inputStyle}
                      >
                        {partnerTypes.map((p) => (
                          <option key={p.title}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Message</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                        placeholder="Tell us about your business"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary full-width">Submit Interest</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--neutral-200)',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
}
