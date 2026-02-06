// server/api/auth/callback.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // 获取 URL 参数 (code, state)
  const query = getQuery(event)
  const { code, state } = query

  // 代理请求到 Windmill
  const windmillCallbackUrl = `${apiBase}/api/r/weaver/auth/callback`

  try {
    const response = await $fetch.raw(windmillCallbackUrl, {
      method: 'GET',
      query: { code, state },
      redirect: 'manual',  // 不自动跟随重定向
      headers: {
        // 传递原始请求的 headers（用于 fingerprint）
        'User-Agent': getHeader(event, 'user-agent') || '',
        'X-Forwarded-For': getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || '',
        'Cookie': getHeader(event, 'cookie') || ''
      }
    })

    // 获取 Windmill 返回的 Set-Cookie
    const setCookie = response.headers.get('set-cookie')

    // 设置 Cookie 到浏览器
    if (setCookie) {
      setHeader(event, 'Set-Cookie', setCookie)
    }

    // 获取重定向地址
    const location = response.headers.get('location')

    // 重定向到前端首页
    if (location) {
      return sendRedirect(event, location, 302)
    }

    // 如果没有重定向，返回响应体
    return response._data
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'OAuth 回调失败'
    })
  }
})
