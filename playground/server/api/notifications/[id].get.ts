export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '')

  const mockMap = {
    '169': {
      item: {
        id: '169',
        title: 'Demand & Business Case Approval (GDT)',
        summary: 'WOA-DPM-26010001 Pending',
        content:
          'Submitted by Victor Ho via WOA-DPM. Process status is Pending (Registration). Portfolio is Workflow and Optimization, business unit is Group Internal Audit (GIA).',
        link: 'https://outlook.office.com/',
        source: 'Victor Ho via WOA-DPM',
        category: 'order',
        createdAt: '2026-01-01T15:13:00.000Z',
        readAt: null,
        payload: {
          variant: 'approval',
          user_id: 'demo-user',
          author: 'Victor Ho',
          approval: {
            reference: 'WOA-DPM-26010001',
            status: 'Pending',
            submittedLabel: 'Submitted by:',
            submittedBy: 'Victor Ho via WOA-DPM',
            submittedDate: '2026-01-01',
            submittedTime: '15:13',
            timeline: [
              {
                name: 'Ideation',
                status: 'Approved',
                date: 'Approved 2026-02-01 at 14:47',
              },
              {
                name: 'Pre-Approval Assessment',
                status: 'Approved',
                date: 'Approved 2026-02-03 at 17:21',
              },
              {
                name: 'Registration',
                status: 'Pending',
                date: 'Pending',
              },
            ],
            attachments: [
              { name: 'File 1.png' },
              { name: 'File 2.png' },
              { name: 'File 3.png' },
            ],
            fields: [
              { label: 'Reference Number', value: 'WOA-DPM-26010001' },
              { label: 'Process Status', value: 'Pending (Registration)' },
              { label: 'Requestor', value: 'Victor Ho' },
              { label: 'Request Date', value: '2026-01-01' },
              { label: 'Portfolio', value: 'Workflow and Optimization' },
              { label: 'Business Unit', value: 'Group Internal Audit (GIA)' },
            ],
            detailLabel: 'View details in WOA-DPM >',
          },
        },
      },
    },
    '170': {
      item: {
        id: '170',
        title: 'Lorem ipsum dolor',
        summary: 'Sofia Johnson sent you a long-form update.',
        content:
          'Lorem ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
        link: 'https://outlook.office.com/',
        source: 'Sofia Johnson',
        category: 'order',
        createdAt: '2025-10-24T15:13:00.000Z',
        readAt: null,
        payload: {
          variant: 'message',
          user_id: 'demo-user',
          author: 'Sofia Johnson',
          message: {
            author: 'Sofia Johnson',
            recipient: 'to me',
            date: '2025-10-24',
            time: '15:13',
            linkLabel: 'Open in Outlook>',
          },
        },
      },
    },
    '171': {
      item: {
        id: '171',
        title: 'Lorem ipsum dolor',
        summary: 'Printing and typesetting summary',
        content:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text since the 1500s and remains common in publishing software.',
        link: '',
        source: 'Latest Updates',
        category: 'order',
        createdAt: '2025-10-23T10:08:00.000Z',
        readAt: null,
        payload: {
          variant: 'article',
          user_id: 'demo-user',
        },
      },
    },
  }

  return mockMap[id as keyof typeof mockMap] || { item: null }
})
