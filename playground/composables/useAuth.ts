import type { AuthUser, AuthUserResponse } from '../types/auth'

export type User = AuthUser

type AuthErrorType = 'unauthenticated' | 'forbidden' | 'network' | 'invalid-response' | 'unknown'

interface AuthErrorAction {
  type: AuthErrorType
  shouldClearLocalData: boolean
  shouldRedirectHome: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const getErrorStatusCode = (error: unknown) => {
  if (isRecord(error)) {
    const statusCode = error.statusCode ?? error.status
    if (typeof statusCode === 'number') {
      return statusCode
    }
  }

  return undefined
}

const isValidAuthUserResponse = (value: unknown): value is AuthUserResponse => {
  return isRecord(value)
    && (value.code === 0 || value.code === 1)
    && typeof value.authenticated === 'boolean'
    && (value.user === null || isRecord(value.user))
    && isRecord(value.token)
    && typeof value.token.valid === 'boolean'
}

const createInvalidAuthResponseError = () => {
  return Object.assign(new Error('Invalid auth user response'), {
    authErrorType: 'invalid-response' satisfies AuthErrorType,
  })
}

export const normalizeUser = (response: AuthUserResponse): User | null => {
  return response.authenticated ? response.user : null
}

export const isAuthenticated = (response: AuthUserResponse): boolean => {
  return response.authenticated && response.code === 1 && !!response.user && response.token.valid
}

const classifyAuthError = (error: unknown): AuthErrorType => {
  if (isRecord(error) && error.authErrorType === 'invalid-response') {
    return 'invalid-response'
  }

  const statusCode = getErrorStatusCode(error)

  if (statusCode === 401) return 'unauthenticated'
  if (statusCode === 403) return 'forbidden'
  if (statusCode === 0 || statusCode === 408 || statusCode === 502 || statusCode === 503 || statusCode === 504) {
    return 'network'
  }

  if (isRecord(error) && error.name === 'FetchError' && !statusCode) {
    return 'network'
  }

  return 'unknown'
}

const handleAuthError = (error: unknown): AuthErrorAction => {
  const type = classifyAuthError(error)

  return {
    type,
    shouldClearLocalData: type === 'forbidden',
    shouldRedirectHome: type === 'forbidden',
  }
}

const identifyAuthUser = (user: User) => {
  if (!import.meta.client) {
    return
  }

  const { $identifyLogRocketUser } = useNuxtApp()
  $identifyLogRocketUser(user)
}

const initPushAfterAuth = () => {
  if (!import.meta.client) {
    return
  }

  const { init } = usePushSubscription()
  void init().catch((error) => {
    console.error('Init push subscription after auth failed:', error)
  })
}

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const isLoggedIn = useState<boolean>('auth:isLoggedIn', () => false)
  const lastCheckTime = useState<number>('auth:lastCheckTime', () => 0)

  const CACHE_DURATION = 5 * 60 * 1000

  const setAuthState = (authUser: User, checkedAt = Date.now()) => {
    user.value = authUser
    isLoggedIn.value = true
    lastCheckTime.value = checkedAt
  }

  const resetAuthState = () => {
    user.value = null
    isLoggedIn.value = false
    lastCheckTime.value = 0
  }

  const clearLocalData = async () => {
    if (import.meta.client) {
      const { stopPolling } = useNotification()
      const { unsubscribe } = usePushSubscription()
      const db = useNotificationDB()

      stopPolling()
      await unsubscribe().catch((error) => {
        console.error('Clear local push subscription failed:', error)
      })
      await db.clearAll()
    }
  }

  const redirectHome = async () => {
    if (import.meta.client) {
      await navigateTo('/')
    }
  }

  const afterLoginSuccess = (authUser: User) => {
    identifyAuthUser(authUser)
    initPushAfterAuth()
  }

  const cleanupAfterAuthFailed = async (action: AuthErrorAction) => {
    if (action.shouldClearLocalData) {
      await clearLocalData()
    }

    if (action.shouldRedirectHome) {
      await redirectHome()
    }
  }

  const login = async () => {
    try {
      const response = await $fetch<{ authorization_url: string }>('/api/auth/login', {
        method: 'POST',
      })

      if (response?.authorization_url) {
        if (import.meta.client) {
          window.location.href = response.authorization_url
        }
      }
      else {
        throw new Error('未获取到登录 URL')
      }
    }
    catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const handleCallback = async () => {
    try {
      return await checkAuth(true)
    }
    catch (error) {
      console.error('Callback handling failed:', error)
      throw error
    }
  }

  const checkAuth = async (forceRefresh = false) => {
    try {
      const now = Date.now()
      if (!forceRefresh && isLoggedIn.value && (now - lastCheckTime.value < CACHE_DURATION)) {
        return true
      }

      const response = await $fetch<unknown>('/api/auth/user')

      if (!isValidAuthUserResponse(response)) {
        throw createInvalidAuthResponseError()
      }

      const responseUser = normalizeUser(response)

      if (isAuthenticated(response) && responseUser) {
        setAuthState(responseUser, now)
        afterLoginSuccess(responseUser)
        return true
      }

      resetAuthState()
      return false
    }
    catch (error: unknown) {
      console.error('Check auth failed:', error)
      resetAuthState()
      await cleanupAfterAuthFailed(handleAuthError(error))

      return false
    }
  }

  const logout = async () => {
    try {
      const response = await $fetch<{ code: number, logout_url?: string, message: string }>('/api/auth/logout', {
        method: 'POST',
      })

      resetAuthState()
      await clearLocalData()

      if (response?.code === 1 && response?.logout_url) {
        if (import.meta.client) {
          window.location.href = response.logout_url
        }
      }

      return response
    }
    catch (error) {
      console.error('Logout failed:', error)
      resetAuthState()
      await clearLocalData()
      throw error
    }
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    handleCallback,
    checkAuth,
    clearLocalData,
  }
}
