export const useDevice = () => {
  const isMobile = () => {
    if (import.meta.client) {
      // 检测用户代理字符串
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']

      // 检查是否包含移动设备关键词
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword))

      // 也可以检查屏幕宽度
      const isSmallScreen = window.innerWidth <= 768

      return isMobileDevice || isSmallScreen
    }
    return false
  }

  const getDeviceRoute = () => {
    return isMobile() ? '/mobile' : '/desktop'
  }

  return {
    isMobile,
    getDeviceRoute
  }
}