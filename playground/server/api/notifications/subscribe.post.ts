import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // 返回给前端的 VAPID 公钥，用于浏览器创建 Push Subscription
  const vapidPublicKey = config.public.vapidPublicKey || ''

  try {
    // 读取前端上报的订阅信息，兼容扁平结构和嵌套 subscription 结构
    const body = await readBody<Record<string, any>>(event)
    // const endpoint = String(body?.subscription?.endpoint || body?.endpoint || '')

    // if (isNotificationMockEnabled()) {
    //   // 本地 mock 模式下，不调用真实后端，直接写入内存模拟数据
    //   const mockResult = registerMockSubscription(body)
    //   return {
    //     success: true,
    //     vapidPublicKey,
    //     data: mockResult,
    //     message: '模拟订阅已注册',
    //   }
    // }

    // if (!endpoint) {
    //   throw createError({
    //     statusCode: 400,
    //     message: '订阅 endpoint 不能为空',
    //   })
    // }

    // 非 mock 模式下，将订阅请求代理到 Windmill 通知接口
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

    // 统一转换成前端可消费的 HTTP 错误
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '注册推送订阅失败',
    })
  }
})
