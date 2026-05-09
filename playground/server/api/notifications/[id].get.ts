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
      id: 192,
      body: '您有一条新的泛微通知',
      icon: '/icons/icon-192.png',
      title: '泛微通知',
      is_read: 1,
      read_at: '2026-04-30T16:29:00.831Z',
      subtitle: null,
      msg_group: 'process',
      action_url: null,
      created_at: '2026-04-30T15:30:00.776Z',
      dedupe_key: 'ingest:no_message_id:18c254c860ec49bab137fee6856967de',
      updated_at: '2026-04-30T16:29:00.831Z',
      msg_category: 'process',
      payload_json: {
        msgId: 'e9-lPg701d3-1eaad553',
        userId: '24703',
        requestId: '861868',
        userEmail: 'xinliu@dchbi.com',
      },
      dispatched_at: null,
      msg_publish_at: null,
      dispatch_status: 'pending',
      source_message_id: null,
    }
  }

  const notificationApiPrefix = getNotificationApiPrefix()
  const params = new URLSearchParams({ id })

  return proxyWindmill<Record<string, unknown>>(event, `${notificationApiPrefix}/detail?${params.toString()}`, {
    method: 'GET',
    errorMessage: '获取通知详情失败',
  })
})
