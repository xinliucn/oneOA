import type { H3Event } from 'h3'
import { forwardSetCookieHeaders, getForwardHeaders, getWindmillApiBase } from './windmillProxy'

type ProxyBody = BodyInit | Record<string, unknown> | unknown[] | null

type ProxyRequestOptions = {
  method?: HttpMethod
  body?: ProxyBody
  headers?: Record<string, string>
  skipCookies?: boolean
  errorMessage?: string
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'

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

export const proxyRequest = async <T>(event: H3Event, path: string, options: ProxyRequestOptions = {}): Promise<T> => {
  const apiBase = getWindmillApiBase()
  const forwardHeaders = getForwardHeaders(event)

  if (options.skipCookies) {
    delete forwardHeaders.cookie
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
