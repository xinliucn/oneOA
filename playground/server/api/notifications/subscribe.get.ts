export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  // 前端订阅前会先拉取 VAPID 公钥，用于创建浏览器 Push Subscription
  const vapidPublicKey = config.public.vapidPublicKey || ''
  return {
    success: true,
    vapidPublicKey,
    message: '已返回订阅配置',
  }
})
