<template>
  <!-- eslint-disable vue/no-v-html -->
  <NuxtPage v-if="isPreviewRoute" />

  <div
    v-else-if="documentDetail"
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

      <button
        type="button"
        class="mobile-company-document-detail__file"
        @click="openPreview"
      >
        <IconCustom
          name="document"
          :size="15"
          color="#B10F49"
        />
        <span>{{ previewFileName }}</span>
      </button>

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

      <!-- Sanitized controlled OA/CMS HTML before rendering. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="mobile-company-document-detail__paragraphs"
        v-html="documentDetail.contentHtml"
      />

      <!-- Sanitized controlled OA/CMS HTML before rendering. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
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
import { sanitizeControlledHtml } from '~/utils/sanitizeHtml'

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
    serverRelativeUrl?: string
    ServerRelativeUrl?: string
    server_relative_url?: string
    fileUrl?: string
    file_url?: string
    requestid?: string | number
    requestId?: string | number
    workflowid?: string | number
    workflowId?: string | number
  }
}

interface CompanyDocumentPreviewResponse {
  data?: string
  fileName?: string
  contentType?: string
  documentId?: string
}

interface CompanyDocumentDetail {
  title: string
  code: string
  version: string
  fileName: string
  serverRelativeUrl: string
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
const isPreviewRoute = computed(() => route.path.endsWith('/preview'))
const groupTitle = computed(() => String(route.query.groupTitle || 'Company Documents'))
const selectedDocumentDetail = useState<CompanyDocumentDetailResponseItem | null>('company-document:selected-detail', () => null)
const selectedDocumentPreview = useState<CompanyDocumentPreviewResponse | null>('company-document:selected-preview', () => null)
const accepted = ref(false)
const fixedPreviewFileName = 'testpdf.pdf'
const fixedPreviewServerRelativeUrl = '%2Fsites%2FDCHGroupLegalCompliancePublicSite%2FTemplates%2FShared%20Documents%2FKey%20Functions%20-%2002.%20Contract%20Templates%20%26%20Digital%20Playbooks%2F%E5%86%85%E5%9C%B0%E7%89%A9%E6%B5%81%2F01.%20Digital%20Playbooks%2F02.%20Non%E2%80%91Disclosure%20Agreement%20Playbook%2Ftestpdf.pdf'

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
  const bracketStart = value.lastIndexOf('[')
  const hasVersionSuffix = bracketStart > -1 && value.endsWith(']')
  const code = hasVersionSuffix ? value.slice(0, bracketStart) : value
  const version = hasVersionSuffix ? value.slice(bracketStart) : ''

  return {
    code: String(route.query.code || code || value),
    version: String(route.query.version || version),
  }
}

const getFallbackContentHtml = () => {
  return [
    '<p>请你在同意之前，仔细阅读本政策。点击“同意”按钮，代表你愿意遵守本政策内容。</p>',
    '<p>请你在同意之前，仔细阅读本政策。点击“同意”按钮，代表你愿意遵守本政策内容。</p>',
    '<p>Please read this policy carefully before clicking the "Accept" button. Your acceptance to this policy means you agree to comply with the policy content.</p>',
  ].join('')
}

const getMainTableFileName = (mainTable: NonNullable<CompanyDocumentDetailResponseItem['mainTable']>, fallbackTitle: string) => {
  return mainTable.fileName || mainTable.filename || mainTable.file_name || String(route.query.fileName || '') || fallbackTitle || fixedPreviewFileName
}

const getMainTableServerRelativeUrl = (mainTable?: CompanyDocumentDetailResponseItem['mainTable']) => {
  return mainTable?.serverRelativeUrl
    || mainTable?.ServerRelativeUrl
    || mainTable?.server_relative_url
    || mainTable?.fileUrl
    || mainTable?.file_url
    || String(route.query.serverRelativeUrl || '')
    || fixedPreviewServerRelativeUrl
}

const fetchCompanyDocumentDetail = $fetch as typeof $fetch<any>

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
  const serverRelativeUrl = getMainTableServerRelativeUrl(mainTable)
  const fileName = getMainTableFileName(mainTable, serverRelativeUrl.split('/').pop() || `${title}.pdf`)

  return {
    title,
    code,
    version,
    fileName,
    serverRelativeUrl,
    createdBy: mainTable.createdby || '-',
    createdDate: mainTable.createddate || '-',
    publishedDate: mainTable.RequestPublishDate || '-',
    contentHtml: sanitizeControlledHtml(mainTable.content_display || getFallbackContentHtml()),
    footerHtml: sanitizeControlledHtml(mainTable.footer_display || ''),
  }
})

const previewQuery = computed<{ serverRelativeUrl: string, fileName: string }>(() => {
  return {
    serverRelativeUrl: fixedPreviewServerRelativeUrl,
    fileName: fixedPreviewFileName,
  }
})

const scopedDocumentPreview = computed(() => {
  return selectedDocumentPreview.value?.documentId === documentSlug.value
    ? selectedDocumentPreview.value
    : null
})

const { data: companyDocumentPreviewResponse } = await useAsyncData(
  'company-document-preview',
  () => $fetch<CompanyDocumentPreviewResponse>('/api/ecologyOa/companyDocumentPreview', {
    method: 'GET',
    query: previewQuery.value,
  }),
  {
    watch: [documentSlug],
  },
)

watch(
  companyDocumentPreviewResponse,
  (response) => {
    if (response) {
      selectedDocumentPreview.value = {
        ...response,
        documentId: documentSlug.value,
      }
    }
  },
  { immediate: true },
)

const previewFileName = computed(() => {
  return scopedDocumentPreview.value?.fileName || companyDocumentPreviewResponse.value?.fileName || documentDetail.value?.fileName || 'Preview file'
})

const handleBack = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}`,
    query: {
      title: groupTitle.value,
    },
  })
}

const openPreview = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(documentSlug.value)}/preview`,
    query: {
      groupTitle: groupTitle.value,
      folderbaseid: folderbaseid.value,
      serverRelativeUrl: previewQuery.value.serverRelativeUrl,
      title: documentDetail.value?.title || '',
      fileName: previewFileName.value,
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
  background: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 999px;
  color: #666666;
  font-size: 13px;
  max-width: 100%;
}

.mobile-company-document-detail__file span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
