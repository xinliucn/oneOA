export interface User {
  name: string
  email?: string
  username?: string
  displayName?: string
}

interface AuthUserPayload {
  name?: string
  email?: string
  username?: string
  displayName?: string
  token_verified?: boolean
}

interface AuthUserResponse {
  code?: number
  user?: AuthUserPayload
  data?: AuthUserPayload | { user?: AuthUserPayload }
  authenticated?: boolean
  token_valid?: boolean
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

const isAuthUserPayload = (value: unknown): value is AuthUserPayload => {
  return isRecord(value)
}

const resolveAuthUser = (response: AuthUserResponse): AuthUserPayload | null => {
  if (isAuthUserPayload(response.user)) {
    return response.user
  }

  if (isRecord(response.data) && isAuthUserPayload(response.data.user)) {
    return response.data.user
  }

  if (isAuthUserPayload(response.data)) {
    return response.data
  }

  return isAuthUserPayload(response) ? response : null
}

const identifyAuthUser = (user: User) => {
  if (!import.meta.client) {
    return
  }

  const { $identifyLogRocketUser } = useNuxtApp()
  $identifyLogRocketUser(user)
}

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const isLoggedIn = useState<boolean>('auth:isLoggedIn', () => false)
  const lastCheckTime = useState<number>('auth:lastCheckTime', () => 0)

  const CACHE_DURATION = 5 * 60 * 1000

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

      const response = await $fetch<AuthUserResponse>('/api/auth/user')
      const responseUser = resolveAuthUser(response)
      const authenticated = Boolean(
        response.authenticated
        || response.token_valid
        || response.code === 1
        || responseUser?.token_verified,
      )

      if (authenticated && responseUser) {
        user.value = {
          name: responseUser.name || responseUser.displayName || responseUser.username || 'User',
          email: responseUser.email,
          username: responseUser.username,
          displayName: responseUser.displayName,
        }
        isLoggedIn.value = true
        lastCheckTime.value = now

        identifyAuthUser(user.value)

        // 登录成功后静默恢复推送订阅，但不阻塞主登录流程。
        if (import.meta.client) {
          const { init } = usePushSubscription()
          void init().catch((error) => {
            console.error('Init push subscription after auth failed:', error)
          })
        }

        return true
      }

      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0
      return false
    }
    catch (error: unknown) {
      console.error('Check auth failed:', error)
      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0

      if (getErrorStatusCode(error) === 403) {
        await clearLocalData()
        if (import.meta.client) await navigateTo('/')
      }

      return false
    }
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

  const logout = async () => {
    try {
      const response = await $fetch<{ code: number, logout_url?: string, message: string }>('/api/auth/logout', {
        method: 'POST',
      })

      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0
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
      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0
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
