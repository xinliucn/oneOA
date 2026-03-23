import type { NotificationSubscribeResponse } from '~/types/notification'

// 推送订阅状态：用于驱动按钮展示和错误提示
type PushStatus = 'idle' | 'unsupported' | 'subscribing' | 'subscribed' | 'denied' | 'error'

// 临时写死的联调数据。
// 等 Windmill 订阅接口字段最终敲定后，再切回浏览器真实 subscription 动态上报。
const TEMP_SUBSCRIBE_PAYLOAD = {
  kind: 'webpush',
  platform: 'apple',
  subscription: {
    endpoint: 'https://web.push.apple.com/test-endpoint',
    keys: {
      p256dh: 'test-p256dh-key',
      auth: 'test-auth-key',
    },
  },
  userAgent: 'Mozilla/5.0 Safari',
  timeZone: 'Asia/Hong_Kong',
  user_id: 'test-user-001',
} as const

// 将服务端返回的 VAPID 公钥从 Base64URL 转成 PushManager 需要的 Uint8Array
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
  // 全局共享推送订阅状态，避免多个组件重复初始化
  const status = useState<PushStatus>('push:status', () => 'idle')
  const errorMessage = useState<string | null>('push:error', () => null)
  const subscription = useState<PushSubscriptionJSON | null>('push:subscription', () => null)

  const isSupported = computed(() => {
    if (!import.meta.client) {
      return false
    }

    // 只有同时支持 Service Worker、PushManager 和 Notification 的浏览器才可用
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

    // iOS Web Push 需要以“添加到主屏幕”后的独立模式运行
    return Boolean((window.navigator as any).standalone)
  }

  const ensurePermission = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      return 'denied'
    }

    // 已经授权时直接复用，避免重复弹权限框
    if (Notification.permission === 'granted') {
      return 'granted'
    }

    // 首次订阅前向浏览器申请通知权限
    const result = await Notification.requestPermission()
    if (result === 'denied') {
      status.value = 'denied'
    }

    return result
  }

  const ensureServiceWorkerRegistration = async () => {
    // 优先复用已注册的 SW，避免重复 register
    const existing = await navigator.serviceWorker.getRegistration()
    if (existing) {
      return existing
    }

    // 如果还未注册，则注册通知 Service Worker，并等待 ready
    await navigator.serviceWorker.register('/sw.js')
    return navigator.serviceWorker.ready
  }

  const syncSubscription = async (pushJSON: PushSubscriptionJSON) => {
    // 当前先使用写死请求体联调，因此这里不依赖浏览器真实 subscription 内容。
    // 保留入参是为了后续切回动态上报时，不需要改调用方。
    void pushJSON

    if (!TEMP_SUBSCRIBE_PAYLOAD.subscription.endpoint) {
      return
    }

    await $fetch<NotificationSubscribeResponse>('/api/notifications/subscribe', {
      method: 'POST',
      body: TEMP_SUBSCRIBE_PAYLOAD,
    })
  }

  const fetchVapidPublicKey = async () => {
    console.log('+++++++',2);
    
    const config = await $fetch<NotificationSubscribeResponse>('/api/notifications/subscribe', {
      method: 'POST',
    })

    if (!config.vapidPublicKey) {
      throw new Error('服务端未配置 VAPID 公钥')
    }

    return config.vapidPublicKey
  }

  const createSubscription = async (registration: ServiceWorkerRegistration) => {
    console.log('+++++++',2);
    const vapidPublicKey = await fetchVapidPublicKey()

    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })
  }

  const init = async () => {
    // if (!import.meta.client || !isSupported.value) {
    //   status.value = 'unsupported'
    //   return
    // }

    // if (Notification.permission === 'denied') {
    //   status.value = 'denied'
    //   return
    // }
    console.log('++++++1');
    

    try {
      // 初始化时优先读取浏览器里已有的 Push Subscription，用于恢复订阅状态
      const registration = await ensureServiceWorkerRegistration()
      console.log('+++++++',registration);
      
      let existing = await registration.pushManager.getSubscription()
      console.log('++++++1',existing);
      // 如果用户之前已经授权通知，但浏览器里还没有 subscription，
      // 则在登录后自动补建订阅，不额外弹权限框。
      if (!existing && Notification.permission === 'granted') {
        existing = await createSubscription(registration)
      }

      const existingSubscription = existing?.toJSON() || null
      const shouldSync =
        Boolean(existingSubscription?.endpoint) &&
        existingSubscription?.endpoint !== subscription.value?.endpoint

      subscription.value = existingSubscription
      status.value = existingSubscription ? 'subscribed' : 'idle'

      // 登录后自动做“无感恢复”：
      // 如果浏览器里已经有订阅，则静默同步一次到后端，但不会主动申请新权限
      if (existingSubscription && shouldSync) {
        await syncSubscription(existingSubscription)
      }
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
      // 进入订阅流程时先清空上一次错误提示
      status.value = 'subscribing'
      errorMessage.value = null

      const permission = await ensurePermission()
      if (permission !== 'granted') {
        return null
      }

      const registration = await ensureServiceWorkerRegistration()
      let pushSubscription = await registration.pushManager.getSubscription()

      if (!pushSubscription) {
        // 浏览器本地尚未订阅时，使用 VAPID 公钥创建新的 Push Subscription
        pushSubscription = await createSubscription(registration)
      }

      const pushJSON = pushSubscription.toJSON()
      // 将浏览器生成的订阅信息上报后端，供服务端后续发送 Web Push
      await syncSubscription(pushJSON)

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

  const unsubscribe = async () => {
    if (!import.meta.client || !isSupported.value) {
      status.value = 'unsupported'
      subscription.value = null
      return false
    }

    try {
      // 登出或会话失效时，主动取消浏览器本地的 Push Subscription
      const registration = await ensureServiceWorkerRegistration()
      const existing = await registration.pushManager.getSubscription()

      if (!existing) {
        subscription.value = null
        status.value = 'idle'
        errorMessage.value = null
        return true
      }

      const success = await existing.unsubscribe()
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
