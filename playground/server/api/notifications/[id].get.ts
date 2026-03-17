import { normalizeNotification } from '../../utils/notification'
import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'
import { getMockNotificationDetail, isNotificationMockEnabled } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '通知 ID 不能为空',
    })
  }

  try {
    if (isNotificationMockEnabled()) {
      return getMockNotificationDetail(id)
    }

    const query = getQuery(event)
    const userId = typeof query.user_id === 'string' && query.user_id.trim() ? query.user_id.trim() : 'anonymous'
    const params = new URLSearchParams({
      user_id: userId,
      id,
    })

    const path = `${getNotificationApiPrefix()}/detail?${params.toString()}`
    const response = await proxyWindmill<any>(event, path, { method: 'GET', skipCookies: true })
    const candidate = response?.data?.item || response?.data || response?.item || response

    return {
      item: candidate ? normalizeNotification(candidate) : null,
    }
  } catch (error: any) {
    console.error('Get notification detail API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取通知详情失败',
    })
  }
})
