export type MobileToastType = 'success' | 'error'

interface MobileToastState {
  visible: boolean
  message: string
  type: MobileToastType
}

let mobileToastTimer: ReturnType<typeof setTimeout> | undefined
let mobileToastElement: HTMLDivElement | undefined

const getMobileToastElement = () => {
  if (!import.meta.client) {
    return
  }

  if (mobileToastElement) {
    return mobileToastElement
  }

  mobileToastElement = document.createElement('div')
  mobileToastElement.className = 'mobile-global-toast'
  document.body.appendChild(mobileToastElement)

  return mobileToastElement
}

const renderNativeToast = (message: string, type: MobileToastType) => {
  const element = getMobileToastElement()

  if (!element) {
    return
  }

  element.textContent = message
  element.className = `mobile-global-toast mobile-global-toast--${type} is-visible`
  element.style.position = 'fixed'
  element.style.zIndex = '2147483647'
  element.style.top = 'calc(env(safe-area-inset-top, 0px) + 18px)'
  element.style.left = '50%'
  element.style.maxWidth = 'calc(100vw - 96px)'
  element.style.transform = 'translateX(-50%)'
  element.style.padding = '8px 16px'
  element.style.borderRadius = '999px'
  element.style.fontSize = '15px'
  element.style.lineHeight = '1.2'
  element.style.textAlign = 'center'
  element.style.whiteSpace = 'nowrap'
  element.style.boxShadow = '0 2px 8px rgb(0 0 0 / 8%)'
  element.style.pointerEvents = 'none'
  element.style.opacity = '1'
  element.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
  element.style.border = type === 'success' ? '1px solid #43b563' : '1px solid #d4586f'
  element.style.background = type === 'success' ? '#d9f3df' : '#fde7ec'
  element.style.color = type === 'success' ? '#007a1d' : '#a60a3a'
}

const hideNativeToast = () => {
  if (!mobileToastElement) {
    return
  }

  mobileToastElement.classList.remove('is-visible')
  mobileToastElement.style.opacity = '0'
}

export const useMobileToast = () => {
  const toast = useState<MobileToastState>('mobile:toast', () => ({
    visible: false,
    message: '',
    type: 'success',
  }))

  const showToast = (message: string, type: MobileToastType = 'success', duration = 3000) => {
    if (mobileToastTimer) {
      clearTimeout(mobileToastTimer)
    }

    toast.value = {
      visible: true,
      message,
      type,
    }
    renderNativeToast(message, type)

    mobileToastTimer = setTimeout(() => {
      toast.value.visible = false
      hideNativeToast()
    }, duration)
  }

  const hideToast = () => {
    if (mobileToastTimer) {
      clearTimeout(mobileToastTimer)
      mobileToastTimer = undefined
    }

    toast.value.visible = false
    hideNativeToast()
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}
