export default defineNuxtRouteMiddleware((to, from) => {
  // 只在客户端执行设备重定向
  if (import.meta.server) {
    return
  }

  const userAgent = navigator.userAgent

  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent || '')
  // 根据设备类型重定向到对应的路由
  if (isMobile && !to.path.startsWith('/mobile')) {
    return navigateTo('/mobile')
  }

  if (!isMobile && !to.path.startsWith('/desktop')) {
    return navigateTo('/desktop')
  }
})
