import type { ApprovalAction, ApprovalItem } from '~/types/approval'
import { formatRequestName } from '~/utils/todo'

interface WorkflowBaseInfo {
  workflowName?: string
  workflowTypeName?: string
}

interface WorkflowListItem {
  createTime?: string
  creatorDepartmentName?: string
  creatorName?: string
  currentNodeName?: string
  lastOperateTime?: string
  requestId?: string
  requestName?: string
  requestmark?: string
  status?: string
  workflowBaseInfo?: WorkflowBaseInfo
}

const actionLabelMap: Record<ApprovalAction, string> = {
  Approve: 'Approved',
  Reject: 'Rejected',
  Return: 'Returned',
}

const statusMap: Record<ApprovalAction, ApprovalItem['status']> = {
  Approve: 'Approved',
  Reject: 'Rejected',
  Return: 'Pending',
}

const processStatusMap: Record<ApprovalAction, string> = {
  Approve: 'Approved',
  Reject: 'Rejected',
  Return: 'Returned for revision',
}

const normalizeDateValue = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return value.includes(' ') ? value.replace(' ', 'T') : value
}

const formatDate = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(normalizeDateValue(value))
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('zh-CN', {
    hour12: false,
  })
}

const formatDateOnly = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(normalizeDateValue(value))
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

const mapWorkflowToApproval = (item: WorkflowListItem): ApprovalItem => {
  const requestId = item.requestId || item.requestmark || ''
  const code = item.requestmark || requestId
  const submittedBy = item.creatorName || 'Unknown'
  const submittedDate = formatDate(item.createTime)
  const requestDate = formatDateOnly(item.createTime)
  const processStatus = item.currentNodeName || item.status || 'Pending'
  const portfolio = item.workflowBaseInfo?.workflowName || item.workflowBaseInfo?.workflowTypeName || 'Workflow'
  const businessUnit = item.creatorDepartmentName || submittedBy

  return {
    id: requestId,
    code,
    category: item.workflowBaseInfo?.workflowTypeName || 'workflow',
    status: 'Pending',
    title: formatRequestName(item.requestName) || code || 'Workflow Request',
    subtitle: item.status || processStatus || 'Pending Approval',
    date: requestDate,
    badge: null,
    referenceNo: code || requestId,
    submittedBy,
    submittedDate,
    processStatus,
    requestDate,
    portfolio,
    businessUnit,
    detailLinkLabel: 'View workflow details',
    latestComment: '',
    attachments: [],
    approvers: [
      {
        name: submittedBy,
        action: 'Submitted',
        date: submittedDate,
        role: 'Requestor',
      },
    ],
    fields: [
      { label: 'Reference Number', value: code || requestId },
      { label: 'Process Status', value: processStatus },
      { label: 'Requestor', value: submittedBy },
      { label: 'Request Date', value: requestDate },
      { label: 'Portfolio', value: portfolio },
      { label: 'Business Unit', value: businessUnit },
    ],
  }
}

export const useApprovals = () => {
  const approvals = useState<ApprovalItem[]>('approvals:list', () => [])
  const loading = useState<boolean>('approvals:loading', () => false)
  const syncing = useState<boolean>('approvals:syncing', () => false)
  const bootstrapped = useState<boolean>('approvals:bootstrapped', () => false)

  const getApprovalById = (id: string) => {
    return approvals.value.find(item => item.id === id || item.code === id) || null
  }

  const refreshFromServer = async () => {
    if (syncing.value) {
      return
    }

    syncing.value = true
    loading.value = true

    try {
      const response = await $fetch<WorkflowListItem[]>('/api/myApproved/workflowList', {
        method: 'POST',
      })

      approvals.value = Array.isArray(response)
        ? response.map(item => mapWorkflowToApproval(item))
        : []
    }
    catch (error) {
      console.error('Fetch approvals from workflow list failed:', error)
      approvals.value = []
    }
    finally {
      loading.value = false
      syncing.value = false
    }
  }

  const bootstrap = async () => {
    if (bootstrapped.value && approvals.value.length > 0) {
      return
    }

    await refreshFromServer()
    bootstrapped.value = true
  }

  const ensureApproval = async (id: string) => {
    const existing = getApprovalById(id)
    if (existing) {
      return existing
    }

    await refreshFromServer()
    return getApprovalById(id)
  }

  const submitApprovalAction = async (id: string, action: ApprovalAction, comment = '') => {
    const target = getApprovalById(id)
    if (!target) {
      return null
    }

    target.status = statusMap[action]
    target.processStatus = processStatusMap[action]
    target.latestComment = comment.trim()

    const processStatusField = target.fields.find(field => field.label === 'Process Status')
    if (processStatusField) {
      processStatusField.value = target.processStatus
    }

    target.approvers = [
      ...target.approvers,
      {
        name: 'You',
        action: actionLabelMap[action],
        date: formatDate(new Date().toISOString()),
        role: 'Mobile action',
      },
    ]

    approvals.value = [...approvals.value]
    return target
  }

  return {
    approvals,
    loading,
    syncing,
    bootstrap,
    refreshFromServer,
    getApprovalById,
    ensureApproval,
    submitApprovalAction,
  }
}
