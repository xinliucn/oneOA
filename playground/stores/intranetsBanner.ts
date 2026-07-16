import { defineStore } from 'pinia'

type IntranetsBannerItem = {
  id: string
  sort: number
  imageUrl: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const asString = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

const asSortOrder = (value: unknown) => {
  const sortOrder = Number(value)
  return Number.isFinite(sortOrder) ? sortOrder : Number.MAX_SAFE_INTEGER
}

const collectBannerItems = (response: unknown) => {
  if (!isRecord(response) || !isRecord(response.data) || !isRecord(response.data.listHomePageCarousel)) {
    return []
  }

  const listHomePageCarousel = response.data.listHomePageCarousel
  return Array.isArray(listHomePageCarousel.data) ? listHomePageCarousel.data : []
}

const resolveBannerError = (response: unknown) => {
  if (!isRecord(response)) {
    return ''
  }

  const errors = Array.isArray(response.errors) ? response.errors : []
  const rootError = errors.find(isRecord)
  const rootErrorMessage = rootError ? asString(rootError.message) : ''

  if (rootErrorMessage) {
    return rootErrorMessage
  }

  return Number(response.code) === 1 ? '' : asString(response.message)
}

const normalizeBannerItem = (value: unknown): IntranetsBannerItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)

  if (!id) {
    return null
  }

  return {
    id,
    sort: asSortOrder(value.carouselSort),
    imageUrl: asString(value.brandLogo),
  }
}

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Fetch intranets banner failed'
}

export const useIntranetsBannerStore = defineStore('intranetsBanner', () => {
  const bannerItems = ref<IntranetsBannerItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const fetchBanners = async (force = false) => {
    if (!force && loaded.value) {
      return bannerItems.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<unknown>('/api/intranets/banner', {
        method: 'POST',
      })

      bannerItems.value = collectBannerItems(response)
        .map(normalizeBannerItem)
        .filter((item): item is IntranetsBannerItem => !!item)
        .sort((left, right) => left.sort - right.sort)
      error.value = resolveBannerError(response) || null
      loaded.value = true

      return bannerItems.value
    }
    catch (fetchError: unknown) {
      bannerItems.value = []
      error.value = getErrorMessage(fetchError)
      loaded.value = true
      console.error('Fetch intranets banner failed:', fetchError)
      throw fetchError
    }
    finally {
      loading.value = false
    }
  }

  return {
    bannerItems,
    error,
    fetchBanners,
    loaded,
    loading,
  }
})
