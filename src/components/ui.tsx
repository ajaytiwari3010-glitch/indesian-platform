import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function StatusBadge({ status }: { status: 'live' | 'coming-soon' | 'development' | 'roadmap' }) {
  const labels = {
    'live': 'Live',
    'coming-soon': 'Coming Soon',
    'development': 'Under Development',
    'roadmap': 'Future Roadmap',
  }
  const classes = {
    'live': 'status-badge status-live',
    'coming-soon': 'status-badge status-coming-soon',
    'development': 'status-badge status-development',
    'roadmap': 'status-badge status-roadmap',
  }
  return <span className={classes[status]}>{labels[status]}</span>
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
      {subtitle && <p className="text-lg text-slate-500">{subtitle}</p>}
    </div>
  )
}

export function Card({
  children,
  to,
  className = '',
  hover = true,
}: {
  children: ReactNode
  to?: string
  className?: string
  hover?: boolean
}) {
  const cls = `card-base ${hover ? 'card-hover' : ''} ${className}`
  if (to) {
    return (
      <Link to={to} className={`${cls} block h-full`}>
        {children}
      </Link>
    )
  }
  return <div className={cls}>{children}</div>
}

export function IconBadge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CtaBand({
  title,
  subtitle,
  ctaText,
  ctaTo,
}: {
  title: string
  subtitle: string
  ctaText: string
  ctaTo: string
}) {
  return (
    <div className="container-page">
      <div className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 my-16">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/85 text-lg">{subtitle}</p>
        </div>
        <Link to={ctaTo} className="btn bg-white text-primary-800 hover:bg-primary-50 hover:-translate-y-0.5 whitespace-nowrap">
          {ctaText}
        </Link>
      </div>
    </div>
  )
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start text-slate-700">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-50 mt-0.5 flex items-center justify-center">
            <svg className="w-3 h-3 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Timeline({ items }: { items: { year: string; title: string; text: string }[] }) {
  return (
    <div className="relative pl-7">
      <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />
      {items.map((item, i) => (
        <div key={i} className="relative pb-8 last:pb-0">
          <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary-600 border-[3px] border-white shadow-[0_0_0_2px_#99f6e4]" />
          <div className="text-xs font-bold text-primary-600 mb-1">{item.year}</div>
          <h4 className="text-base font-semibold mb-1">{item.title}</h4>
          <p className="text-sm text-slate-500">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
