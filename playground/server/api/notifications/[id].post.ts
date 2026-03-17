import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'
import { isNotificationMockEnabled, markMockNotificationAsRead } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '通知 ID 不能为空',
    })
  }

  try {
    const body = await readBody<Record<string, any>>(event).catch(() => ({}))

    if (isNotificationMockEnabled()) {
      return markMockNotificationAsRead(id, typeof body.readAt === 'string' ? body.readAt : undefined)
    }

    const path = `${getNotificationApiPrefix()}/mark-read`

    const response = await proxyWindmill<any>(event, path, {
      method: 'POST',
      body: {
        user_id: 'anonymous',
        id: Number(id),
      },
      skipCookies: true,
    })

    return {
      success: true,
      id,
      data: response,
    }
  } catch (error: any) {
    console.error('Mark notification as read API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '标记通知已读失败',
    })
  }
})
