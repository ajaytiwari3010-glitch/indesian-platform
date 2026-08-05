import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

const categories = ['All', 'Energy', 'Agriculture', 'Infrastructure', 'Technology', 'Smart Home']

const products = [
  {
    cat: 'Energy',
    name: 'Rooftop Solar Kit — 3 kW',
    price: '₹89,000',
    old: '₹1,10,000',
    img: 'https://images.pexels.com/photos/18306343/pexels-photo-18306343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Agriculture',
    name: 'Organic Grains Bundle — 5 kg',
    price: '₹1,499',
    old: '₹1,899',
    img: 'https://images.pexels.com/photos/3737694/pexels-photo-3737694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Smart Home',
    name: 'Smart Home Security Pack',
    price: '₹12,499',
    old: '₹15,999',
    img: 'https://images.pexels.com/photos/27662902/pexels-photo-27662902.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Technology',
    name: 'Edge AI Compute Module',
    price: '₹24,999',
    old: '',
    img: 'https://images.pexels.com/photos/16888144/pexels-photo-16888144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Agriculture',
    name: 'Cold-Pressed Oil — 1 L Trio',
    price: '₹899',
    old: '₹1,200',
    img: 'https://images.pexels.com/photos/7772119/pexels-photo-7772119.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Energy',
    name: 'Home Battery Storage — 5 kWh',
    price: '₹1,49,000',
    old: '',
    img: 'https://images.pexels.com/photos/4320449/pexels-photo-4320449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Smart Home',
    name: 'Connected Sensor Hub',
    price: '₹6,499',
    old: '₹8,999',
    img: 'https://images.pexels.com/photos/22307556/pexels-photo-22307556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    cat: 'Infrastructure',
    name: 'Modular Building Kit — Sample',
    price: '₹4,999',
    old: '',
    img: 'https://images.pexels.com/photos/13758319/pexels-photo-13758319.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
]

export default function Home() {
  useDocument(
    'Indesian.com — Online Commerce by Indesian Group',
    'Shop across energy, agriculture, infrastructure, and technology. Indesian.com is the online commerce destination of the Indesian Group.',
  )
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? products : products.filter((p) => p.cat === active)

  return (
    <>
      <section className="hero">
        <div className="hero-grad" />
        <div className="container hero-content fade-up">
          <span className="eyebrow">Indesian.com — Online Commerce</span>
          <h1>Everything from the Indesian Group, in one store.</h1>
          <p>
            Shop clean-energy systems, farm-fresh produce, smart-home devices, and
            technology built by the businesses of Indesian — delivered across India.
          </p>
          <div className="hero-actions">
            <a href="#shop" className="btn btn-primary">Start Shopping</a>
            <Link to="/group" className="btn btn-secondary">Explore the Group</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="container">
          <div className="stats">
            <div className="stat">
              <div className="stat-num">6</div>
              <div className="stat-label">Business verticals</div>
            </div>
            <div className="stat">
              <div className="stat-num">12k+</div>
              <div className="stat-label">Products shipped</div>
            </div>
            <div className="stat">
              <div className="stat-num">28</div>
              <div className="stat-label">States served</div>
            </div>
            <div className="stat">
              <div className="stat-num">4.8★</div>
              <div className="stat-label">Average rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="shop" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Featured Products</span>
          <h2 className="section-title">Shop by category</h2>
          <p className="section-subtitle">
            A curated selection from across the Indesian businesses — from solar kits to organic grains.
          </p>

          <div className="cat-pills">
            {categories.map((c) => (
              <button
                key={c}
                className={`cat-pill ${active === c ? 'active' : ''}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filtered.map((p) => (
              <div className="product-card" key={p.name}>
                <img className="product-img" src={p.img} alt={p.name} loading="lazy" />
                <div className="product-body">
                  <div className="product-cat">{p.cat}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">
                    {p.price}
                    {p.old && <small>{p.old}</small>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Our Businesses</span>
          <h2 className="section-title">One group, many verticals</h2>
          <p className="section-subtitle">
            Each Indesian business powers a part of this store. Discover what they do.
          </p>
          <div className="grid grid-3">
            <Link to="/energy" className="vertical-card">
              <div className="vc-icon">⚡</div>
              <h3>Indesian Energy</h3>
              <p>Solar, storage, and clean-power systems for homes and industry.</p>
              <span className="vc-link">Visit Energy →</span>
            </Link>
            <Link to="/agri" className="vertical-card">
              <div className="vc-icon">🌾</div>
              <h3>Indesian Agri</h3>
              <p>Farm-sourced grains, oils, and produce with fair-trade sourcing.</p>
              <span className="vc-link">Visit Agri →</span>
            </Link>
            <Link to="/infra" className="vertical-card">
              <div className="vc-icon">🏗️</div>
              <h3>Indesian Infra</h3>
              <p>Modular building materials and infrastructure solutions.</p>
              <span className="vc-link">Visit Infra →</span>
            </Link>
            <Link to="/technology" className="vertical-card">
              <div className="vc-icon">🤖</div>
              <h3>Indesian AI and Technology</h3>
              <p>Edge AI modules, smart-home devices, and platform tools.</p>
              <span className="vc-link">Visit Technology →</span>
            </Link>
            <Link to="/opd" className="vertical-card">
              <div className="vc-icon">🩺</div>
              <h3>Indesian Digital OPD</h3>
              <p>Digital outpatient care, tele-consults, and health products.</p>
              <span className="vc-link">Visit Digital OPD →</span>
            </Link>
            <Link to="/group" className="vertical-card">
              <div className="vc-icon">🏛️</div>
              <h3>Indesian Group</h3>
              <p>The parent company behind every Indesian business.</p>
              <span className="vc-link">About the Group →</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Become an Indesian partner</h2>
            <p>Supply, distribute, or co-build with the Indesian Group.</p>
          </div>
          <Link to="/partner" className="btn btn-primary">Partner With Us</Link>
        </div>
      </div>
    </>
  )
}
