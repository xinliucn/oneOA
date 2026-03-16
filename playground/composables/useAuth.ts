export interface User {
  name: string
  email?: string
  username?: string
  displayName?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const isLoggedIn = useState<boolean>('auth:isLoggedIn', () => false)
  const lastCheckTime = useState<number>('auth:lastCheckTime', () => 0)

  const CACHE_DURATION = 5 * 60 * 1000

  const login = async () => {
    try {
      const response = await $fetch<{ authorization_url: string }>('/api/auth/login', {
        method: 'POST'
      })

      if (response?.authorization_url) {
        if (import.meta.client) {
          window.location.href = response.authorization_url
        }
      } else {
        throw new Error('未获取到登录 URL')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const handleCallback = async () => {
    try {
      return await checkAuth(true)
    } catch (error) {
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

      const response = await $fetch<any>('/api/auth/user')
      const responseUser = response?.user || response?.data?.user || response?.data || response
      const authenticated = Boolean(
        response?.authenticated ||
          response?.token_valid ||
          response?.code === 1 ||
          responseUser?.token_verified,
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
        return true
      }

      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0
      return false
    } catch (error: any) {
      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0

      if (error?.statusCode === 403 || error?.status === 403) {
        await clearLocalData()
        if (import.meta.client) await navigateTo('/')
      }

      return false
    }
  }

  const clearLocalData = async () => {
    if (import.meta.client) {
      const { stopPolling } = useNotification()
      const db = useNotificationDB()
      stopPolling()
      await db.clearAll()
    }
  }

  const logout = async () => {
    try {
      const response = await $fetch<{ code: number; logout_url?: string; message: string }>('/api/auth/logout', {
        method: 'POST'
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
    } catch (error) {
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
