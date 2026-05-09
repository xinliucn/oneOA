import { proxyWindmill } from '../../utils/windmillProxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  if (raw) {
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
    return await proxyWindmill(event, '/api/r/weaver/auth/user', {
      method: 'GET',
      errorMessage: '获取用户信息失败',
    })
  }
  catch (error: unknown) {
    console.error('Get user API error:', error)

    // 如果是 401 错误，说明未登录
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: '未登录',
      })
    }

    throw error
  }
})
