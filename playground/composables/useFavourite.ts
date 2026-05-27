export interface FavouriteRecord {
  id: string
  userId: string
  itemidList: number[]
  raw: Record<string, any>
}

export interface FavouriteCatalogItem {
  id: string
  itemId: number
  name: string
  nameEn?: string
  nameSc?: string
  nameTc?: string
  description: string
  icon: string
  homepageUrl: string
  mobileUrl: string
  raw: Record<string, any>
}

type FavouriteResponse = FavouriteRecord[] | { data?: FavouriteRecord[] | any[] } | any[]

const normalizeNumberId = (value: any) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const numberValue = Number(value.trim())
    if (Number.isFinite(numberValue)) {
      return numberValue
    }
  }

  return null
}

const normalizeItemIdList = (value: any): number[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map(normalizeNumberId)
          .filter((itemId): itemId is number => itemId !== null),
      ),
    )
  }

  if (typeof value === 'string') {
    return normalizeItemIdList(value.split(/[,\s/]+/))
  }

  return []
}

const isRecord = (value: any): value is Record<string, any> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const unwrapFavouriteResponse = (response: FavouriteResponse): any[] => {
  if (Array.isArray(response)) {
    return response
  }

  if (isRecord(response) && Array.isArray(response.data)) {
    return response.data
  }

  return []
}

const normalizeFavouriteRecord = (value: any): FavouriteRecord | null => {
  if (!isRecord(value)) {
    return null
  }

  const mainTable = isRecord(value.mainTable) ? value.mainTable : value
  const id = mainTable.id
  const userId = mainTable.userid ?? mainTable.userId

  return {
    id: typeof id === 'string' || typeof id === 'number' ? String(id) : '',
    userId: typeof userId === 'string' || typeof userId === 'number' ? String(userId) : '',
    itemidList: normalizeItemIdList(mainTable.itemidList),
    raw: value,
  }
}

const normalizeFavouriteResponse = (response: FavouriteResponse) => {
  return unwrapFavouriteResponse(response)
    .map(normalizeFavouriteRecord)
    .filter((item): item is FavouriteRecord => Boolean(item))
}

const normalizeString = (value: any) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

const getFirstString = (...values: any[]) => {
  for (const value of values) {
    const normalizedValue = normalizeString(value)
    if (normalizedValue) {
      return normalizedValue
    }
  }

  return ''
}

const normalizeFavouriteCatalogItem = (value: any): FavouriteCatalogItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const mainTable = isRecord(value.mainTable) ? value.mainTable : value

  if (Array.isArray(mainTable.itemidList)) {
    return null
  }

  const itemId = normalizeNumberId(mainTable.id)
  if (itemId === null) {
    return null
  }

  return {
    id: String(itemId),
    itemId,
    name: getFirstString(mainTable.name_en, mainTable.name_sc, mainTable.name_tc, mainTable.name, mainTable.application, `Favourite ${itemId}`),
    nameEn: getFirstString(mainTable.name_en, mainTable.name, mainTable.application),
    nameSc: getFirstString(mainTable.name_sc),
    nameTc: getFirstString(mainTable.name_tc),
    description: getFirstString(mainTable.description_en, mainTable.description, mainTable.description_sc),
    icon: getFirstString(mainTable.iconx64, mainTable.icon),
    homepageUrl: getFirstString(mainTable.homepage_url, mainTable.homepageUrl),
    mobileUrl: getFirstString(mainTable.mobileurl, mainTable.mobileUrl),
    raw: value,
  }
}

const normalizeFavouriteCatalogItems = (response: FavouriteResponse) => {
  return unwrapFavouriteResponse(response)
    .map(normalizeFavouriteCatalogItem)
    .filter((item): item is FavouriteCatalogItem => Boolean(item))
}

export const useFavourite = () => {
  const records = useState<FavouriteRecord[]>('favourite:records', () => [])
  const items = useState<FavouriteCatalogItem[]>('favourite:items', () => [])
  const itemidList = useState<number[]>('favourite:itemid-list', () => [])
  const loading = useState<boolean>('favourite:loading', () => false)
  const saving = useState<boolean>('favourite:saving', () => false)
  const bootstrapped = useState<boolean>('favourite:bootstrapped', () => false)
  const error = useState<Error | null>('favourite:error', () => null)

  const getFavourite = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<FavouriteResponse>('/api/ecologyOa/favourite', {
        method: 'GET',
      })
      const nextRecords = normalizeFavouriteResponse(response)
      const nextItems = normalizeFavouriteCatalogItems(response)

      records.value = nextRecords
      items.value = nextItems
      itemidList.value = nextItems.length > 0
        ? nextItems.map(item => item.itemId)
        : nextRecords[0]?.itemidList || []
      bootstrapped.value = true

      return {
        items: items.value,
        itemidList: itemidList.value,
      }
    }
    catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError : new Error('Get favourites failed')
      records.value = []
      items.value = []
      itemidList.value = []
      throw caughtError
    }
    finally {
      loading.value = false
    }
  }

  const saveFavourite = async (nextItemidList: Array<number | string>) => {
    const normalizedItemidList = normalizeItemIdList(nextItemidList)
    saving.value = true
    error.value = null

    try {
      const response = await $fetch<FavouriteResponse>('/api/ecologyOa/favourite', {
        method: 'POST',
        body: {
          itemidList: normalizedItemidList,
        },
      })
      const nextRecords = normalizeFavouriteResponse(response)
      const nextItems = normalizeFavouriteCatalogItems(response)

      records.value = nextRecords
      if (nextItems.length > 0) {
        items.value = nextItems
      }
      itemidList.value = nextRecords[0]?.itemidList || normalizedItemidList
      bootstrapped.value = true

      return {
        items: items.value,
        itemidList: itemidList.value,
      }
    }
    catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError : new Error('Save favourites failed')
      throw caughtError
    }
    finally {
      saving.value = false
    }
  }

  const bootstrapFavourite = async () => {
    if (bootstrapped.value) {
      return {
        items: items.value,
        itemidList: itemidList.value,
      }
    }

    return getFavourite()
  }

  return {
    records,
    items,
    itemidList,
    loading,
    saving,
    bootstrapped,
    error,
    getFavourite,
    saveFavourite,
    bootstrapFavourite,
  }
}
