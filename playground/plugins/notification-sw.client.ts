export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) {
    return
  }

  const { bootstrap, handleServiceWorkerMessage } = useNotification()

  const registerServiceWorker = async () => {
    await bootstrap()

    if (!('serviceWorker' in navigator)) {
      return
    }

    try {
      await navigator.serviceWorker.register('/sw.js')

      navigator.serviceWorker.addEventListener('message', (event) => {
        void handleServiceWorkerMessage(event.data)
      })
    } catch (error) {
      console.error('Register notification service worker failed:', error)
    }
  }

  nuxtApp.hook('app:mounted', () => {
    void registerServiceWorker()
  })
})
