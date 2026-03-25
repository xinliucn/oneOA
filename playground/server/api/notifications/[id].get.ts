import { normalizeNotification } from '../../utils/notification'
import { getNotificationApiPrefix, proxyWindmill } from '../../utils/windmillProxy'
import { getMockNotificationDetail, isNotificationMockEnabled } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  // 从动态路由中提取通知 ID
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '通知 ID 不能为空',
    })
  }

  try {
    if (isNotificationMockEnabled()) {
      // mock 模式直接读取本地模拟详情
      return getMockNotificationDetail(id)
    }

    const query = getQuery(event)
    // 当前没有完整登录态串联时，先保留 user_id 的兜底逻辑
    const userId = typeof query.user_id === 'string' && query.user_id.trim() ? query.user_id.trim() : 'anonymous'
    const params = new URLSearchParams({
      user_id: userId,
      id,
    })

    const path = `${getNotificationApiPrefix()}/detail?${params.toString()}`
    // 转发到 Windmill 详情接口，并把返回结果规整成统一结构
    const response = await proxyWindmill<any>(event, path, { method: 'GET', skipCookies: false })
    const candidate = response?.data?.item || response?.data || response?.item || response

    return {
      item: candidate ? normalizeNotification(candidate) : null,
    }
  } catch (error: any) {
    console.error('Get notification detail API error:', error)

    // 统一转换成前端可消费的 HTTP 错误
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取通知详情失败',
    })
  }
})
