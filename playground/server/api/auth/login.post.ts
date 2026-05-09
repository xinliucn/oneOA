import { proxyWindmill } from '../../utils/windmillProxy'

export default defineEventHandler(async (event) => {
  try {
    return await proxyWindmill<{ url: string }>(event, '/api/r/weaver/auth/login', {
      method: 'POST',
      errorMessage: '获取登录 URL 失败',
    })
  }
  catch (error: unknown) {
    console.error('Login API error:', error)
    throw error
  }
})
