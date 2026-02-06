export default defineNuxtPlugin((nuxtApp) => {
  // 创建自定义 fetch 实例，配置错误处理
  const customFetch = $fetch.create({
    onResponseError({ response }) {
      console.error('HTTP Error:', response.status, response.statusText)

      // 当响应状态码为 403 或 500 时，跳转到对应错误页面
      if (response.status === 403) {
        navigateTo('/403')
      } else if (response.status === 500) {
        navigateTo('/500')
      }
    }
  })

  // 覆盖全局 $fetch，使所有使用 $fetch 的地方都自动应用错误处理
  globalThis.$fetch = customFetch

  // 同时也提供给 Nuxt 应用实例，可以通过 useNuxtApp().$fetch 访问
  nuxtApp.provide('fetch', customFetch)

  // 全局 Vue 错误处理（用于捕捉其他类型的错误）
  nuxtApp.hook('vue:error', (error: any) => {
    console.error('Vue error:', error)

    // 检查是否是 HTTP 错误
    if (error?.statusCode === 403 || error?.status === 403) {
      navigateTo('/403')
    } else if (error?.statusCode === 500 || error?.status === 500) {
      navigateTo('/500')
    }
  })

  // 全局应用错误处理（用于捕捉其他类型的错误）
  nuxtApp.hook('app:error', (error: any) => {
    console.error('App error:', error)

    if (error?.statusCode === 403 || error?.status === 403) {
      navigateTo('/403')
    } else if (error?.statusCode === 500 || error?.status === 500) {
      navigateTo('/500')
    }
  })
})
