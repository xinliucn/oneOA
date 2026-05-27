import type { FetchNewsListOptions, NewsItem, NewsListResponse } from '~/types/news'

const pendingNewsRequests = new Map<string, Promise<NewsItem[]>>()

export const useNewsList = () => {
  const { locale } = useAppI18n()
  const newsList = useState<NewsItem[]>('news:list', () => [])
  const newsLocale = useState<string>('news:list:locale', () => '')
  const loading = useState<boolean>('news:list:loading', () => false)
  const error = useState<Error | null>('news:list:error', () => null)

  const fetchNewsList = async (options: FetchNewsListOptions = {}) => {
    const requestLocale = options.locale || locale.value

    if (newsList.value.length > 0 && newsLocale.value === requestLocale) {
      return newsList.value
    }

    const pendingRequest = pendingNewsRequests.get(requestLocale)
    if (pendingRequest) {
      return pendingRequest
    }

    const request = (async () => {
      try {
        loading.value = true
        error.value = null

        const response = await $fetch<NewsListResponse>('/api/news/newslist', {
          query: {
            locale: requestLocale,
          },
        })

        if (response?.code === 1 && Array.isArray(response.data?.list)) {
          newsList.value = response.data.list
          newsLocale.value = requestLocale
          return newsList.value
        }

        newsList.value = []
        newsLocale.value = requestLocale
        return newsList.value
      }
      catch (err: any) {
        console.error('Failed to fetch news list:', err)
        error.value = err
        throw err
      }
      finally {
        pendingNewsRequests.delete(requestLocale)
        loading.value = false
      }
    })()

    pendingNewsRequests.set(requestLocale, request)
    return request
  }

  const refreshNewsList = async () => {
    newsList.value = []
    return await fetchNewsList()
  }

  const clearNewsList = () => {
    newsList.value = []
    newsLocale.value = ''
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
