export interface NewsItem {
  id: number
  title: string
  date: string
  image: string
  category?: string
}

interface NewsListResponse {
  code: number
  data?: {
    list?: NewsItem[]
  }
}

export const useNewsList = () => {
  const newsList = useState<NewsItem[]>('news:list', () => [])
  const loading = useState<boolean>('news:list:loading', () => false)
  const error = useState<Error | null>('news:list:error', () => null)

  const fetchNewsList = async () => {
    if (newsList.value.length > 0) {
      return newsList.value
    }

    try {
      loading.value = true
      error.value = null

      const response = await $fetch<NewsListResponse>('/api/news/newslist')

      if (response?.code === 1 && Array.isArray(response.data?.list)) {
        newsList.value = response.data.list
        return newsList.value
      }

      newsList.value = []
      return newsList.value
    }
    catch (err: any) {
      console.error('Failed to fetch news list:', err)
      error.value = err
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const refreshNewsList = async () => {
    newsList.value = []
    return await fetchNewsList()
  }

  const clearNewsList = () => {
    newsList.value = []
    error.value = null
  }

  return {
    newsList,
    loading,
    error,
    fetchNewsList,
    refreshNewsList,
    clearNewsList,
  }
}
