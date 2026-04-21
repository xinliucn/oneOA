export default defineNuxtPlugin((nuxtApp) => {
  const { bootstrap } = useNetworkGuard()

  nuxtApp.hook('app:mounted', () => {
    if (import.meta.dev && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister()
        })
      })
      return
    }

    bootstrap()
  })
})
