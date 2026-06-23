import type { IncomingNotificationItem } from '~/types/notification'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) {
    return
  }

  const notificationsStore = useNotificationsStore()

  const isIncomingNotificationItem = (value: unknown): value is IncomingNotificationItem => {
    return !!value
      && typeof value === 'object'
      && 'id' in value
      && 'title' in value
      && 'content' in value
  }

  const handleServiceWorkerMessage = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') {
      return
    }

    const message = payload as { type?: string, item?: unknown }
    if (message.type === 'notification:push' && isIncomingNotificationItem(message.item)) {
      void notificationsStore.ingestNotification(message.item)
    }
  }

  const registerServiceWorker = async () => {
    await notificationsStore.hydrateFromCache()
    await notificationsStore.fetchNotificationList()

    if (!('serviceWorker' in navigator)) {
      return
    }

    try {
      await navigator.serviceWorker.register('/sw.js')

      navigator.serviceWorker.addEventListener('message', (event) => {
        handleServiceWorkerMessage(event.data)
      })
    }
    catch (error) {
      console.error('Register notification service worker failed:', error)
    }
  }

  nuxtApp.hook('app:mounted', () => {
    void registerServiceWorker()
  })
})
