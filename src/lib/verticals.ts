export type VerticalStatus = 'coming-soon' | 'development' | 'roadmap'

export type Vertical = {
  slug: string
  route: string
  name: string
  shortName: string
  tagline: string
  icon: string
  entity: string
  status: VerticalStatus
  heroTitle: string
  heroSubtitle: string
  overview: string
  products: { icon: string; title: string; desc: string; status: VerticalStatus }[]
  customerJourney: { step: string; title: string; desc: string }[]
  partnerOpportunity: string
  partnerCategories: string[]
  techVision: string
  currentStatus: string
  roadmap: { phase: string; title: string; desc: string; status: VerticalStatus }[]
  formType?: 'energy' | 'agri' | 'infra' | 'opd'
}

export const verticals: Vertical[] = [
  {
    slug: 'opd',
    route: '/opd',
    name: 'Indesian Digital OPD',
    shortName: 'Digital OPD',
    tagline: 'Virtual healthcare and digital healthcare solutions',
    icon: '🩺',
    entity: 'Indesian Digital Private Limited',
    status: 'coming-soon',
    heroTitle: 'Digital Healthcare Access, Designed Around People',
    heroSubtitle: 'A virtual healthcare platform designed to make outpatient care more accessible across India. Under development.',
    overview: 'Indesian Digital OPD is being built as a digital healthcare platform under Indesian Digital Private Limited. The goal is to connect patients with qualified healthcare professionals through virtual consultations, digital health records, and coordinated care — making outpatient services more accessible, especially in areas with limited healthcare infrastructure. Healthcare services will be enabled in accordance with applicable requirements and through appropriately qualified and authorized professionals or organizations.',
    products: [
      { icon: '📹', title: 'Virtual Consultations', desc: 'Connect with verified healthcare professionals from home.', status: 'development' },
      { icon: '📋', title: 'Digital Health Records', desc: 'Patient-controlled, centralised medical history.', status: 'development' },
      { icon: '🗓️', title: 'Appointment Scheduling', desc: 'Book and manage appointments online.', status: 'development' },
      { icon: '🔬', title: 'Lab Coordination', desc: 'Coordinate diagnostic tests with partner labs.', status: 'roadmap' },
    ],
    customerJourney: [
      { step: '01', title: 'Register', desc: 'Create a patient profile with basic health information.' },
      { step: '02', title: 'Request Appointment', desc: 'Choose a speciality and preferred time slot.' },
      { step: '03', title: 'Consult', desc: 'Connect with a qualified healthcare professional.' },
      { step: '04', title: 'Follow-up', desc: 'Receive guidance and schedule follow-ups as needed.' },
    ],
    partnerOpportunity: 'Healthcare organizations, clinics, and appropriately qualified medical professionals can partner with Indesian Digital OPD to extend their reach to patients digitally.',
    partnerCategories: ['Healthcare Organizations', 'Qualified Medical Professionals', 'Diagnostic Labs', 'Pharmacies'],
    techVision: 'Built on the Indesian AI and Technology platform with smart enquiry routing, automated appointment updates, and future AI-assisted symptom intake — all coordinated through the central Indesian CRM.',
    currentStatus: 'Indesian Digital OPD is under development. Clinical workflows, healthcare professional onboarding, and patient services are not yet operational.',
    roadmap: [
      { phase: 'Phase 1', title: 'Platform Build', desc: 'Core consultation and appointment infrastructure.', status: 'development' },
      { phase: 'Phase 2', title: 'Provider Network', desc: 'Onboard qualified healthcare professionals and organizations.', status: 'roadmap' },
      { phase: 'Phase 3', title: 'Patient Services', desc: 'Launch consultations and digital health records.', status: 'roadmap' },
      { phase: 'Phase 4', title: 'Integrated Care', desc: 'Lab coordination, chronic care, and health technology.', status: 'roadmap' },
    ],
    formType: 'opd',
  },
  {
    slug: 'energy',
    route: '/energy',
    name: 'Indesian Energy',
    shortName: 'Energy',
    tagline: 'Energy and future partner-led energy solutions',
    icon: '⚡',
    entity: 'Indesian Industries Private Limited',
    status: 'coming-soon',
    heroTitle: 'Smarter Pathways to Energy Solutions',
    heroSubtitle: 'Partner-led energy solutions designed for India\'s transition to clean power. Under development.',
    overview: 'Indesian Energy is being developed as the energy vertical of Indesian Industries Private Limited. The focus is on partner-led clean energy solutions — connecting customers with verified installers and energy service providers for solar, storage, and related energy systems. Rather than building all capabilities in-house, Indesian Energy operates through a partner-first model.',
    products: [
      { icon: '☀️', title: 'Rooftop Solar', desc: 'Residential and commercial solar via partner installers.', status: 'development' },
      { icon: '🔋', title: 'Energy Storage', desc: 'Battery systems for backup and off-grid use.', status: 'roadmap' },
      { icon: '🏭', title: 'Industrial Power', desc: 'Distributed generation for industrial customers.', status: 'roadmap' },
      { icon: '🔌', title: 'EV Charging', desc: 'Charging infrastructure through partners.', status: 'roadmap' },
    ],
    customerJourney: [
      { step: '01', title: 'Enquire', desc: 'Submit energy requirements through the enquiry form.' },
      { step: '02', title: 'Assess', desc: 'Partner assesses site and recommends a solution.' },
      { step: '03', title: 'Install', desc: 'Verified partner installs the energy system.' },
      { step: '04', title: 'Support', desc: 'Ongoing monitoring and maintenance support.' },
    ],
    partnerOpportunity: 'Solar installers, energy consultants, and EPC companies can partner with Indesian Energy to receive project leads, access the Indesian platform, and deliver energy solutions under the Indesian brand.',
    partnerCategories: ['Solar Installers', 'Energy Consultants', 'EPC Partners', 'Equipment Suppliers'],
    techVision: 'Energy enquiries will flow through the central Indesian CRM with AI-assisted partner matching, automated project updates, and future integration with energy monitoring systems.',
    currentStatus: 'Indesian Energy is under development. The partner network and customer-facing services are being built and are not yet operational.',
    roadmap: [
      { phase: 'Phase 1', title: 'Partner Network', desc: 'Build network of verified energy installers.', status: 'development' },
      { phase: 'Phase 2', title: 'Customer Enquiries', desc: 'Launch enquiry and partner-matching flow.', status: 'roadmap' },
      { phase: 'Phase 3', title: 'Project Delivery', desc: 'First partner-led installations.', status: 'roadmap' },
      { phase: 'Phase 4', title: 'Energy Platform', desc: 'Monitoring, optimisation, and EV charging.', status: 'roadmap' },
    ],
    formType: 'energy',
  },
  {
    slug: 'agri',
    route: '/agri',
    name: 'Indesian Agri',
    shortName: 'Agri',
    tagline: 'Agriculture products, services and partner ecosystem',
    icon: '🌾',
    entity: 'Indesian Industries Private Limited',
    status: 'coming-soon',
    heroTitle: 'Digital Pathways for Agriculture and Growth',
    heroSubtitle: 'A partner-led agriculture ecosystem connecting farmers to markets. Under development.',
    overview: 'Indesian Agri is being built as the agriculture vertical of Indesian Industries Private Limited. The focus is on creating a partner ecosystem that connects farmers and agri-producers with markets, processing, and supply chain infrastructure — improving value realization for farmers while ensuring quality and traceability for customers.',
    products: [
      { icon: '🌾', title: 'Grains & Pulses', desc: 'Sourced from farmer partners across India.', status: 'development' },
      { icon: '🫒', title: 'Cold-Pressed Oils', desc: 'Traditional, chemical-free oil processing.', status: 'roadmap' },
      { icon: '🥬', title: 'Fresh Produce', desc: 'Farm-to-table supply chain.', status: 'roadmap' },
      { icon: '📦', title: 'Agri-Inputs', desc: 'Seeds, bio-fertilizers, and tools for farmers.', status: 'roadmap' },
    ],
    customerJourney: [
      { step: '01', title: 'Source', desc: 'Produce sourced from partner farmers.' },
      { step: '02', title: 'Process', desc: 'Cleaning, grading, and packaging.' },
      { step: '03', title: 'Distribute', desc: 'Supply to customers and markets.' },
      { step: '04', title: 'Trace', desc: 'Farm-to-customer traceability.' },
    ],
    partnerOpportunity: 'Farmers, farmer collectives, agri-processors, and logistics providers can partner with Indesian Agri to access markets, fair pricing, and the Indesian supply chain infrastructure.',
    partnerCategories: ['Farmers', 'Farmer Collectives', 'Agri-Processors', 'Logistics Partners'],
    techVision: 'The agri ecosystem will use the Indesian CRM for partner management, AI-assisted demand matching, and automated supply chain updates — with future plans for farm-level traceability.',
    currentStatus: 'Indesian Agri is under development. The farmer partner network and product supply chain are being established and are not yet operational.',
    roadmap: [
      { phase: 'Phase 1', title: 'Partner Network', desc: 'Onboard farmer partners and collectives.', status: 'development' },
      { phase: 'Phase 2', title: 'Supply Chain', desc: 'Build processing and distribution infrastructure.', status: 'roadmap' },
      { phase: 'Phase 3', title: 'Product Launch', desc: 'First products available to customers.', status: 'roadmap' },
      { phase: 'Phase 4', title: 'Agri Platform', desc: 'Digital traceability and agri-input services.', status: 'roadmap' },
    ],
    formType: 'agri',
  },
  {
    slug: 'infra',
    route: '/infra',
    name: 'Indesian Infra',
    shortName: 'Infra',
    tagline: 'Infrastructure solutions and partner-led project services',
    icon: '🏗️',
    entity: 'Indesian Industries Private Limited',
    status: 'coming-soon',
    heroTitle: 'Connecting Infrastructure Requirements with Capable Solutions',
    heroSubtitle: 'Partner-led infrastructure solutions for India\'s building needs. Under development.',
    overview: 'Indesian Infra is being developed as the infrastructure vertical of Indesian Industries Private Limited. The focus is on partner-led project services — connecting customers with verified contractors and project management teams for construction, civil works, and infrastructure projects. Indesian Infra coordinates projects while working through a network of specialized execution partners.',
    products: [
      { icon: '🏗️', title: 'Modular Construction', desc: 'Prefabricated building solutions via partners.', status: 'development' },
      { icon: '🛣️', title: 'Civil Works', desc: 'Roads, drainage, and civil infrastructure.', status: 'roadmap' },
      { icon: '🏢', title: 'Commercial Buildings', desc: 'Turnkey commercial construction projects.', status: 'roadmap' },
      { icon: '💧', title: 'Water & Sanitation', desc: 'Water supply and treatment systems.', status: 'roadmap' },
    ],
    customerJourney: [
      { step: '01', title: 'Enquire', desc: 'Submit project requirements through the enquiry form.' },
      { step: '02', title: 'Plan', desc: 'Partner develops proposal and project plan.' },
      { step: '03', title: 'Execute', desc: 'Verified partner executes the project.' },
      { step: '04', title: 'Handover', desc: 'Quality check and project handover.' },
    ],
    partnerOpportunity: 'Construction companies, contractors, and engineering firms can partner with Indesian Infra to receive project leads, access the Indesian platform, and deliver infrastructure projects under the Indesian brand.',
    partnerCategories: ['Construction Companies', 'Civil Contractors', 'Engineering Firms', 'Material Suppliers'],
    techVision: 'Infrastructure enquiries will flow through the central Indesian CRM with AI-assisted partner matching, automated project updates, and future integration with project monitoring tools.',
    currentStatus: 'Indesian Infra is under development. The partner network and project services are being built and are not yet operational.',
    roadmap: [
      { phase: 'Phase 1', title: 'Partner Network', desc: 'Build network of verified contractors.', status: 'development' },
      { phase: 'Phase 2', title: 'Project Enquiries', desc: 'Launch enquiry and partner-matching flow.', status: 'roadmap' },
      { phase: 'Phase 3', title: 'Project Delivery', desc: 'First partner-led projects.', status: 'roadmap' },
      { phase: 'Phase 4', title: 'Infra Platform', desc: 'Project monitoring and modular construction.', status: 'roadmap' },
    ],
    formType: 'infra',
  },
]

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug)
}
