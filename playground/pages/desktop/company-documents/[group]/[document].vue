<template>
  <div class="company-document-view">
    <header class="company-document-view__header">
      <nav class="company-document-view__breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/desktop">Home</NuxtLink>
        <span>&gt;</span>
        <NuxtLink to="/desktop/company-documents">Company Documents</NuxtLink>
        <span>&gt;</span>
        <NuxtLink
          :to="{
            path: `/desktop/company-documents/${encodeURIComponent(groupSlug)}`,
            query: {
              folderbaseid,
              title: groupTitle,
            },
          }"
        >
          {{ groupTitle }}
        </NuxtLink>
        <span>&gt;</span>
        <span>{{ documentDetail?.title || documentTitle }}</span>
      </nav>

      <h1>{{ documentDetail?.title || documentTitle }}</h1>
    </header>

    <main v-if="loading" class="company-document-view__state">
      Loading...
    </main>

    <main v-else-if="documentDetail" class="company-document-view__content">
      <section class="company-document-view__summary">
        <div class="company-document-view__status-panel">
          <div
            class="company-document-view__status-bar"
            :class="{ 'is-acknowledged': documentDetail.status === 'Acknowledged' }"
          >
            {{ documentDetail.status }}
          </div>
          <div class="company-document-view__status-body">
            <span class="company-document-view__status-icon">
              <IconCustom name="personnel" :size="18" color="#666666" />
            </span>
            <span>{{ documentDetail.status === 'Acknowledged' ? 'Acknowledged' : 'Acknowledgment required' }}</span>
          </div>
        </div>

        <aside class="company-document-view__meta">
          <div class="company-document-view__creator">
            <span class="company-document-view__avatar">
              <IconCustom name="personnel" :size="20" color="#ffffff" />
            </span>
            <div class="company-document-view__creator-copy">
              <span>Created by:</span>
              <strong>{{ documentDetail.createdBy }}</strong>
            </div>
            <time>
              <span>{{ documentDetail.createdDate }}</span>
              <span>{{ documentDetail.createdTime }}</span>
            </time>
          </div>

          <div class="company-document-view__published">
            <span>Published:</span>
            <strong>{{ documentDetail.publishedDateTime }}</strong>
          </div>

          <div class="company-document-view__file">
            <IconCustom name="document" :size="15" color="#a60a3a" />
            <span>{{ documentDetail.fileName }}</span>
            <button type="button" @click="downloadDocument">
              Download
            </button>
          </div>
        </aside>
      </section>

      <section class="company-document-view__policy">
        <div
          class="company-document-view__paragraphs"
          v-html="documentDetail.contentHtml"
        />

        <div
          v-if="documentDetail.footerHtml"
          class="company-document-view__paragraphs"
          v-html="documentDetail.footerHtml"
        />

        <div class="company-document-view__acknowledgement">
          <p>我已閱讀並願意遵守本政策內容。</p>

          <label>
            <input v-model="accepted" type="checkbox">
            <span>我已阅读并愿意遵守本政策内容。</span>
          </label>

          <p>I have read and agreed with the policy content.</p>
        </div>

        <button type="button" class="company-document-view__accept" @click="handleAccept">
          Accept
        </button>
      </section>
    </main>

    <main v-else class="company-document-view__state">
      Document not found
    </main>

    <footer class="company-document-view__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
type CompanyDocumentStatus = 'Acknowledged' | 'Not Acknowledged'

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
    readstatus?: string
    acknowledgedate_display?: string
    fileName?: string
    filename?: string
    file_name?: string
    serverRelativeUrl?: string
    ServerRelativeUrl?: string
    server_relative_url?: string
    fileUrl?: string
    file_url?: string
  }
}

interface CompanyDocumentPreviewResponse {
  data?: string
  fileName?: string
  contentType?: string
}

interface CompanyDocumentDetail {
  title: string
  code: string
  version: string
  fileName: string
  serverRelativeUrl: string
  createdBy: string
  createdDate: string
  createdTime: string
  publishedDateTime: string
  contentHtml: string
  footerHtml: string
  status: CompanyDocumentStatus
}

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const documentSlug = computed(() => String(route.params.document || ''))
const folderbaseid = computed(() => String(route.query.folderbaseid || groupSlug.value))
const groupTitle = computed(() => String(route.query.groupTitle || route.query.title || 'Company Documents'))
const documentTitle = computed(() => String(route.query.title || 'Company Document'))
const selectedDocumentDetail = useState<CompanyDocumentDetailResponseItem | null>('company-document:selected-detail', () => null)
const companyDocumentDetailResponse = ref<unknown>(null)
const loading = ref(true)
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

const getStatus = (item: CompanyDocumentDetailResponseItem): CompanyDocumentStatus => {
  const readstatus = item.mainTable?.readstatus || ''

  if (readstatus === '已签署' || readstatus === 'Acknowledged' || item.mainTable?.acknowledgedate_display) {
    return 'Acknowledged'
  }

  return 'Not Acknowledged'
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

const splitDateTime = (value?: string) => {
  const [date = '', time = ''] = String(value || '').split(' ')

  return {
    date,
    time,
  }
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

const selectedDocument = computed(() => {
  const selectedItem = String(selectedDocumentDetail.value?.mainTable?.id || '') === documentSlug.value
    ? selectedDocumentDetail.value
    : null

  return selectedItem || normalizeCompanyDocumentDetailResponse(companyDocumentDetailResponse.value)
    .find(detail => String(detail.mainTable?.id || '') === documentSlug.value)
})

const documentDetail = computed<CompanyDocumentDetail | null>(() => {
  const mainTable = selectedDocument.value?.mainTable

  if (!mainTable) {
    return null
  }

  const { code, version } = getDocumentCodeAndVersion(mainTable.Number_Version)
  const title = mainTable.RequestName || documentTitle.value || code
  const serverRelativeUrl = getMainTableServerRelativeUrl(mainTable)
  const fileName = getMainTableFileName(mainTable, serverRelativeUrl.split('/').pop() || `${title}.pdf`)
  const createdDateTime = splitDateTime(mainTable.createddate || mainTable.RequestPublishDate)

  return {
    title,
    code,
    version,
    fileName,
    serverRelativeUrl,
    createdBy: mainTable.createdby || '-',
    createdDate: createdDateTime.date || '-',
    createdTime: createdDateTime.time || '',
    publishedDateTime: mainTable.RequestPublishDate || mainTable.createddate || '-',
    contentHtml: mainTable.content_display || getFallbackContentHtml(),
    footerHtml: mainTable.footer_display || '',
    status: getStatus(selectedDocument.value),
  }
})

const fetchCompanyDocumentDetail = async () => {
  loading.value = true

  try {
    companyDocumentDetailResponse.value = await $fetch('/api/ecologyOa/companyDocumentDetail', {
      method: 'POST',
      body: {
        folderbaseid: folderbaseid.value,
        pageNo: 1,
        pageSize: 100,
      },
    })
  } finally {
    loading.value = false
  }
}

const downloadDocument = async () => {
  if (!documentDetail.value) {
    return
  }

  const response = await $fetch<CompanyDocumentPreviewResponse>('/api/ecologyOa/companyDocumentPreview', {
    method: 'GET',
    query: {
      serverRelativeUrl: documentDetail.value.serverRelativeUrl || fixedPreviewServerRelativeUrl,
      fileName: documentDetail.value.fileName || fixedPreviewFileName,
    },
  })

  if (!response.data || !import.meta.client) {
    return
  }

  const byteCharacters = window.atob(response.data)
  const byteNumbers = Array.from(byteCharacters, character => character.charCodeAt(0))
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: response.contentType || 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = response.fileName || documentDetail.value.fileName
  link.click()
  URL.revokeObjectURL(url)
}

const handleAccept = () => {
  accepted.value = true
}

watch([folderbaseid, documentSlug], () => {
  fetchCompanyDocumentDetail()
})

onMounted(() => {
  fetchCompanyDocumentDetail()
})
</script>

<style scoped>
.company-document-view {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.company-document-view__header {
  padding: 22px 82px 20px;
  border-bottom: 1px solid #d9d9d9;
  background: #f5f5f5;
}

.company-document-view__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
}

.company-document-view__breadcrumb a {
  color: inherit;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  text-decoration: underline;
}

.company-document-view__breadcrumb span {
  font-size: 12px;
  line-height: 100%;
}

.company-document-view__breadcrumb span:last-child {
  font-weight: 700;
}

.company-document-view__header h1 {
  margin: 25px 0 0;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 110%;
}

.company-document-view__content {
  flex: 1;
  width: 100%;
  max-width: 884px;
  padding: 18px 82px 72px;
}

.company-document-view__summary {
  display: grid;
  grid-template-columns: 418px 1fr;
  gap: 22px;
  align-items: start;
}

.company-document-view__status-panel {
  border-radius: 7px;
  overflow: hidden;
}

.company-document-view__status-bar {
  height: 25px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  background: #ff0000;
  color: #ffffff;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 100%;
}

.company-document-view__status-bar.is-acknowledged {
  background: #00820f;
}

.company-document-view__status-body {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  background: #f5f5f5;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
}

.company-document-view__status-icon,
.company-document-view__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #ffffff;
}

.company-document-view__status-icon {
  width: 28px;
  height: 28px;
}

.company-document-view__meta {
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding-top: 1px;
}

.company-document-view__creator {
  display: grid;
  grid-template-columns: 32px 1fr 82px;
  gap: 7px;
  align-items: start;
}

.company-document-view__avatar {
  width: 28px;
  height: 28px;
  background: #d9d9d9;
}

.company-document-view__creator-copy {
  min-width: 0;
}

.company-document-view__creator-copy span,
.company-document-view__published span,
.company-document-view__creator time {
  display: block;
  color: #a3aab2;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 120%;
}

.company-document-view__creator-copy strong,
.company-document-view__published strong {
  display: block;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 120%;
}

.company-document-view__creator time {
  text-align: right;
}

.company-document-view__file {
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr) auto;
  align-items: start;
  gap: 8px;
  color: #666666;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 120%;
}

.company-document-view__file button {
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
  text-decoration: underline;
  cursor: pointer;
}

.company-document-view__policy {
  position: relative;
  margin-top: 52px;
  padding: 19px 20px 23px;
  border-radius: 7px;
  background: #f5f5f5;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 150%;
}

.company-document-view__policy::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -17px;
  height: 1px;
  background: #d9d9d9;
}

.company-document-view__paragraphs {
  margin: 0 0 14px;
}

.company-document-view__paragraphs :deep(p) {
  margin: 0;
}

.company-document-view__paragraphs :deep(p + p) {
  margin-top: 12px;
}

.company-document-view__acknowledgement {
  margin-top: 13px;
  padding-left: 23px;
}

.company-document-view__acknowledgement p {
  margin: 0 0 10px;
}

.company-document-view__acknowledgement label {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
}

.company-document-view__acknowledgement input {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: #a60a3a;
}

.company-document-view__accept {
  position: absolute;
  right: 17px;
  bottom: 16px;
  width: 83px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: #edccd7;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 100%;
  cursor: pointer;
}

.company-document-view__state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
}

.company-document-view__footer {
  margin-top: auto;
  padding: 16px;
  background: #a60a3a;
  color: #ffffff;
  text-align: center;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
}
</style>
