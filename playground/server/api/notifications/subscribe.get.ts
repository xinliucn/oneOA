export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const vapidPublicKey = config.public.vapidPublicKey || ''

  return {
    success: true,
    vapidPublicKey,
    message: '已返回订阅配置',
  }
})
