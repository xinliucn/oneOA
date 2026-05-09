import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '').trim()

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '通知 ID 不能为空',
    })
  }

  const config = useRuntimeConfig()

  if (config.mockEnabled) {
    return {
      success: true,
      id,
      data: {
        success: true,
        affected_rows: 1,
      },
    }
  }

  try {
    const notificationApiPrefix = getNotificationApiPrefix()
    const data = await proxyWindmill<Record<string, unknown>>(event, `${notificationApiPrefix}/mark-read`, {
      method: 'POST',
      body: {
        id: Number.isNaN(Number(id)) ? id : Number(id),
      },
      errorMessage: '标记通知已读失败',
    })

    return {
      success: true,
      id,
      data,
    }
  }
  catch (error: unknown) {
    console.error('Mark notification as read API error:', error)
    throw error
  }
})
