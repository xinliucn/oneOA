import { appLocales, appMessages } from './i18n/config'

export default defineNuxtConfig({
  modules: ['../src/module', '@element-plus/nuxt', '@pinia/nuxt'],
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  // 优化 CSS 加载
  css: ['~/assets/css/desktop-critical.css'],
  runtimeConfig: {
    mockEnabled: process.env.NUXT_MOCK_ENABLED === 'true',
    fixedProxyCookie: process.env.NUXT_FIXED_PROXY_COOKIE || '',
    trustedProxyIps: process.env.NUXT_TRUSTED_PROXY_IPS || '',
    vapidPrivateKey: process.env.NUXT_VAPID_PRIVATE_KEY || '',
    vapidSubject: process.env.NUXT_VAPID_SUBJECT || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      logrocketAppId: process.env.NUXT_PUBLIC_LOGROCKET_APP_ID || '',
      allowedRedirectHostSuffixes: process.env.NUXT_PUBLIC_ALLOWED_REDIRECT_HOST_SUFFIXES || 'dchbi.app,dch.com.hk',
      internalNetworkGuardEnabled: process.env.NUXT_PUBLIC_INTERNAL_NETWORK_GUARD_ENABLED === 'true',
      internalNetworkProbeUrl: process.env.NUXT_PUBLIC_INTERNAL_NETWORK_PROBE_URL || 'https://intranet.dch.com.hk/',
      internalNetworkHosts: process.env.NUXT_PUBLIC_INTERNAL_NETWORK_HOSTS || 'intranet.dch.com.hk',
      internalNetworkAlertMessage: process.env.NUXT_PUBLIC_INTERNAL_NETWORK_ALERT_MESSAGE || 'Please connect DCH network to access websites',
      vapidPublicKey: process.env.NUXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || '',
    },
  },
  devServer: {
    port: 5173,
  },
  compatibilityDate: 'latest',
  vite: {
    css: {
      devSourcemap: true,
    },
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
    preview: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
  myModule: {
    defaultLocale: 'zh-CN',
    fallbackLocale: 'en',
    locales: appLocales,
    messages: appMessages,
  },
})
