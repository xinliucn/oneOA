export default defineNuxtRouteMiddleware((to, from) => {
  const userAgent = process.server 
    ? useRequestHeaders()['user-agent'] 
    : navigator.userAgent

     const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent || '')
     // 根据设备类型重定向到对应的路由
  if (isMobile && !to.path.startsWith('/mobile')) {
    return navigateTo('/mobile')
  }
  
  if (!isMobile && !to.path.startsWith('/desktop')) {
    return navigateTo('/desktop')
  }
})
