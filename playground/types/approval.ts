export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected'
export type ApprovalAction = 'Approve' | 'Reject' | 'Return'

export interface ApprovalTimelineItem {
  name: string
  action: string
  date: string
  role?: string
}

export interface ApprovalAttachment {
  name: string
  extraCount?: string
}

export interface ApprovalField {
  label: string
  value: string
}

export interface ApprovalItem {
  id: string
  code: string
  category: string
  status: ApprovalStatus
  title: string
  subtitle: string
  date: string
  badge?: string | null
  referenceNo: string
  submittedBy: string
  submittedDate: string
  processStatus: string
  requestDate: string
  portfolio: string
  businessUnit: string
  detailLinkLabel: string
  latestComment?: string
  attachments: ApprovalAttachment[]
  approvers: ApprovalTimelineItem[]
  fields: ApprovalField[]
  requestmark: string
}
