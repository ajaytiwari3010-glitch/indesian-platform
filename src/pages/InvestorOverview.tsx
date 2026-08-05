import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import { SectionHeading, Card, IconBadge, CtaBand, StatusBadge, FeatureList, Timeline } from '../components/ui'
import { DynamicForm } from '../components/forms'

const businessModel = [
  { icon: '📈', title: 'Customer Demand', desc: 'Customers discover and engage with Indesian businesses.' },
  { icon: '💻', title: 'Digital Platform', desc: 'The platform captures and routes enquiries.' },
  { icon: '🤖', title: 'AI-Assisted Journey', desc: 'AI understands requirements and routes appropriately.' },
  { icon: '🤝', title: 'Partner Network', desc: 'Verified partners deliver products and services.' },
  { icon: '📋', title: 'Service Coordination', desc: 'The platform coordinates delivery and updates.' },
  { icon: '💰', title: 'Revenue Opportunities', desc: 'Revenue generated through multiple streams.' },
]

const revenueStreams = [
  { icon: '🛒', title: 'Product Sales', desc: 'Direct product sales through Indesian businesses.' },
  { icon: '🏪', title: 'Marketplace Commission', desc: 'Commission on products sold through Indesian.com.' },
  { icon: '🛠️', title: 'Service Commission', desc: 'Commission on partner-delivered services.' },
  { icon: '📌', title: 'Premium Listings', desc: 'Premium placement for partner products and services.' },
  { icon: '🔄', title: 'Partner Subscriptions', desc: 'Subscription fees for premium partner accounts.' },
  { icon: '💻', title: 'Technology Subscriptions', desc: 'Platform access for enterprise customers.' },
  { icon: '🏢', title: 'Enterprise Solutions', desc: 'Custom technology solutions for organizations.' },
]

const growthStrategy = [
  { year: 'Phase 1', title: 'Digital Foundation', text: 'Build the core platform, CRM, and partner onboarding framework.' },
  { year: 'Phase 2', title: 'Customer Validation', text: 'Attract customers and validate demand across verticals.' },
  { year: 'Phase 3', title: 'Partner Development', text: 'Onboard and verify partners across all verticals.' },
  { year: 'Phase 4', title: 'Revenue', text: 'Generate revenue through multiple streams.' },
  { year: 'Phase 5', title: 'Technology Expansion', text: 'Expand AI, automation, and platform capabilities.' },
  { year: 'Phase 6', title: 'National Scale', text: 'Scale across India through partner-led operations.' },
  { year: 'Phase 7', title: 'Future International Growth', text: 'Explore global opportunities in the future.' },
]

const fundingAreas = [
  { icon: '🤖', title: 'Technology Development', desc: 'Build and scale the AI-powered platform and CRM.' },
  { icon: '📦', title: 'Product Development', desc: 'Develop customer-facing digital products and services.' },
  { icon: '📣', title: 'Customer Acquisition', desc: 'Attract customers to the platform.' },
  { icon: '🤝', title: 'Partner Network', desc: 'Build and manage the partner ecosystem.' },
  { icon: '⚙️', title: 'Operations', desc: 'Day-to-day operations and infrastructure.' },
  { icon: '🔒', title: 'Security', desc: 'Platform security and data protection.' },
  { icon: '📋', title: 'Compliance', desc: 'Regulatory and legal compliance.' },
  { icon: '👥', title: 'Team Expansion', desc: 'Hire across engineering, operations, and partnerships.' },
]

export default function InvestorOverview() {
  useDocument(
    'Investor Overview — Indesian Group',
    'An investor-ready overview of Indesian Industries Private Limited: business foundation, ecosystem, AI-first strategy, partner-led model, revenue opportunities, growth roadmap, and funding use areas.',
  )

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Investor Overview</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Investing in Indesian</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              An overview of the Indesian Group — our business foundation, ecosystem, strategy,
              and the opportunity we're building for the future.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#enquiry" className="btn btn-primary">Investor Enquiry</a>
              <Link to="/group" className="btn btn-secondary">About the Group</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Existing Foundation" title="Approximately 8 years of building" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Indesian Industries Private Limited is the main holding and business organization
                with approximately 8 years of business history. The founder and director has
                approximately 8 years of directorship and business leadership experience.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Indesian Digital Private Limited was formed to manage digital technology
                initiatives and Indesian Digital OPD — bringing the group's digital vision to life.
              </p>
            </div>
            <Card hover={false} className="bg-slate-50">
              <h3 className="text-base font-semibold mb-3">Key Facts</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><strong className="block text-slate-900">Holding Entity</strong> Indesian Industries Private Limited</li>
                <li><strong className="block text-slate-900">Digital Entity</strong> Indesian Digital Private Limited</li>
                <li><strong className="block text-slate-900">Business History</strong> Approximately 8 years</li>
                <li><strong className="block text-slate-900">Leadership</strong> Approximately 8 years of directorship experience</li>
                <li><strong className="block text-slate-900">Business Verticals</strong> 6 planned verticals</li>
                <li><strong className="block text-slate-900">Current Stage</strong> Platform development phase</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Market Opportunity" title="The customer problem" subtitle="What challenges do customers face today?" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Card hover={false} className="border-red-200 bg-red-50/50">
              <h3 className="text-xl font-semibold mb-4 text-red-700">The Challenge</h3>
              <FeatureList items={[
                'Customers often need to search across multiple providers',
                'Information must be repeated to different businesses',
                'Customers must follow up manually for updates',
                'No unified platform for discovering and accessing diverse services',
                'Inconsistent experience across different providers',
              ]} />
            </Card>
            <Card hover={false} className="border-primary-200 bg-primary-50/50">
              <h3 className="text-xl font-semibold mb-4 text-primary-700">The Indesian Vision</h3>
              <p className="text-slate-600 mb-4">A connected digital ecosystem that brings multiple businesses, products, and services under one platform — with AI-assisted enquiry routing, a central CRM, and partner-led delivery.</p>
              <FeatureList items={[
                'One platform across all Indesian businesses',
                'AI-assisted customer journey',
                'Partner-led service delivery',
                'Automated updates at every step',
              ]} />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Business Model" title="How the ecosystem works" subtitle="From customer demand to revenue — a connected flow." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessModel.map((step, i) => (
              <Card key={step.title}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary-600">Step {i + 1}</span>
                </div>
                <IconBadge>{step.icon}</IconBadge>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Revenue Opportunities" title="How the ecosystem earns" subtitle="All revenue streams are proposed or future — not currently active." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueStreams.map((r) => (
              <Card key={r.title}>
                <IconBadge>{r.icon}</IconBadge>
                <h3 className="text-base font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-slate-500">{r.desc}</p>
                <div className="mt-3"><StatusBadge status="roadmap" /></div>
              </Card>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-6">All revenue streams are proposed and not yet operational. Future revenue is not presented as current revenue.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Growth Strategy" title="Phased growth plan" />
          <div className="max-w-2xl">
            <Timeline items={growthStrategy} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Funding Use Areas" title="Where investment goes" subtitle="Funding will be deployed across the following areas to build and scale the platform." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fundingAreas.map((f) => (
              <Card key={f.title}>
                <IconBadge>{f.icon}</IconBadge>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500 italic max-w-2xl">
            Investor information and detailed financial materials may be shared through appropriate business discussions.
          </p>
        </div>
      </section>

      <section className="py-16" id="enquiry">
        <div className="container-page">
          <SectionHeading eyebrow="Investor Enquiry" title="Get in touch" subtitle="Reach out to our investor relations team to start the conversation." />
          <div className="max-w-2xl">
            <DynamicForm formType="investor" />
          </div>
        </div>
      </section>

      <CtaBand
        title="Explore the Indesian ecosystem"
        subtitle="Learn more about our businesses and approach."
        ctaText="About the Group"
        ctaTo="/group"
      />
    </>
  )
}
