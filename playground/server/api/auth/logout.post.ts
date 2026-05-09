import { proxyWindmill } from '../../utils/windmillProxy'

export default defineEventHandler(async (event) => {
  try {
    return await proxyWindmill(event, '/api/r/weaver/auth/logout', {
      method: 'POST',
      errorMessage: '登出失败',
    })
  }
  catch (error: unknown) {
    console.error('Logout API error:', error)
    throw error
  }
})
