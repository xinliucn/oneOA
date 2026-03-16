import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'
import { isNotificationMockEnabled, registerMockSubscription } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const vapidPublicKey = config.public.vapidPublicKey || ''

  try {
    const body = await readBody<Record<string, any>>(event)

    if (isNotificationMockEnabled()) {
      const mockResult = registerMockSubscription(body)
      return {
        success: true,
        vapidPublicKey,
        data: mockResult,
        message: '模拟订阅已注册',
      }
    }

    if (!body?.endpoint) {
      throw createError({
        statusCode: 400,
        message: '订阅 endpoint 不能为空',
      })
    }

    const response = await proxyWindmill<any>(event, `${getNotificationApiPrefix()}/subscribe`, {
      method: 'POST',
      body,
    })

    return {
      success: true,
      vapidPublicKey,
      data: response,
      message: '订阅已注册',
    }
  } catch (error: any) {
    console.error('Subscribe notification API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '注册推送订阅失败',
    })
  }
})
