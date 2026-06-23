import { proxyWindmill } from '../../utils/windmillProxy'

const NOTIFICATION_API_PREFIX = '/api/r/notification'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  const response = {
    success: true,
    affected_rows: 1,
  }
  if (raw) {
    return {
      success: true,
      data: response,
      message: '订阅已取消',
    }
  }
  try {
    const body = await readBody<Record<string, any>>(event)
    const response = await proxyWindmill<any>(event, `${NOTIFICATION_API_PREFIX}/unsubscribe`, {
      method: 'POST',
      body,
    })

    return {
      success: true,
      data: response,
      message: '订阅已取消',
    }
  }
  catch (error: any) {
    console.error('Unsubscribe notification API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '取消推送订阅失败',
    })
  }
})
