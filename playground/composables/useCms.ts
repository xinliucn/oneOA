// CMS GraphQL 响应类型
export interface CmsResponse<T = any> {
  code?: number
  data?: T
  message?: string
}

export const useCms = () => {
  // 使用 useState 缓存状态
  const loading = useState<boolean>('cms:loading', () => false)
  const error = useState<Error | null>('cms:error', () => null)

  // 调用 CMS GraphQL 接口
  const getCmsdata = async <T = any>(query: any): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<T>('/api/r/cms/graphql', {
        method: 'POST',
        body: query
      })

      return response
    } catch (err: any) {
      console.error('CMS GraphQL request failed:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getCmsdata
  }
}
