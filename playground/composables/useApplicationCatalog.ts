export interface ApplicationCatalogItem {
  id: string
  name: string
  type: string
  regions: string[]
  business: string
  homepageUrl: string
  mobileUrl: string
  description: string
  icon: string
  raw: Record<string, any>,
  mainTable: any
}
export interface ApplicationCatalogGroup {
  id: string
  title: string
  items: ApplicationCatalogItem[]
}

export interface ApplicationBusiness {
  id: string
  slug: string
  name: string
  icon: string
  color: string
  description: string
  intranetLabel: string
  regions: string[]
  groups: ApplicationCatalogGroup[]
  items: ApplicationCatalogItem[]
}

export interface ApplicationCatalogFilters {
  business?: string
  type?: string | string[]
  tag?: string
}

export const APPLICATION_BUSINESS_FILTER: ApplicationCatalogFilters = {
  type: 'Business',
}

const buildApplicationCatalogPayload = (filters: ApplicationCatalogFilters = {}) => ({
  ...(filters.business ? { business: filters.business } : {}),
  ...(filters.type ? { type: filters.type } : {}),
  ...(filters.tag ? { tag: filters.tag } : {}),
})

const normalizeString = (value?: string | null) => {
  return typeof value === 'string' ? value.trim() : ''
}

const uniq = <T>(items: T[]) => {
  return Array.from(new Set(items))
}

const applicationIconModules = import.meta.glob('~/assets/images/applications/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const applicationIconMap = Object.fromEntries(
  Object.entries(applicationIconModules).map(([path, resolvedUrl]) => [
    path.split('/').pop() || '',
    resolvedUrl,
  ]),
)

const normalizeApplicationIconPath = (iconx64?: string | null) => {
  const iconName = normalizeString(iconx64)
  if (!iconName) {
    return ''
  }

  if (/^(https?:)?\/\//.test(iconName) || iconName.startsWith('/')) {
    return iconName
  }

  return applicationIconMap[iconName] || iconName
}

const slugify = (value: string) => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const buildBusinessMeta = (business: string) => {
  const normalizedBusiness = normalizeString(business)
  const lowerBusiness = normalizedBusiness.toLowerCase()

  if (lowerBusiness.includes('digital') || lowerBusiness.includes('technology') || lowerBusiness.includes('it')) {
    return {
      slug: 'digital-technology',
      name: 'Digital & Technology',
      icon: 'digital-technology',
      color: '#3C8AFF',
    }
  }

  if (lowerBusiness.includes('finance')) {
    return {
      slug: 'finance',
      name: 'Finance',
      icon: 'finance-bars',
      color: '#009A88',
    }
  }

  if (lowerBusiness.includes('legal') || lowerBusiness.includes('compliance')) {
    return {
      slug: 'legal-compliance',
      name: 'Legal & Compliance',
      icon: 'legal-compliance',
      color: '#D7008F',
    }
  }

  if (lowerBusiness.includes('human resources') || lowerBusiness.includes('hr')) {
    return {
      slug: 'human-resources',
      name: 'Human Resources',
      icon: 'personnel',
      color: '#A60A3A',
    }
  }

  if (lowerBusiness.includes('china')) {
    return {
      slug: 'china-business',
      name: 'China Business',
      icon: 'building',
      color: '#C77800',
    }
  }

  if (normalizedBusiness) {
    return {
      slug: slugify(normalizedBusiness),
      name: normalizedBusiness.replace(/^group\s+/i, ''),
      icon: 'apps',
      color: '#A60A3A',
    }
  }

  return {
    slug: 'others',
    name: 'Others',
    icon: 'apps',
    color: '#A60A3A',
  }
}

const groupCatalogByBusiness = (catalog: ApplicationCatalogItem[]): ApplicationBusiness[] => {
  const businessMap = new Map<string, ApplicationCatalogItem[]>()

  for (const item of catalog) {
    const business = item.business || 'Others'
    const currentItems = businessMap.get(business) || []
    businessMap.set(business, [...currentItems, item])
  }

  return Array.from(businessMap.entries()).map(([business, items]) => {
    const meta = buildBusinessMeta(business)
    const groupMap = new Map<string, ApplicationCatalogItem[]>()

    for (const item of items) {
      const groupTitle = item.type || 'Applications'
      const currentItems = groupMap.get(groupTitle) || []
      groupMap.set(groupTitle, [...currentItems, item])
    }

    return {
      id: meta.slug,
      slug: meta.slug,
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      description: items.find(item => item.description)?.description || '',
      intranetLabel: `${meta.name} Intranet`,
      regions: uniq(items.flatMap(item => item.regions)),
      groups: Array.from(groupMap.entries()).map(([title, groupItems]) => ({
        id: slugify(title) || 'applications',
        title,
        items: groupItems,
      })),
      items,
    }
  })
}

export const useApplicationCatalog = () => {
  const catalog = useState<ApplicationCatalogItem[]>('applications:catalog', () => [])
  const loading = useState<boolean>('applications:catalog:loading', () => false)
  const syncing = useState<boolean>('applications:catalog:syncing', () => false)
  const bootstrapped = useState<boolean>('applications:catalog:bootstrapped', () => false)
  const form = useState<any>('applications:catalog:form', () => null)
  const requestVersion = useState<number>('applications:catalog:requestVersion', () => 0)
  const businesses = computed(() => groupCatalogByBusiness(catalog.value))

  const requestApplicationCatalogData = async (filters: ApplicationCatalogFilters = {}) => {
    const response = await $fetch<any[] | { data?: any[] }>('/api/applications/catlog', {
      method: 'POST',
      body: buildApplicationCatalogPayload(filters),
    })
    const responseData = Array.isArray(response) ? response : response?.data

    return (responseData || []).map((item) => ({
      ...item,
      mainTable: {
        ...item?.mainTable,
        iconx64: normalizeApplicationIconPath(item?.mainTable?.iconx64),
      },
    }))
  }

  const refreshFromServer = async (filters: ApplicationCatalogFilters = {}) => {
    const currentRequestVersion = requestVersion.value + 1
    requestVersion.value = currentRequestVersion
    syncing.value = true
    loading.value = true

    try {
      const nextCatalog = await requestApplicationCatalogData(filters)

      if (currentRequestVersion === requestVersion.value) {
        catalog.value = nextCatalog
      }
    } catch (error) {
      console.error('Fetch application catalog failed:', error)
      if (currentRequestVersion === requestVersion.value) {
        catalog.value = []
      }
    } finally {
      if (currentRequestVersion === requestVersion.value) {
        loading.value = false
        syncing.value = false
      }
    }

    return catalog.value
  }

  const bootstrap = async () => {
    if (bootstrapped.value && catalog.value.length > 0) {
      return catalog.value
    }

    const data = await refreshFromServer()
    bootstrapped.value = true
    return data
  }
  const getApplicationCatalogData = async (filters: ApplicationCatalogFilters = {}) => {
    return refreshFromServer({
      'business': filters.business,
      'type': filters.type,
      'tag': filters.tag,
    })
  }

  const getApplicationById = (id: string) => {
    return catalog.value.find(item => item.id === id) || null
  }

  const getApplicationsByBusiness = (business: string) => {
    const targetBusiness = normalizeString(business).toLowerCase()
    if (!targetBusiness) {
      return []
    }

    return catalog.value.filter(item => item.business.toLowerCase() === targetBusiness)
  }

  const getBusinessBySlug = (slug: string) => {
    return businesses.value.find(item => item.slug === slug) || null
  }

  const getFormData = async (id: string) => {
    try {
      const response = await $fetch<any>('/api/todo/form', {
        method: 'POST',
        body: {
          requestid: id,
        },
      })

      form.value = response?.data ?? response

    } catch (error) {
      console.error('Fetch application catalog failed:', error)
      form.value = null
    }
  }

  return {
    catalog,
    businesses,
    loading,
    syncing,
    bootstrapped,
    form,
    bootstrap,
    requestApplicationCatalogData,
    refreshFromServer,
    getApplicationCatalogData,
    getApplicationById,
    getApplicationsByBusiness,
    getBusinessBySlug,
    getFormData,
  }
}
