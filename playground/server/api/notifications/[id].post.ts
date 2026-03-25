import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'
import { isNotificationMockEnabled, markMockNotificationAsRead } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  // 从动态路由中提取要标记已读的通知 ID
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '通知 ID 不能为空',
    })
  }

  try {
    // 请求体目前主要兼容 readAt 等扩展字段
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({} as Record<string, any>))

    if (isNotificationMockEnabled()) {
      // mock 模式下直接更新本地模拟数据
      return markMockNotificationAsRead(id, typeof body.readAt === 'string' ? body.readAt : undefined)
    }

    const path = `${getNotificationApiPrefix()}/mark-read`
    const userId = typeof body.user_id === 'string' && body.user_id.trim() ? body.user_id.trim() : 'anonymous'

    // 非 mock 模式下，将已读请求代理到 Windmill
    const response = await proxyWindmill<any>(event, path, {
      method: 'POST',
      body: {
        user_id: userId,
        id: Number(id),
      },
      skipCookies: false,
    })

    return {
      success: true,
      id,
      data: response,
    }
  } catch (error: any) {
    console.error('Mark notification as read API error:', error)

    // 统一转换成前端可消费的 HTTP 错误
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '标记通知已读失败',
    })
  }
})
