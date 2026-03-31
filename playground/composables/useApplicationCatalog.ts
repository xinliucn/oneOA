export interface ApplicationCatalogItem {
  id: string
  name: string
  type: string
  regions: string[]
}

export interface ApplicationCatalogGroup {
  id: string
  title: string
  items: ApplicationCatalogItem[]
}

export interface ApplicationDepartment {
  id: string
  slug: string
  name: string
  icon: string
  color: string
  description: string
  intranetLabel: string
  regions: string[]
  groups: ApplicationCatalogGroup[]
}

export const applicationDepartments: ApplicationDepartment[] = [
  {
    id: 'dt',
    slug: 'digital-technology',
    name: 'Digital & Technology',
    icon: 'digital-technology',
    color: '#3C8AFF',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    intranetLabel: 'Digital & Technology Intranet',
    regions: ['CN', 'HK', 'SEA'],
    groups: [
      {
        id: 'forms',
        title: 'New Forms',
        items: [
          { id: 'dt-1', name: 'Order Engagement Approval', type: 'Weaver Process', regions: ['CN', 'HK', 'SEA'] },
          { id: 'dt-2', name: 'IT Demand Creation', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'dt-3', name: 'IT Project Change Submission', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'dt-4', name: 'IT Project Creation', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
        ],
      },
      {
        id: 'data',
        title: 'Data',
        items: [
          { id: 'dt-5', name: 'Order List', type: 'Weaver Data', regions: ['CN', 'HK', 'SEA'] },
          { id: 'dt-6', name: 'IT Demand List', type: 'Weaver Data', regions: ['CN', 'HK', 'SEA'] },
          { id: 'dt-7', name: 'IT Project List', type: 'Weaver Data', regions: ['CN', 'HK', 'SEA'] },
        ],
      },
    ],
  },
  {
    id: 'finance',
    slug: 'finance',
    name: 'Finance',
    icon: 'finance-bars',
    color: '#009A88',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    intranetLabel: 'Finance Intranet',
    regions: ['CN', 'HK', 'SEA'],
    groups: [
      {
        id: 'forms',
        title: 'New Forms',
        items: [
          { id: 'finance-1', name: 'Bounced Cheque Record', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'finance-2', name: 'Bounced Cheque Refund Application', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'finance-3', name: 'TBC', type: 'Redirect to []', regions: ['CN', 'HK', 'SEA'] },
        ],
      },
      {
        id: 'data',
        title: 'Data',
        items: [
          { id: 'finance-4', name: 'Bounced Cheque Data List', type: 'Weaver Data', regions: ['CN', 'HK', 'SEA'] },
        ],
      },
    ],
  },
  {
    id: 'legal',
    slug: 'legal-compliance',
    name: 'Legal & Compliance',
    icon: 'legal-compliance',
    color: '#D7008F',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    intranetLabel: 'Legal & Compliance Intranet',
    regions: ['CN', 'HK', 'SEA'],
    groups: [
      {
        id: 'forms',
        title: 'New Forms',
        items: [
          { id: 'legal-1', name: 'Dispute Submission', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'legal-2', name: 'Group Contract Clearance & Approval', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'legal-3', name: 'Signed Contract Submission (Group)', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
          { id: 'legal-4', name: 'Trademark Registration', type: 'Weaver Process Form', regions: ['CN', 'HK', 'SEA'] },
        ],
      },
      {
        id: 'data',
        title: 'Data',
        items: [
          { id: 'legal-5', name: 'Contract List', type: 'Weaver Data', regions: ['CN', 'HK', 'SEA'] },
          { id: 'legal-6', name: 'Dispute Tracker', type: 'Weaver Data', regions: ['CN', 'HK', 'SEA'] },
        ],
      },
    ],
  },
]

export const getApplicationDepartmentBySlug = (slug: string) => {
  return applicationDepartments.find((department) => department.slug === slug) || null
}
