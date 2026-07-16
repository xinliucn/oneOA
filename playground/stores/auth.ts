import { defineStore } from 'pinia'
import type { AuthUser, AuthUserResponse } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): { user: AuthUser | null, authenticated: boolean } => ({
    user: null,
    authenticated: false,
  }),
  actions: {
    setAuthUser(response: AuthUserResponse) {
      if (response.authenticated !== true || !response.user) {
        this.user = null
        this.authenticated = false
        return
      }

      this.user = response.user
      this.authenticated = true
    },
  },
})
