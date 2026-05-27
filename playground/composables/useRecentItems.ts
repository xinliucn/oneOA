export type RecentItemType = 'application' | 'business' | 'news' | 'todo' | 'shortcut'

export interface RecentItem {
  id: string
  type: RecentItemType
  label: string
  labelEn?: string
  labelSc?: string
  labelTc?: string
  subtitle?: string
  icon: string
  url?: string
  path?: string
  visitedAt: number
}

const RECENT_ITEMS_LIMIT = 20

const isRecord = (value: any): value is Record<string, any> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const normalizeString = (value: any) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

const normalizeRecentItem = (value: any): RecentItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = normalizeString(value.id)
  const label = normalizeString(value.label)
  const icon = normalizeString(value.icon) || 'apps'
  const type = normalizeString(value.type) as RecentItemType

  if (!id || !label) {
    return null
  }

  return {
    id,
    type: type || 'shortcut',
    label,
    labelEn: normalizeString(value.labelEn),
    labelSc: normalizeString(value.labelSc),
    labelTc: normalizeString(value.labelTc),
    subtitle: normalizeString(value.subtitle),
    icon,
    url: normalizeString(value.url),
    path: normalizeString(value.path),
    visitedAt: Number(value.visitedAt) || Date.now(),
  }
}

const sortRecentItems = (items: RecentItem[]) => {
  return [...items].sort((left, right) => right.visitedAt - left.visitedAt)
}

export const useRecentItems = (scope = 'mobile') => {
  const stateKey = `${scope}:recent-items`
  const hydratedKey = `${scope}:recent-items:hydrated`
  const storageKey = `${scope}:recent-items`
  const items = useState<RecentItem[]>(stateKey, () => [])
  const hydrated = useState<boolean>(hydratedKey, () => false)

  const persist = () => {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(storageKey, JSON.stringify(items.value))
  }

  const hydrate = () => {
    if (!import.meta.client || hydrated.value) {
      return
    }

    try {
      const rawItems = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const normalizedItems = Array.isArray(rawItems)
        ? rawItems.map(normalizeRecentItem).filter((item): item is RecentItem => Boolean(item))
        : []

      items.value = sortRecentItems(normalizedItems).slice(0, RECENT_ITEMS_LIMIT)
    }
    catch (error) {
      console.error('Load recent items failed:', error)
      items.value = []
    }
    finally {
      hydrated.value = true
    }
  }

  const addRecentItem = (item: Omit<RecentItem, 'visitedAt'> & { visitedAt?: number }) => {
    hydrate()

    const normalizedItem = normalizeRecentItem({
      ...item,
      visitedAt: item.visitedAt || Date.now(),
    })

    if (!normalizedItem) {
      return
    }

    items.value = [
      normalizedItem,
      ...items.value.filter(currentItem => currentItem.id !== normalizedItem.id),
    ].slice(0, RECENT_ITEMS_LIMIT)

    persist()
  }

  const clearRecentItems = () => {
    items.value = []
    persist()
  }

  return {
    items,
    hydrate,
    addRecentItem,
    clearRecentItems,
  }
}
