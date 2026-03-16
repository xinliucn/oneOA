import type { H3Event } from 'h3'

export const getForwardHeaders = (event: H3Event): Record<string, string> => {
  const cookieHeader = getRequestHeader(event, 'cookie')
  const userAgent = getRequestHeader(event, 'user-agent')
  const referer = getRequestHeader(event, 'referer')
  const forwardedIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''

  return {
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...(userAgent ? { 'user-agent': userAgent } : {}),
    ...(referer ? { referer: referer } : {}),
    'X-Real-IP': forwardedIp,
    'X-Forwarded-For': forwardedIp,
  }
}

export const forwardSetCookieHeaders = (event: H3Event, response: { headers: Headers }) => {
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

export const getNotificationApiPrefix = () => {
  const config = useRuntimeConfig()
  return config.public.notificationApiPrefix || '/api/r/weaver/notifications'
}

export const proxyWindmill = async <T>(
  event: H3Event,
  path: string,
  options: { method?: string; body?: BodyInit | Record<string, any> | null; headers?: Record<string, string> } = {},
): Promise<T> => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'

  const response = await $fetch.raw<T>(`${apiBase}${path}`, {
    ...options,
    method: options.method as HttpMethod | undefined,
    headers: {
      ...getForwardHeaders(event),
      ...((options.headers || {}) as Record<string, string>),
    },
  })

  forwardSetCookieHeaders(event, response)
  return response._data as T
}
