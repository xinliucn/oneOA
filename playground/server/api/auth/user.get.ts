export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const authMockEnabled = (() => {
    const raw = config.authMockEnabled
    if (typeof raw === 'boolean') {
      return raw
    }
    const normalized = String(raw ?? 'false').toLowerCase()
    return normalized !== 'false' && normalized !== '0'
  })()

  if (authMockEnabled) {
    return {
      code: 1,
      user: {
        name: 'Mock User',
        email: 'mock.user@dchbi.app',
        username: 'mock.user@dchbi.app',
        token_verified: true,
        roles: ['mock-user', 'admin'],
      },
      login_at: Date.now(),
      session_id: 'mock-session-id',
      token_valid: true,
      authenticated: true,
      logged_in_for: 0,
      token_expired: false,
      session_rotated: false,
      token_refreshed: false,
      token_expires_at: Date.now() + 30 * 60 * 1000,
      token_expires_in: 30 * 60,
    }
  }

  try {
    // 获取客户端的所有请求头
    const cookieHeader = getRequestHeader(event, 'cookie')
    const userAgent = getRequestHeader(event, 'user-agent')
    const referer = getRequestHeader(event, 'referer')

    // 调用 Windmill API 获取用户信息，使用 raw 获取完整响应
    const response = await $fetch.raw(`${apiBase}/api/r/weaver/auth/user`, {
      method: 'GET',
      headers: {
        ...(cookieHeader && { cookie: cookieHeader }),
        ...(userAgent && { 'user-agent': userAgent }),
        ...(referer && { referer: referer }),
        'X-Real-IP': getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || '',
        'X-Forwarded-For': getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || '',
      }
    })

    // 转发 Windmill 返回的 Set-Cookie 到客户端
    const setCookieHeaders = response.headers.get('set-cookie')
    if (setCookieHeaders) {
      setHeader(event, 'set-cookie', setCookieHeaders)
    }

    return response._data
  } catch (error: any) {
    console.error('Get user API error:', error)

    // 如果是 401 错误，说明未登录
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: '未登录'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取用户信息失败'
    })
  }
})
