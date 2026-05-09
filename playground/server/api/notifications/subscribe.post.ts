import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  const response = {
    success: true,
    vapidPublicKey: '',
    data: {
      email: null,
      channel: 'apns',
      success: true,
      user_id: 'test-user-001',
      platform: 'web',
    },
    message: '订阅已注册',
  }
  if (raw) {
    return {
      success: true,
      data: response,
      message: '订阅已注册',
    }
  }
  try {
    // 读取前端上报的订阅信息，兼容扁平结构和嵌套 subscription 结构
    const body = await readBody<Record<string, any>>(event)
    const response = await proxyWindmill<any>(event, `${getNotificationApiPrefix()}/subscribe`, {
      method: 'POST',
      body,
    })

    return {
      success: true,
      data: response,
      message: '订阅已注册',
    }
  }
  catch (error: any) {
    console.error('Subscribe notification API error:', error)

    // 统一转换成前端可消费的 HTTP 错误
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '注册推送订阅失败',
    })
  }
})
