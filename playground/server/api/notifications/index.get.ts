import { normalizeNotificationList } from '../../utils/notification'
import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'
import { isNotificationMockEnabled, listMockNotifications } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const rawPage = Number.parseInt(String(query.page || '1'), 10)
  const rawPageSize = Number.parseInt(String(query.pageSize || '20'), 10)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? Math.min(rawPageSize, 100) : 20

  try {
    const keyword = typeof query.keyword === 'string' ? query.keyword : ''
    const userId = typeof query.user_id === 'string' ? query.user_id : ''
    const isRead = typeof query.is_read === 'string' ? query.is_read : ''
    const category = typeof query.category === 'string' ? query.category : ''

    if (isNotificationMockEnabled()) {
      return listMockNotifications({
        page,
        pageSize,
        keyword,
      })
    }

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (userId) params.set('user_id', userId)
    if (isRead !== '') params.set('is_read', isRead)
    if (category) params.set('category', category)
    if (keyword) params.set('keyword', keyword)

    const path = `${getNotificationApiPrefix()}/list?${params.toString()}`
    const response = await proxyWindmill<any>(event, path, { method: 'GET' })

    return normalizeNotificationList(response, page, pageSize)
  } catch (error: any) {
    console.error('Get notifications API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取通知列表失败',
    })
  }
})
