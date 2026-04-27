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
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const notificationApiPrefix = config.public.notificationApiPrefix || '/api/r/notification'
    const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/mark-read`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: {
        id: Number.isNaN(Number(id)) ? id : Number(id),
      },
    })

    forwardSetCookieHeaders(event, response)

    return {
      success: true,
      id,
      data: response._data,
    }
  }
  catch (error: unknown) {
    console.error('Mark notification as read API error:', error)

    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, '标记通知已读失败'),
    })
  }
})
