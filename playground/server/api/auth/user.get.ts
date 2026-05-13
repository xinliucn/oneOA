import type { AuthToken, AuthUser, AuthUserResponse } from '../../../types/auth'
import { proxyWindmill } from '../../utils/windmillProxy'

interface LegacyAuthUserPayload {
  name?: string
  email?: string
  username?: string
  displayName?: string
  token_verified?: boolean
  roles?: string[]
}

interface LegacyAuthUserResponse {
  code?: number
  user?: LegacyAuthUserPayload
  data?: LegacyAuthUserPayload | { user?: LegacyAuthUserPayload }
  authenticated?: boolean
  token_valid?: boolean
  login_at?: number
  session_id?: string
  logged_in_for?: number
  token_expired?: boolean
  session_rotated?: boolean
  token_refreshed?: boolean
  token_expires_at?: number
  token_expires_in?: number
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const asLegacyAuthUser = (value: unknown): LegacyAuthUserPayload | null => {
  return isRecord(value) ? value : null
}

const resolveLegacyUser = (response: LegacyAuthUserResponse): LegacyAuthUserPayload | null => {
  const directUser = asLegacyAuthUser(response.user)
  if (directUser) {
    return directUser
  }

  const nestedUser = isRecord(response.data) ? asLegacyAuthUser(response.data.user) : null
  if (nestedUser) {
    return nestedUser
  }

  return asLegacyAuthUser(response.data)
}

const normalizeAuthUser = (user: LegacyAuthUserPayload): AuthUser => {
  return {
    name: user.name || user.displayName || user.username || 'User',
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    roles: user.roles,
  }
}

const normalizeAuthResponse = (rawResponse: unknown): AuthUserResponse => {
  const response = (isRecord(rawResponse) ? rawResponse : {}) as LegacyAuthUserResponse
  const legacyUser = resolveLegacyUser(response)
  const authenticated = Boolean(
    response.authenticated
    || response.token_valid
    || response.code === 1
    || legacyUser?.token_verified,
  )

  const token: AuthToken = {
    valid: authenticated,
    verified: legacyUser?.token_verified,
    expired: response.token_expired,
    expiresAt: response.token_expires_at,
    expiresIn: response.token_expires_in,
    refreshed: response.token_refreshed,
    sessionRotated: response.session_rotated,
  }

  return {
    code: authenticated && legacyUser ? 1 : 0,
    authenticated: authenticated && !!legacyUser,
    user: authenticated && legacyUser ? normalizeAuthUser(legacyUser) : null,
    session: {
      id: response.session_id,
      loginAt: response.login_at,
      loggedInFor: response.logged_in_for,
    },
    token,
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  if (raw) {
    return normalizeAuthResponse({
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
    })
  }

  try {
    const response = await proxyWindmill<unknown>(event, '/api/r/weaver/auth/user', {
      method: 'GET',
      errorMessage: '获取用户信息失败',
    })

    return normalizeAuthResponse(response)
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
