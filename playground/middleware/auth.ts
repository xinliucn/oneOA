export default defineNuxtRouteMiddleware(async (to) => {
  // 只在客户端执行中间件
  if (import.meta.server) {
    return
  }

  const { checkAuth } = useAuth()

  // 如果访问的是登录页面，直接放行
  if (to.path === '/') {
    return
  }

  // 检查登录状态
  const isLoggedIn = await checkAuth()

  if (!isLoggedIn) {
    // 未登录，重定向到登录页面
    return navigateTo('/')
  }
})