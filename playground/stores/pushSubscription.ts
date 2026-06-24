import { defineStore } from 'pinia'
import type { PushSubscriptionStatus, PushToggleResult } from '~/types/notificationSubscription'
import { createPushSubscriptionClient, type PushClientSubscription } from '~/utils/pushSubscriptionClient'

let iosPermissionPromptResolver: ((allowed: boolean) => void) | null = null

const getErrorMessage = (value: unknown, fallback: string) => {
  if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
    return value.message
  }

  return fallback
}

const logPushSubscription = (stage: string, detail: Record<string, unknown> = {}) => {
  console.info('[push-subscription]', stage, detail)
}

export const usePushSubscriptionStore = defineStore('pushSubscription', () => {
  const status = ref<PushSubscriptionStatus>('idle')
  const checking = ref(false)
  const toggling = ref(false)
  const error = ref<string | null>(null)
  const subscription = ref<PushClientSubscription | null>(null)
  const lastSyncedIdentity = ref<string | null>(null)
  const iosPermissionPrompt = reactive({ visible: false })

  const runtimeConfig = useRuntimeConfig()
  const { user } = useAuth()
  const { t } = useAppI18n()
  const client = createPushSubscriptionClient({
    vapidPublicKey: String(runtimeConfig.public.vapidPublicKey || ''),
    requestIOSPermission: () => requestIOSPermission(),
  })

  const isSupported = computed(() => client.isSupported())
  const isSubscribed = computed(() => status.value === 'subscribed')
  const canToggle = computed(() => import.meta.client && status.value !== 'unsupported')

  const setPermissionStatus = () => {
    status.value = client.getPermission() === 'denied' ? 'denied' : 'idle'
  }

  const setSubscription = (value: PushClientSubscription | null) => {
    subscription.value = value
    status.value = value ? 'subscribed' : 'idle'
    error.value = null
  }

  const syncRemote = async (action: 'subscribe' | 'unsubscribe', value: PushClientSubscription) => {
    const userEmail = user.value?.email?.trim() || ''

    if (!userEmail) {
      throw new Error('缺少用户邮箱，无法注册推送订阅')
    }

    logPushSubscription(`remote:${action}:start`, {
      endpoint: client.identity(value),
    })

    await $fetch(`/api/notification/${action}`, {
      method: 'POST',
      body: client.toPayload(value, userEmail),
    })

    lastSyncedIdentity.value = action === 'subscribe' ? client.identity(value) : null
    logPushSubscription(`remote:${action}:done`, {
      endpoint: client.identity(value),
    })
  }

  const requestIOSPermission = () => {
    return new Promise<boolean>((resolve) => {
      iosPermissionPromptResolver = resolve
      iosPermissionPrompt.visible = true
    })
  }

  const allowIOSPermissionPrompt = () => {
    iosPermissionPrompt.visible = false
    iosPermissionPromptResolver?.(true)
    iosPermissionPromptResolver = null
  }

  const denyIOSPermissionPrompt = () => {
    iosPermissionPrompt.visible = false
    iosPermissionPromptResolver?.(false)
    iosPermissionPromptResolver = null
  }

  const init = async () => {
    if (checking.value) {
      return
    }

    checking.value = true
    error.value = null

    try {
      if (!client.isSupported()) {
        status.value = 'unsupported'
        subscription.value = null
        return
      }

      const localSubscription = await client.getLocalSubscription()
      if (!localSubscription) {
        subscription.value = null
        setPermissionStatus()
        error.value = null
        return
      }

      setSubscription(localSubscription)
      if (client.identity(localSubscription) !== lastSyncedIdentity.value) {
        await syncRemote('subscribe', localSubscription)
      }
    }
    catch (initError) {
      status.value = 'error'
      error.value = getErrorMessage(initError, '读取推送订阅状态失败')
      console.error('Init push subscription failed:', initError)
    }
    finally {
      checking.value = false
    }
  }

  const subscribe = async () => {
    if (client.isIOSStandaloneRequired()) {
      status.value = 'unsupported'
      error.value = t('notification.push.iosHomeScreenRequired')
      return null
    }

    status.value = 'subscribing'
    const nextSubscription = await client.subscribe()

    if (!nextSubscription) {
      setPermissionStatus()
      return null
    }

    await syncRemote('subscribe', nextSubscription)
    setSubscription(nextSubscription)

    return nextSubscription
  }

  const unsubscribe = async () => {
    const currentSubscription = subscription.value
    const success = await client.unsubscribe()

    if (currentSubscription) {
      await syncRemote('unsubscribe', currentSubscription)
    }

    setSubscription(null)
    return success
  }

  const setEnabled = async (enabled: boolean): Promise<PushToggleResult> => {
    if (toggling.value) {
      return 'failed'
    }

    toggling.value = true
    error.value = null

    try {
      if (enabled) {
        return await subscribe() ? 'enabled' : 'failed'
      }

      if (isSubscribed.value) {
        return await unsubscribe() ? 'disabled' : 'failed'
      }

      return 'disabled'
    }
    catch (toggleError) {
      status.value = 'error'
      error.value = getErrorMessage(toggleError, '推送订阅操作失败')
      console.error('Toggle push subscription failed:', toggleError)
      return 'failed'
    }
    finally {
      toggling.value = false
    }
  }

  return {
    status,
    checking,
    toggling,
    error,
    iosPermissionPrompt,
    isSupported,
    isSubscribed,
    canToggle,
    init,
    setEnabled,
    unsubscribe,
    allowIOSPermissionPrompt,
    denyIOSPermissionPrompt,
  }
})
