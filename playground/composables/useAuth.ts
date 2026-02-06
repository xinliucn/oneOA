export interface User {
  name: string
  email?: string
  username?: string
}

export const useAuth = () => {
  // 使用 useState 创建响应式状态
  const user = useState<User | null>('auth:user', () => null)
  const isLoggedIn = useState<boolean>('auth:isLoggedIn', () => false)
  const lastCheckTime = useState<number>('auth:lastCheckTime', () => 0)

  // 缓存有效期：5分钟
  const CACHE_DURATION = 5 * 60 * 1000

  // 登录函数 - 获取登录 URL 并跳转
  const login = async () => {
    try {
      // 调用 Nitro 代理接口获取登录 URL（使用 POST 方法）
      const response = await $fetch<{ authorization_url: string }>('/api/auth/login', {
        method: 'POST'
      })
      if (response?.authorization_url) {
        // 跳转到 Windmill 登录页面
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

  // 处理回调 - 验证 cookie 并获取用户信息
  const handleCallback = async () => {
    try {
      // 调用 Nitro 代理接口验证 cookie 并获取用户信息
      const userData = await $fetch<User>('/api/auth/user')
      // const userData = {
      //   name: 'Demo User',
      //   email: 'demo@example.com'
      // }
      if (userData) {
        user.value = userData
        isLoggedIn.value = true
        return true
      }

      return false
    } catch (error) {
      console.error('Callback handling failed:', error)
      throw error
    }
  }

  // 检查登录状态 - 通过调用 API 验证 cookie
  const checkAuth = async (forceRefresh = false) => {
    try {
      // 如果有缓存且未过期，直接返回缓存结果
      const now = Date.now()
      if (!forceRefresh && isLoggedIn.value && (now - lastCheckTime.value < CACHE_DURATION)) {
        return true
      }

      // 调用 Nitro 代理接口（不是直接调用 Windmill API）
      const userData:any = await $fetch<User>('/api/auth/user')
      // const userData = {
      //   "code": 1,
      //   "user": {
      //     "name": "Xin LIU",
      //     "email": "xinliu@dchbi.com",
      //     "roles": [
      //       "default-roles-weaver",
      //       "offline_access",
      //       "uma_authorization",
      //       "admin",
      //       "read-token",
      //       "manage-account",
      //       "manage-account-links",
      //       "view-profile"
      //     ],
      //     "user_id": "48529189-aa93-48dd-9d11-dd6f2fe08c63",
      //     "username": "xinliu@dchbi.com",
      //     "token_verified": true
      //   },
      //   "login_at": 1770366316843,
      //   "session_id": "938e5fca47bb4e6eb4654ecdc95fa38d",
      //   "token_valid": true,
      //   "authenticated": true,
      //   "logged_in_for": 185,
      //   "token_expired": false,
      //   "session_rotated": false,
      //   "token_refreshed": false,
      //   "token_expires_at": 1770366616000,
      //   "token_expires_in": 113
      // }
      if (userData.code == 1) {
        isLoggedIn.value = true
        user.value = userData.user
        lastCheckTime.value = now
        return true
      }

      lastCheckTime.value = 0
      return false
    } catch (error) {
      // 401 错误表示未登录
      user.value = null
      isLoggedIn.value = false
      lastCheckTime.value = 0
      return false
    }
  }

  // 登出函数
  const logout = async () => {
    try {
      // 调用 Nitro 代理接口登出
      const response = await $fetch<{ code: number; logout_url?: string; message: string }>('/api/auth/logout', {
        method: 'POST'
      })

      // 清除本地状态
      user.value = null
      isLoggedIn.value = false

      // 如果有登出 URL，跳转到 Windmill 登出页面
      if (response?.code === 1 && response?.logout_url) {
        if (import.meta.client) {
          window.location.href = response.logout_url
        }
      }

      return response
    } catch (error) {
      console.error('Logout failed:', error)
      // 即使 API 调用失败，也清除本地状态
      user.value = null
      isLoggedIn.value = false
      throw error
    }
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    handleCallback,
    checkAuth
  }
}
