import type { NotificationItem, NotificationListResponse } from '~/types/notification'

const toNonEmptyString = (value: any, fallback = '') => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

const toIsoString = (value: any) => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }

  return new Date().toISOString()
}

export const normalizeNotification = (raw: any): NotificationItem => {
  const payloadSource = raw?.payload ?? raw?.payload_json
  const payload = payloadSource && typeof payloadSource === 'object' ? payloadSource : null
  const title = toNonEmptyString(raw?.title || raw?.subject || raw?.name, '消息通知')
  const content = toNonEmptyString(raw?.content || raw?.body || raw?.message, '')
  const createdAt = toIsoString(raw?.createdAt || raw?.created_at || raw?.timestamp || raw?.time)
  const updatedAt = toIsoString(raw?.updatedAt || raw?.updated_at || raw?.updated_time || createdAt)
  const referenceId = toNonEmptyString(
    raw?.referenceId || raw?.reference_id || raw?.referenceNo || raw?.request_id || payload?.referenceId || payload?.request_id,
    '',
  )
  const requestId = toNonEmptyString(raw?.requestId || raw?.requestid || raw?.request_id || payload?.requestId || payload?.requestid || payload?.request_id, '')

  return {
    id: toNonEmptyString(raw?.id || raw?.notification_id || raw?.uuid || raw?._id, `${Date.now()}`),
    title,
    content,
    summary: toNonEmptyString(raw?.summary || raw?.subtitle || raw?.description, ''),
    referenceId,
    requestId,
    link: toNonEmptyString(raw?.link || raw?.url || raw?.target_url || raw?.action_url, ''),
    source: toNonEmptyString(raw?.source || raw?.from, ''),
    category: toNonEmptyString(raw?.category || raw?.msg_category || raw?.type, ''),
    createdAt,
    readAt: raw?.readAt || raw?.read_at || raw?.read_time || null,
    payload,
    created_at: toNonEmptyString(raw?.created_at || createdAt, createdAt),
    updated_at: toNonEmptyString(raw?.updated_at || updatedAt, updatedAt),
    is_read: toNonEmptyString(raw?.is_read, raw?.readAt || raw?.read_at || raw?.read_time ? '1' : '0'),
  }
}

export const normalizeNotificationList = (
  raw: any,
  page: number,
  pageSize: number,
): NotificationListResponse => {
  const candidate = raw?.data ?? raw
  const sourceItems
    = candidate?.items
      || candidate?.list
      || candidate?.rows
      || candidate?.records
      || (Array.isArray(candidate) ? candidate : [])

  const items = (Array.isArray(sourceItems) ? sourceItems : []).map(item => normalizeNotification(item))
  const total = Number(candidate?.total || candidate?.count || candidate?.pagination?.total || items.length)
  const unreadCount = Number(
    candidate?.unreadCount
    || candidate?.unread
    || candidate?.total_unread
    || candidate?.unread_count
    || items.filter(item => !item.readAt).length,
  )
  const resolvedPage = Number(candidate?.page || page)
  const resolvedPageSize = Number(candidate?.pageSize || candidate?.page_size || pageSize)
  const resolvedTotal = Number.isFinite(total) ? total : items.length

  return {
    items,
    total: resolvedTotal,
    page: Number.isFinite(resolvedPage) ? resolvedPage : page,
    pageSize: Number.isFinite(resolvedPageSize) ? resolvedPageSize : pageSize,
    unreadCount: Number.isFinite(unreadCount) ? unreadCount : 0,
    hasMore: Boolean(candidate?.hasMore ?? candidate?.has_more) || (resolvedPage * resolvedPageSize < resolvedTotal),
    syncedAt: Date.now(),
  }
}
