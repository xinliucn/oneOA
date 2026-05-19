import type { H3Event } from 'h3'
import { splitSetCookieString } from 'cookie-es'

type ProxyBody = BodyInit | Record<string, unknown> | unknown[] | null

type ProxyWindmillOptions = {
  method?: string
  body?: ProxyBody
  headers?: Record<string, string>
  skipCookies?: boolean
  errorMessage?: string
}

type RuntimeConfigWithProxy = {
  apiBase?: string
  trustedProxyIps?: string | string[]
  public: {
    apiBase?: string
    notificationApiPrefix?: string
  }
}

const proxyLogPrefix = '[windmill-proxy]'

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

const formatProxyErrorMessage = (fallback: string, error?: unknown) => {
  const detail = error ? getErrorMessage(error, fallback) : fallback
  return `${proxyLogPrefix} ${detail}`
}

export const getWindmillApiBase = () => {
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithProxy
  const apiBase = String(config.apiBase || config.public.apiBase || '').trim()

  if (!apiBase) {
    throw createError({
      statusCode: 500,
      message: formatProxyErrorMessage('configuration error: public.apiBase is required'),
    })
  }

  return apiBase.replace(/\/+$/, '')
}

const normalizeTrustedProxyIps = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value.map(item => item.trim()).filter(Boolean)
  }

  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

const getSocketRemoteAddress = (event: H3Event) => {
  return event.node.req.socket.remoteAddress || ''
}

const isTrustedProxyRequest = (event: H3Event) => {
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithProxy
  const trustedProxyIps = normalizeTrustedProxyIps(config.trustedProxyIps)

  return trustedProxyIps.includes(getSocketRemoteAddress(event))
}

export const getTrustedClientIp = (event: H3Event) => {
  if (isTrustedProxyRequest(event)) {
    const forwardedFor = getHeader(event, 'x-forwarded-for')
    const realIp = getHeader(event, 'x-real-ip')
    const forwardedIp = forwardedFor?.split(',')[0]?.trim() || realIp?.trim()

    if (forwardedIp) {
      return forwardedIp
    }
  }

  return getSocketRemoteAddress(event)
}

export const getForwardHeaders = (event: H3Event): Record<string, string> => {
  const cookieHeader = getRequestHeader(event, 'cookie')
  const userAgent = getRequestHeader(event, 'user-agent')
  const referer = getRequestHeader(event, 'referer')
  const clientIp = getTrustedClientIp(event)

  return {
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...(userAgent ? { 'user-agent': userAgent } : {}),
    ...(referer ? { referer: referer } : {}),
    ...(clientIp ? { 'X-Real-IP': clientIp, 'X-Forwarded-For': clientIp } : {}),
  }
}

const getRequestHostname = (event: H3Event) => {
  return String(getRequestHeader(event, 'host') || '')
    .split(':')[0]
    ?.trim()
    .toLowerCase() || ''
}

const normalizeCookieDomain = (domain: string) => {
  return domain.trim().replace(/^\./, '').toLowerCase()
}

const canSetCookieForHost = (domain: string, hostname: string) => {
  const normalizedDomain = normalizeCookieDomain(domain)
  return normalizedDomain === hostname || hostname.endsWith(`.${normalizedDomain}`)
}

const normalizeSetCookieForCurrentHost = (event: H3Event, cookie: string) => {
  const hostname = getRequestHostname(event)
  const domainMatch = cookie.match(/;\s*domain=([^;]+)/i)

  if (!hostname || !domainMatch?.[1] || canSetCookieForHost(domainMatch[1], hostname)) {
    return cookie
  }

  return cookie.replace(/;\s*domain=[^;]+/i, '')
}

export const forwardSetCookieHeaders = (event: H3Event, response: { headers: Headers }) => {
  const rawHeaders = response.headers as Headers & { getSetCookie?: () => string[] }
  const setCookies = (rawHeaders.getSetCookie?.() || [])
    .map(cookie => normalizeSetCookieForCurrentHost(event, cookie))

  if (setCookies.length > 0) {
    setHeader(event, 'set-cookie', setCookies)
    return
  }

  const singleSetCookie = response.headers.get('set-cookie')
  if (singleSetCookie) {
    setHeader(
      event,
      'set-cookie',
      splitSetCookieString(singleSetCookie)
        .map(cookie => normalizeSetCookieForCurrentHost(event, cookie)),
    )
  }
}

export const getNotificationApiPrefix = () => {
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithProxy
  return config.public.notificationApiPrefix || '/api/r/weaver/notifications'
}

export const proxyWindmill = async <T>(
  event: H3Event,
  path: string,
  options: ProxyWindmillOptions = {},
): Promise<T> => {
  const apiBase = getWindmillApiBase()

  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'

  const forwardHeaders = getForwardHeaders(event)
  if (options.skipCookies) {
    delete forwardHeaders.cookie
  }

  try {
    const response = await $fetch.raw<T>(`${apiBase}${path}`, {
      ...options,
      method: options.method as HttpMethod | undefined,
      headers: {
        ...forwardHeaders,
        ...(options.headers || {}),
      },
    })

    forwardSetCookieHeaders(event, response)
    return response._data as T
  }
  catch (error: unknown) {
    throw createError({
      statusCode: getErrorStatusCode(error),
      message: formatProxyErrorMessage(options.errorMessage || 'request failed', error),
    })
  }
}
