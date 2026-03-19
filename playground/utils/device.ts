const MOBILE_KEYWORDS = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']

export const isMobileUserAgent = (userAgent = '') => {
  const normalizedUserAgent = userAgent.toLowerCase()
  return MOBILE_KEYWORDS.some(keyword => normalizedUserAgent.includes(keyword))
}

export const isMobileViewport = (viewportWidth?: number) => {
  return typeof viewportWidth === 'number' && viewportWidth <= 768
}

export const detectMobileDevice = ({
  userAgent,
  viewportWidth,
}: {
  userAgent?: string
  viewportWidth?: number
} = {}) => {
  return isMobileUserAgent(userAgent) || isMobileViewport(viewportWidth)
}
