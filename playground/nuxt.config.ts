export default defineNuxtConfig({
  modules: ['../src/module', '@element-plus/nuxt'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  myModule: {},
  devServer: {
    port: 5173
  },
  runtimeConfig: {
    authMockEnabled: process.env.NUXT_AUTH_MOCK_ENABLED ?? 'false',
    notificationMockEnabled: process.env.NUXT_NOTIFICATION_MOCK_ENABLED ?? 'false',
    vapidPrivateKey: process.env.NUXT_VAPID_PRIVATE_KEY || '',
    vapidSubject: process.env.NUXT_VAPID_SUBJECT || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://windmill-uat.dchbi.app',
      notificationApiPrefix: process.env.NUXT_PUBLIC_NOTIFICATION_API_PREFIX || '/api/r/notification',
      vapidPublicKey: process.env.NUXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    }
  },
  // 优化 CSS 加载
  css: [],

  vite: {
    css: {
      devSourcemap: true
    }
  }
})
