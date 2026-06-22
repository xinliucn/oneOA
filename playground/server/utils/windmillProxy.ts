import type { H3Event } from 'h3'
import { forwardSetCookieHeaders, getForwardHeaders, getWindmillApiBase } from './requestProxy'

type ProxyBody = BodyInit | Record<string, unknown> | unknown[] | null

type ProxyWindmillOptions = {
  method?: string
  body?: ProxyBody
  headers?: Record<string, string>
  skipCookies?: boolean
  errorMessage?: string
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
