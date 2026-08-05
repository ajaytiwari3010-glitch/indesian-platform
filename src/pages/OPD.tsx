import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const services = [
  { icon: '🩺', title: 'Video Consultations', desc: 'Connect with verified doctors from home within minutes.' },
  { icon: '📋', title: 'Digital Prescriptions', desc: 'Secure, paperless prescriptions delivered to your phone.' },
  { icon: '🔬', title: 'Lab Test Booking', desc: 'Book diagnostics with home sample collection.' },
  { icon: '💊', title: 'Medicine Delivery', desc: 'Order prescribed medicines with same-day delivery.' },
  { icon: '📊', title: 'Health Records', desc: 'Centralised, secure medical history you control.' },
  { icon: '🧬', title: 'Chronic Care', desc: 'Ongoing programs for diabetes, hypertension, and more.' },
]

export default function OPD() {
  useDocument(
    'Indesian Digital OPD — Digital Outpatient Care',
    'Indesian Digital OPD provides tele-consultations, digital prescriptions, lab bookings, and medicine delivery across India.',
  )
  return (
    <>
      <section className="page-header">
        <div className="hero-grad" />
        <div className="container hero-content">
          <span className="eyebrow">Healthcare</span>
          <h1>Indesian Digital OPD</h1>
          <p>
            Outpatient care, reimagined. Consult verified doctors, book lab tests, order medicines,
            and manage your health records — all from one digital platform.
          </p>
          <div className="hero-actions">
            <a href="#services" className="btn btn-primary">Book a Consultation</a>
            <Link to="/partner" className="btn btn-secondary">For Doctors & Clinics</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats">
            <div className="stat"><div className="stat-num">800+</div><div className="stat-label">Verified doctors</div></div>
            <div className="stat"><div className="stat-num">2.4L</div><div className="stat-label">Consultations done</div></div>
            <div className="stat"><div className="stat-num">120+</div><div className="stat-label">Specialities</div></div>
            <div className="stat"><div className="stat-num">15 min</div><div className="stat-label">Avg. wait time</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="services" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Services</span>
          <h2 className="section-title">Everything outpatient, online</h2>
          <p className="section-subtitle">A complete digital outpatient department for individuals and families.</p>
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
          <span className="eyebrow">How It Works</span>
          <h2 className="section-title">Care in three simple steps</h2>
          <div className="grid grid-3">
            <div className="card">
              <div className="tag">Step 1</div>
              <h3 style={{ marginTop: 12 }}>Choose a doctor</h3>
              <p className="muted">Browse by speciality, language, and availability.</p>
            </div>
            <div className="card">
              <div className="tag">Step 2</div>
              <h3 style={{ marginTop: 12 }}>Consult online</h3>
              <p className="muted">Talk over secure video or chat from anywhere.</p>
            </div>
            <div className="card">
              <div className="tag">Step 3</div>
              <h3 style={{ marginTop: 12 }}>Get treated</h3>
              <p className="muted">Receive prescriptions, book tests, and order medicines.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Are you a doctor or clinic?</h2>
            <p>Join the Indesian Digital OPD network and reach patients nationwide.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Partner With Us</Link>
        </div>
      </div>
    </>
  )
}
