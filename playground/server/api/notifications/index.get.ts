import { normalizeNotificationList } from '../../utils/notification'
import { getMockNotificationList } from '../../utils/notificationMock'
import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'

const getErrorStatusCode = (error: unknown) => {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  return 500
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return fallback
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  // 前端分页参数统一做一次兜底和边界收敛，避免异常值直接透传
  const rawPage = Number.parseInt(String(query.page || '1'), 10)
  const rawPageSize = Number.parseInt(String(query.pageSize || '20'), 10)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? Math.min(rawPageSize, 100) : 20
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  if (raw) {
    const items = getMockNotificationList()
    const response = {
      items,
      total: items.length,
      page: 1,
      pageSize: 20,
      unreadCount: items.filter(item => !item.readAt).length,
      hasMore: false,
      syncedAt: Date.now(),
    }
    return normalizeNotificationList(response, page, pageSize)
  }

  try {
    // 透传可选筛选条件，兼容前端列表查询
    const keyword = typeof query.keyword === 'string' ? query.keyword : ''
    const userId = typeof query.user_id === 'string' ? query.user_id : ''
    const isRead = typeof query.is_read === 'string' ? query.is_read : ''
    const category = typeof query.category === 'string' ? query.category : ''

    // 将前端参数转换成 Windmill 侧约定的查询参数格式
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (userId) params.set('user_id', userId)
    if (isRead !== '') params.set('is_read', isRead)
    if (category) params.set('category', category)
    if (keyword) params.set('keyword', keyword)

    const path = `${getNotificationApiPrefix()}/list?${params.toString()}`
    // 这里原本应回源 Windmill，当前先保留本地联调用的静态返回
    const response = await proxyWindmill<Record<string, unknown>>(event, path, {
      method: 'GET',
      skipCookies: false,
    })

    // 将不同来源的数据统一规整成前端使用的通知列表结构
    return normalizeNotificationList(response, page, pageSize)
  }
  catch (error: unknown) {
    console.error('Get notifications API error:', error)

    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, '获取通知列表失败'),
    })
  }
})
