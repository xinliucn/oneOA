import type { H3Event } from 'h3'
import { splitSetCookieString } from 'cookie-es'

type ProxyBody = BodyInit | Record<string, unknown> | unknown[] | null

type ProxyRequestOptions = {
  method?: HttpMethod
  body?: ProxyBody
  headers?: Record<string, string>
  skipCookies?: boolean
  errorMessage?: string
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'

type RuntimeConfigWithFixedProxyCookie = {
  fixedProxyCookie?: string
}

type RuntimeConfigWithProxy = {
  apiBase?: string
  trustedProxyIps?: string | string[]
  public: {
    apiBase?: string
  }
}

/** 从 H3Error 或未知错误中提取 HTTP 状态码，默认返回 500 */
const getErrorStatusCode = (error: unknown) => {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  return 500
}

/** 从 H3Error 或未知错误中提取错误信息，无法提取时返回 fallback */
const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return fallback
}

/**
 * 读取后端 API 的 base URL。
 * 优先取服务端 config.apiBase，其次取 config.public.apiBase，末尾斜杠会被去除。
 * 未配置时抛出 500 错误。
 */
export const getWindmillApiBase = () => {
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithProxy
  const apiBase = String(config.apiBase || config.public.apiBase || '').trim()

  if (!apiBase) {
    throw createError({
      statusCode: 500,
      message: 'configuration error: public.apiBase is required',
    })
  }

  return apiBase.replace(/\/+$/, '')
}

/**
 * 将 trustedProxyIps 配置项统一转为字符串数组。
 * 支持逗号分隔的字符串或字符串数组两种格式。
 */
const normalizeTrustedProxyIps = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value.map(item => item.trim()).filter(Boolean)
  }

  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

/** 获取当前请求的 TCP socket 远端 IP */
const getSocketRemoteAddress = (event: H3Event) => {
  return event.node.req.socket.remoteAddress || ''
}

/** 判断当前请求是否来自受信任的反向代理 IP */
const isTrustedProxyRequest = (event: H3Event) => {
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithProxy
  const trustedProxyIps = normalizeTrustedProxyIps(config.trustedProxyIps)

  return trustedProxyIps.includes(getSocketRemoteAddress(event))
}

/**
 * 获取真实客户端 IP。
 * 若请求来自受信任的代理，优先读取 X-Forwarded-For / X-Real-IP 头；
 * 否则直接返回 socket 远端 IP。
 */
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

/**
 * 构造转发给后端的请求头。
 * 包含 cookie、user-agent、referer 以及真实客户端 IP（X-Real-IP / X-Forwarded-For）。
 */
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

/** 从请求头中提取当前访问的 hostname（不含端口，小写） */
const getRequestHostname = (event: H3Event) => {
  return String(getRequestHeader(event, 'host') || '')
    .split(':')[0]
    ?.trim()
    .toLowerCase() || ''
}

/** 去除 cookie domain 前缀的点号并转为小写，方便做域名匹配 */
const normalizeCookieDomain = (domain: string) => {
  return domain.trim().replace(/^\./, '').toLowerCase()
}

/** 判断后端返回的 cookie domain 是否适用于当前 hostname */
const canSetCookieForHost = (domain: string, hostname: string) => {
  const normalizedDomain = normalizeCookieDomain(domain)
  return normalizedDomain === hostname || hostname.endsWith(`.${normalizedDomain}`)
}

/**
 * 修正单条 Set-Cookie 字符串的 domain。
 * 若后端返回的 domain 与当前访问的 hostname 不匹配（跨域代理场景），
 * 则去掉 domain 属性，让浏览器使用当前域名，避免 cookie 被丢弃。
 */
const normalizeSetCookieForCurrentHost = (event: H3Event, cookie: string) => {
  const hostname = getRequestHostname(event)
  const domainMatch = cookie.match(/;\s*domain=([^;]+)/i)

  if (!hostname || !domainMatch?.[1] || canSetCookieForHost(domainMatch[1], hostname)) {
    return cookie
  }

  return cookie.replace(/;\s*domain=[^;]+/i, '')
}

/**
 * 将后端响应的 Set-Cookie 头透传给浏览器，同时修正 domain。
 * 优先使用 getSetCookie()（正确处理多值），fallback 到单值 get() + splitSetCookieString 拆分。
 */
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

export const proxyRequest = async <T>(event: H3Event, path: string, options: ProxyRequestOptions = {}): Promise<T> => {
  const apiBase = getWindmillApiBase()
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithFixedProxyCookie
  const forwardHeaders = getForwardHeaders(event)
  // fixedProxyCookie 用于开发/测试环境，直接注入固定 cookie 绕过登录
  const fixedProxyCookie = String(config.fixedProxyCookie || '').trim()

  if (options.skipCookies) {
    delete forwardHeaders.cookie
  }
  else if (fixedProxyCookie) {
    forwardHeaders.cookie = fixedProxyCookie
  }
  try {
    const response = await $fetch.raw<T>(`${apiBase}${path}`, {
      method: options.method,
      body: options.body,
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
      message: getErrorMessage(error, options.errorMessage || 'Proxy request failed'),
    })
  }
}
