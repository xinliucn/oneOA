import type {
  NotificationSubscriptionPayload,
  NotificationWebPushSubscription,
} from '~/types/notificationSubscription'

export type PushClientSubscription = PushSubscriptionJSON

type PushSubscriptionClientOptions = {
  vapidPublicKey: string
  requestIOSPermission: () => Promise<boolean>
}

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

const normalizeWebPushSubscription = (value: PushSubscriptionJSON): NotificationWebPushSubscription | null => {
  if (!value.endpoint || !value.keys?.auth || !value.keys.p256dh) {
    return null
  }

  return {
    endpoint: value.endpoint,
    keys: {
      auth: value.keys.auth,
      p256dh: value.keys.p256dh,
    },
  }
}

const withTimeout = async <T>(task: Promise<T>, message: string, timeoutMs = 8000) => {
  let timer: number | undefined

  try {
    return await Promise.race([
      task,
      new Promise<T>((_resolve, reject) => {
        timer = window.setTimeout(() => reject(new Error(message)), timeoutMs)
      }),
    ])
  }
  finally {
    if (timer) {
      window.clearTimeout(timer)
    }
  }
}

export const createPushSubscriptionClient = (options: PushSubscriptionClientOptions) => {

  const isIOS = () => import.meta.client && /iPhone|iPad|iPod/i.test(navigator.userAgent)

  const isSafari = () => {
    if (!import.meta.client) {
      return false
    }

    const userAgent = navigator.userAgent
    return (
      /Safari\//.test(userAgent)
      && !/Chrome\//.test(userAgent)
      && !/Chromium\//.test(userAgent)
      && !/Edg\//.test(userAgent)
    ) || (isIOS() && !/CriOS|FxiOS|EdgiOS/i.test(userAgent))
  }

  const isStandalone = () => {
    if (!import.meta.client) {
      return false
    }

    return Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
      || window.matchMedia('(display-mode: standalone)').matches
  }

  const isSupported = () => {
    return import.meta.client
      && 'Notification' in window
      && 'serviceWorker' in navigator
      && 'PushManager' in window
  }

  const getPermission = () => import.meta.client && 'Notification' in window ? Notification.permission : 'default'

  const ensurePermission = async () => {
    if (!isSupported()) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (isIOS() && Notification.permission === 'default' && !(await options.requestIOSPermission())) {
      return 'denied'
    }

    return await Notification.requestPermission()
  }

  const ensureServiceWorkerRegistration = async () => {
    const existing = await navigator.serviceWorker.getRegistration()

    if (existing?.active) {
      return existing
    }
    const registration = existing || await navigator.serviceWorker.register('/sw.js')

    if (registration.active) {
      return registration
    }

    const installingWorker = registration.installing || registration.waiting

    if (!installingWorker) {
      return registration
    }

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        installingWorker.removeEventListener('statechange', handleStateChange)
        reject(new Error('Service Worker 激活超时'))
      }, 8000)

      const handleStateChange = () => {

        if (installingWorker.state !== 'activated') {
          return
        }

        window.clearTimeout(timeout)
        installingWorker.removeEventListener('statechange', handleStateChange)
        resolve()
      }

      installingWorker.addEventListener('statechange', handleStateChange)
    })

    const activeWorker = registration.active as ServiceWorker | null

    return registration
  }

  const getApplicationServerKey = () => {

    if (!options.vapidPublicKey) {
      throw new Error('未配置 Web Push VAPID 公钥')
    }

    const applicationServerKey = urlBase64ToUint8Array(options.vapidPublicKey)

    return applicationServerKey
  }

  const getLocalSubscription = async (): Promise<PushClientSubscription | null> => {
    if (!isSupported() || Notification.permission === 'denied') {
      return null
    }

    const registration = await ensureServiceWorkerRegistration()
    const subscription = await withTimeout(
      registration.pushManager.getSubscription(),
      '读取 Web Push 订阅超时',
    )

    return subscription?.toJSON() || null
  }

  const subscribe = async (): Promise<PushClientSubscription | null> => {

    if (!isSupported()) {
      throw new Error('当前浏览器不支持 Web Push')
    }

    if (await ensurePermission() !== 'granted') {
      throw new Error('通知权限未允许')
    }

    const registration = await ensureServiceWorkerRegistration()

    const existingSubscription = await withTimeout(
      registration.pushManager.getSubscription(),
      '读取 Web Push 订阅超时',
    )

    if (existingSubscription) {
      return existingSubscription.toJSON()
    }

    const applicationServerKey = getApplicationServerKey()
    const pushPermissionState = await registration.pushManager.permissionState({
      userVisibleOnly: true,
      applicationServerKey,
    })


    if (pushPermissionState === 'denied') {
      throw new Error('浏览器拒绝创建 Web Push 订阅')
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    return subscription.toJSON()
  }

  const unsubscribe = async () => {
    if (!isSupported()) {
      return false
    }

    const registration = await ensureServiceWorkerRegistration()
    const pushSubscription = await registration.pushManager.getSubscription()

    return pushSubscription ? await pushSubscription.unsubscribe() : true
  }

  const identity = (value: PushClientSubscription | null) => {
    if (!value) {
      return null
    }

    return value.endpoint || null
  }

  const toPayload = (value: PushClientSubscription, userEmail: string): NotificationSubscriptionPayload => {
    const subscription = normalizeWebPushSubscription(value)

    if (!subscription) {
      throw new Error('Web Push 订阅信息不完整')
    }

    return {
      kind: 'webpush',
      platform: isSafari() ? 'apple' : 'webpush',
      subscription,
      userAgent: navigator.userAgent,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      user_id: userEmail,
    }
  }

  return {
    isSupported,
    isIOSStandaloneRequired: () => isIOS() && !isStandalone(),
    getPermission,
    getLocalSubscription,
    subscribe,
    unsubscribe,
    identity,
    toPayload,
  }
}
