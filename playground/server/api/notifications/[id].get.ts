import type { H3Event } from 'h3'
import { normalizeNotification } from '../../utils/notification'
import { getMockNotificationById } from '../../utils/notificationMock'

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

const pickNotificationDetail = (response: any) => {
  return response?.data?.item || response?.data || response?.item || response
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
      item: getMockNotificationById(id),
    }
  }

  try {
    const notificationApiPrefix = config.public.notificationApiPrefix || '/api/r/notification'
    const params = new URLSearchParams({ id })
    const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/detail?${params.toString()}`, {
      method: 'GET',
      headers: getForwardHeaders(event),
    })

    return response
  }
  catch (error: unknown) {
    console.error('Get notification detail API error:', error)

    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, '获取通知详情失败'),
    })
  }
})
