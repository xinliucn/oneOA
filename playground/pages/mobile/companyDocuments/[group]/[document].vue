<template>
  <div
    v-if="documentDetail"
    class="mobile-company-document-detail"
  >
    <div class="mobile-company-document-detail__toolbar">
      <button
        type="button"
        class="mobile-company-document-detail__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="16"
          :rotate="180"
          color="#B10F49"
        />
        <span>{{ groupTitle }}</span>
      </button>
    </div>

    <main class="mobile-company-document-detail__content">
      <div class="mobile-company-document-detail__code">
        {{ documentDetail.code }}{{ documentDetail.version }}
      </div>

      <h1 class="mobile-company-document-detail__title">
        {{ documentDetail.title }}
      </h1>

      <div class="mobile-company-document-detail__file">
        <IconCustom
          name="document"
          :size="15"
          color="#B10F49"
        />
        <span>{{ documentDetail.fileName }}</span>
      </div>

      <div class="mobile-company-document-detail__meta">
        <div class="mobile-company-document-detail__meta-item">
          <span class="mobile-company-document-detail__meta-label">Created By</span>
          <span class="mobile-company-document-detail__meta-value">{{ documentDetail.createdBy }}</span>
        </div>
        <div class="mobile-company-document-detail__meta-item">
          <span class="mobile-company-document-detail__meta-label">Created Date</span>
          <span class="mobile-company-document-detail__meta-value">{{ documentDetail.createdDate }}</span>
        </div>
        <div class="mobile-company-document-detail__meta-item">
          <span class="mobile-company-document-detail__meta-label">Published Date</span>
          <span class="mobile-company-document-detail__meta-value">{{ documentDetail.publishedDate }}</span>
        </div>
      </div>

      <div
        class="mobile-company-document-detail__paragraphs"
        v-html="documentDetail.contentHtml"
      />

      <div
        v-if="documentDetail.footerHtml"
        class="mobile-company-document-detail__footer"
        v-html="documentDetail.footerHtml"
      />

      <div class="mobile-company-document-detail__checkboxes">
        <label class="mobile-company-document-detail__checkbox-row">
          <input
            v-model="accepted"
            type="checkbox"
            class="mobile-company-document-detail__checkbox"
          >
          <span>我已閱讀並願意遵守本政策內容。</span>
        </label>

        <label class="mobile-company-document-detail__checkbox-row">
          <input
            v-model="accepted"
            type="checkbox"
            class="mobile-company-document-detail__checkbox"
          >
          <span>我已阅读并愿意遵守本政策内容。</span>
        </label>

        <label class="mobile-company-document-detail__checkbox-row">
          <input
            v-model="accepted"
            type="checkbox"
            class="mobile-company-document-detail__checkbox"
          >
          <span>I have read and agreed with the policy content.</span>
        </label>
      </div>

      <button
        type="button"
        class="mobile-company-document-detail__accept"
        @click="handleAccept"
      >
        Accept
      </button>
    </main>
  </div>

  <div
    v-else
    class="mobile-company-document-detail__empty"
  >
    Document not found
  </div>
</template>

<script setup lang="ts">
interface CompanyDocumentDetailResponseItem {
  mainTable?: {
    id?: string | number
    createdby?: string
    RequestName?: string
    createddate?: string
    Number_Version?: string
    content_display?: string
    footer_display?: string
    RequestPublishDate?: string
    fileName?: string
    filename?: string
    file_name?: string
    requestid?: string | number
    requestId?: string | number
    workflowid?: string | number
    workflowId?: string | number
  }
}

interface CompanyDocumentDetail {
  title: string
  code: string
  version: string
  fileName: string
  createdBy: string
  createdDate: string
  publishedDate: string
  contentHtml: string
  footerHtml: string
}

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const folderbaseid = computed(() => String(route.query.folderbaseid || groupSlug.value))
const documentSlug = computed(() => String(route.params.document || ''))
const groupTitle = computed(() => String(route.query.groupTitle || 'Company Documents'))
const selectedDocumentDetail = useState<CompanyDocumentDetailResponseItem | null>('company-document:selected-detail', () => null)
const accepted = ref(false)

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

const getDocumentCodeAndVersion = (numberVersion?: string) => {
  const value = numberVersion || String(route.query.code || '')
  const match = value.match(/^(.*?)(\[[^\]]+\])$/)

  return {
    code: String(route.query.code || match?.[1] || value),
    version: String(route.query.version || match?.[2] || ''),
  }
}

const getFallbackContentHtml = () => {
  return [
    '<p>请你在同意之前，仔细阅读本政策。点击“同意”按钮，代表你愿意遵守本政策内容。</p>',
    '<p>请你在同意之前，仔细阅读本政策。点击“同意”按钮，代表你愿意遵守本政策内容。</p>',
    '<p>Please read this policy carefully before clicking the "Accept" button. Your acceptance to this policy means you agree to comply with the policy content.</p>',
  ].join('')
}

const fetchCompanyDocumentDetail = $fetch as typeof $fetch<unknown>

const { data: companyDocumentDetailResponse } = await useAsyncData(
  'company-document-sign-detail',
  () => fetchCompanyDocumentDetail('/api/ecologyOa/companyDocumentDetail', {
    method: 'POST',
    body: {
      folderbaseid: folderbaseid.value,
      pageNo: 1,
      pageSize: 10,
    },
  }),
  {
    watch: [groupSlug, documentSlug],
  },
)

const documentDetail = computed<CompanyDocumentDetail | null>(() => {
  const selectedItem = String(selectedDocumentDetail.value?.mainTable?.id || '') === documentSlug.value
    ? selectedDocumentDetail.value
    : null
  const item = selectedItem || normalizeCompanyDocumentDetailResponse(companyDocumentDetailResponse.value)
    .find(detail => String(detail.mainTable?.id || '') === documentSlug.value)
  const mainTable = item?.mainTable

  if (!mainTable) {
    return null
  }

  const { code, version } = getDocumentCodeAndVersion(mainTable.Number_Version)
  const title = mainTable.RequestName || String(route.query.title || code)
  const fileName = mainTable.fileName || mainTable.filename || mainTable.file_name || `${title}.pdf`

  return {
    title,
    code,
    version,
    fileName,
    createdBy: mainTable.createdby || '-',
    createdDate: mainTable.createddate || '-',
    publishedDate: mainTable.RequestPublishDate || '-',
    contentHtml: mainTable.content_display || getFallbackContentHtml(),
    footerHtml: mainTable.footer_display || '',
  }
})

const handleBack = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}`,
    query: {
      title: groupTitle.value,
    },
  })
}

const handleAccept = () => {
  accepted.value = true
}
</script>

<style scoped>
.mobile-company-document-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.mobile-company-document-detail__toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid #f1e8eb;
  background: #ffffff;
}

.mobile-company-document-detail__back {
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #b10f49;
  font-size: 15px;
}

.mobile-company-document-detail__content {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 24px;
}

.mobile-company-document-detail__code {
  margin-bottom: 8px;
  color: #464646;
  font-size: 13px;
}

.mobile-company-document-detail__title {
  margin: 0 0 16px;
  font-size: 20px;
  line-height: 1.25;
  font-weight: 700;
  color: #171717;
}

.mobile-company-document-detail__file {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  margin-bottom: 18px;
  border: 1px solid #d7d7d7;
  border-radius: 999px;
  color: #666666;
  font-size: 13px;
}

.mobile-company-document-detail__meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.mobile-company-document-detail__meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-company-document-detail__meta-label {
  font-size: 13px;
  font-weight: 700;
  color: #252525;
}

.mobile-company-document-detail__meta-value {
  font-size: 13px;
  color: #262626;
}

.mobile-company-document-detail__paragraphs {
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 1.45;
  color: #252525;
}

.mobile-company-document-detail__footer {
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.45;
  color: #252525;
}

.mobile-company-document-detail__paragraphs :deep(p),
.mobile-company-document-detail__footer :deep(p) {
  margin: 0;
}

.mobile-company-document-detail__paragraphs :deep(p + p),
.mobile-company-document-detail__footer :deep(p + p) {
  margin-top: 14px;
}

.mobile-company-document-detail__checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 13px;
  line-height: 1.45;
  color: #252525;
}

.mobile-company-document-detail__checkbox {
  width: 16px;
  height: 16px;
  margin: 2px 0 0;
  accent-color: #a60a3a;
  flex-shrink: 0;
}

.mobile-company-document-detail__accept {
  width: 100%;
  max-width: 140px;
  height: 40px;
  margin: 18px auto 0;
  display: block;
  border: 0;
  border-radius: 999px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}

.mobile-company-document-detail__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f8f8f;
  background: #ffffff;
}
</style>
