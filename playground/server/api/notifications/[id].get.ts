import type { H3Event } from 'h3'

const getErrorStatusCode = (error: unknown) => {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  return 500
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return fallback
}

const getForwardHeaders = (event: H3Event) => {
  const cookieHeader = getRequestHeader(event, 'cookie')
  const userAgent = getRequestHeader(event, 'user-agent')
  const referer = getRequestHeader(event, 'referer')
  const forwardedIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''

  return {
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...(userAgent ? { 'user-agent': userAgent } : {}),
    ...(referer ? { referer } : {}),
    'X-Real-IP': forwardedIp,
    'X-Forwarded-For': forwardedIp,
  }
}

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
      "id": 192,
      "body": "您有一条新的泛微通知",
      "icon": "/icons/icon-192.png",
      "title": "泛微通知",
      "is_read": 1,
      "read_at": "2026-04-30T16:29:00.831Z",
      "subtitle": null,
      "msg_group": "process",
      "action_url": null,
      "created_at": "2026-04-30T15:30:00.776Z",
      "dedupe_key": "ingest:no_message_id:18c254c860ec49bab137fee6856967de",
      "updated_at": "2026-04-30T16:29:00.831Z",
      "msg_category": "process",
      "payload_json": {
        "msgId": "e9-lPg701d3-1eaad553",
        "userId": "24703",
        "requestId": "861868",
        "userEmail": "xinliu@dchbi.com"
      },
      "dispatched_at": null,
      "msg_publish_at": null,
      "dispatch_status": "pending",
      "source_message_id": null
    }
  }

  try {
    const notificationApiPrefix = config.public.notificationApiPrefix || '/api/r/notification'
    const params = new URLSearchParams({ id })
    const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/detail?${params.toString()}`, {
      method: 'GET',
      headers: getForwardHeaders(event),
    })

    return response._data
  }
  catch (error: unknown) {

    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, '获取通知详情失败'),
    })
  }
})
