import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'
import type { Vertical } from '../lib/verticals'
import { StatusBadge, SectionHeading, Card, IconBadge, FeatureList, CtaBand } from './ui'
import { DynamicForm } from './forms'

export default function VerticalPage({ vertical }: { vertical: Vertical }) {
  useDocument(
    `${vertical.name} — ${vertical.tagline}`,
    vertical.heroSubtitle,
  )

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{vertical.icon}</span>
              <StatusBadge status={vertical.status} />
            </div>
            <span className="eyebrow">{vertical.entity}</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{vertical.heroTitle}</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">{vertical.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#enquiry" className="btn btn-primary">Make an Enquiry</a>
              <Link to="/partner" className="btn btn-secondary">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Overview" title={`What is ${vertical.name}?`} />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-lg text-slate-600 leading-relaxed">{vertical.overview}</p>
            </div>
            <div className="card-base bg-slate-50">
              <h3 className="text-base font-semibold mb-3">Current Status</h3>
              <div className="mb-4"><StatusBadge status={vertical.status} /></div>
              <p className="text-sm text-slate-500 leading-relaxed">{vertical.currentStatus}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Products & Services" title="Proposed offerings" subtitle="All products and services are proposed and under development unless otherwise stated." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vertical.products.map((p) => (
              <Card key={p.title}>
                <IconBadge>{p.icon}</IconBadge>
                <div className="mb-2"><StatusBadge status={p.status} /></div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Customer Journey" title="How customers will engage" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vertical.customerJourney.map((step) => (
              <div key={step.step} className="card-base">
                <div className="text-3xl font-bold font-display text-primary-200 mb-3">{step.step}</div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Partner Opportunity" title="Build with us" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-slate-600 mb-6">{vertical.partnerOpportunity}</p>
              <h3 className="text-base font-semibold mb-3">Partner Categories</h3>
              <FeatureList items={vertical.partnerCategories} />
            </div>
            <div className="card-base bg-primary-50">
              <h3 className="text-base font-semibold mb-3">Technology Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{vertical.techVision}</p>
              <Link to="/technology" className="text-primary-700 font-semibold text-sm">Learn about our technology →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Future Roadmap" title="Our planned phases" subtitle="A phased approach to building this vertical." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vertical.roadmap.map((phase) => (
              <div key={phase.phase} className="card-base">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary-600">{phase.phase}</span>
                  <StatusBadge status={phase.status} />
                </div>
                <h3 className="text-base font-semibold mb-2">{phase.title}</h3>
                <p className="text-sm text-slate-500">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="enquiry">
        <div className="container-page">
          <SectionHeading eyebrow="Enquiry" title={`Get in touch about ${vertical.name}`} subtitle="Have a question or want to explore working with this business? Send us an enquiry." />
          <div className="max-w-2xl">
            {vertical.formType ? (
              <DynamicForm formType={vertical.formType} />
            ) : (
              <DynamicForm formType="business" />
            )}
          </div>
        </div>
      </section>

      <CtaBand
        title="Become an Indesian partner"
        subtitle="Partner with us to grow together."
        ctaText="Partner With Us"
        ctaTo="/partner"
      />
    </>
  )
}
