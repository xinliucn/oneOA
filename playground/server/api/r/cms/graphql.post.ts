// server/api/r/cms/graphql.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // 构建 CMS GraphQL 端点 URL
  const cmsGraphqlUrl = `${apiBase}/api/r/cms/graphql`

  try {
    // 读取请求体中的 GraphQL query
    const query = await readBody(event)

    // 代理请求到实际的 CMS GraphQL 服务
    const response = await $fetch(cmsGraphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 传递原始请求的 headers
        'Cookie': getHeader(event, 'cookie') || ''
      },
      body: query
    })

    return response
  } catch (error: any) {
    console.error('CMS GraphQL proxy error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'CMS GraphQL 请求失败'
    })
  }
})
