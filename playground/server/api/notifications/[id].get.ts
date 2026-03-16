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

    const path = `${getNotificationApiPrefix()}/${encodeURIComponent(id)}`
    const response = await proxyWindmill<any>(event, path, { method: 'GET' })
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
