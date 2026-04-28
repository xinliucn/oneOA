<template>
  <div class="mobile-company-document-group">
    <div class="mobile-company-document-group__toolbar">
      <button
        type="button"
        class="mobile-company-document-group__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="16"
          :rotate="180"
          color="#B10F49"
        />
        <span>Company Documents</span>
      </button>

      <button
        type="button"
        class="mobile-company-document-group__search"
      >
        <IconCustom
          name="search"
          :size="17"
          color="#A60A3A"
        />
      </button>
    </div>

    <div class="mobile-company-document-group__banner">
      {{ groupTitle }} ({{ documents.length }})
    </div>

    <main class="mobile-company-document-group__list">
      <button
        v-for="document in documents"
        :key="document.slug"
        type="button"
        class="mobile-company-document-group__item"
        @click="handleDocumentClick(document)"
      >
        <span class="mobile-company-document-group__item-content">
          <span class="mobile-company-document-group__item-title">{{ document.title }}</span>
          <span class="mobile-company-document-group__item-meta">
            {{ document.code }}{{ document.version }} · {{ document.summaryDate }}
            <span :class="['mobile-company-document-group__item-status', { 'is-pending': document.status === 'Not Acknowledged' }]">
              {{ document.status }}
            </span>
          </span>
        </span>
        <IconCustom
          name="chevron-right"
          :size="15"
          color="#A60A3A"
        />
      </button>

      <div
        v-if="!pending && !documents.length"
        class="mobile-company-document-group__empty"
      >
        No documents found
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
type CompanyDocumentStatus = 'Acknowledged' | 'Not Acknowledged'

interface CompanyDocumentDetailResponseItem {
  mainTable?: {
    id?: string | number
    RequestName?: string
    Number_Version?: string
    RequestPublishDate?: string
    createddate?: string
    readstatus?: string
    acknowledgedate_display?: string
  }
}

interface CompanyDocumentItem {
  slug: string
  title: string
  code: string
  version: string
  summaryDate: string
  status: CompanyDocumentStatus
  raw: CompanyDocumentDetailResponseItem
}

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const folderbaseid = computed(() => String(route.query.folderbaseid || groupSlug.value))
const groupTitle = computed(() => String(route.query.title || 'Company Documents'))
const selectedDocumentDetail = useState<CompanyDocumentDetailResponseItem | null>('company-document:selected-detail', () => null)

const normalizeCompanyDocumentDetailResponse = (response: any): CompanyDocumentDetailResponseItem[] => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data
  }

  return []
}

const getStatus = (item: CompanyDocumentDetailResponseItem): CompanyDocumentStatus => {
  const readstatus = item.mainTable?.readstatus || ''

  if (readstatus === '已签署' || readstatus === 'Acknowledged' || item.mainTable?.acknowledgedate_display) {
    return 'Acknowledged'
  }

  return 'Not Acknowledged'
}

const getDocumentCodeAndVersion = (numberVersion?: string) => {
  const value = numberVersion || ''
  const match = value.match(/^(.*?)(\[[^\]]+\])$/)

  return {
    code: match?.[1] || value,
    version: match?.[2] || '',
  }
}

const formatSummaryDate = (date?: string) => {
  return date?.split(' ')[0] || ''
}

const fetchCompanyDocumentDetail = $fetch as typeof $fetch<unknown>

const { data: companyDocumentDetailResponse, pending } = await useAsyncData(
  'company-document-detail',
  () => fetchCompanyDocumentDetail('/api/ecologyOa/companyDocumentDetail', {
    method: 'POST',
    body: {
      folderbaseid: folderbaseid.value,
      pageNo: 1,
      pageSize: 10,
    },
  }),
  {
    watch: [groupSlug],
  },
)

const documents = computed<CompanyDocumentItem[]>(() => {
  return normalizeCompanyDocumentDetailResponse(companyDocumentDetailResponse.value).map((item) => {
    const mainTable = item.mainTable || {}
    const { code, version } = getDocumentCodeAndVersion(mainTable.Number_Version)
    const title = mainTable.RequestName || code || String(mainTable.id || '')

    return {
      slug: String(mainTable.id || title),
      title,
      code,
      version,
      summaryDate: formatSummaryDate(mainTable.RequestPublishDate || mainTable.createddate),
      status: getStatus(item),
      raw: item,
    }
  })
})

const handleBack = () => navigateTo('/mobile/companyDocuments')

const handleDocumentClick = (document: CompanyDocumentItem) => {
  selectedDocumentDetail.value = document.raw

  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(document.slug)}`,
    query: {
      groupTitle: groupTitle.value,
      folderbaseid: folderbaseid.value,
      title: document.title,
      code: document.code,
      version: document.version,
      summaryDate: document.summaryDate,
    },
  })
}
</script>

<style scoped>
.mobile-company-document-group {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.mobile-company-document-group__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1e8eb;
  background: #ffffff;
}

.mobile-company-document-group__back {
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #b10f49;
  font-size: 15px;
}

.mobile-company-document-group__search {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: #fce4ec;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-company-document-group__banner {
  padding: 10px 16px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.mobile-company-document-group__list {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}

.mobile-company-document-group__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  border: 0;
  border-top: 1px solid #ededed;
  background: #ffffff;
  text-align: left;
}

.mobile-company-document-group__item-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-company-document-group__item-title {
  font-size: 14px;
  line-height: 1.3;
  font-weight: 500;
  color: #171717;
}

.mobile-company-document-group__item-meta {
  font-size: 10px;
  line-height: 1.3;
  color: #8f8f8f;
}

.mobile-company-document-group__item-status {
  color: #6f6f6f;
}

.mobile-company-document-group__item-status.is-pending {
  color: #d4586f;
}

.mobile-company-document-group__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f8f8f;
  background: #ffffff;
}
</style>
