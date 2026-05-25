<template>
  <div class="company-docs">
    <div
      v-if="approvedToast"
      class="company-docs__toast"
    >
      <span class="company-docs__toast-icon">
        <IconCustom
          name="check"
          :size="18"
          color="#ffffff"
        />
      </span>
      <span>{{ approvedToast }}</span>
    </div>

    <section
      class="company-docs__hero"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <h1>{{ t('pages.companyDocuments.title') }}</h1>
    </section>

    <main class="company-docs__body">
      <nav
        class="company-docs__breadcrumb"
        :aria-label="t('common.breadcrumb')"
      >
        <NuxtLink to="/desktop">
          {{ t('common.home') }}
        </NuxtLink>
        <span>&gt;</span>
        <span>{{ t('pages.companyDocuments.title') }}</span>
      </nav>

      <div class="company-docs__toolbar">
        <label class="company-docs__search">
          <IconCustom
            name="search"
            :size="14"
          />
          <input
            v-model.trim="searchQuery"
            type="search"
            :placeholder="t('pages.companyDocuments.searchPlaceholder')"
          >
        </label>

        <div
          class="company-docs__filters"
          :aria-label="t('pages.companyDocuments.fields.acknowledgedStatus')"
        >
          <button
            v-for="filter in filters"
            :key="filter.key"
            type="button"
            :class="['company-docs__filter', { 'is-active': activeFilter === filter.key }]"
            @click="handleFilterClick(filter.key)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="company-docs-table">
        <div class="company-docs-table__row company-docs-table__row--head">
          <button type="button">
            {{ t('pages.companyDocuments.fields.folderTitle') }}
          </button>
          <button type="button">
            {{ t('pages.companyDocuments.fields.folderDescription') }}
          </button>
          <button type="button">
            {{ t('pages.companyDocuments.articleCount') }}
          </button>
        </div>

        <div
          v-if="loading"
          class="company-docs-table__state"
        >
          {{ t('pages.companyDocuments.states.loading') }}
        </div>
        <div
          v-else-if="error"
          class="company-docs-table__state company-docs-table__state--error"
        >
          {{ t('pages.companyDocuments.states.loadError') }}
        </div>
        <div
          v-else-if="paginatedFolders.length === 0"
          class="company-docs-table__state"
        >
          {{ t('pages.companyDocuments.states.empty') }}
        </div>
        <template v-else>
          <div
            v-for="folder in paginatedFolders"
            :key="folder.slug"
            class="company-docs-table__row"
          >
            <NuxtLink
              class="company-docs-table__link"
              :to="{
                path: `/desktop/company-documents/${encodeURIComponent(folder.folderbaseid)}`,
                query: {
                  folderbaseid: folder.folderbaseid,
                  title: folder.title,
                },
              }"
            >
              {{ folder.title }}
            </NuxtLink>
            <span>{{ folder.description }}</span>
            <span>{{ folder.articles }}</span>
          </div>
        </template>
      </div>

      <div class="company-docs__footer-row">
        <span class="company-docs__record-count">
          {{ recordCountLabel }}
        </span>

        <div
          class="company-docs__pagination"
          aria-label="Pagination"
        >
          <button
            type="button"
            class="company-docs__page-nav"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <IconCustom
              name="chevron-right"
              :size="16"
              :rotate="180"
            />
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            class="company-docs__page"
            :class="{ 'is-active': currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="company-docs__page-nav"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <IconCustom
              name="chevron-right"
              :size="16"
            />
          </button>
        </div>
      </div>
    </main>

    <footer class="company-docs__copyright">
      {{ t('common.copyright', { year: 2026 }) }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import heroImage from '~/assets/images/Rectangle 2.png'
import type { CompanyDocumentFolder, CompanyDocumentGroupResponseItem, CompanyDocumentStatus, DocumentCategoryStatusFilter, DocumentCategoryTabKey } from '~/types/documentManagement'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

type DocumentFilter = 'All' | 'Acknowledged' | 'Not Yet Acknowledged'

const route = useRoute()
const { t } = useAppI18n()
const documentStore = useDocumentManagementStore()
const activeFilter = ref<DocumentFilter>('All')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 15
const pageLoading = ref(false)
const pageError = ref<Error | null>(null)
const approvedToast = ref('')
let approvedToastTimer: ReturnType<typeof setTimeout> | null = null
const filters = computed<Array<{ key: DocumentFilter, label: string }>>(() => [
  { key: 'All', label: t('pages.companyDocuments.filters.all') },
  { key: 'Acknowledged', label: t('pages.companyDocuments.filters.acknowledged') },
  { key: 'Not Yet Acknowledged', label: t('pages.companyDocuments.filters.notAcknowledged') },
])

const filterTabByFilter: Record<DocumentFilter, DocumentCategoryTabKey> = {
  'All': 'all',
  'Acknowledged': 'acknowledged',
  'Not Yet Acknowledged': 'notAcknowledged',
}
const filterStatusByFilter: Record<DocumentFilter, DocumentCategoryStatusFilter> = {
  'All': '',
  'Acknowledged': 'Acknowledged',
  'Not Yet Acknowledged': 'NotYetAcknowledged',
}

const activeTabKey = computed<DocumentCategoryTabKey>(() => filterTabByFilter[activeFilter.value])

const { pending: initialLoading, error: categoryError } = await useAsyncData('desktop-document-categories', () => {
  return documentStore.fetchCategoryTabs({
    page: 1,
    pageSize: 20,
    matchingKeyword: '',
  })
})

const loading = computed(() => {
  return initialLoading.value || pageLoading.value || documentStore.categoryLoadingByTab[activeTabKey.value]
})

const error = computed(() => categoryError.value || pageError.value)

const getNumber = (value: any) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

const getStatus = (item: CompanyDocumentGroupResponseItem): CompanyDocumentStatus | undefined => {
  const rawStatus = item.status || item.readstatus || item.readstatus_display || ''

  if (rawStatus === 'Acknowledged' || rawStatus === '已签署') {
    return 'Acknowledged'
  }

  if (rawStatus === 'Not Acknowledged' || rawStatus === '未签署') {
    return 'Not Acknowledged'
  }

  if (item.acknowledgedate || item.acknowledgedate_display) {
    return 'Acknowledged'
  }
}

const folders = computed<CompanyDocumentFolder[]>(() => {
  return documentStore.categoriesByTab[activeTabKey.value].map((item) => {
    const title = item.FolderTitle || ''
    const slug = String(item.id || item.osid || title)

    return {
      slug,
      folderbaseid: String(item.osid || item.id || title),
      title,
      description: item.FolderDescription || title,
      articles: getNumber(item.count),
      acknowledgedCount: getNumber(item.acknowledgedCount),
      notAcknowledgedCount: getNumber(item.notAcknowledgedCount),
      status: getStatus(item),
    }
  })
})

const filteredFolders = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) {
    return folders.value
  }

  return folders.value.filter(folder =>
    [folder.title, folder.description].some(value => value.toLowerCase().includes(keyword)),
  )
})

const totalRecords = computed(() => {
  if (searchQuery.value.trim()) {
    return filteredFolders.value.length
  }

  return documentStore.categoryPaginationByTab[activeTabKey.value].total || filteredFolders.value.length
})
const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize)))

const paginatedFolders = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize

  return filteredFolders.value.slice(startIndex, startIndex + pageSize)
})

const visiblePages = computed(() => {
  const visibleCount = Math.min(3, totalPages.value)
  const maxStart = Math.max(1, totalPages.value - visibleCount + 1)
  const start = Math.min(Math.max(1, currentPage.value - 1), maxStart)

  return Array.from({ length: visibleCount }, (_, index) => start + index)
})

const recordCountLabel = computed(() => {
  if (totalRecords.value === 0) {
    return t('pages.companyDocuments.zeroRecords')
  }

  const startRecord = (currentPage.value - 1) * pageSize + 1
  const endRecord = Math.min(currentPage.value * pageSize, totalRecords.value)

  return t('pages.companyDocuments.recordCount', {
    start: startRecord,
    end: endRecord,
    total: totalRecords.value,
  })
})

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

const handleFilterClick = async (filter: DocumentFilter) => {
  activeFilter.value = filter
  pageLoading.value = true
  pageError.value = null

  try {
    await documentStore.fetchCategories({
      page: 1,
      pageSize: 20,
      matchingKeyword: '',
      status: filterStatusByFilter[filter],
    })
  }
  catch (caughtError) {
    pageError.value = caughtError instanceof Error ? caughtError : new Error('Fetch company documents failed')
  }
  finally {
    pageLoading.value = false
  }
}

const ensureCurrentPageLoaded = async () => {
  if (searchQuery.value.trim()) {
    return
  }

  const requiredCount = Math.min(currentPage.value * pageSize, totalRecords.value)

  if (requiredCount <= folders.value.length) {
    return
  }

  pageLoading.value = true
  pageError.value = null
  try {
    while (
      folders.value.length < requiredCount
      && documentStore.hasMoreCategories(activeTabKey.value)
    ) {
      await documentStore.fetchNextCategoryPage(activeTabKey.value)
    }
  }
  catch (caughtError) {
    pageError.value = caughtError instanceof Error ? caughtError : new Error('Fetch company documents failed')
  }
  finally {
    pageLoading.value = false
  }
}

const showApprovedToast = () => {
  const approvedTitle = String(route.query.approvedTitle || '')

  if (!approvedTitle) {
    return
  }

  approvedToast.value = `${approvedTitle} ${t('pages.companyDocuments.messages.approved')}`
  approvedToastTimer = setTimeout(() => {
    approvedToast.value = ''
    approvedToastTimer = null
  }, 3000)

  const nextQuery = { ...route.query }
  delete nextQuery.approvedTitle
  void navigateTo({
    path: route.path,
    query: nextQuery,
    replace: true,
  })
}

watch([activeFilter, searchQuery], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

watch([activeTabKey, currentPage], () => {
  void ensureCurrentPageLoaded()
})

onMounted(() => {
  showApprovedToast()
})

onBeforeUnmount(() => {
  if (approvedToastTimer) {
    clearTimeout(approvedToastTimer)
  }
})
</script>

<style scoped>
.company-docs {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.company-docs__toast {
  position: fixed;
  top: 78px;
  right: 18px;
  z-index: 30;
  min-width: 176px;
  min-height: 49px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 10px;
  border: 1px solid #24a447;
  border-radius: 8px;
  background: #d9f2dd;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.16);
  color: #118a2c;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
}

.company-docs__toast-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #00820f;
}

.company-docs__hero {
  min-height: 320px;
  display: flex;
  align-items: center;
  padding: 0 110px;
  background-size: cover;
  background-position: center;
}

.company-docs__hero h1 {
  margin: 0;
  color: #ffffff;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 700;
}

.company-docs__body {
  flex: 1;
  padding: 0 110px 62px;
}

.company-docs__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 -110px 58px;
  padding: 22px 110px;
  border-bottom: 1px solid #d9d9d9;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  background: #F9F9F9;
}

.company-docs__breadcrumb a {
  color: inherit;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0%;
  text-underline-offset: 0%;
  text-decoration-skip-ink: auto;
}

.company-docs__breadcrumb span {
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.company-docs__breadcrumb span:last-child {
  font-weight: 700;
}

.company-docs__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 52px;
}

.company-docs__search {
  width: 324px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-radius: 5px;
  background: #f5f5f5;
  color: #777777;
}

.company-docs__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #333333;
  height: 100%;
}

.company-docs__search input::placeholder {
  color: #A3AAB2;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;

}

.company-docs__filters {
  display: flex;
  gap: 7px;
}

.company-docs__filter {
  min-height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  padding: 0 12px;
  background: #ffffff;
  color: #616161;
  line-height: 1;
  cursor: pointer;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

}

.company-docs__filter.is-active {
  border-color: #a60a3a;
  background: #a60a3a;
  color: #ffffff;
}

.company-docs-table {
  width: 100%;
  font-family: var(--font-source-sans-pro);
}

.company-docs-table__row {
  display: grid;
  grid-template-columns: 1.25fr 1.25fr 0.55fr;
  align-items: center;
  min-height: 40px;
  padding: 0 24px;
  column-gap: 18px;
  color: #000000;
  font-size: 12px;
  line-height: 100%;
  font-weight: 400;
  letter-spacing: 0;
}

.company-docs-table__row:nth-child(odd):not(.company-docs-table__row--head) {
  background: #f7f7f7;
  border-radius: 8px;
}

.company-docs-table__row--head {
  min-height: 34px;
  padding-bottom: 8px;
  font-weight: 700;
  border-bottom: 1px solid #d9d9d9;
}

.company-docs-table__row--head button {
  justify-self: start;
  border: 0;
  padding: 0;
  background: transparent;
  color: #000000;
  font: inherit;
}

.company-docs-table__row--head button::after {
  content: "↕";
  margin-left: 4px;
  color: #000000;
  font-size: 13px;
}

.company-docs-table__state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
}

.company-docs-table__state--error {
  color: #a60a3a;
}

.company-docs-table__link {
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0;
  text-underline-offset: 2px;
  text-decoration-skip-ink: auto;
}

.company-docs-table__row > span {
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.company-docs__footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 30px;
}

.company-docs__record-count {
  color: #555555;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
}

.company-docs__pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-docs__page,
.company-docs__page-nav {
  width: 39px;
  height: 39px;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  line-height: 100%;
}

.company-docs__page-nav {
  background: #f8dbe6;
  color: #a60a3a;
}

.company-docs__page:disabled,
.company-docs__page-nav:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.company-docs__page.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.company-docs__copyright {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-size: 10px;
  line-height: 1.2;
}
</style>
