import type { H3Event } from 'h3'
import { splitSetCookieString } from 'cookie-es'

export const proxyRequest = async <T>(e: H3Event, path: string, options: OptionsType): Promise<T> => {
    try {
        const response = await $fetch.raw<T>(`${'这是url'}`, {
            method: options.method,
            body: options.body,
            headers: {
                ...options.headers,
            }
        })
        return response._data as T
    } catch (error) {
        console.error('Error occurred while proxying request:', error)
        throw error
    }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT'

type OptionsType = {
    method: HttpMethod
    body?: any
    headers?: Record<string, string>
}