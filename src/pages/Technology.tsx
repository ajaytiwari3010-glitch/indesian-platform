import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import { SectionHeading, Card, IconBadge, CtaBand, StatusBadge, FeatureList } from '../components/ui'

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Customer Interaction',
    desc: 'AI assists every customer interaction — from first enquiry to post-delivery support — making responses faster and more relevant.',
    status: 'development' as const,
  },
  {
    icon: '📝',
    title: 'Smart Enquiry',
    desc: 'Customers can submit enquiries through any Indesian business page. AI routes each enquiry to the right business or partner automatically.',
    status: 'development' as const,
  },
  {
    icon: '🔗',
    title: 'Central CRM',
    desc: 'A unified customer relationship management system connects all businesses and partners — one customer profile across the ecosystem.',
    status: 'development' as const,
  },
  {
    icon: '🤝',
    title: 'Partner Matching',
    desc: 'The platform matches each customer enquiry with the best-suited partner based on location, capability, and availability.',
    status: 'development' as const,
  },
  {
    icon: '🔔',
    title: 'Automated Updates',
    desc: 'Customers and partners receive automated status updates at every stage — from enquiry received to service completed.',
    status: 'development' as const,
  },
  {
    icon: '⚙️',
    title: 'Workflow Automation (n8n)',
    desc: 'Backend automation powered by n8n handles enquiry routing, partner notifications, and workflow orchestration.',
    status: 'development' as const,
  },
  {
    icon: '🎙️',
    title: 'Future Voice Commands',
    desc: 'Voice-driven interactions will allow customers to make enquiries and navigate services hands-free.',
    status: 'roadmap' as const,
  },
  {
    icon: '📱',
    title: 'Future Super App',
    desc: 'A single app that brings every Indesian service together — shopping, healthcare, energy, agriculture, and more — in one place.',
    status: 'roadmap' as const,
  },
]

const processFlow = [
  { icon: '👤', title: 'Customer', desc: 'A customer submits an enquiry.' },
  { icon: '🤖', title: 'AI-Assisted Interaction', desc: 'AI understands the customer\'s requirement.' },
  { icon: '🧠', title: 'Requirement Understanding', desc: 'The system captures and categorizes the need.' },
  { icon: '⚙️', title: 'Digital Workflow', desc: 'n8n workflows route the enquiry.' },
  { icon: '🤝', title: 'Partner Matching', desc: 'The best-suited partner is matched.' },
  { icon: '📦', title: 'Service Tracking', desc: 'The service is tracked through delivery.' },
  { icon: '🔔', title: 'Customer Updates', desc: 'Automated updates keep the customer informed.' },
]

export default function Technology() {
  useDocument(
    'Indesian AI and Technology — Technology Designed to Simplify Customer Journeys',
    'The technology platform behind the Indesian ecosystem: AI-powered customer interaction, smart enquiry, central CRM, partner matching, n8n workflows, and future voice and Super App initiatives.',
  )

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Indesian Digital Private Limited</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Technology Designed to Simplify Customer Journeys</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              The technology layer powering every Indesian business — from AI-powered customer
              interaction to automated workflows and a future Super App.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/partner" className="btn btn-primary">Build With Us</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Platform Overview"
            title="One technology layer, many businesses"
            subtitle="Every Indesian business runs on the same technology platform — making interactions seamless for customers and partners."
          />
          <div className="grid lg:grid-cols-2 gap-8">
            <Card hover={false}>
              <h3 className="text-xl font-semibold mb-4">What we're building</h3>
              <p className="text-slate-500 mb-4">The Indesian technology platform is designed to be the connective tissue of the entire ecosystem. It handles customer enquiries, partner matching, automated updates, and workflow orchestration.</p>
              <FeatureList items={[
                'AI-assisted enquiry routing across all businesses',
                'Central CRM for unified customer profiles',
                'Partner matching based on capability and location',
                'Automated status updates via n8n workflows',
              ]} />
            </Card>
            <Card hover={false} className="bg-primary-50">
              <h3 className="text-xl font-semibold mb-4">Status overview</h3>
              <p className="text-slate-500 mb-4">The platform is currently under development. Features are clearly labeled with their status so you know exactly what exists today and what's planned.</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status="development" />
                  <span className="text-sm text-slate-600">Currently being built</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status="roadmap" />
                  <span className="text-sm text-slate-600">Planned for the future</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Platform Features" title="What the platform does" subtitle="Each feature is labeled with its current development status." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <div className="flex items-center justify-between mb-3">
                  <IconBadge>{f.icon}</IconBadge>
                  <StatusBadge status={f.status} />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Process Flow" title="How the technology works" subtitle="From customer enquiry to service delivery — a connected, AI-assisted flow." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processFlow.map((step, i) => (
              <div key={step.title} className="card-base">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary-600">Step {i + 1}</span>
                </div>
                <IconBadge>{step.icon}</IconBadge>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Future Vision" title="Where we're headed" subtitle="Two major initiatives are on our future roadmap." />
          <div className="grid md:grid-cols-2 gap-8">
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <IconBadge>🎙️</IconBadge>
                <StatusBadge status="roadmap" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voice Commands</h3>
              <p className="text-slate-500 mb-4">We envision a future where customers can interact with the Indesian ecosystem using voice — making enquiries, tracking orders, and navigating services hands-free.</p>
              <FeatureList items={[
                'Voice-based enquiry submission',
                'Voice navigation across services',
                'Multi-language voice support',
              ]} />
            </Card>
            <Card hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <IconBadge>📱</IconBadge>
                <StatusBadge status="roadmap" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Super App</h3>
              <p className="text-slate-500 mb-4">The Indesian Super App will bring every service — shopping, healthcare, energy, agriculture, and infrastructure — into a single, unified application.</p>
              <FeatureList items={[
                'Single login for all Indesian services',
                'Unified customer profile and history',
                'Cross-vertical product discovery',
                'Integrated payments and tracking',
              ]} />
            </Card>
          </div>
        </div>
      </section>

      <CtaBand
        title="Build with Indesian AI"
        subtitle="Partner with us to integrate or co-build on our platform."
        ctaText="Partner With Us"
        ctaTo="/partner"
      />
    </>
  )
}
