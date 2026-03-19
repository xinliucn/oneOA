import type { ApprovalItem } from '~/types/approval'

export const approvalItems: ApprovalItem[] = [
  {
    id: '169',
    code: '169',
    category: 'order',
    status: 'Pending',
    title: '通知标题',
    subtitle: '通知正文',
    date: '2026-03-16',
    badge: null,
    referenceNo: '169',
    submittedBy: '消息中心',
    submittedDate: '2026-03-16 17:56',
    processStatus: 'Pending',
    requestDate: '2026-03-16',
    portfolio: 'order',
    businessUnit: 'Notification Center',
    detailLinkLabel: 'View details in Message Center',
    attachments: [{ name: 'Notification-169.txt' }],
    approvers: [
      { name: '消息中心', action: 'Approved', date: '2026-03-16 at 17:56', role: 'Source' },
      { name: '当前处理节点', action: 'Pending', date: '', role: 'Current step' },
    ],
    fields: [
      { label: 'Reference Number', value: '169' },
      { label: 'Process Status', value: 'Pending' },
      { label: 'Requestor', value: '消息中心' },
      { label: 'Request Date', value: '2026-03-16' },
      { label: 'Portfolio', value: 'order' },
      { label: 'Business Unit', value: 'Notification Center' },
    ],
  },
  {
    id: '167',
    code: '167',
    category: 'order',
    status: 'Pending',
    title: '通知标题',
    subtitle: '通知正文',
    date: '2026-03-16',
    badge: null,
    referenceNo: '167',
    submittedBy: '消息中心',
    submittedDate: '2026-03-16 17:56',
    processStatus: 'Pending',
    requestDate: '2026-03-16',
    portfolio: 'order',
    businessUnit: 'Notification Center',
    detailLinkLabel: 'View details in Message Center',
    attachments: [{ name: 'Notification-167.txt' }],
    approvers: [
      { name: '消息中心', action: 'Approved', date: '2026-03-16 at 17:56', role: 'Source' },
      { name: '当前处理节点', action: 'Pending', date: '', role: 'Current step' },
    ],
    fields: [
      { label: 'Reference Number', value: '167' },
      { label: 'Process Status', value: 'Pending' },
      { label: 'Requestor', value: '消息中心' },
      { label: 'Request Date', value: '2026-03-16' },
      { label: 'Portfolio', value: 'order' },
      { label: 'Business Unit', value: 'Notification Center' },
    ],
  },
]

export const getApprovalById = (id: string) => {
  return approvalItems.find((item) => item.id === id || item.code === id) || null
}
