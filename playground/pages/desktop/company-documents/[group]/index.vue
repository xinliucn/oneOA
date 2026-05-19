<template>
  <div class="company-docs-detail">
    <header class="company-docs-detail__header">
      <nav
        class="company-docs-detail__breadcrumb"
        aria-label="Breadcrumb"
      >
        <NuxtLink to="/desktop">
          Home
        </NuxtLink>
        <span>&gt;</span>
        <NuxtLink to="/desktop/company-documents">
          Company Documents
        </NuxtLink>
        <span>&gt;</span>
        <span>{{ groupTitle }}</span>
      </nav>

      <h1>{{ groupTitle }}</h1>
    </header>

    <main class="company-docs-detail__body">
      <div class="company-docs-detail__toolbar">
        <label class="company-docs-detail__search">
          <IconCustom
            name="search"
            :size="14"
          />
          <input
            v-model.trim="searchQuery"
            type="search"
            placeholder="Search Document Information"
          >
        </label>
      </div>

      <div class="company-docs-detail-table">
        <div class="company-docs-detail-table__row company-docs-detail-table__row--head">
          <button type="button">
            {{ t('pages.companyDocuments.fields.numberVersion') }}
          </button>
          <button type="button">
            {{ t('pages.companyDocuments.fields.ePolicyName') }}
          </button>
          <button type="button">
            {{ t('pages.companyDocuments.fields.publishedDate') }}
          </button>
          <button type="button">
            {{ t('pages.companyDocuments.fields.acknowledgedStatus') }}
          </button>
        </div>

        <div
          v-if="loading"
          class="company-docs-detail-table__state"
        >
          Loading...
        </div>
        <div
          v-else-if="error"
          class="company-docs-detail-table__state company-docs-detail-table__state--error"
        >
          Failed to load document information.
        </div>
        <div
          v-else-if="filteredDocuments.length === 0"
          class="company-docs-detail-table__state"
        >
          No documents found.
        </div>
        <template v-else>
          <div
            v-for="(document, index) in filteredDocuments"
            :key="document.slug"
            :class="['company-docs-detail-table__row', { 'is-striped': index % 2 === 0 }]"
          >
            <NuxtLink
              class="company-docs-detail-table__link"
              :to="getDocumentRoute(document)"
              @click="selectedDocumentDetail = document.raw"
            >
              {{ document.numberVersion }}
            </NuxtLink>
            <NuxtLink
              class="company-docs-detail-table__link"
              :to="getDocumentRoute(document)"
              @click="selectedDocumentDetail = document.raw"
            >
              {{ document.title }}
            </NuxtLink>
            <span>{{ document.publishedDate }}</span>
            <span :class="['company-docs-detail-table__status', { 'is-pending': document.status === 'Not Acknowledged' }]">
              {{ document.status }}
            </span>
          </div>
        </template>
      </div>

      <div class="company-docs-detail__footer-row">
        <span class="company-docs-detail__record-count">
          {{ recordCountLabel }}
        </span>
      </div>
    </main>

    <footer class="company-docs-detail__copyright">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CompanyDocumentDetailResponseItem, CompanyDocumentItem, CompanyDocumentStatus } from '~/types/documentManagement'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const route = useRoute()
const { t } = useAppI18n()
const documentStore = useDocumentManagementStore()
const groupSlug = computed(() => String(route.params.group || ''))
const folderbaseid = computed(() => groupSlug.value)
const groupTitle = computed(() => String(route.query.title || 'Company Documents'))
const searchQuery = ref('')
const loading = ref(true)
const error = ref<Error | null>(null)
const selectedDocumentDetail = useState<CompanyDocumentDetailResponseItem | null>('company-document:selected-detail', () => null)

const getStatus = (item: CompanyDocumentDetailResponseItem): CompanyDocumentStatus => {
  const readstatus = item.mainTable?.readstatus || ''

  if (readstatus === '已签署' || readstatus === 'Acknowledged' || item.mainTable?.acknowledgedate_display) {
    return 'Acknowledged'
  }

  return 'Not Acknowledged'
}

const getDocumentCodeAndVersion = (numberVersion?: string) => {
  const value = numberVersion || ''
  const bracketStart = value.lastIndexOf('[')
  const hasVersionSuffix = bracketStart > -1 && value.endsWith(']')

  return {
    code: hasVersionSuffix ? value.slice(0, bracketStart) : value,
    version: hasVersionSuffix ? value.slice(bracketStart) : '',
  }
}

const formatSummaryDate = (date?: string) => {
  return date?.split(' ')[0] || ''
}

const documents = computed<CompanyDocumentItem[]>(() => {
  return documentStore.documentsList.map((item) => {
    const mainTable = item.mainTable || {}
    const numberVersion = mainTable.Number_Version || ''
    const { code, version } = getDocumentCodeAndVersion(numberVersion)
    const title = mainTable.RequestName || code || String(mainTable.id || '')

    return {
      slug: String(mainTable.id || title),
      title,
      code,
      version,
      numberVersion: numberVersion || code || title,
      publishedDate: formatSummaryDate(mainTable.RequestPublishDate || mainTable.createddate),
      status: getStatus(item),
      raw: item,
    }
  })
})

const filteredDocuments = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) {
    return documents.value
  }

  return documents.value.filter((document) => {
    return [
      document.numberVersion,
      document.title,
      document.publishedDate,
      document.status,
    ].some(value => String(value || '').toLowerCase().includes(keyword))
  })
})

const recordCountLabel = computed(() => `${filteredDocuments.value.length} records`)

const getDocumentRoute = (document: CompanyDocumentItem) => ({
  path: `/desktop/company-documents/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(document.slug)}`,
  query: {
    groupTitle: groupTitle.value,
    folderbaseid: folderbaseid.value,
    title: document.title,
    code: document.code,
    version: document.version,
    summaryDate: document.publishedDate,
  },
})

const loadDocumentsList = async () => {
  loading.value = true
  error.value = null

  try {
    await documentStore.fetchDocumentList({
      folderbaseid: folderbaseid.value,
      pageNo: 1,
      pageSize: 10,
    })
  }
  catch (caughtError) {
    error.value = caughtError instanceof Error ? caughtError : new Error('Fetch document list failed')
  }
  finally {
    loading.value = false
  }
}

watch(folderbaseid, () => {
  void loadDocumentsList()
})

onMounted(() => {
  void loadDocumentsList()
})
</script>

<style scoped>
.company-docs-detail {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.company-docs-detail__header {
  min-height: 112px;
  padding: 21px 75px 20px;
  border-bottom: 1px solid #d9d9d9;
  background: #f5f5f5;
}

.company-docs-detail__header h1 {
  margin: 29px 0 0;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 26px;
  line-height: 100%;
  font-weight: 700;
  letter-spacing: 0;
}

.company-docs-detail__body {
  flex: 1;
  padding: 21px 15px 62px 75px;
}

.company-docs-detail__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.company-docs-detail__breadcrumb a {
  color: inherit;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0;
  text-underline-offset: 0;
  text-decoration-skip-ink: auto;
}

.company-docs-detail__breadcrumb span {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.company-docs-detail__breadcrumb span:last-child {
  font-weight: 700;
}

.company-docs-detail__toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 39px;
}

.company-docs-detail__search {
  width: 282px;
  height: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-radius: 7px;
  background: #f5f5f5;
  color: #777777;
}

.company-docs-detail__search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #333333;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  line-height: 100%;
}

.company-docs-detail__search input::placeholder {
  color: #a3aab2;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 100%;
}

.company-docs-detail-table {
  width: 100%;
  font-family: "Source Sans Pro", sans-serif;
}

.company-docs-detail-table__row {
  display: grid;
  grid-template-columns: 140px minmax(360px, 1fr) 112px 150px;
  align-items: center;
  min-height: 35px;
  padding: 0 21px;
  column-gap: 18px;
  color: #000000;
  font-size: 12px;
  line-height: 100%;
  font-weight: 400;
  letter-spacing: 0;
}

.company-docs-detail-table__row.is-striped {
  background: #f7f7f7;
  border-radius: 8px;
}

.company-docs-detail-table__row--head {
  min-height: 27px;
  padding-bottom: 7px;
  font-weight: 700;
  border-bottom: 1px solid #d9d9d9;
}

.company-docs-detail-table__row--head button {
  justify-self: start;
  border: 0;
  padding: 0;
  background: transparent;
  color: #000000;
  font: inherit;
}

.company-docs-detail-table__row--head button::after {
  content: "↕";
  margin-left: 4px;
  color: #000000;
  font-size: 13px;
}

.company-docs-detail-table__state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
}

.company-docs-detail-table__state--error {
  color: #a60a3a;
}

.company-docs-detail-table__link {
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
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

.company-docs-detail-table__row > span {
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.company-docs-detail-table__row > .company-docs-detail-table__link {
  color: #a60a3a;
}

.company-docs-detail-table__status.is-pending {
  color: #a60a3a;
}

.company-docs-detail-table__row > .company-docs-detail-table__status {
  width: 95px;
  height: 15px;
  display: inline-flex;
  align-items: center;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  color: #00820F;
  vertical-align: middle;
}

.company-docs-detail-table__row > .company-docs-detail-table__status.is-pending {
  color: #FF0000;
}

.company-docs-detail__footer-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  margin-top: 29px;
}

.company-docs-detail__record-count {
  color: #555555;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
}

.company-docs-detail__copyright {
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
