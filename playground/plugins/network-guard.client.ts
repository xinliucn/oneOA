export default defineNuxtPlugin((nuxtApp) => {
  const { bootstrap } = useNetworkGuard()

  nuxtApp.hook('app:mounted', () => {
    bootstrap()
  })
})
