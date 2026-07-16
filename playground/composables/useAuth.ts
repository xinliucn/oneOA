import type {
  AuthHttpError,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthUser,
  AuthUserResponse,
} from '../types/auth'
import { usePushSubscriptionStore } from '~/stores/pushSubscription'

const getErrorStatusCode = (error: unknown) => {
  const authError = error as AuthHttpError | null | undefined
  const statusCode = authError?.statusCode ?? authError?.status

  return typeof statusCode === 'number' ? statusCode : undefined
}

const identifyAuthUser = (user: AuthUser) => {
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

  const pushSubscriptionStore = usePushSubscriptionStore()
  void pushSubscriptionStore.init().catch((error) => {
    console.error('Init push subscription after auth failed:', error)
  })
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const isLoggedIn = useState<boolean>('auth:isLoggedIn', () => false)
  const lastCheckTime = useState<number>('auth:lastCheckTime', () => 0)

  const CACHE_DURATION = 5 * 60 * 1000

  const setAuthState = (authUser: AuthUser, checkedAt = Date.now()) => {
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
      const pushSubscriptionStore = usePushSubscriptionStore()
      const db = useNotificationDB()

      stopPolling()
      await pushSubscriptionStore.unsubscribe().catch((error) => {
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

  const afterLoginSuccess = (authUser: AuthUser) => {
    identifyAuthUser(authUser)
    initPushAfterAuth()
  }

  const login = async () => {
    try {
      const response = await $fetch<AuthLoginResponse>('/api/auth/login', {
        method: 'POST',
      })

      if (response.authorization_url) {
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

  const checkAuth = async (forceRefresh = false) => {
    try {
      const now = Date.now()
      if (!forceRefresh && isLoggedIn.value && (now - lastCheckTime.value < CACHE_DURATION)) {
        return true
      }

      const response = await $fetch<AuthUserResponse>('/api/auth/user')
      const responseUser = response.user

      if (response.authenticated === true && responseUser) {
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

      if (getErrorStatusCode(error) === 403) {
        await clearLocalData()
        await redirectHome()
      }

      return false
    }
  }

  const handleCallback = () => checkAuth(true)

  const logout = async () => {
    try {
      const response = await $fetch<AuthLogoutResponse>('/api/auth/logout', {
        method: 'POST',
      })

      resetAuthState()
      await clearLocalData()

      if (response.code === 1 && response.logout_url) {
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
