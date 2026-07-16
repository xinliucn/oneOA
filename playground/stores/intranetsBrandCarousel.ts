import { defineStore } from 'pinia'

type IntranetsBrandCarouselItem = {
  id: string
  name: string
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

const collectBrandCarouselItems = (response: unknown) => {
  if (!isRecord(response) || !isRecord(response.data) || !isRecord(response.data.listBrandCarousel)) {
    return []
  }

  const listBrandCarousel = response.data.listBrandCarousel
  return Array.isArray(listBrandCarousel.data) ? listBrandCarousel.data : []
}

const resolveBrandCarouselError = (response: unknown) => {
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

const normalizeBrandCarouselItem = (value: unknown): IntranetsBrandCarouselItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)

  if (!id) {
    return null
  }

  return {
    id,
    name: asString(value.brandName),
    sort: asSortOrder(value.carouselSort),
    imageUrl: asString(value.brandLogo),
  }
}

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Fetch intranets brand carousel failed'
}

export const useIntranetsBrandCarouselStore = defineStore('intranetsBrandCarousel', () => {
  const brandCarouselItems = ref<IntranetsBrandCarouselItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const fetchBrandCarousel = async (force = false) => {
    if (!force && loaded.value) {
      return brandCarouselItems.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<unknown>('/api/intranets/brand-carousel', {
        method: 'POST',
      })

      brandCarouselItems.value = collectBrandCarouselItems(response)
        .map(normalizeBrandCarouselItem)
        .filter((item): item is IntranetsBrandCarouselItem => !!item)
        .sort((left, right) => left.sort - right.sort)
      error.value = resolveBrandCarouselError(response) || null
      loaded.value = true

      return brandCarouselItems.value
    }
    catch (fetchError: unknown) {
      brandCarouselItems.value = []
      error.value = getErrorMessage(fetchError)
      loaded.value = true
      console.error('Fetch intranets brand carousel failed:', fetchError)
      throw fetchError
    }
    finally {
      loading.value = false
    }
  }

  return {
    brandCarouselItems,
    error,
    fetchBrandCarousel,
    loaded,
    loading,
  }
})
