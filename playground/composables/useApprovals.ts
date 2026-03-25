import type { ApprovalAction, ApprovalItem } from '~/types/approval'
import type { NotificationDetailResponse, NotificationItem, NotificationListResponse } from '~/types/notification'
import { useCurrentUserId } from '~/composables/useCurrentUserId'

const DEFAULT_PAGE_SIZE = 20

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

const formatDate = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('zh-CN', {
    hour12: false,
  })
}

const mapNotificationToApproval = (item: NotificationItem): ApprovalItem => {
  const status: ApprovalItem['status'] = item.readAt ? 'Approved' : 'Pending'
  const submittedBy = item.source || '消息中心'
  const requestDate = item.createdAt ? item.createdAt.slice(0, 10) : ''
  const processStatus = item.readAt ? 'Approved' : 'Pending'

  return {
    id: item.id,
    code: item.id,
    category: item.category || 'order',
    status,
    title: item.title || '通知标题',
    subtitle: item.summary || item.content || '通知正文',
    date: requestDate,
    badge: null,
    referenceNo: item.id,
    submittedBy,
    submittedDate: formatDate(item.createdAt),
    processStatus,
    requestDate,
    portfolio: item.category || 'order',
    businessUnit: submittedBy,
    detailLinkLabel: 'View details in Message Center',
    latestComment: '',
    attachments: item.link ? [{ name: 'Notification Link' }] : [],
    approvers: [
      {
        name: submittedBy,
        action: item.readAt ? 'Approved' : 'Pending',
        date: formatDate(item.readAt || item.createdAt),
        role: 'Source',
      },
    ],
    fields: [
      { label: 'Reference Number', value: item.id },
      { label: 'Process Status', value: processStatus },
      { label: 'Requestor', value: submittedBy },
      { label: 'Request Date', value: requestDate },
      { label: 'Portfolio', value: item.category || 'order' },
      { label: 'Business Unit', value: submittedBy },
    ],
  }
}

const upsertApproval = (list: ApprovalItem[], incoming: ApprovalItem) => {
  const next = [...list]
  const targetIndex = next.findIndex((item) => item.id === incoming.id)

  if (targetIndex >= 0) {
    next[targetIndex] = incoming
    return next
  }

  return [incoming, ...next]
}

export const useApprovals = () => {
  const approvals = useState<ApprovalItem[]>('approvals:list', () => [])
  const loading = useState<boolean>('approvals:loading', () => false)
  const syncing = useState<boolean>('approvals:syncing', () => false)
  const bootstrapped = useState<boolean>('approvals:bootstrapped', () => false)
  const { getCurrentUserId } = useCurrentUserId()

  const getApprovalById = (id: string) => {
    return approvals.value.find((item) => item.id === id || item.code === id) || null
  }

  const refreshFromServer = async () => {
    if (syncing.value) {
      return
    }

    syncing.value = true
    loading.value = true

    try {
      const response = await $fetch<NotificationListResponse>('/api/notifications', {
        method: 'GET',
        query: {
          page: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          ...(getCurrentUserId() ? { user_id: getCurrentUserId() } : {}),
          is_read: 0,
          category: 'order',
        },
      })

      approvals.value = Array.isArray(response?.items)
        ? response.items.map((item) => mapNotificationToApproval(item))
        : []
    } catch (error) {
      console.error('Fetch approvals from notifications failed:', error)
    } finally {
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

    try {
      const detail = await $fetch<NotificationDetailResponse>(`/api/notifications/${encodeURIComponent(id)}`, {
        method: 'GET',
        query: {
          ...(getCurrentUserId() ? { user_id: getCurrentUserId() } : {}),
        },
      })

      if (!detail?.item) {
        return null
      }

      const mapped = mapNotificationToApproval(detail.item)
      approvals.value = upsertApproval(approvals.value, mapped)
      return mapped
    } catch (error) {
      console.error('Fetch approval detail from notifications failed:', error)
      return null
    }
  }

  const submitApprovalAction = async (id: string, action: ApprovalAction, comment = '') => {
    const target = getApprovalById(id)
    if (!target) {
      return null
    }

    if (action === 'Approve') {
      try {
        await $fetch(`/api/notifications/${encodeURIComponent(id)}`, {
          method: 'POST',
          body: {
            ...(getCurrentUserId() ? { user_id: getCurrentUserId() } : {}),
            id,
          },
        })
      } catch (error) {
        console.error('Mark notification as read failed:', error)
      }
    }

    target.status = statusMap[action]
    target.processStatus = processStatusMap[action]
    target.latestComment = comment.trim()

    const processStatusField = target.fields.find((field) => field.label === 'Process Status')
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
