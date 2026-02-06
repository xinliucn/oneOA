/**
 * 创建页面水印
 * @param text 水印文本
 */
export const createWatermark = (text: string) => {
  // 移除已存在的水印
  const existingWatermark = document.getElementById('page-watermark')
  if (existingWatermark) {
    existingWatermark.remove()
  }

  // 创建水印容器
  const watermarkDiv = document.createElement('div')
  watermarkDiv.id = 'page-watermark'
  watermarkDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `

  // 创建 canvas 生成水印图案
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置 canvas 尺寸
  canvas.width = 300
  canvas.height = 200

  // 设置水印样式
  ctx.font = '14px Arial'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 旋转画布
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(-20 * Math.PI / 180)

  // 绘制水印文本（支持多行）
  const lines = text.split('\n')
  const lineHeight = 20
  const startY = -(lines.length - 1) * lineHeight / 2

  lines.forEach((line, index) => {
    ctx.fillText(line, 0, startY + index * lineHeight)
  })

  // 将 canvas 转换为 base64
  const base64Url = canvas.toDataURL()

  // 设置水印背景
  watermarkDiv.style.backgroundImage = `url(${base64Url})`
  watermarkDiv.style.backgroundRepeat = 'repeat'

  // 添加到页面
  document.body.appendChild(watermarkDiv)

  // 防止水印被删除（监听 DOM 变化）
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const watermark = document.getElementById('page-watermark')
        if (!watermark) {
          createWatermark(text)
        }
      }
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: false
  })
}

/**
 * 移除页面水印
 */
export const removeWatermark = () => {
  const watermark = document.getElementById('page-watermark')
  if (watermark) {
    watermark.remove()
  }
}

/**
 * 根据用户信息创建水印
 * @param user 用户信息对象
 */
export const createUserWatermark = (user: any) => {
  if (!user) return

  // 获取用户信息，构建水印文本
  const nameParts = (user.name || '用户').split(' ')
  const firstname = nameParts[0] || '用户'
  const lastname = nameParts[1] || ''
  const email = user.email || 'N/A'

  // 格式化当前日期时间为 yyyy-mm-dd hh:ii:ss
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  const watermarkText = `${firstname} ${lastname}, ${email}\n${datetime}`
  createWatermark(watermarkText)
}