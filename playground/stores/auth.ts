import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        authenticated: false,
    }),
    actions: {
        setAuthUser(response: any) {
            this.user = normalizeUser(response)
            this.authenticated = isAuthenticated(response)
        }
    },
})