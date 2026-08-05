import { useState } from 'react'
import { useDocument } from '../hooks/useDocument'
import { SectionHeading, IconBadge } from '../components/ui'
import { DynamicForm } from '../components/forms'

const contactInfo = [
  { icon: '📧', title: 'Email', value: 'hello@indesian.com' },
  { icon: '🏢', title: 'Holding Entity', value: 'Indesian Industries Private Limited' },
  { icon: '💻', title: 'Digital Entity', value: 'Indesian Digital Private Limited' },
]

const tabs = [
  { key: 'general', label: 'General Enquiry' },
  { key: 'business', label: 'Business Enquiry' },
  { key: 'partner', label: 'Partnership Enquiry' },
  { key: 'investor', label: 'Investor Enquiry' },
]

export default function Contact() {
  useDocument(
    'Contact — Indesian Group',
    'Get in touch with the Indesian Group. General enquiries, business enquiries, partnership enquiries, and investor enquiries.',
  )

  const [activeTab, setActiveTab] = useState('general')

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Contact</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Get in Touch</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Have a question, a business enquiry, or want to partner with us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SectionHeading eyebrow="Reach Us" title="Contact details" />
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.title} className="flex items-start gap-3">
                    <IconBadge className="w-10 h-10 text-xl flex-shrink-0">{c.icon}</IconBadge>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                      <div className="text-sm text-slate-500">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-400">
                  Additional contact details will be added as they become available. Please use the
                  enquiry forms for all communication during this phase.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-primary-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <DynamicForm formType={activeTab} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
