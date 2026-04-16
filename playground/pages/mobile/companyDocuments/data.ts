export type CompanyDocumentStatus = 'Acknowledged' | 'Not Acknowledged'

export type CompanyDocumentDetail = {
  slug: string
  code: string
  version: string
  title: string
  fileName: string
  createdBy: string
  createdDate: string
  publishedDate: string
  status: CompanyDocumentStatus
  summaryDate: string
}

export type CompanyDocumentGroup = {
  slug: string
  title: string
  category: string
  documents: CompanyDocumentDetail[]
}

export const companyDocumentGroups: CompanyDocumentGroup[] = [
  {
    slug: 'group-doa',
    title: 'Group DOA',
    category: 'Group DOA',
    documents: [
      {
        slug: 'group-doa-policy',
        code: 'KB00100001',
        version: '[1.0]',
        title: 'Group DOA Policy',
        fileName: 'Group DOA Policy.pdf',
        createdBy: 'Corporate Governance Team',
        createdDate: '2026-02-10 12:00:00',
        publishedDate: '2026-02-10 12:15:00',
        status: 'Acknowledged',
        summaryDate: '2026-02-10',
      },
    ],
  },
  {
    slug: 'anti-money-laundering-policy',
    title: 'Anti-Money Laundering Policy',
    category: 'Anti-money Laundering Policy',
    documents: [
      {
        slug: 'anti-money-laundering-policy-v1',
        code: 'KB00111011',
        version: '[1.0]',
        title: 'Anti-Money Laundering Policy',
        fileName: 'Anti-Money Laundering Policy.pdf',
        createdBy: 'Risk and Compliance',
        createdDate: '2026-03-05 10:12:00',
        publishedDate: '2026-03-05 10:20:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-03-05',
      },
    ],
  },
  {
    slug: 'group-treasury-policies',
    title: 'Group Treasury Policies',
    category: 'Group Treasury Policies',
    documents: [
      {
        slug: 'group-treasury-policy-main',
        code: 'KB00120021',
        version: '[2.0]',
        title: 'Group Treasury Policy',
        fileName: 'Group Treasury Policy.pdf',
        createdBy: 'Treasury Team',
        createdDate: '2026-01-08 16:20:00',
        publishedDate: '2026-01-08 16:30:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-01-08',
      },
    ],
  },
  {
    slug: 'special-purpose-vehicle-management-rules',
    title: 'Special Purpose Vehicle (SPV) Management Rules',
    category: 'Special Purpose Vehicle (SPV) Management Rules',
    documents: [
      {
        slug: 'spv-management-rules',
        code: 'KB00130031',
        version: '[1.0]',
        title: 'Special Purpose Vehicle (SPV) Management Rules',
        fileName: 'SPV Management Rules.pdf',
        createdBy: 'Finance Control',
        createdDate: '2026-01-12 09:40:00',
        publishedDate: '2026-01-12 09:50:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-01-12',
      },
    ],
  },
  {
    slug: 'group-taxation-policies',
    title: 'Group Taxation Policies',
    category: 'Group Taxation Policies',
    documents: [
      {
        slug: 'group-taxation-policy',
        code: 'KB00140010',
        version: '[1.2]',
        title: 'Group Taxation Policy',
        fileName: 'Group Taxation Policy.pdf',
        createdBy: 'Tax Team',
        createdDate: '2026-01-18 13:10:00',
        publishedDate: '2026-01-18 13:15:00',
        status: 'Acknowledged',
        summaryDate: '2026-01-18',
      },
    ],
  },
  {
    slug: 'group-financial-system-policies',
    title: 'Group Financial System Policies',
    category: 'Group Financial System Policies',
    documents: [
      {
        slug: 'group-financial-system-policy',
        code: 'KB00150020',
        version: '[1.0]',
        title: 'Group Financial System Policy',
        fileName: 'Group Financial System Policy.pdf',
        createdBy: 'Finance Systems',
        createdDate: '2026-02-01 08:00:00',
        publishedDate: '2026-02-01 08:05:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-02-01',
      },
    ],
  },
  {
    slug: 'group-business-record-keeping-guidelines',
    title: 'Group Business Record Keeping Guidelines',
    category: 'Group Business Record Keeping Guidelines',
    documents: [
      {
        slug: 'business-record-keeping-guidelines',
        code: 'KB00160001',
        version: '[1.1]',
        title: 'Group Business Record Keeping Guidelines',
        fileName: 'Business Record Keeping Guidelines.pdf',
        createdBy: 'Administration',
        createdDate: '2026-03-08 14:00:00',
        publishedDate: '2026-03-08 14:15:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-03-08',
      },
    ],
  },
  {
    slug: 'group-credit-control-policy',
    title: 'Group Credit Control Policy',
    category: 'Group Credit Control Policy',
    documents: [
      {
        slug: 'customer-credit-limit-management-policy',
        code: 'KB0010236',
        version: '[3.03]',
        title: 'Customer Credit Limit Management Policy',
        fileName: '大行集团客户授信额度管理办法0331.pdf',
        createdBy: 'Ko Tuen Wai Tina',
        createdDate: '2026-03-31 18:18:34',
        publishedDate: '2026-03-31 18:21:09',
        status: 'Not Acknowledged',
        summaryDate: '2026-03-31',
      },
      {
        slug: 'buy-side-counterparties-credit-policy',
        code: 'KB0010237',
        version: '[2.01]',
        title: '(Buy-side) Counterparties credit policy',
        fileName: 'Buy-side Counterparties credit policy.pdf',
        createdBy: 'Group Finance',
        createdDate: '2021-04-20 09:00:00',
        publishedDate: '2021-04-20 09:20:00',
        status: 'Not Acknowledged',
        summaryDate: '2021-04-20',
      },
    ],
  },
  {
    slug: 'group-risk-management-policy-reporting-guidelines',
    title: 'Group Risk Management Policy & Reporting Guidelines',
    category: 'Group Risk Management Policy & Reporting Guidelines',
    documents: [
      {
        slug: 'group-risk-management-policy',
        code: 'KB00170007',
        version: '[1.0]',
        title: 'Group Risk Management Policy & Reporting Guidelines',
        fileName: 'Risk Management Policy.pdf',
        createdBy: 'Risk Management',
        createdDate: '2026-03-15 15:00:00',
        publishedDate: '2026-03-15 15:05:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-03-15',
      },
    ],
  },
  {
    slug: 'group-provision-policy',
    title: 'Group Provision Policy',
    category: 'Group Provision Policy',
    documents: [
      {
        slug: 'group-provision-policy-main',
        code: 'KB00180001',
        version: '[1.0]',
        title: 'Group Provision Policy',
        fileName: 'Group Provision Policy.pdf',
        createdBy: 'Finance Policy',
        createdDate: '2026-03-09 11:30:00',
        publishedDate: '2026-03-09 11:40:00',
        status: 'Acknowledged',
        summaryDate: '2026-03-09',
      },
    ],
  },
  {
    slug: 'group-policy-on-intercompany-transactions',
    title: 'Group Policy on Intercompany Transactions',
    category: 'Group Policy on Intercompany Transactions',
    documents: [
      {
        slug: 'intercompany-transactions-policy',
        code: 'KB00190002',
        version: '[1.0]',
        title: 'Group Policy on Intercompany Transactions',
        fileName: 'Intercompany Transactions Policy.pdf',
        createdBy: 'Financial Control',
        createdDate: '2026-02-22 10:10:00',
        publishedDate: '2026-02-22 10:12:00',
        status: 'Acknowledged',
        summaryDate: '2026-02-22',
      },
    ],
  },
  {
    slug: 'construction-project-guide',
    title: 'Construction Project Guide',
    category: 'Construction Project Guide',
    documents: [
      {
        slug: 'construction-project-guide-it',
        code: 'KB00200012',
        version: '[2.0]',
        title: 'Construction Project Guide',
        fileName: 'Construction Project Guide.pdf',
        createdBy: 'Project Office',
        createdDate: '2026-01-25 17:00:00',
        publishedDate: '2026-01-25 17:10:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-01-25',
      },
    ],
  },
  {
    slug: 'group-policy-for-property-leasing',
    title: 'Group Policy for Property Leasing',
    category: 'Group Policy for Property Leasing',
    documents: [
      {
        slug: 'property-leasing-policy',
        code: 'KB00210001',
        version: '[1.0]',
        title: 'Group Policy for Property Leasing',
        fileName: 'Property Leasing Policy.pdf',
        createdBy: 'Property Management',
        createdDate: '2026-03-01 13:00:00',
        publishedDate: '2026-03-01 13:05:00',
        status: 'Acknowledged',
        summaryDate: '2026-03-01',
      },
    ],
  },
  {
    slug: 'gad-policies',
    title: 'GAD Policies',
    category: 'GAD Admin Policies',
    documents: [
      {
        slug: 'gad-policy-main',
        code: 'KB00220006',
        version: '[1.0]',
        title: 'GAD Policy',
        fileName: 'GAD Policy.pdf',
        createdBy: 'GAD Team',
        createdDate: '2026-02-28 10:00:00',
        publishedDate: '2026-02-28 10:10:00',
        status: 'Not Acknowledged',
        summaryDate: '2026-02-28',
      },
    ],
  },
  {
    slug: 'group-accounting-policies',
    title: 'Group Accounting Policies',
    category: 'Group Accounting Policies',
    documents: [
      {
        slug: 'group-accounting-policy-main',
        code: 'KB00230003',
        version: '[5.0]',
        title: 'Group Accounting Policy',
        fileName: 'Group Accounting Policy.pdf',
        createdBy: 'Accounting Team',
        createdDate: '2026-01-06 09:00:00',
        publishedDate: '2026-01-06 09:05:00',
        status: 'Acknowledged',
        summaryDate: '2026-01-06',
      },
    ],
  },
]

export const findCompanyDocumentGroup = (slug: string) => {
  return companyDocumentGroups.find(group => group.slug === slug) || null
}

export const findCompanyDocumentDetail = (groupSlug: string, documentSlug: string) => {
  const group = findCompanyDocumentGroup(groupSlug)
  if (!group) {
    return null
  }

  return group.documents.find(document => document.slug === documentSlug) || null
}
