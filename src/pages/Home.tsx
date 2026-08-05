import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import { SectionHeading, Card, IconBadge, CtaBand, StatusBadge, FeatureList } from '../components/ui'
import { verticals } from '../lib/verticals'

const ecosystemFlow = [
  { icon: '👤', title: 'Customer', desc: 'A customer needs a product or service.' },
  { icon: '🔍', title: 'Digital Discovery', desc: 'The customer discovers Indesian through the platform.' },
  { icon: '📝', title: 'Smart Requirement Journey', desc: 'AI-assisted enquiry captures the customer\'s requirements.' },
  { icon: '📦', title: 'Relevant Products or Services', desc: 'The platform surfaces relevant options.' },
  { icon: '🤝', title: 'Verified Partner Network', desc: 'A matched partner delivers the product or service.' },
  { icon: '🔔', title: 'Service Updates and Support', desc: 'Automated updates keep the customer informed.' },
]

const growthFlow = [
  { step: '01', title: 'Digital Foundation', desc: 'Build the core platform and CRM.' },
  { step: '02', title: 'Customer Demand', desc: 'Attract customers through the platform.' },
  { step: '03', title: 'Partner Network', desc: 'Onboard verified partners to deliver.' },
  { step: '04', title: 'Revenue and Validation', desc: 'Generate revenue and validate the model.' },
  { step: '05', title: 'Technology Expansion', desc: 'Expand AI, automation, and platform capabilities.' },
  { step: '06', title: 'National Growth', desc: 'Scale across India through partners.' },
  { step: '07', title: 'Global Opportunities', desc: 'Explore future international expansion.' },
]

const categories = ['All', 'Energy', 'Agriculture', 'Infrastructure', 'Technology', 'Smart Home']

const demoProducts = [
  { cat: 'Energy', name: 'Rooftop Solar Kit — 3 kW', price: '₹89,000', old: '₹1,10,000', img: 'https://images.pexels.com/photos/18306343/pexels-photo-18306343.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Agriculture', name: 'Organic Grains Bundle — 5 kg', price: '₹1,499', old: '₹1,899', img: 'https://images.pexels.com/photos/3737694/pexels-photo-3737694.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Smart Home', name: 'Smart Home Security Pack', price: '₹12,499', old: '₹15,999', img: 'https://images.pexels.com/photos/27662902/pexels-photo-27662902.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Technology', name: 'Edge AI Compute Module', price: '₹24,999', old: '', img: 'https://images.pexels.com/photos/16888144/pexels-photo-16888144.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Agriculture', name: 'Cold-Pressed Oil — 1 L Trio', price: '₹899', old: '₹1,200', img: 'https://images.pexels.com/photos/7772119/pexels-photo-7772119.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Energy', name: 'Home Battery Storage — 5 kWh', price: '₹1,49,000', old: '', img: 'https://images.pexels.com/photos/4320449/pexels-photo-4320449.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Smart Home', name: 'Connected Sensor Hub', price: '₹6,499', old: '₹8,999', img: 'https://images.pexels.com/photos/22307556/pexels-photo-22307556.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
  { cat: 'Infrastructure', name: 'Modular Building Kit — Sample', price: '₹4,999', old: '', img: 'https://images.pexels.com/photos/13758319/pexels-photo-13758319.jpeg?auto=compress&cs=tinysrgb&h=400&w=600', badge: 'Demo' },
]

const allBusinesses = [
  { to: '/group', name: 'Indesian Group', desc: 'Corporate identity and ecosystem overview.', icon: '🏛️' },
  { to: '/', name: 'Indesian.com', desc: 'E-commerce and future multi-category marketplace.', icon: '🛒' },
  { to: '/opd', name: 'Indesian Digital OPD', desc: 'Virtual healthcare and digital healthcare solutions.', icon: '🩺' },
  { to: '/energy', name: 'Indesian Energy', desc: 'Energy and partner-led energy solutions.', icon: '⚡' },
  { to: '/agri', name: 'Indesian Agri', desc: 'Agriculture products, services and partner ecosystem.', icon: '🌾' },
  { to: '/infra', name: 'Indesian Infra', desc: 'Infrastructure solutions and project services.', icon: '🏗️' },
]

export default function Home() {
  useDocument(
    'Indesian.com — Building Connected Digital Experiences for the Future',
    'Indesian is developing a customer-first, AI-enabled and partner-led ecosystem designed to connect people and businesses with products, services and digital solutions.',
  )

  const [activeCat, setActiveCat] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const filtered = demoProducts.filter((p) => {
    const catMatch = activeCat === 'All' || p.cat === activeCat
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  const toggleCart = (name: string) => {
    setCart((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])
  }

  const toggleWishlist = (name: string) => {
    setWishlist((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])
  }

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Indesian.com — E-commerce & Ecosystem</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Building Connected Digital Experiences for the Future
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl">
              Indesian is developing a customer-first, AI-enabled and partner-led ecosystem designed
              to connect people and businesses with products, services and digital solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#businesses" className="btn btn-primary">Explore Businesses</a>
              <Link to="/partner" className="btn btn-secondary">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" id="businesses">
        <div className="container-page">
          <SectionHeading
            eyebrow="Business Ecosystem"
            title="One group, six businesses"
            subtitle="Each Indesian business operates within a shared digital platform — connected by common technology, a central CRM, and a partner-first operating model."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBusinesses.map((b) => (
              <Card to={b.to} key={b.to}>
                <div className="flex items-center justify-between mb-3">
                  <IconBadge>{b.icon}</IconBadge>
                  {b.to !== '/group' && <StatusBadge status="coming-soon" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{b.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{b.desc}</p>
                <span className="text-primary-700 font-semibold text-sm">Explore →</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="How Indesian Works"
            title="A connected customer journey"
            subtitle="From discovery to delivery, every step is connected through the Indesian platform."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemFlow.map((step, i) => (
              <div key={step.title} className="card-base">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-bold text-primary-600">Step {i + 1}</span>
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
                {i < ecosystemFlow.length - 1 && (
                  <div className="hidden lg:block text-primary-300 text-xl mt-3">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured Products"
            title="Explore products from Indesian businesses"
            subtitle="Demo products shown for illustration. The marketplace is under development."
          />

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeCat === c ? 'bg-primary-700 text-white border-primary-700' : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'}`}
                  onClick={() => setActiveCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
            <span>Cart: {cart.length} item(s)</span>
            <span>Wishlist: {wishlist.length} item(s)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p.name} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="relative">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full aspect-[4/3] object-cover bg-slate-100" />
                  <span className="absolute top-3 left-3 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">{p.badge}</span>
                  <button
                    onClick={() => toggleWishlist(p.name)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg hover:bg-white transition-colors"
                    aria-label="Toggle wishlist"
                  >
                    {wishlist.includes(p.name) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1">{p.cat}</div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{p.name}</h3>
                  <div className="text-lg font-bold text-slate-800 mb-3">
                    {p.price}
                    {p.old && <span className="ml-2 text-sm text-slate-400 line-through font-normal">{p.old}</span>}
                  </div>
                  <button
                    onClick={() => toggleCart(p.name)}
                    className={`btn w-full text-sm py-2 ${cart.includes(p.name) ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {cart.includes(p.name) ? '✓ In Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-slate-500 py-12">No products found. Try a different search or category.</p>
          )}

          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-2 text-sm text-slate-400">
              <StatusBadge status="coming-soon" />
              Marketplace checkout is under development
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Technology Vision"
            title="AI-first by design"
            subtitle="Every Indesian business is built on a shared AI-first technology platform."
          />
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <IconBadge>🤖</IconBadge>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Interaction</h3>
              <p className="text-sm text-slate-500">Smart enquiry routing and AI-assisted customer interactions across every vertical.</p>
              <div className="mt-3"><StatusBadge status="development" /></div>
            </Card>
            <Card>
              <IconBadge>🔗</IconBadge>
              <h3 className="text-lg font-semibold mb-2">Central CRM</h3>
              <p className="text-sm text-slate-500">A unified customer relationship system connecting all businesses and partners.</p>
              <div className="mt-3"><StatusBadge status="development" /></div>
            </Card>
            <Card>
              <IconBadge>📱</IconBadge>
              <h3 className="text-lg font-semibold mb-2">Future Super App</h3>
              <p className="text-sm text-slate-500">A single app to access every Indesian service — from shopping to healthcare.</p>
              <div className="mt-3"><StatusBadge status="roadmap" /></div>
            </Card>
          </div>
          <div className="mt-8">
            <Link to="/technology" className="text-primary-700 font-semibold">Explore our technology vision →</Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Partner Model"
            title="Scaling through technology and partners"
          />
          <div className="max-w-3xl">
            <p className="text-lg text-slate-600 mb-6">
              Indesian aims to scale through technology, customer demand and a carefully developed
              partner network. Rather than building everything in-house, we connect customer demand
              with capable, verified and appropriately matched partners.
            </p>
            <FeatureList items={[
              'Partner-led delivery across energy, agri, and infra',
              'Verified partner network with quality standards',
              'Revenue-sharing and lead-generation models',
              'Low fixed-cost expansion model',
            ]} />
          </div>
          <div className="mt-8">
            <Link to="/partner" className="btn btn-primary">Partner With Us</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Future Growth"
            title="Our growth journey"
            subtitle="A phased approach to building and scaling the Indesian ecosystem."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthFlow.map((step) => (
              <div key={step.step} className="card-base">
                <div className="text-3xl font-bold font-display text-primary-200 mb-3">{step.step}</div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Marketplace Development Roadmap" title="Coming to Indesian.com" subtitle="The e-commerce and marketplace platform is under development." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { phase: 'Phase 1', title: 'Platform Foundation', desc: 'Core marketplace architecture and seller onboarding framework.', status: 'development' as const },
              { phase: 'Phase 2', title: 'Category Launch', desc: 'Initial product categories from Indesian businesses.', status: 'roadmap' as const },
              { phase: 'Phase 3', title: 'Partner Marketplace', desc: 'Open partner seller stores and third-party listings.', status: 'roadmap' as const },
              { phase: 'Phase 4', title: 'AI Commerce', desc: 'AI-assisted discovery and automated logistics.', status: 'roadmap' as const },
            ].map((p) => (
              <div key={p.phase} className="card-base">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary-600">{p.phase}</span>
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="text-base font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Explore Indesian"
        subtitle="Become a partner or get in touch with our team."
        ctaText="Partner With Us"
        ctaTo="/partner"
      />

      <section className="py-16 bg-white">
        <div className="container-page text-center">
          <SectionHeading eyebrow="Contact" title="Get in touch" center />
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
            <Link to="/investor" className="btn btn-secondary">Investor Overview</Link>
          </div>
        </div>
      </section>
    </>
  )
}
