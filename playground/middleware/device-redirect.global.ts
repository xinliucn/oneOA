export default defineNuxtRouteMiddleware((to, _from) => {
  // 只在客户端执行设备重定向
  if (import.meta.server) {
    return
  }

  // 如果是登录页或错误页面，不进行设备重定向
  if (to.path === '/' || to.path.match(/^\/(403|404|500)$/)) {
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
