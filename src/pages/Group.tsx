import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import { SectionHeading, Card, IconBadge, CtaBand, Timeline, FeatureList, StatusBadge } from '../components/ui'

const milestones = [
  { year: '2017', title: 'Foundation', text: 'Indesian Industries Private Limited established with a focus on building across multiple sectors.' },
  { year: '2018–2021', title: 'Sector Development', text: 'Exploration and early development across energy, agriculture, and infrastructure.' },
  { year: '2022', title: 'Digital Vision', text: 'Began shaping the digital platform strategy and AI-first technology roadmap.' },
  { year: '2023', title: 'Indesian Digital', text: 'Indesian Digital Private Limited formed to lead digital technology and healthcare initiatives.' },
  { year: '2024–2025', title: 'Platform Build', text: 'Building the unified digital ecosystem, central CRM, and AI-powered enquiry platform.' },
  { year: '2025+', title: 'Future Launch', text: 'Planned launch of Indesian.com, Digital OPD, and partner-led verticals.' },
]

const businesses = [
  { to: '/', name: 'Indesian.com', desc: 'E-commerce and future multi-category marketplace.', icon: '🛒' },
  { to: '/opd', name: 'Indesian Digital OPD', desc: 'Virtual healthcare and digital healthcare solutions.', icon: '🩺' },
  { to: '/energy', name: 'Indesian Energy', desc: 'Energy and partner-led energy solutions.', icon: '⚡' },
  { to: '/agri', name: 'Indesian Agri', desc: 'Agriculture products, services and partner ecosystem.', icon: '🌾' },
  { to: '/infra', name: 'Indesian Infra', desc: 'Infrastructure solutions and project services.', icon: '🏗️' },
]

const approaches = [
  { icon: '👥', title: 'Customer-First', desc: 'Every product and service is designed around the customer\'s needs.' },
  { icon: '🤖', title: 'Technology-Enabled', desc: 'AI and automation power every interaction and workflow.' },
  { icon: '🤝', title: 'Partner-Led', desc: 'We grow through verified partners rather than building everything in-house.' },
  { icon: '📈', title: 'Scalable', desc: 'A shared platform model that scales across sectors and geographies.' },
]

const visionItems = [
  'Digital platforms connecting all Indesian businesses',
  'AI automation for customer interaction and workflow',
  'Partner ecosystem for scalable service delivery',
  'Scalable services across multiple sectors',
  'National growth through partner-led expansion',
  'Future international expansion',
]

export default function Group() {
  useDocument(
    'Indesian Group — Building Businesses for a Connected Future',
    'Indesian Industries Private Limited is a diversified Indian conglomerate with approximately 8 years of business foundation, building a customer-first, technology-enabled and partner-led ecosystem.',
  )

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Indesian Group</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Building Businesses for a Connected Future</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Indesian Industries Private Limited is a diversified Indian conglomerate with
              approximately 8 years of business foundation, building a customer-first,
              technology-enabled and partner-led ecosystem.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/investor" className="btn btn-primary">Investor Overview</Link>
              <Link to="/partner" className="btn btn-secondary">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="About" title="Our foundation" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Indesian Industries Private Limited is the main holding and business organization
                with approximately 8 years of business history. The founder and director has
                approximately 8 years of directorship and business leadership experience.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Over this period, the group has developed presence and capabilities across energy,
                agriculture, and infrastructure. Indesian Digital Private Limited was formed to
                manage digital technology initiatives and Indesian Digital OPD.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                The group is now building a unified digital platform that connects every business
                under a shared technology layer, a central CRM, and a partner-first operating model.
              </p>
            </div>
            <div className="card-base bg-slate-50">
              <h3 className="text-base font-semibold mb-3">Legal Entities</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <strong className="block text-slate-900">Indesian Industries Private Limited</strong>
                  Main holding and business organization. Houses Energy, Agri, Infra, and the future e-commerce platform.
                </li>
                <li>
                  <strong className="block text-slate-900">Indesian Digital Private Limited</strong>
                  Manages digital technology initiatives and Indesian Digital OPD.
                </li>
              </ul>
              <div className="mt-5 pt-5 border-t border-slate-200">
                <h3 className="text-base font-semibold mb-2">Business History</h3>
                <p className="text-sm text-slate-500">Approximately 8 years of business foundation and leadership experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Our Foundation" title="Approximately 8 years of building" />
          <div className="max-w-2xl">
            <Timeline items={milestones} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Our Businesses" title="Five businesses, one platform" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((b) => (
              <Card to={b.to} key={b.to}>
                <div className="flex items-center justify-between mb-3">
                  <IconBadge>{b.icon}</IconBadge>
                  {b.to !== '/' && <StatusBadge status="coming-soon" />}
                </div>
                <h3 className="text-lg font-semibold mb-1">{b.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{b.desc}</p>
                <span className="text-primary-700 font-semibold text-sm">Learn more →</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Our Approach" title="How we build" subtitle="Four principles guide every Indesian business." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approaches.map((a) => (
              <Card key={a.title}>
                <IconBadge>{a.icon}</IconBadge>
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-slate-500">{a.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Leadership" title="Founder and leadership" subtitle="The founder and director brings approximately 8 years of directorship and business leadership experience." />
          <div className="grid lg:grid-cols-2 gap-8">
            <Card hover={false}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold font-display text-primary-700">FD</div>
                <div>
                  <h3 className="text-lg font-semibold">Founder & Director</h3>
                  <p className="text-sm text-primary-600 font-semibold">Indesian Industries Private Limited</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm">
                The founder and director has approximately 8 years of directorship and business
                leadership experience, guiding the group's development across multiple sectors.
              </p>
              <p className="text-slate-400 text-xs mt-4 italic">
                Detailed leadership profiles may be shared through appropriate business discussions.
              </p>
            </Card>
            <Card hover={false} className="bg-primary-50">
              <h3 className="text-lg font-semibold mb-4">Leadership Vision</h3>
              <FeatureList items={[
                'Build a durable, diversified business ecosystem',
                'Leverage technology to simplify customer journeys',
                'Grow through partners with low fixed costs',
                'Create long-term value across resilient sectors',
              ]} />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Future Vision" title="Where we're headed" subtitle="Our vision for the Indesian ecosystem." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💻', title: 'Digital Platforms', desc: 'Connected digital platforms across all businesses.' },
              { icon: '🤖', title: 'AI Automation', desc: 'AI-powered customer interaction and workflow automation.' },
              { icon: '🤝', title: 'Partner Ecosystem', desc: 'A verified partner network for scalable delivery.' },
              { icon: '📊', title: 'Scalable Services', desc: 'Services designed to scale across sectors and regions.' },
              { icon: '🇮🇳', title: 'National Growth', desc: 'Expand across India through partner-led operations.' },
              { icon: '🌍', title: 'Future International Expansion', desc: 'Explore global opportunities in the future.' },
            ].map((v) => (
              <Card key={v.title}>
                <IconBadge>{v.icon}</IconBadge>
                <h3 className="text-base font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Work with Indesian Group"
        subtitle="Send us a business enquiry and our team will respond."
        ctaText="Business Enquiry"
        ctaTo="/contact"
      />
    </>
  )
}
