import type { NotificationItem, NotificationListResponse } from '~/types/notification'

const toNonEmptyString = (value: unknown, fallback = '') => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

const toIsoString = (value: unknown) => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }

  return new Date().toISOString()
}

export const normalizeNotification = (raw: any): NotificationItem => {
  const payload = raw?.payload && typeof raw.payload === 'object' ? raw.payload : null
  const title = toNonEmptyString(raw?.title || raw?.subject || raw?.name, '消息通知')
  const content = toNonEmptyString(raw?.content || raw?.body || raw?.message, '')

  return {
    id: toNonEmptyString(raw?.id || raw?.notification_id || raw?.uuid || raw?._id, `${Date.now()}`),
    title,
    content,
    summary: toNonEmptyString(raw?.summary || raw?.description, ''),
    link: toNonEmptyString(raw?.link || raw?.url || raw?.target_url, ''),
    source: toNonEmptyString(raw?.source || raw?.from, ''),
    category: toNonEmptyString(raw?.category || raw?.type, ''),
    createdAt: toIsoString(raw?.createdAt || raw?.created_at || raw?.timestamp || raw?.time),
    readAt: raw?.readAt || raw?.read_at || raw?.read_time || null,
    payload,
  }
}

export const normalizeNotificationList = (
  raw: any,
  page: number,
  pageSize: number,
): NotificationListResponse => {
  const candidate = raw?.data ?? raw
  const sourceItems =
    candidate?.items ||
    candidate?.list ||
    candidate?.rows ||
    candidate?.records ||
    (Array.isArray(candidate) ? candidate : [])

  const items = (Array.isArray(sourceItems) ? sourceItems : []).map((item) => normalizeNotification(item))
  const total = Number(candidate?.total || candidate?.count || candidate?.pagination?.total || items.length)
  const unreadCount = Number(
    candidate?.unreadCount ||
      candidate?.unread ||
      candidate?.unread_count ||
      items.filter((item) => !item.readAt).length,
  )

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
    page,
    pageSize,
    unreadCount: Number.isFinite(unreadCount) ? unreadCount : 0,
    hasMore: page * pageSize < (Number.isFinite(total) ? total : items.length),
    syncedAt: Date.now(),
  }
}
