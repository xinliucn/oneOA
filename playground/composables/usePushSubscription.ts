import type { NotificationSubscribeResponse } from '~/types/notification'

type PushStatus = 'idle' | 'unsupported' | 'subscribing' | 'subscribed' | 'denied' | 'error'

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

export const usePushSubscription = () => {
  const status = useState<PushStatus>('push:status', () => 'idle')
  const errorMessage = useState<string | null>('push:error', () => null)
  const subscription = useState<PushSubscriptionJSON | null>('push:subscription', () => null)

  const isSupported = computed(() => {
    if (!import.meta.client) {
      return false
    }

    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  })

  const isIOS = () => {
    if (!import.meta.client) {
      return false
    }

    const userAgent = navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

  const isStandalone = () => {
    if (!import.meta.client) {
      return false
    }

    return Boolean((window.navigator as any).standalone)
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
    if (existing) {
      return existing
    }

    await navigator.serviceWorker.register('/sw.js')
    return navigator.serviceWorker.ready
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
      const existing = await registration.pushManager.getSubscription()
      subscription.value = existing?.toJSON() || null
      status.value = existing ? 'subscribed' : 'idle'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = '读取推送订阅状态失败'
      console.error('Init push subscription failed:', error)
    }
  }

  const subscribe = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      return null
    }

    if (isIOS() && !isStandalone()) {
      status.value = 'error'
      errorMessage.value = 'iOS 需要先将站点添加到主屏幕，才能开启推送通知。'
      return null
    }

    try {
      status.value = 'subscribing'
      errorMessage.value = null

      const permission = await ensurePermission()
      if (permission !== 'granted') {
        return null
      }

      const config = await $fetch<NotificationSubscribeResponse>('/api/notifications/subscribe', {
        method: 'GET',
      })

      if (!config.vapidPublicKey) {
        throw new Error('服务端未配置 VAPID 公钥')
      }

      const registration = await ensureServiceWorkerRegistration()
      let pushSubscription = await registration.pushManager.getSubscription()

      if (!pushSubscription) {
        pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
        })
      }

      const pushJSON = pushSubscription.toJSON()
      await $fetch<NotificationSubscribeResponse>('/api/notifications/subscribe', {
        method: 'POST',
        body: {
          endpoint: pushJSON.endpoint,
          p256dh: pushJSON.keys?.p256dh || '',
          auth: pushJSON.keys?.auth || '',
        },
      })

      subscription.value = pushJSON
      status.value = 'subscribed'

      return pushSubscription
    } catch (error: any) {
      status.value = 'error'
      errorMessage.value = error?.message || '推送订阅失败'
      console.error('Subscribe push failed:', error)
      return null
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
  }
}
