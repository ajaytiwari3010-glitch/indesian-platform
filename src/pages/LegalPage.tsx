import { useDocument } from '../hooks/useDocument'
import { Link } from 'react-router-dom'

type LegalSection = { heading: string; body: string }

const legalData: Record<string, { title: string; description: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How Indesian collects, uses, and protects information.',
    sections: [
      { heading: 'Data Collection', body: 'Indesian may collect information that you provide directly through forms on this website, including your name, email address, phone number, organization, and any information you include in enquiry or application messages. We may also collect technical data such as browser type and pages visited for the purpose of improving the website.' },
      { heading: 'Data Usage', body: 'Information collected through this website is used for the purpose of responding to enquiries, processing partner applications, and improving our services. We do not sell or rent your personal information to third parties.' },
      { heading: 'Cookies', body: 'This website may use cookies and similar technologies to enhance user experience and analyze website traffic. You can control cookies through your browser settings.' },
      { heading: 'User Responsibilities', body: 'Users are responsible for providing accurate information when submitting forms and enquiries. Users should not submit confidential or sensitive information through this website until a secure communication channel has been established.' },
      { heading: 'Third-Party Partners', body: 'In the future, Indesian may share relevant enquiry information with verified partners for the purpose of fulfilling service requests. Partners are expected to handle information in accordance with applicable data protection requirements.' },
      { heading: 'Service Availability', body: 'This website and its services are provided on an "as is" basis. Some features described on this website are under development or planned for the future and are not currently available.' },
      { heading: 'Future Service Activation', body: 'When new services are activated, this privacy policy may be updated to reflect the data practices associated with those services. Users will be notified of material changes.' },
      { heading: 'Contact', body: 'For privacy-related enquiries, please use the contact form on this website or email hello@indesian.com.' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    description: 'The terms and conditions for using the Indesian website.',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By accessing and using this website, you accept and agree to be bound by these Terms of Use. If you do not agree with these terms, please do not use this website.' },
      { heading: 'Use of Website', body: 'You agree to use this website for lawful purposes only. You must not use this website in any way that could damage, disable, or impair the website or interfere with any other party\'s use.' },
      { heading: 'User Responsibilities', body: 'Users are responsible for the accuracy of information submitted through forms and enquiries. Users must not submit false, misleading, or fraudulent information.' },
      { heading: 'Intellectual Property', body: 'All content on this website, including text, graphics, logos, and design elements, is the property of Indesian Industries Private Limited unless otherwise stated. You may not reproduce or distribute content without permission.' },
      { heading: 'Third-Party Partners', body: 'Some services described on this website may be delivered through third-party partners in the future. Indesian is not responsible for the acts or omissions of third-party partners, though we aim to work with verified and capable partners.' },
      { heading: 'Service Availability', body: 'This website describes products and services that are currently under development or planned for the future. Indesian does not guarantee that any described service is currently operational. Features labeled "Coming Soon," "Under Development," or "Future Roadmap" are not currently available.' },
      { heading: 'Limitation of Liability', body: 'Indesian shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website. The website is provided on an "as is" basis without warranties of any kind.' },
      { heading: 'Future Service Activation', body: 'When new services are activated, these Terms of Use may be updated. Continued use of the website after changes constitutes acceptance of the updated terms.' },
      { heading: 'Changes to Terms', body: 'Indesian reserves the right to update these terms at any time. Users are encouraged to review this page periodically.' },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Important information about the Indesian website and its content.',
    sections: [
      { heading: 'General Disclaimer', body: 'The information provided on this website is for general informational purposes only. While Indesian strives to keep information accurate and up to date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.' },
      { heading: 'Future Services', body: 'Many products and services described on this website are currently under development or planned for the future. Features labeled "Coming Soon," "Under Development," or "Future Roadmap" are not currently operational and should not be relied upon as currently available.' },
      { heading: 'Healthcare Disclaimer', body: 'Indesian Digital OPD is under development. This website does not provide medical advice, diagnosis, or treatment. The AI must not be presented as a replacement for qualified healthcare professionals. Healthcare services will be enabled in accordance with applicable requirements and through appropriately qualified and authorized professionals or organizations.' },
      { heading: 'Energy Disclaimer', body: 'Indesian Energy is under development. Availability and service suitability are subject to assessment. No guaranteed savings or specific technical outcomes are promised.' },
      { heading: 'Agriculture Disclaimer', body: 'Indesian Agri is under development. No agricultural outcomes are promised. Services and product availability are subject to partner network development.' },
      { heading: 'Infrastructure Disclaimer', body: 'Indesian Infra is under development. No project completion is guaranteed. Project delivery is subject to partner capability and assessment.' },
      { heading: 'Investment Disclaimer', body: 'This website does not constitute an offer to sell or a solicitation to buy securities. Investor information and detailed financial materials may be shared through appropriate business discussions. No valuation, funding data, or financial achievements are represented unless verified.' },
      { heading: 'Third-Party Partners', body: 'Future services may be delivered through third-party partners. Indesian is not responsible for the acts or omissions of third parties.' },
      { heading: 'Limitation of Liability', body: 'Indesian shall not be liable for any losses or damages arising from the use of this website or reliance on any information provided herein.' },
      { heading: 'Service Availability', body: 'All services are subject to availability and may be modified, suspended, or discontinued at any time without notice.' },
    ],
  },
}

export default function LegalPage({ type }: { type: 'privacy' | 'terms' | 'disclaimer' }) {
  const data = legalData[type]
  useDocument(`${data.title} — Indesian`, data.description)

  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="container-page relative">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow">Legal</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{data.title}</h1>
            <p className="text-lg text-slate-600">{data.description}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="max-w-3xl">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
              <p className="text-sm text-amber-700">
                <strong>Notice:</strong> Legal content should be reviewed and finalized before production launch.
                The content below is professional placeholder legal content.
              </p>
            </div>
            <div className="space-y-8">
              {data.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
                  <p className="text-slate-600 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-400 mb-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="flex gap-4 text-sm">
                {type !== 'privacy' && <Link to="/privacy" className="text-primary-700 font-semibold">Privacy Policy</Link>}
                {type !== 'terms' && <Link to="/terms" className="text-primary-700 font-semibold">Terms of Use</Link>}
                {type !== 'disclaimer' && <Link to="/disclaimer" className="text-primary-700 font-semibold">Disclaimer</Link>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
