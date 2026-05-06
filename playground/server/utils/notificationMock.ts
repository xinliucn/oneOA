import type { NotificationItem } from '~/types/notification'

type NotificationPayload = NotificationItem['payload']

const buildIsoTime = (minutesAgo: number) => {
  return new Date(Date.now() - minutesAgo * 60 * 1000).toISOString()
}

const buildReadTime = (minutesAgo: number) => {
  return new Date(Date.now() - minutesAgo * 60 * 1000 + 30 * 1000).toISOString()
}

const withNotificationFields = (item: Omit<NotificationItem, 'created_at' | 'updated_at' | 'is_read'> & { payload: NotificationPayload }) => ({
  ...item,
  created_at: item.createdAt,
  updated_at: item.readAt || item.createdAt,
  is_read: item.readAt ? '1' : '0',
})

const mockNotifications: Array<NotificationItem & { payload: NotificationPayload }> = [
  withNotificationFields({
    id: '169',
    title: 'Action Required: Demand & Business Case Approval',
    content: 'Submitted by Victor Ho via WOA-DPM. Please review the latest demand and business case approval request.',
    summary: 'WOA-DPM-26010001',
    requestId: '506594',
    link: 'https://outlook.office.com/',
    source: 'Victor Ho via WOA-DPM',
    category: 'it',
    createdAt: buildIsoTime(5),
    readAt: null,
    payload: {
      variant: 'approval',
      requestId: '506594',
      user_id: 'demo-user',
      author: 'Victor Ho',
      approval: {
        reference: 'WOA-DPM-26010001',
        status: 'Pending',
        submittedLabel: 'Submitted by:',
        submittedBy: 'Victor Ho via WOA-DPM',
        submittedDate: '2026-04-21',
        submittedTime: '09:25',
        timeline: [
          {
            name: 'Ideation',
            status: 'Approved',
            date: 'Approved 2026-04-18 at 14:47',
          },
          {
            name: 'Pre-Approval Assessment',
            status: 'Approved',
            date: 'Approved 2026-04-20 at 17:21',
          },
          {
            name: 'Registration',
            status: 'Pending',
            date: 'Pending',
          },
        ],
        attachments: [
          { name: 'Demand Case.xlsx' },
          { name: 'Business Justification.pdf' },
        ],
        fields: [
          { label: 'Reference Number', value: 'WOA-DPM-26010001' },
          { label: 'Process Status', value: 'Pending (Registration)' },
          { label: 'Requestor', value: 'Victor Ho' },
          { label: 'Request Date', value: '2026-04-21' },
          { label: 'Portfolio', value: 'Workflow and Optimization' },
          { label: 'Business Unit', value: 'Group Internal Audit (GIA)' },
        ],
        detailLabel: 'View details in WOA-DPM >',
      },
    },
  }),
  withNotificationFields({
    id: '170',
    title: 'Submission: Contract Clearance Request',
    content: 'Kelvin Leung submitted a new contract clearance request in YonYou-CCA.',
    summary: 'YY-CCA-20250095',
    link: 'https://outlook.office.com/',
    source: 'Kelvin Leung via YonYou-CCA',
    category: 'finance',
    createdAt: buildIsoTime(10),
    readAt: null,
    payload: {
      variant: 'message',
      user_id: 'demo-user',
      author: 'Kelvin Leung',
      message: {
        author: 'Kelvin Leung',
        recipient: 'to me',
        date: '2026-04-21',
        time: '09:20',
        linkLabel: 'Open in Outlook >',
      },
    },
  }),
  withNotificationFields({
    id: '171',
    title: 'Action Required: 2025 eAppraisal Approval (Bob Wan)',
    content: 'Bob Wan submitted a 2025 eAppraisal item that has already been reviewed.',
    summary: 'BIPO-EAPPRAISAL-20250093',
    link: '',
    source: 'Bob Wan via BIPO-EAPPRAISAL',
    category: 'it',
    createdAt: buildIsoTime(60),
    readAt: buildReadTime(58),
    payload: {
      variant: 'article',
      user_id: 'demo-user',
    },
  }),
  withNotificationFields({
    id: '172',
    title: 'Submission: eCAPEX Request',
    content: 'Kelvin Leung submitted an eCAPEX request for your review.',
    summary: 'YY-ECAPEX-20250094',
    link: '',
    source: 'Kelvin Leung via YonYou-eCAPEX',
    category: 'finance',
    createdAt: buildIsoTime(70),
    readAt: buildReadTime(66),
    payload: {
      variant: 'article',
      user_id: 'demo-user',
    },
  }),
  withNotificationFields({
    id: '173',
    title: 'Submission: eClaim Request (China)',
    content: 'Kelvin Leung submitted an eClaim request for China entity.',
    summary: 'YY-ECLAIM-20250092',
    link: '',
    source: 'Kelvin Leung via YY-eClaim',
    category: 'legal',
    createdAt: buildIsoTime(120),
    readAt: buildReadTime(116),
    payload: {
      variant: 'article',
      user_id: 'demo-user',
    },
  }),
  withNotificationFields({
    id: '174',
    title: 'Submission: eTravel Request (Singapore)',
    content: 'Kelvin Leung submitted a travel request for Singapore itinerary.',
    summary: 'YY-ETRAVEL-20250091',
    link: '',
    source: 'Kelvin Leung via YY-eTravel',
    category: 'it',
    createdAt: buildIsoTime(125),
    readAt: buildReadTime(122),
    payload: {
      variant: 'article',
      user_id: 'demo-user',
    },
  }),
]

export const getMockNotificationList = () => {
  return mockNotifications.map(item => ({
    ...item,
    payload: item.payload ? { ...item.payload } : item.payload,
  }))
}

export const getMockNotificationById = (id: string) => {
  return getMockNotificationList().find(item => item.id === id) || null
}
