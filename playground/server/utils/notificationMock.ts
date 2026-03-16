import type {
  NotificationDetailResponse,
  NotificationItem,
  NotificationListResponse,
} from '~/types/notification'

const HOUR = 60 * 60 * 1000

let mockNotifications: NotificationItem[] | null = null
const mockSubscriptions: Array<Record<string, any>> = []

const createSeedNotifications = (): NotificationItem[] => {
  const categories = ['系统', '待办', '审批', '公告']

  return Array.from({ length: 36 }).map((_, index) => {
    const id = `mock-notification-${index + 1}`
    const createdAt = new Date(Date.now() - index * (HOUR / 2)).toISOString()
    const isRead = index % 3 === 0

    return {
      id,
      title: `模拟通知 ${index + 1}`,
      content: `这是一条用于本地联调的模拟消息，序号 ${index + 1}。`,
      summary: `您有一条新的${categories[index % categories.length]}消息待处理。`,
      category: categories[index % categories.length],
      source: 'Mock Center',
      link: `/desktop?notificationId=${encodeURIComponent(id)}`,
      createdAt,
      readAt: isRead ? new Date(Date.now() - index * (HOUR / 2) + 5 * 60 * 1000).toISOString() : null,
      payload: {
        mock: true,
        index: index + 1,
      },
    }
  })
}

const ensureMockNotifications = () => {
  if (!mockNotifications) {
    mockNotifications = createSeedNotifications()
  }

  return mockNotifications
}

export const isNotificationMockEnabled = () => {
  const config = useRuntimeConfig()
  const rawValue = config.notificationMockEnabled

  if (typeof rawValue === 'boolean') {
    return rawValue
  }

  const normalized = String(rawValue ?? 'true').toLowerCase()
  return normalized !== 'false' && normalized !== '0'
}

export const listMockNotifications = (params: {
  page: number
  pageSize: number
  keyword?: string
}): NotificationListResponse => {
  const { page, pageSize, keyword = '' } = params
  const source = ensureMockNotifications()
  const normalizedKeyword = keyword.trim().toLowerCase()

  const filtered = normalizedKeyword
    ? source.filter((item) => {
        return item.title.toLowerCase().includes(normalizedKeyword) || item.content.toLowerCase().includes(normalizedKeyword)
      })
    : source

  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return {
    items,
    total,
    page,
    pageSize,
    unreadCount: filtered.filter((item) => !item.readAt).length,
    hasMore: page * pageSize < total,
    syncedAt: Date.now(),
  }
}

export const getMockNotificationDetail = (id: string): NotificationDetailResponse => {
  const source = ensureMockNotifications()
  const item = source.find((notification) => notification.id === id) || null

  return {
    item,
  }
}

export const markMockNotificationAsRead = (id: string, readAt?: string) => {
  const source = ensureMockNotifications()
  const target = source.find((notification) => notification.id === id)

  if (!target) {
    return {
      success: false,
      id,
      message: '通知不存在',
    }
  }

  target.readAt = readAt || new Date().toISOString()

  return {
    success: true,
    id,
    data: {
      item: target,
    },
  }
}

export const registerMockSubscription = (body: Record<string, any>) => {
  const endpoint = String(body.endpoint || '')

  if (!endpoint) {
    throw createError({
      statusCode: 400,
      message: '订阅 endpoint 不能为空',
    })
  }

  const existed = mockSubscriptions.find((subscription) => subscription.endpoint === endpoint)
  if (!existed) {
    mockSubscriptions.push({
      ...body,
      createdAt: Date.now(),
    })
  }

  return {
    success: true,
    total: mockSubscriptions.length,
  }
}
