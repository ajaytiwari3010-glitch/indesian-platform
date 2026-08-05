import { useState } from 'react'
import { submitForm } from '../lib/forms'

type FieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox'

export type FormField = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  placeholder?: string
  halfWidth?: boolean
}

export type FormConfig = {
  type: string
  title: string
  subtitle: string
  fields: FormField[]
  submitLabel: string
}

const consentField: FormField = {
  name: 'consent',
  label: 'I consent to Indesian reviewing and storing this information for the purpose of responding to my enquiry.',
  type: 'checkbox',
  required: true,
}

export const formConfigs: Record<string, FormConfig> = {
  general: {
    type: 'general',
    title: 'General Enquiry',
    subtitle: 'Have a question about the Indesian ecosystem? Let us know.',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Optional' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
      { name: 'enquiryType', label: 'Enquiry Type', type: 'select', options: ['General', 'Business', 'Partnership', 'Investor', 'Media', 'Other'] },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message' },
      consentField,
    ],
    submitLabel: 'Submit Enquiry',
  },
  business: {
    type: 'business',
    title: 'Business Enquiry',
    subtitle: 'Looking to work with a specific Indesian business? Tell us more.',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Company name' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
      { name: 'vertical', label: 'Business Vertical', type: 'select', options: ['Indesian.com', 'Indesian Digital OPD', 'Indesian Energy', 'Indesian Agri', 'Indesian Infra', 'Indesian AI and Technology'] },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us about your business needs' },
      consentField,
    ],
    submitLabel: 'Submit Business Enquiry',
  },
  partner: {
    type: 'partner',
    title: 'Partner Application',
    subtitle: 'Apply to partner with the Indesian Group. Partner applications are subject to review and verification.',
    fields: [
      { name: 'businessName', label: 'Business Name', type: 'text', required: true, placeholder: 'Your business name' },
      { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, placeholder: 'Full name' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
      { name: 'businessCategory', label: 'Business Category', type: 'select', required: true, options: ['Product Seller', 'Supplier', 'Service Provider', 'Energy Professional', 'Agriculture Partner', 'Infrastructure Partner', 'Healthcare Organization', 'Technology Partner', 'Logistics Partner'] },
      { name: 'serviceCategory', label: 'Service Category', type: 'text', placeholder: 'What service do you provide?' },
      { name: 'cityState', label: 'City / State', type: 'text', required: true, placeholder: 'e.g. Pune, Maharashtra' },
      { name: 'serviceArea', label: 'Service Area', type: 'text', placeholder: 'Geographic area you serve' },
      { name: 'experience', label: 'Experience', type: 'text', placeholder: 'Years of experience' },
      { name: 'website', label: 'Website', type: 'text', placeholder: 'Optional' },
      { name: 'registration', label: 'Business Registration Information', type: 'text', placeholder: 'Where applicable' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Describe your business and what you offer' },
      consentField,
    ],
    submitLabel: 'Submit Application',
  },
  energy: {
    type: 'energy',
    title: 'Energy Enquiry',
    subtitle: 'Submit your energy requirements and our team will connect you with a suitable partner.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
      { name: 'city', label: 'City', type: 'text', required: true, placeholder: 'Your city' },
      { name: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Other'] },
      { name: 'monthlyBill', label: 'Monthly Electricity Bill', type: 'select', options: ['Below ₹2,000', '₹2,000 – ₹5,000', '₹5,000 – ₹10,000', '₹10,000 – ₹25,000', 'Above ₹25,000'] },
      { name: 'roofType', label: 'Roof Type', type: 'select', options: ['Concrete', 'Tin/Metal Sheet', 'Tiles', 'Open Ground', 'Other'] },
      { name: 'requirement', label: 'Approximate Requirement', type: 'text', placeholder: 'e.g. 3 kW solar system' },
      { name: 'contactMethod', label: 'Preferred Contact Method', type: 'select', options: ['Phone Call', 'WhatsApp', 'Email'] },
      consentField,
    ],
    submitLabel: 'Submit Energy Enquiry',
  },
  agri: {
    type: 'agri',
    title: 'Agriculture Enquiry',
    subtitle: 'Submit your agriculture requirements and our team will connect you with the right partner.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 ...' },
      { name: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Your location' },
      { name: 'customerType', label: 'Customer Type', type: 'select', required: true, options: ['Farmer', 'Agri Business', 'Buyer', 'Other'] },
      { name: 'requirement', label: 'Agriculture Requirement', type: 'text', required: true, placeholder: 'What do you need?' },
      { name: 'cropCategory', label: 'Crop Category', type: 'text', placeholder: 'Where relevant' },
      { name: 'landSize', label: 'Land Size Range', type: 'text', placeholder: 'Where relevant' },
      { name: 'contactMethod', label: 'Preferred Contact Method', type: 'select', options: ['Phone Call', 'WhatsApp', 'Email'] },
      consentField,
    ],
    submitLabel: 'Submit Agri Enquiry',
  },
  infra: {
    type: 'infra',
    title: 'Project Enquiry',
    subtitle: 'Submit your project requirements and our team will connect you with a suitable partner.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Organization name' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
      { name: 'projectType', label: 'Project Type', type: 'select', required: true, options: ['Residential Construction', 'Commercial Construction', 'Civil Works', 'Roads', 'Water & Sanitation', 'Modular Construction', 'Other'] },
      { name: 'projectLocation', label: 'Project Location', type: 'text', required: true, placeholder: 'Project location' },
      { name: 'projectScale', label: 'Project Scale', type: 'select', options: ['Small', 'Medium', 'Large'] },
      { name: 'budget', label: 'Estimated Budget Range', type: 'select', options: ['Below ₹5 Lakh', '₹5 – ₹25 Lakh', '₹25 Lakh – ₹1 Crore', '₹1 – ₹5 Crore', 'Above ₹5 Crore'] },
      { name: 'timeline', label: 'Timeline', type: 'text', placeholder: 'Expected timeline' },
      { name: 'description', label: 'Project Description', type: 'textarea', required: true, placeholder: 'Describe your project' },
      consentField,
    ],
    submitLabel: 'Submit Project Enquiry',
  },
  opd: {
    type: 'opd',
    title: 'Appointment Request',
    subtitle: 'Request an appointment. Healthcare services will be enabled through appropriately qualified and authorized professionals or organizations.',
    fields: [
      { name: 'name', label: 'Patient Name', type: 'text', required: true, placeholder: 'Patient name' },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
      { name: 'speciality', label: 'Preferred Speciality', type: 'select', options: ['General Medicine', 'Pediatrics', 'Cardiology', 'Dermatology', 'Orthopedics', 'Gynecology', 'Psychiatry', 'Other'] },
      { name: 'preferredDate', label: 'Preferred Date', type: 'text', placeholder: 'Preferred date' },
      { name: 'preferredTime', label: 'Preferred Time', type: 'select', options: ['Morning', 'Afternoon', 'Evening'] },
      { name: 'description', label: 'Brief Description', type: 'textarea', placeholder: 'Brief description of your concern (optional)' },
      consentField,
    ],
    submitLabel: 'Request Appointment',
  },
  investor: {
    type: 'investor',
    title: 'Investor Enquiry',
    subtitle: 'Investor information and detailed financial materials may be shared through appropriate business discussions.',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Organization or firm' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
      { name: 'interest', label: 'Area of Interest', type: 'select', options: ['Investment', 'Partnership', 'Advisory', 'Media', 'Other'] },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message' },
      consentField,
    ],
    submitLabel: 'Submit Investor Enquiry',
  },
  contact: {
    type: 'contact',
    title: 'Contact Us',
    subtitle: 'Reach out to the Indesian team.',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Optional' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 ...' },
      { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@example.com' },
      { name: 'enquiryType', label: 'Enquiry Type', type: 'select', required: true, options: ['General', 'Business', 'Partnership', 'Investor'] },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message' },
      consentField,
    ],
    submitLabel: 'Send Message',
  },
}

export function DynamicForm({ formType }: { formType: string }) {
  const config = formConfigs[formType]
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  if (!config) return <p>Form not found.</p>

  const handleChange = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const result = await submitForm(config.type, values)
      if (result.ok) {
        setStatus('success')
        setValues({})
      } else {
        setStatus('error')
        setError(result.message)
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="card-base text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank you.</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Your request has been received. Our team will review the information and provide an update through the appropriate channel.
        </p>
        <button className="btn btn-secondary" onClick={() => setStatus('idle')}>Submit another</button>
      </div>
    )
  }

  return (
    <div className="card-base">
      <h3 className="text-xl font-semibold mb-1">{config.title}</h3>
      <p className="text-slate-500 text-sm mb-6">{config.subtitle}</p>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {config.fields.map((field, i) => {
            const isFullWidth = field.type === 'textarea' || field.type === 'checkbox' || !field.halfWidth
            const colSpan = isFullWidth ? 'sm:col-span-2' : ''
            return (
              <div key={field.name} className={colSpan} style={{ order: field.type === 'checkbox' ? 999 : i }}>
                {field.type === 'checkbox' ? (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required={field.required}
                      checked={values[field.name] === 'true'}
                      onChange={(e) => handleChange(field.name, e.target.checked ? 'true' : 'false')}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
                    />
                    <span className="text-sm text-slate-600">{field.label}{field.required && <span className="text-primary-600 ml-0.5">*</span>}</span>
                  </label>
                ) : (
                  <>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                      {field.label}{field.required && <span className="text-primary-600 ml-0.5">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        className="input-field"
                        value={values[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="input-field min-h-[90px] resize-y"
                        value={values[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="input-field"
                        value={values[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting...' : config.submitLabel}
        </button>
        <p className="text-xs text-slate-400 text-center">
          Demo submission — stored locally. Supabase integration coming soon.
        </p>
      </form>
    </div>
  )
}

export function EnquiryForm({ type = 'general' }: { type?: string }) {
  return <DynamicForm formType={type} />
}

export function PartnerForm() {
  return <DynamicForm formType="partner" />
}

export function ContactForm() {
  return <DynamicForm formType="contact" />
}

export function BusinessEnquiryForm() {
  return <DynamicForm formType="business" />
}
