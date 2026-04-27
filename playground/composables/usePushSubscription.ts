import type {
  NotificationItem,
  NotificationSubscribeResponse,
} from '~/types/notification'
import { useCurrentUserId } from '~/composables/useCurrentUserId'

type PushStatus = 'idle' | 'unsupported' | 'subscribing' | 'subscribed' | 'denied' | 'error'

type FCMSubscriptionState = {
  kind: 'fcm'
  platform: 'fcm'
  token: string
}

type LocalSubscriptionState = PushSubscriptionJSON | FCMSubscriptionState | null
type SyncableSubscription = Exclude<LocalSubscriptionState, null>

type FirebaseMessagingClient = {
  messaging: any
  getToken: (messaging: any, options: Record<string, any>) => Promise<string>
  deleteToken: (messaging: any) => Promise<boolean>
  onMessage: (messaging: any, nextOrObserver: (payload: any) => void) => unknown
}

let firebaseMessagingClientPromise: Promise<FirebaseMessagingClient> | null = null
let firebaseForegroundListenerBound = false

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const normalized = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(normalized)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

const normalizeIncomingNotification = (payload: any): NotificationItem => {
  const data = payload?.data || {}
  const notification = payload?.notification || {}
  const now = new Date().toISOString()
  const createdAt = String(data.created_at || data.createdAt || now)
  const updatedAt = String(data.updated_at || data.updatedAt || createdAt)

  return {
    id: String(data.id || data.notification_id || Date.now()),
    title: String(notification.title || data.title || '消息通知'),
    content: String(notification.body || data.content || data.body || ''),
    summary: String(data.summary || ''),
    link: String(data.link || data.url || '/desktop'),
    category: String(data.category || data.type || ''),
    createdAt,
    readAt: null,
    created_at: createdAt,
    updated_at: updatedAt,
    is_read: '0',
    payload: data,
  }
}

export const usePushSubscription = () => {
  const status = useState<PushStatus>('push:status', () => 'idle')
  const errorMessage = useState<string | null>('push:error', () => null)
  const subscription = useState<LocalSubscriptionState>('push:subscription', () => null)

  const runtimeConfig = useRuntimeConfig()
  const { getCurrentUserId } = useCurrentUserId()

  const isIOS = () => {
    if (!import.meta.client) {
      return false
    }

    return /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }

  const isSafari = () => {
    if (!import.meta.client) {
      return false
    }

    const userAgent = navigator.userAgent
    const isSafariUA =
      /Safari\//.test(userAgent) &&
      !/Chrome\//.test(userAgent) &&
      !/Chromium\//.test(userAgent) &&
      !/Edg\//.test(userAgent)

    return isSafariUA || (isIOS() && !/CriOS|FxiOS|EdgiOS/i.test(userAgent))
  }

  const isChromium = () => {
    if (!import.meta.client) {
      return false
    }

    const userAgent = navigator.userAgent
    return /Chrome\//.test(userAgent) || /Chromium\//.test(userAgent) || /Edg\//.test(userAgent)
  }

  const shouldUseFCM = () => {
    return isChromium() && !isSafari()
  }

  const isStandalone = () => {
    if (!import.meta.client) {
      return false
    }

    return (
      Boolean((window.navigator as any).standalone) ||
      window.matchMedia('(display-mode: standalone)').matches
    )
  }

  const isSupported = computed(() => {
    if (!import.meta.client) {
      return false
    }

    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return false
    }

    return shouldUseFCM() || 'PushManager' in window
  })

  const getSubscriptionIdentity = (value: LocalSubscriptionState): string | null => {
    if (!value) {
      return null
    }

    if ('token' in value) {
      return value.token
    }

    return value.endpoint || null
  }

  const getConfiguredVapidPublicKey = (kind: 'fcm' | 'webpush'): string => {
    if (kind === 'fcm') {
      return String(runtimeConfig.public.firebaseVapidKey || '')
    }

    return String(runtimeConfig.public.vapidPublicKey || '')
  }

  const buildSyncPayload = (value: SyncableSubscription) => {
    const basePayload = {
      userAgent: navigator.userAgent,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...(getCurrentUserId() ? { user_id: getCurrentUserId() } : {}),
    }

    if ('token' in value) {
      return {
        kind: 'fcm' as const,
        platform: 'fcm' as const,
        token: value.token,
        ...basePayload,
      }
    }

    return {
      kind: 'webpush' as const,
      platform: isSafari() ? 'apple' as const : 'webpush' as const,
      subscription: value,
      ...basePayload,
    }
  }

  const ensurePermission = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    const result = await Notification.requestPermission()
    if (result === 'denied') {
      status.value = 'denied'
    }

    return result
  }

  const ensureServiceWorkerRegistration = async () => {
    const existing = await navigator.serviceWorker.getRegistration()

    if (!existing) {
      await navigator.serviceWorker.register('/sw.js')
    }

    return navigator.serviceWorker.ready
  }

  const fetchVapidPublicKey = async (kind: 'fcm' | 'webpush'): Promise<string> => {
    const configured = getConfiguredVapidPublicKey(kind)
    if (configured) {
      return configured
    }

    const config = await $fetch<NotificationSubscribeResponse>('/api/notifications/subscribe', {
      method: 'GET',
    })

    const remoteKey = kind === 'fcm'
      ? config.firebaseVapidKey
      : config.webpushVapidPublicKey

    if (!remoteKey) {
      throw new Error(kind === 'fcm' ? '服务端未配置 FCM VAPID 公钥' : '服务端未配置 Web Push VAPID 公钥')
    }

    return String(remoteKey)
  }

  const getFirebaseMessagingClient = async () => {
    if (firebaseMessagingClientPromise) {
      return firebaseMessagingClientPromise
    }

    firebaseMessagingClientPromise = (async () => {
      const [{ getApp, getApps, initializeApp }, messagingModule] = await Promise.all([
        import('firebase/app'),
        import('firebase/messaging'),
      ])

      if (!(await messagingModule.isSupported())) {
        throw new Error('当前浏览器不支持 FCM')
      }

      const firebaseConfig = {
        apiKey: runtimeConfig.public.firebaseApiKey,
        authDomain: runtimeConfig.public.firebaseAuthDomain,
        projectId: runtimeConfig.public.firebaseProjectId,
        storageBucket: runtimeConfig.public.firebaseStorageBucket,
        messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId,
        appId: runtimeConfig.public.firebaseAppId,
      } as any

      const missingKeys = Object.entries(firebaseConfig)
        .filter(([, value]) => !value)
        .map(([key]) => key)

      if (missingKeys.length > 0) {
        throw new Error(`FCM 配置缺失: ${missingKeys.join(', ')}`)
      }

      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
      const messaging = messagingModule.getMessaging(app)

      return {
        messaging,
        getToken: messagingModule.getToken,
        deleteToken: messagingModule.deleteToken,
        onMessage: messagingModule.onMessage,
      }
    })().catch((error) => {
      firebaseMessagingClientPromise = null
      throw error
    })

    return firebaseMessagingClientPromise
  }

  const ensureForegroundFCMListener = async () => {
    if (firebaseForegroundListenerBound) {
      return
    }

    const client = await getFirebaseMessagingClient()
    firebaseForegroundListenerBound = true

    client.onMessage(client.messaging, (payload: any) => {
      try {
        const { ingestNotification } = useNotification()
        void ingestNotification(normalizeIncomingNotification(payload))
      } catch (error) {
        console.error('Handle FCM foreground message failed:', error)
      }
    })
  }

  const syncSubscription = async (value: SyncableSubscription) => {
    const body = buildSyncPayload(value)

    if ('token' in value && !value.token) {
      return
    }

    if (!('token' in value) && !value.endpoint) {
      return
    }
    
    return await $fetch<NotificationSubscribeResponse>('/api/notifications/subscribe', {
      method: 'POST',
      body,
    })
  }

  const unsyncSubscription = async (value: SyncableSubscription) => {
    const body = buildSyncPayload(value)

    if ('token' in value && !value.token) {
      return
    }

    if (!('token' in value) && !value.endpoint) {
      return
    }

    await $fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      body,
    })
  }

  const createWebPushSubscription = async (registration: ServiceWorkerRegistration) => {
    const vapidPublicKey = await fetchVapidPublicKey('webpush')

    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })
  }

  const getFCMToken = async (registration: ServiceWorkerRegistration) => {
    const client = await getFirebaseMessagingClient()
    const vapidKey = await fetchVapidPublicKey('fcm')
    const token = await client.getToken(client.messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })

    if (!token) {
      throw new Error('未获取到 FCM token')
    }

    await ensureForegroundFCMListener()
    return token
  }

  const init = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      return
    }

    if (Notification.permission === 'denied') {
      status.value = 'denied'
      return
    }

    try {
      const registration = await ensureServiceWorkerRegistration()
      let existingSubscription: LocalSubscriptionState = null

      if (shouldUseFCM()) {
        if (Notification.permission === 'granted') {
          existingSubscription = {
            kind: 'fcm',
            platform: 'fcm',
            token: await getFCMToken(registration),
          }
        }
      } else {
        const existing = await registration.pushManager.getSubscription()
        existingSubscription = existing?.toJSON() || null
      }

      const shouldSync =
        Boolean(getSubscriptionIdentity(existingSubscription)) &&
        getSubscriptionIdentity(existingSubscription) !== getSubscriptionIdentity(subscription.value)

      subscription.value = existingSubscription
      status.value = existingSubscription ? 'subscribed' : 'idle'
      errorMessage.value = null

      if (existingSubscription && shouldSync) {
        await syncSubscription(existingSubscription)
      }
    } catch (error: any) {
      status.value = 'error'
      errorMessage.value = error?.message || '读取推送订阅状态失败'
      console.error('Init push subscription failed:', error)
    }
  }

  const subscribe = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      return null
    }

    if (!shouldUseFCM() && isIOS() && !isStandalone()) {
      status.value = 'error'
      errorMessage.value = 'iOS 需要先将站点添加到主屏幕，才能开启推送通知。'
      return null
    }

    try {
      status.value = 'subscribing'
      errorMessage.value = null

      const permission = await ensurePermission()
      if (permission !== 'granted') {
        status.value = permission === 'denied' ? 'denied' : 'idle'
        return null
      }

      const registration = await ensureServiceWorkerRegistration()
      let nextSubscription: SyncableSubscription

      if (shouldUseFCM()) {
        nextSubscription = {
          kind: 'fcm',
          platform: 'fcm',
          token: await getFCMToken(registration),
        }
      } else {
        let pushSubscription = await registration.pushManager.getSubscription()

        if (!pushSubscription) {
          pushSubscription = await createWebPushSubscription(registration)
        }

        nextSubscription = pushSubscription.toJSON()
      }

      await syncSubscription(nextSubscription)
      subscription.value = nextSubscription
      status.value = 'subscribed'

      return nextSubscription
    } catch (error: any) {
      status.value = 'error'
      errorMessage.value = error?.message || '推送订阅失败'
      console.error('Subscribe push failed:', error)
      return null
    }
  }

  const unsubscribe = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      subscription.value = null
      return false
    }

    try {
      const registration = await ensureServiceWorkerRegistration()
      const currentSubscription = subscription.value

      if (shouldUseFCM()) {
        let success = false

        try {
          const client = await getFirebaseMessagingClient()
          success = await client.deleteToken(client.messaging)
        } catch (error) {
          console.error('Delete FCM token failed:', error)
        }

        const existingPushSubscription = await registration.pushManager.getSubscription()
        if (existingPushSubscription) {
          success = (await existingPushSubscription.unsubscribe()) || success
        }

        if (currentSubscription && 'token' in currentSubscription) {
          await unsyncSubscription(currentSubscription)
        }

        subscription.value = null
        status.value = 'idle'
        errorMessage.value = null

        return success || !currentSubscription
      }

      const existing = await registration.pushManager.getSubscription()

      if (!existing) {
        subscription.value = null
        status.value = 'idle'
        errorMessage.value = null
        return true
      }

      const payloadToUnsync = currentSubscription && !('token' in currentSubscription)
        ? currentSubscription
        : existing.toJSON()

      const success = await existing.unsubscribe()
      await unsyncSubscription(payloadToUnsync)

      subscription.value = null
      status.value = 'idle'
      errorMessage.value = null

      return success
    } catch (error: any) {
      status.value = 'error'
      errorMessage.value = error?.message || '取消推送订阅失败'
      console.error('Unsubscribe push failed:', error)
      return false
    }
  }

  return {
    status,
    errorMessage,
    subscription,
    isSupported,
    init,
    ensurePermission,
    subscribe,
    unsubscribe,
  }
}
