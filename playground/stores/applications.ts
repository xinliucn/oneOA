import { defineStore } from 'pinia'
import { APPLICATION_BUSINESS_FILTER } from '~/composables/useApplicationCatalog'
import type {
  ApplicationCatalogEntry,
  ApplicationCatalogFilters,
  ApplicationPrimaryTabKey,
  SelectedBusinessSummary,
} from '~/types/applicationCatalog'

const catalogFiltersByTab: Record<ApplicationPrimaryTabKey, ApplicationCatalogFilters> = {
  business: APPLICATION_BUSINESS_FILTER,
  application: { type: 'Application' },
}

const createTabRecord = <T>(value: T): Record<ApplicationPrimaryTabKey, T> => ({
  application: value,
  business: value,
})

export const useApplicationsStore = defineStore('applications', () => {
  const { requestApplicationCatalogData } = useApplicationCatalog()
  const activePrimaryTab = ref<ApplicationPrimaryTabKey>('application')
  const selectedBusiness = ref<SelectedBusinessSummary | null>(null)
  const catalogByTab = reactive<Record<ApplicationPrimaryTabKey, ApplicationCatalogEntry[]>>({
    application: [],
    business: [],
  })
  const loadingByTab = reactive(createTabRecord(false))
  const loadedByTab = reactive(createTabRecord(false))
  const requestVersionByTab = reactive(createTabRecord(0))
  const activeCatalogEntries = computed(() => catalogByTab[activePrimaryTab.value])
  const activeLoading = computed(() => loadingByTab[activePrimaryTab.value])

  const getCatalogFilters = (tabKey: ApplicationPrimaryTabKey): ApplicationCatalogFilters => ({
    ...catalogFiltersByTab[tabKey],
  })

  const fetchCatalogByFilters = async (filters: ApplicationCatalogFilters = {}) => {
    return await requestApplicationCatalogData(filters) as ApplicationCatalogEntry[]
  }

  const fetchTabCatalog = async (tabKey = activePrimaryTab.value, force = false) => {
    if (!force && loadedByTab[tabKey]) {
      return catalogByTab[tabKey]
    }

    const currentRequestVersion = requestVersionByTab[tabKey] + 1
    requestVersionByTab[tabKey] = currentRequestVersion
    loadingByTab[tabKey] = true

    try {
      const nextCatalog = await fetchCatalogByFilters(getCatalogFilters(tabKey))

      if (currentRequestVersion === requestVersionByTab[tabKey]) {
        catalogByTab[tabKey] = nextCatalog
        loadedByTab[tabKey] = true
      }
    }
    catch (error) {
      console.error('Fetch application catalog failed:', error)
      if (currentRequestVersion === requestVersionByTab[tabKey]) {
        catalogByTab[tabKey] = []
        loadedByTab[tabKey] = true
      }
    }
    finally {
      if (currentRequestVersion === requestVersionByTab[tabKey]) {
        loadingByTab[tabKey] = false
      }
    }

    return catalogByTab[tabKey]
  }

  const selectPrimaryTab = async (tabKey: ApplicationPrimaryTabKey) => {
    activePrimaryTab.value = tabKey
    return await fetchTabCatalog(tabKey)
  }

  const setSelectedBusiness = (business: SelectedBusinessSummary | null) => {
    selectedBusiness.value = business
  }

  return {
    activeCatalogEntries,
    activeLoading,
    activePrimaryTab,
    catalogByTab,
    fetchCatalogByFilters,
    fetchTabCatalog,
    loadedByTab,
    loadingByTab,
    selectPrimaryTab,
    selectedBusiness,
    setSelectedBusiness,
  }
})
