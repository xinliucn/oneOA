import type { NotificationItem } from '~/types/notification'

const READ_FLAGS = new Set(['1', 'true'])
const BACKTICK_LOCALIZED_DELIMITER = '~`~`'
const SHORT_BACKTICK_LOCALIZED_DELIMITER = '`~`'
const COMPACT_LOCALIZED_WRAPPER = '~~'
const NOTIFICATION_LOCALE_CODES: Record<string, string> = {
  'zh-CN': '7',
  'en': '8',
  'zh-TW': '9',
}

const parseNotificationTimestamp = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (/^\d+$/.test(trimmedValue)) {
      const numericValue = Number(trimmedValue)
      return Number.isFinite(numericValue) ? numericValue : 0
    }

    const timestamp = new Date(trimmedValue).getTime()
    return Number.isFinite(timestamp) ? timestamp : 0
  }

  return 0
}

export const getNotificationTimestamp = (item: NotificationItem) => {
  const raw = item.payload_json?.msgPublishAt || item.msg_publish_at || item.updated_at || item.created_at || item.createdAt
  const timestamp = parseNotificationTimestamp(raw)

  return Number.isFinite(timestamp) ? timestamp : 0
}

const normalizeDisplayText = (value: string) => {
  let text = value
    .replace(/^\$\{\}/, '')

  if (text.endsWith(`${BACKTICK_LOCALIZED_DELIMITER}~`)) {
    text = text.slice(0, -`${BACKTICK_LOCALIZED_DELIMITER}~`.length)
  }

  if (text.endsWith(`${SHORT_BACKTICK_LOCALIZED_DELIMITER}~`)) {
    text = text.slice(0, -`${SHORT_BACKTICK_LOCALIZED_DELIMITER}~`.length)
  }

  if (text.endsWith(COMPACT_LOCALIZED_WRAPPER)) {
    text = text.slice(0, -COMPACT_LOCALIZED_WRAPPER.length)
  }

  return text
    .replace(/\s+/g, ' ')
    .trim()
}

const getLocaleCodeCandidates = (locale: string) => {
  const normalized = locale.toLowerCase()

  if (normalized === 'zh-tw' || normalized.includes('hant')) {
    return ['9', '8', '7']
  }

  if (normalized.startsWith('en')) {
    return ['8', '7', '9']
  }

  if (normalized.startsWith('zh')) {
    return ['7', '8', '9']
  }

  return [NOTIFICATION_LOCALE_CODES['zh-CN'] || '7', '8', '9']
}

const isDigitChar = (value: string) => {
  const code = value.charCodeAt(0)
  return code >= 48 && code <= 57
}

const findNextCompactMarker = (value: string, startIndex: number) => {
  for (let index = startIndex; index < value.length; index += 1) {
    if (value.charAt(index) !== '~') {
      continue
    }

    let codeStartIndex = index
    while (codeStartIndex < value.length && value.charAt(codeStartIndex) === '~') {
      codeStartIndex += 1
    }

    if (codeStartIndex < value.length && isDigitChar(value.charAt(codeStartIndex))) {
      return {
        markerStartIndex: index,
        codeStartIndex,
      }
    }
  }

  return null
}

const parseCompactLocalizedSegments = (raw: string) => {
  const normalizedRaw = raw.replace(/^\$\{\}/, '').trim()
  const firstMarker = findNextCompactMarker(normalizedRaw, 0)
  if (!firstMarker) {
    return null
  }

  const segments = new Map<string, string>()
  let currentMarker: ReturnType<typeof findNextCompactMarker> = firstMarker

  while (currentMarker) {
    let codeEndIndex = currentMarker.codeStartIndex
    while (codeEndIndex < normalizedRaw.length && isDigitChar(normalizedRaw.charAt(codeEndIndex))) {
      codeEndIndex += 1
    }

    const nextMarker = findNextCompactMarker(normalizedRaw, codeEndIndex)
    const code = normalizedRaw.slice(currentMarker.codeStartIndex, codeEndIndex)
    const textEndIndex = nextMarker?.markerStartIndex ?? normalizedRaw.length
    const text = normalizeDisplayText(normalizedRaw.slice(codeEndIndex, textEndIndex))

    if (code && text) {
      segments.set(code, text)
    }

    currentMarker = nextMarker
  }

  return segments
}

const normalizeLocalizedMarkers = (raw: string) => {
  return raw
    .replaceAll(BACKTICK_LOCALIZED_DELIMITER, '~')
    .replaceAll(SHORT_BACKTICK_LOCALIZED_DELIMITER, '~')
}

const resolveLocalizedSegments = (raw: string) => {
  return parseCompactLocalizedSegments(normalizeLocalizedMarkers(raw))
}

const getLocalizedTextFromSegments = (segments: Map<string, string>, locale: string, fallback: string) => {
  for (const code of getLocaleCodeCandidates(locale)) {
    const text = segments.get(code)
    if (text) {
      return text
    }
  }

  return normalizeDisplayText(Array.from(segments.values())[0] || fallback)
}

const findFirstLocalizedMarkerIndex = (value: string) => {
  return findNextCompactMarker(normalizeLocalizedMarkers(value).replace(/^\$\{\}/, ''), 0)?.markerStartIndex ?? -1
}

export const formatNotificationLocalizedText = (value: string | undefined, locale: string) => {
  const raw = value || ''
  const segments = resolveLocalizedSegments(raw)

  if (!segments) {
    return normalizeDisplayText(raw)
  }

  return getLocalizedTextFromSegments(segments, locale, raw)
}

export const formatNotificationTitle = (title: string | undefined, locale: string) => {
  const rawTitle = title || ''
  const statusMatch = rawTitle.match(/\(([^()]*)\)\s*$/)
  const status = statusMatch ? formatNotificationLocalizedText(statusMatch[1], locale) : ''
  const titleWithoutStatus = statusMatch ? rawTitle.slice(0, statusMatch.index) : rawTitle
  const markerIndex = findFirstLocalizedMarkerIndex(titleWithoutStatus)

  if (markerIndex >= 0) {
    const baseTitle = normalizeDisplayText(titleWithoutStatus.slice(0, markerIndex))
    const segments = resolveLocalizedSegments(titleWithoutStatus.slice(markerIndex))
    const localizedTitle = segments ? getLocalizedTextFromSegments(segments, locale, titleWithoutStatus) : ''

    return [baseTitle, localizedTitle, status].filter(Boolean).join(' ')
  }

  const baseTitle = normalizeDisplayText(titleWithoutStatus)

  return [baseTitle, status].filter(Boolean).join(' ')
}

const getNotificationTitleStatus = (title: string | undefined, locale: string) => {
  const statusMatch = (title || '').match(/\(([^()]*)\)\s*$/)
  return statusMatch ? formatNotificationLocalizedText(statusMatch[1], locale) : ''
}

const getPayloadString = (payload: NotificationItem['payload'], keys: string[]) => {
  if (!payload) {
    return ''
  }

  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'string' || typeof value === 'number') {
      const normalized = normalizeDisplayText(String(value))
      if (normalized) {
        return normalized
      }
    }
  }

  return ''
}

const getNotificationBusinessName = (item: NotificationItem, locale: string) => {
  return formatNotificationLocalizedText(item.businessName, locale)
    || formatNotificationLocalizedText(getPayloadString(item.payload_json, ['BusinessName', 'businessName', 'business_name', 'business', 'businessUnit']), locale)
}

export const formatNotificationListTitle = (item: NotificationItem, locale: string) => {
  const requestNo = getPayloadString(item.payload_json, [
    'requestNo',
    'request_no',
    'requestMark',
    'requestmark',
    'referenceNo',
  ])
  || item.request_id?.trim()
  || item.requestId?.trim()
  const body = formatNotificationLocalizedText(item.content || item.body, locale)
  const businessName = getNotificationBusinessName(item, locale)

  if (businessName) {
    return [`[${businessName}]`, body]
      .map(part => normalizeDisplayText(part || ''))
      .filter(Boolean)
      .join(' ')
  }

  const status = getNotificationTitleStatus(item.title, locale)
  return [requestNo, body, status]
    .map(part => normalizeDisplayText(part || ''))
    .filter(Boolean)
    .join(' ')
}

export const formatNotificationSubtitle = (item: NotificationItem) => {
  return getPayloadString(item.payload_json, [
    'referenceId',
  ])
  || item.referenceId?.trim()
  || item.request_id?.trim()
  || item.requestId?.trim()
  || item.subtitle?.trim()
  || ''
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

  const sortedItems = [...items].sort((left, right) => getNotificationTimestamp(right) - getNotificationTimestamp(left))
  return sortedItems[0]?.id ? String(sortedItems[0].id) : null
}

export const isNotificationUnread = (item: NotificationItem) => {
  if (item.readAt || String(item.is_read) === '1') {
    return false
  }

  if (item.is_read === undefined || item.is_read === null || item.is_read === '') {
    return true
  }

  return !READ_FLAGS.has(String(item.is_read).toLowerCase())
}

export const sortNotificationsForDisplay = (items: NotificationItem[]) => {
  return [...items].sort((left, right) => {
    const leftUnread = isNotificationUnread(left)
    const rightUnread = isNotificationUnread(right)

    if (leftUnread !== rightUnread) {
      return leftUnread ? -1 : 1
    }

    return getNotificationTimestamp(right) - getNotificationTimestamp(left)
  })
}
