export default defineNuxtRouteMiddleware(async (to) => {
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

  // 已登录，允许访问
  return
})