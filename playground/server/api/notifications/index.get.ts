import type { H3Event } from 'h3'
import { normalizeNotificationCheck, normalizeNotificationList } from '../../utils/notification'

const getErrorStatusCode = (error: any) => {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }
  return 500
}

const getErrorMessage = (error: any, fallback: string) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

const forwardSetCookieHeaders = (event: H3Event, response: { headers: Headers }) => {
  const rawHeaders = response.headers as Headers & { getSetCookie?: () => string[] }
  const setCookies = rawHeaders.getSetCookie?.() || []

  if (setCookies.length > 0) {
    setHeader(event, 'set-cookie', setCookies)
    return
  }

  const singleSetCookie = response.headers.get('set-cookie')
  if (singleSetCookie) {
    setHeader(event, 'set-cookie', singleSetCookie)
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  const query = getQuery(event)
  const mode = typeof query.mode === 'string' ? query.mode : ''
  const page = 1
  const pageSize = 20

  if (raw) {
    const response ={
    "items": [
            {
  "id": "316",
  "title": "CCA20260197| aa | NDA / Confidentiality Agreement| HKD0.00  (~`~`7 Pending Preliminary Review`~`8 Pending Preliminary Review`~`9 Pending Preliminary Review`~`~)",
  "content": "${}~`~`7 有流程抄送给您`~`8 There is a process to copy to you`~`9 有流程抄送給您`~`~",
  "summary": "",
  "referenceId": "661103",
  "requestId": "661103",
  "creator": "liu xin",
  "sourceSystem": "OA",
  "businessName": "~`~`7 GLC - 合同管理`~`8 GLC - Contract Management`~`9 GLC - 合同管理`~`~",
  "link": "",
  "source": "",
  "category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
  "createdAt": "2026-05-13T17:51:00.719Z",
  "readAt": null,
  "payload": {
    "body": "${}~`~`7 有流程抄送给您`~`8 There is a process to copy to you`~`9 有流程抄送給您`~`~",
    "msgId": "e9-iGkoXT5c-aa660849",
    "title": "CCA20260197| aa | NDA / Confidentiality Agreement| HKD0.00  (~`~`7 Pending Preliminary Review`~`8 Pending Preliminary Review`~`9 Pending Preliminary Review`~`~)",
    "userId": "24703",
    "creator": "liu xin",
    "requestId": "661103",
    "requestNo": "CCA20260197",
    "userEmail": "xinliu@dchbi.com",
    "msgCategory": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
    "businessName": "~`~`7 GLC - 合同管理`~`8 GLC - Contract Management`~`9 GLC - 合同管理`~`~",
    "msgPublishAt": "1778665355072",
    "sourceSystem": "OA"
  },
  "created_at": "2026-05-13T17:51:00.719Z",
  "updated_at": "2026-05-13T17:51:00.719Z",
  "is_read": "0"
}
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20,
    "unreadCount": 1,
    "latestId": "109",
    "hasMore": false,
    "syncedAt": 1778638911454
}

    if (mode === 'check') {
      const normalizedList = normalizeNotificationList(response, page, pageSize)
      return normalizeNotificationCheck({
        unread_count: normalizedList.unreadCount,
        latest_id: normalizedList.latestId,
      })
    }

    return normalizeNotificationList(response, page, pageSize)
  }

  try {
    const cookieHeader = getRequestHeader(event, 'cookie')
    const userAgent = getRequestHeader(event, 'user-agent')
    const referer = getRequestHeader(event, 'referer')
    const forwardedIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''

    const upstreamQuery = new URLSearchParams()
    if (mode) {
      upstreamQuery.set('mode', mode)
    }

    const queryString = upstreamQuery.toString()
    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}/api/r/notification/list${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...(userAgent ? { 'user-agent': userAgent } : {}),
        ...(referer ? { referer } : {}),
        'X-Real-IP': forwardedIp,
        'X-Forwarded-For': forwardedIp,
      },
    })

    forwardSetCookieHeaders(event, response)

    if (mode === 'check') {
      return normalizeNotificationCheck(response._data)
    }

    return normalizeNotificationList(response._data, page, pageSize)
  }
  catch (error: any) {
    console.error('Get notifications API error:', error)

    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, '获取通知列表失败'),
    })
  }
})
