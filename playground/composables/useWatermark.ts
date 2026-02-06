export interface WatermarkOptions {
  text?: string
  fontSize?: number
  fontColor?: string
  opacity?: number
  rotate?: number
  zIndex?: number
  gap?: [number, number]
}

export const useWatermark = (options: WatermarkOptions = {}) => {
  let watermarkDiv: HTMLDivElement | null = null
  let observer: MutationObserver | null = null
  let parentObserver: MutationObserver | null = null

  const defaultOptions: Required<WatermarkOptions> = {
    text: '水印文本',
    fontSize: 16,
    fontColor: 'rgba(0, 0, 0, 0.15)',
    opacity: 1,
    rotate: -20,
    zIndex: 9999,
    gap: [100, 100]
  }

  const config = { ...defaultOptions, ...options }

  // 创建水印Canvas
  const createWatermarkCanvas = (text: string): string => {
    // 确保在客户端环境
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return ''
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const { fontSize, fontColor, rotate, gap } = config
    const [gapX, gapY] = gap

    // 设置canvas尺寸
    canvas.width = 400
    canvas.height = 250

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = fontColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 旋转并绘制文本（支持多行）
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotate * Math.PI) / 180)

    // 将文本按换行符分割成多行
    const lines = text.split('\n')
    const lineHeight = fontSize * 1.5 // 行高为字体大小的1.5倍
    const totalHeight = (lines.length - 1) * lineHeight
    const startY = -totalHeight / 2 // 居中显示

    // 绘制每一行
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight
      ctx.fillText(line, 0, y)
    })

    ctx.restore()

    return canvas.toDataURL()
  }

  // 创建水印元素
  const createWatermark = (text: string) => {
    // 确保在客户端环境
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('Watermark can only be created in browser environment')
      return
    }

    if (watermarkDiv) {
      removeWatermark()
    }

    const base64Url = createWatermarkCanvas(text)
    if (!base64Url) return

    watermarkDiv = document.createElement('div')
    watermarkDiv.setAttribute('data-watermark', 'true')
    watermarkDiv.setAttribute('data-text', text)

    Object.assign(watermarkDiv.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: String(config.zIndex),
      backgroundImage: `url(${base64Url})`,
      backgroundRepeat: 'repeat',
      opacity: String(config.opacity)
    })

    document.body.appendChild(watermarkDiv)
    // 启动防删除监听
    startObserver()
  }

  // 启动MutationObserver监听DOM变化
  const startObserver = () => {
    if (!watermarkDiv) return

    // 监听水印元素自身的变化
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          // 如果水印被修改，重新创建
          if (watermarkDiv && mutation.target === watermarkDiv) {
            const text = watermarkDiv.getAttribute('data-text') || config.text
            removeWatermark()
            createWatermark(text)
          }
        }
      })
    })

    observer.observe(watermarkDiv, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })

    // 监听body的子元素变化，防止水印被删除
    parentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node === watermarkDiv) {
              // 水印被删除，重新创建
              const text = config.text
              setTimeout(() => {
                createWatermark(text)
              }, 0)
            }
          })
        }
      })
    })

    parentObserver.observe(document.body, {
      childList: true
    })
  }

  // 移除水印
  const removeWatermark = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }

    if (parentObserver) {
      parentObserver.disconnect()
      parentObserver = null
    }

    if (watermarkDiv && watermarkDiv.parentNode) {
      watermarkDiv.parentNode.removeChild(watermarkDiv)
      watermarkDiv = null
    }
  }

  // 更新水印文本
  const updateWatermark = (text: string) => {
    if (watermarkDiv) {
      watermarkDiv.setAttribute('data-text', text)
    }
    createWatermark(text)
  }

  return {
    createWatermark,
    removeWatermark,
    updateWatermark
  }
}
