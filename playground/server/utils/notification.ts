import type { NotificationItem } from '~/types/notification'

const toNonEmptyString = (value: any, fallback = '') => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return fallback
}

const normalizePayload = (value: any) => {
  if (!value) {
    return null
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
    }
    catch {
      return null
    }
  }

  return null
}

const toIsoString = (value: any) => {
  if (typeof value === 'string') {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      return new Date().toISOString()
    }

    if (/^\d+$/.test(trimmedValue)) {
      const numericValue = Number(trimmedValue)
      if (Number.isFinite(numericValue)) {
        return new Date(numericValue).toISOString()
      }
    }

    return trimmedValue
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }

  return new Date().toISOString()
}

export const normalizeNotification = (raw: any): NotificationItem => {
  const payload = normalizePayload(raw?.payload ?? raw?.payload_json)
  const title = toNonEmptyString(raw?.title || raw?.subject || raw?.name, '消息通知')
  const content = toNonEmptyString(raw?.content || raw?.body || raw?.message || payload?.body, '')
  const createdAt = toIsoString(raw?.createdAt || raw?.created_at || raw?.msg_publish_at || payload?.msgPublishAt || raw?.timestamp || raw?.time)
  const updatedAt = toIsoString(raw?.updatedAt || raw?.updated_at || raw?.updated_time || raw?.msg_publish_at || createdAt)
  const referenceId = toNonEmptyString(
    raw?.referenceId
    || raw?.reference_id
    || raw?.referenceNo
    || raw?.requestNo
    || raw?.request_no
    || payload?.referenceId
    || payload?.referenceNo
    || payload?.requestNo
    || payload?.request_no
    || raw?.request_id
    || payload?.requestId
    || payload?.requestid
    || payload?.request_id,
    '',
  )
  const requestId = toNonEmptyString(
    raw?.requestId || raw?.requestid || raw?.request_id || payload?.requestId || payload?.requestid || payload?.request_id,
    '',
  )
  const creator = toNonEmptyString(
    raw?.creator || raw?.creatorName || raw?.createdBy || raw?.submitter || payload?.creator || payload?.creatorName || payload?.createdBy || payload?.submitter,
    '',
  )
  const sourceSystem = toNonEmptyString(
    raw?.sourceSystem
    || raw?.source_system
    || raw?.systemName
    || raw?.system
    || payload?.sourceSystem
    || payload?.source_system
    || payload?.systemName
    || payload?.system,
    '',
  )
  const businessName = toNonEmptyString(
    raw?.BusinessName || raw?.businessName || raw?.business_name || raw?.business || payload?.BusinessName || payload?.businessName || payload?.business_name || payload?.business,
    '',
  )

  return {
    id: toNonEmptyString(raw?.id || raw?.notification_id || raw?.uuid || raw?._id, `${Date.now()}`),
    title,
    content,
    summary: toNonEmptyString(raw?.summary || raw?.subtitle || raw?.description || payload?.requestNo || payload?.request_no, ''),
    referenceId,
    requestId,
    creator,
    sourceSystem,
    businessName,
    link: toNonEmptyString(raw?.link || raw?.url || raw?.target_url || raw?.action_url || payload?.actionUrl || payload?.action_url, ''),
    source: toNonEmptyString(raw?.source || raw?.from || raw?.source_system || payload?.sourceSystem, ''),
    category: toNonEmptyString(raw?.category || raw?.msg_category || raw?.type || payload?.msgCategory || payload?.msg_category, ''),
    createdAt,
    readAt: raw?.readAt || raw?.read_at || raw?.read_time || null,
    payload,
    created_at: toNonEmptyString(raw?.created_at || createdAt, createdAt),
    updated_at: toNonEmptyString(raw?.updated_at || updatedAt, updatedAt),
    is_read: toNonEmptyString(raw?.is_read, raw?.readAt || raw?.read_at || raw?.read_time ? '1' : '0'),
  }
}

export const getLatestNotificationId = (items: NotificationItem[]) => {
  if (items.length === 0) {
    return null
  }

  const numericIds = items
    .map(item => Number(item.id))
    .filter(id => Number.isFinite(id))

  if (numericIds.length === items.length) {
    return String(Math.max(...numericIds))
  }

  const sortedItems = [...items].sort((left, right) => {
    return new Date(right.updated_at || right.created_at || right.createdAt || 0).getTime()
      - new Date(left.updated_at || left.created_at || left.createdAt || 0).getTime()
  })

  return sortedItems[0]?.id ? String(sortedItems[0].id) : null
}
