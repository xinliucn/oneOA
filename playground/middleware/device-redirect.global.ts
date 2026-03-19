import { detectMobileDevice } from '~/utils/device'

export default defineNuxtRouteMiddleware((to, _from) => {
  // 只在客户端执行设备重定向
  if (import.meta.server) {
    return
  }

  // 如果是登录页或错误页面，不进行设备重定向
  if (to.path === '/' || to.path.match(/^\/(403|404|500)$/)) {
    return
  }

  // 用户已经明确进入 mobile/desktop 路径时，不再二次纠正，避免首屏 hydration 时 layout 串位。
  if (to.path.startsWith('/mobile') || to.path.startsWith('/desktop')) {
    return
  }

  const isMobile = detectMobileDevice({
    userAgent: navigator.userAgent,
    viewportWidth: window.innerWidth,
  })

  return navigateTo(isMobile ? '/mobile' : '/desktop')
})
