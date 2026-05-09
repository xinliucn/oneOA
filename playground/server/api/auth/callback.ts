// server/api/auth/callback.ts
import type { H3Event } from 'h3'
import { forwardSetCookieHeaders, getForwardHeaders } from '../../utils/windmillProxy'

const safeRedirectFallback = '/'

const allowedRedirectHostSuffixes = [
  'dchbi.app',
  'dch.com.hk',
]

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

const isAllowedRedirectHost = (hostname: string, requestHost?: string) => {
  const normalizedHostname = hostname.toLowerCase()
  const normalizedRequestHost = String(requestHost || '').split(':')[0]?.toLowerCase()

  return normalizedHostname === normalizedRequestHost
    || allowedRedirectHostSuffixes.some((suffix) => {
      return normalizedHostname === suffix || normalizedHostname.endsWith(`.${suffix}`)
    })
}

const normalizeSafeRedirectLocation = (event: H3Event, location: string | null) => {
  if (!location) {
    return null
  }

  if (location.startsWith('/') && !location.startsWith('//')) {
    return location
  }

  try {
    const requestHost = getRequestHeader(event, 'host')
    const url = new URL(location)

    return isAllowedRedirectHost(url.hostname, requestHost) ? location : safeRedirectFallback
  }
  catch {
    return safeRedirectFallback
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // 获取 URL 参数 (code, state)
  const query = getQuery(event)
  const { code, state } = query

  // 代理请求到 Windmill
  const windmillCallbackUrl = `${apiBase}/api/r/weaver/auth/callback`

  try {
    const response = await $fetch.raw(windmillCallbackUrl, {
      method: 'GET',
      query: { code, state },
      redirect: 'manual', // 不自动跟随重定向
      headers: getForwardHeaders(event),
    })

    forwardSetCookieHeaders(event, response)

    // 获取重定向地址
    const location = normalizeSafeRedirectLocation(event, response.headers.get('location'))

    // 重定向到前端首页
    if (location) {
      return sendRedirect(event, location, 302)
    }

    // 如果没有重定向，返回响应体
    return response._data
  }
  catch (error: unknown) {
    console.error('OAuth callback error:', error)
    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, 'OAuth 回调失败'),
    })
  }
})
