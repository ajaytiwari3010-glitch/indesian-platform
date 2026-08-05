import { useDocument } from '../hooks/useDocument'
import { SectionHeading, Card, IconBadge, CtaBand } from '../components/ui'
import { DynamicForm } from '../components/forms'

const benefits = [
  { icon: '🌐', title: 'Access the Ecosystem', desc: 'Reach customers across all Indesian businesses through one platform.' },
  { icon: '🤝', title: 'Verified Partner Network', desc: 'Join a curated network of partners with shared quality standards.' },
  { icon: '📊', title: 'Lead Generation', desc: 'Receive matched customer enquiries through the central CRM.' },
  { icon: '🤖', title: 'AI-Assisted Matching', desc: 'Smart enquiry routing connects you with the right customers.' },
  { icon: '💰', title: 'Low Overhead', desc: 'Grow your business without building your own technology platform.' },
  { icon: '📈', title: 'Scalable Growth', desc: 'Expand across geographies and categories with the Indesian brand.' },
]

const categories = [
  { icon: '🛒', title: 'Product Sellers', desc: 'List products on Indesian.com and reach customers nationwide.' },
  { icon: '📦', title: 'Suppliers', desc: 'Supply products across the Indesian ecosystem.' },
  { icon: '🛠️', title: 'Service Providers', desc: 'Deliver services across multiple verticals.' },
  { icon: '⚡', title: 'Energy Professionals', desc: 'Become a certified Indesian Energy installation partner.' },
  { icon: '🌾', title: 'Agriculture Partners', desc: 'Supply produce and agri-services through the Indesian network.' },
  { icon: '🏗️', title: 'Infrastructure Partners', desc: 'Work with Indesian Infra on construction and infrastructure projects.' },
  { icon: '🩺', title: 'Healthcare Organizations', desc: 'Join the Indesian Digital OPD network with appropriately qualified professionals.' },
  { icon: '🔌', title: 'Technology Partners', desc: 'Integrate with or build on the Indesian AI and Technology platform.' },
  { icon: '🚚', title: 'Logistics Partners', desc: 'Provide delivery and supply chain services across the ecosystem.' },
]

const onboarding = [
  { step: '01', title: 'Apply', desc: 'Submit your partner application through the form below.' },
  { step: '02', title: 'Business Information', desc: 'Provide details about your business and services.' },
  { step: '03', title: 'Document Submission', desc: 'Submit required business registration documents.' },
  { step: '04', title: 'Review', desc: 'Our team reviews your application and documents.' },
  { step: '05', title: 'Verification', desc: 'We verify your business details and capabilities.' },
  { step: '06', title: 'Agreement', desc: 'Sign the partnership agreement.' },
  { step: '07', title: 'Activation', desc: 'Go live and start receiving enquiries.' },
]

export default function PartnerWithUs() {
  useDocument(
    'Partner With Us — Indesian Group',
    'Partner with the Indesian Group across commerce, healthcare, energy, agriculture, infrastructure, technology, and logistics. Partner applications are subject to review and verification.',
  )

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Partnerships</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Grow With the Indesian Partner Ecosystem</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Indesian aims to connect customer demand with capable, verified and appropriately
              matched partners. We grow through partners — and we're building a network across
              every business vertical.
            </p>
            <a href="#apply" className="btn btn-primary">Apply Now</a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Why Partner" title="Partner benefits" subtitle="What you gain by joining the Indesian ecosystem." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <Card key={b.title}>
                <IconBadge>{b.icon}</IconBadge>
                <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Partner Categories" title="Ways to partner" subtitle="Choose the partnership model that fits your business." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <Card key={c.title}>
                <IconBadge>{c.icon}</IconBadge>
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500">{c.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Onboarding Process" title="How to join" subtitle="A thorough, seven-step process to become an Indesian partner." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboarding.map((s) => (
              <div key={s.step} className="card-base">
                <div className="text-3xl font-bold font-display text-primary-200 mb-3">{s.step}</div>
                <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500 italic">
            Partner applications are subject to review and verification.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" id="apply">
        <div className="container-page">
          <SectionHeading eyebrow="Apply" title="Partner application" subtitle="Fill in the form below to apply. Our partnerships team will review and respond." />
          <div className="max-w-2xl">
            <DynamicForm formType="partner" />
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure which partnership fits?"
        subtitle="Reach out and we'll help you find the right fit."
        ctaText="Contact Us"
        ctaTo="/contact"
      />
    </>
  )
}
