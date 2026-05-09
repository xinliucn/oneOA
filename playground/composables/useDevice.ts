import { detectMobileDevice } from '~/utils/device'

export const useDevice = () => {
  const isMobile = () => {
    if (import.meta.client) {
      return detectMobileDevice({
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
      })
    }

    return false
  }

  const getDeviceRoute = () => {
    return isMobile() ? '/mobile' : '/desktop'
  }

  return {
    isMobile,
    getDeviceRoute,
  }
}
