const TRAILING_META_PATTERN = /(?:HKD|RMB|CNY|USD|EUR|GBP|JPY|MOP|TWD|\$|￥|¥)\s*[\d,]+(?:\.\d+)?|\([^)]*(?:pending|approval|approved|rejected|returned|complete|status)[^)]*\)/i
const REQUEST_NAME_WITH_TRAILING_FIELD_PATTERN = /^\s*[^|]+\s*\|\s*(.*?)\s*\|\s*([^|]*)$/i
const REQUEST_NAME_WITH_TRAILING_STATUS_PATTERN = /^\s*[^|]+\s*\|\s*(.*?)\s*(\([^)]*(?:pending|approval|approved|rejected|returned|complete|status)[^)]*\))\s*$/i

const normalizeRequestTitle = (value: string) => {
  return value
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/\s+/g, ' ')
    .trim()
}

const getPrimaryRequestTitle = (value: string) => {
  return normalizeRequestTitle(value.split('|')[0] || '')
}

export const formatRequestName = (value?: string | number | null) => {
  const requestName = normalizeRequestTitle(String(value ?? ''))
  if (!requestName) {
    return ''
  }

  const trailingFieldMatch = requestName.match(REQUEST_NAME_WITH_TRAILING_FIELD_PATTERN)
  if (trailingFieldMatch && TRAILING_META_PATTERN.test(trailingFieldMatch[2] || '')) {
    return getPrimaryRequestTitle(trailingFieldMatch[1] || '') || requestName
  }

  const trailingStatusMatch = requestName.match(REQUEST_NAME_WITH_TRAILING_STATUS_PATTERN)
  if (trailingStatusMatch) {
    return getPrimaryRequestTitle(trailingStatusMatch[1] || '') || requestName
  }

  return requestName
}
