import { defineStore } from 'pinia'
import type {
  CompanyDocumentCategoriesResponse,
  CompanyDocumentDetailResponseItem,
  CompanyDocumentGroupResponseItem,
  DocumentCategoryPagination,
  DocumentCategoryStatusFilter,
  DocumentCategoryTabKey,
  FetchCompanyDocumentListOptions,
  FetchDocumentCategoriesOptions,
} from '~/types/documentManagement'

const categoryStatusByTab: Record<DocumentCategoryTabKey, DocumentCategoryStatusFilter> = {
  all: '',
  acknowledged: 'Acknowledged',
  notAcknowledged: 'NotYetAcknowledged',
}

const getCategoryTabKey = (status: DocumentCategoryStatusFilter = ''): DocumentCategoryTabKey => {
  if (status === 'Acknowledged') {
    return 'acknowledged'
  }

  if (status === 'NotYetAcknowledged') {
    return 'notAcknowledged'
  }

  return 'all'
}

const createPagination = (): DocumentCategoryPagination => ({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 1,
})

export const useDocumentManagementStore = defineStore('documentManagement', () => {
  const documentsList = ref<CompanyDocumentDetailResponseItem[]>([])
  const categoriesByTab = reactive<Record<DocumentCategoryTabKey, CompanyDocumentGroupResponseItem[]>>({
    all: [],
    acknowledged: [],
    notAcknowledged: [],
  })
  const categoryPaginationByTab = reactive<Record<DocumentCategoryTabKey, DocumentCategoryPagination>>({
    all: createPagination(),
    acknowledged: createPagination(),
    notAcknowledged: createPagination(),
  })
  const categoryLoadingByTab = reactive<Record<DocumentCategoryTabKey, boolean>>({
    all: false,
    acknowledged: false,
    notAcknowledged: false,
  })
  const categories = computed(() => categoriesByTab.all)
  const categoryCounts = computed<Record<DocumentCategoryTabKey, number>>(() => ({
    all: categoryPaginationByTab.all.total,
    acknowledged: categoryPaginationByTab.acknowledged.total,
    notAcknowledged: categoryPaginationByTab.notAcknowledged.total,
  }))

  const hasMoreCategories = (tabKey: DocumentCategoryTabKey) => {
    const pagination = categoryPaginationByTab[tabKey]

    return pagination.page < pagination.totalPages
      && categoriesByTab[tabKey].length < pagination.total
  }

  const fetchCategories = async (options: FetchDocumentCategoriesOptions = {}) => {
    const status = options.status ?? ''
    const tabKey = getCategoryTabKey(status)
    const response = await $fetch<CompanyDocumentCategoriesResponse>('/api/documentManagement/categories', {
      method: 'POST',
      body: {
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 20,
        matchingKeyword: options.matchingKeyword ?? '',
        status,
      },
    })

    categoriesByTab[tabKey] = options.append
      ? [...categoriesByTab[tabKey], ...response.data]
      : response.data
    categoryPaginationByTab[tabKey] = {
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
      totalPages: response.totalPages,
    }
    return response
  }

  const fetchNextCategoryPage = async (tabKey: DocumentCategoryTabKey) => {
    if (categoryLoadingByTab[tabKey] || !hasMoreCategories(tabKey)) {
      return
    }

    categoryLoadingByTab[tabKey] = true

    try {
      const pagination = categoryPaginationByTab[tabKey]

      return await fetchCategories({
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        matchingKeyword: '',
        status: categoryStatusByTab[tabKey],
        append: true,
      })
    }
    finally {
      categoryLoadingByTab[tabKey] = false
    }
  }

  const fetchDocumentList = async (options: FetchCompanyDocumentListOptions) => {
    const pageNo = options.pageNo ?? 1
    const pageSize = options.pageSize ?? 10
    const response = await $fetch<CompanyDocumentDetailResponseItem[]>('/api/documentManagement/list', {
      method: 'POST',
      body: {
        folderbaseid: options.folderbaseid,
        pageNo,
        pageSize,
      },
    })
    documentsList.value = response

    return response
  }

  const fetchCategoryTabs = async (options: Omit<FetchDocumentCategoriesOptions, 'status'> = {}) => {
    return await Promise.all(
      (Object.values(categoryStatusByTab) as DocumentCategoryStatusFilter[]).map(status =>
        fetchCategories({
          ...options,
          status,
        }),
      ),
    )
  }

  return {
    categories,
    categoriesByTab,
    categoryCounts,
    categoryLoadingByTab,
    categoryPaginationByTab,
    documentsList,
    fetchCategories,
    fetchCategoryTabs,
    fetchDocumentList,
    fetchNextCategoryPage,
    hasMoreCategories,
  }
})
