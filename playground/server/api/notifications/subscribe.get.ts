export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  return {
    success: true,
    firebaseVapidKey: config.public.firebaseVapidKey || '',
    webpushVapidPublicKey: config.public.vapidPublicKey || '',
    message: '已返回订阅配置',
  }
})
