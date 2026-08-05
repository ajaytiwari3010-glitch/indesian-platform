import { Link } from 'react-router-dom'

const footerSections = [
  {
    title: 'Businesses',
    links: [
      { label: 'Indesian.com', to: '/' },
      { label: 'Indesian Group', to: '/group' },
      { label: 'Indesian Digital OPD', to: '/opd' },
      { label: 'Indesian Energy', to: '/energy' },
      { label: 'Indesian Agri', to: '/agri' },
      { label: 'Indesian Infra', to: '/infra' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Technology', to: '/technology' },
      { label: 'Investor Overview', to: '/investor' },
      { label: 'Partner With Us', to: '/partner' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Use', to: '/terms' },
      { label: 'Disclaimer', to: '/disclaimer' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center text-white font-extrabold">I</span>
              <span className="font-display font-extrabold text-xl text-white">Indesian Group</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              A customer-first, technology-enabled and partner-led ecosystem designed to connect
              people and businesses with products, services and digital solutions.
            </p>
            <div className="mt-5 space-y-1 text-sm text-slate-400">
              <p>Indesian Industries Private Limited</p>
              <p>Indesian Digital Private Limited</p>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{section.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link to={link.to} className="text-slate-400 text-sm hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Indesian Industries Private Limited. All rights reserved.</span>
          <span>indesian.com</span>
        </div>
      </div>
    </footer>
  )
}
