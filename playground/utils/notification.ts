import type { NotificationItem } from '~/types/notification'

const READ_FLAGS = new Set(['1', 'true'])

const getNotificationTimestamp = (item: NotificationItem) => {
  const raw = item.updated_at || item.created_at || item.createdAt
  const timestamp = new Date(raw).getTime()

  return Number.isFinite(timestamp) ? timestamp : 0
}

export const isNotificationUnread = (item: NotificationItem) => {
  if (item.readAt) {
    return false
  }

  if (item.is_read === undefined || item.is_read === null || item.is_read === '') {
    return true
  }

  return !READ_FLAGS.has(String(item.is_read).toLowerCase())
}

export const sortNotificationsForDisplay = (items: NotificationItem[]) => {
  return [...items].sort((left, right) => {
    const unreadDiff = Number(isNotificationUnread(right)) - Number(isNotificationUnread(left))

    if (unreadDiff !== 0) {
      return unreadDiff
    }

    return getNotificationTimestamp(right) - getNotificationTimestamp(left)
  })
}
