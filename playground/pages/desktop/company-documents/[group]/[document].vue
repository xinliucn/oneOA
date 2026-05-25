<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="company-document-view">
    <header class="company-document-view__header">
      <nav
        class="company-document-view__breadcrumb"
        :aria-label="t('common.breadcrumb')"
      >
        <NuxtLink to="/desktop">
          {{ t('common.home') }}
        </NuxtLink>
        <span>&gt;</span>
        <NuxtLink to="/desktop/company-documents">
          {{ t('pages.companyDocuments.title') }}
        </NuxtLink>
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

    <main
      v-if="loading"
      class="company-document-view__state"
    >
      {{ t('pages.companyDocuments.states.loading') }}
    </main>

    <main
      v-else-if="documentDetail"
      class="company-document-view__content"
    >
      <section class="company-document-view__summary">
        <div class="company-document-view__status-panel">
          <div
            class="company-document-view__status-bar"
            :class="{ 'is-acknowledged': documentDetail.status === 'Acknowledged' }"
          >
            {{ formatDocumentStatus(documentDetail.status) }}
          </div>
          <div class="company-document-view__status-body">
            <span class="company-document-view__status-icon">
              <IconCustom
                name="personnel"
                :size="23"
                color="#666666"
              />
            </span>
            <span>{{ formatStatusSummary(documentDetail.status) }}</span>
          </div>
        </div>

        <aside class="company-document-view__meta">
          <div class="company-document-view__creator">
            <span class="company-document-view__avatar">
              <IconCustom
                name="personnel"
                :size="20"
                color="#ffffff"
              />
            </span>
            <div class="company-document-view__creator-copy">
              <span>{{ t('pages.companyDocuments.fields.createdBy') }}:</span>
              <strong>{{ documentDetail.createdBy }}</strong>
            </div>
            <time>
              <span>{{ documentDetail.createdDate }}</span>
              <span>{{ documentDetail.createdTime }}</span>
            </time>
          </div>

          <div class="company-document-view__published">
            <span>{{ t('pages.companyDocuments.fields.publishedDate') }}:</span>
            <strong>{{ documentDetail.publishedDateTime }}</strong>
          </div>

          <div
            v-for="file in previewFileList"
            :key="file.id || file.osid || file.filename"
            class="company-document-view__file"
          >
            <IconCustom
              name="document"
              :size="19"
              color="#a60a3a"
            />
            <span>{{ file.filename }}</span>
            <button
              type="button"
              @click="downloadDocument(file)"
            >
              {{ t('pages.companyDocuments.actions.download') }}
            </button>
          </div>
        </aside>
      </section>

      <section class="company-document-view__policy">
        <!-- Sanitized controlled OA/CMS HTML before rendering. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          class="company-document-view__paragraphs"
          v-html="documentDetail.contentHtml"
        />

        <!-- Sanitized controlled OA/CMS HTML before rendering. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="company-document-view__acknowledgement">
          <label>
            <input
              v-model="accepted"
              :disabled="isAcknowledged"
              type="checkbox"
            >
            <div
              v-if="documentDetail.footerHtml"
              class="company-document-view__paragraphs"
              v-html="documentDetail.footerHtml"
            />
          </label>
          <button
            v-if="!isAcknowledged"
            type="button"
            class="company-document-view__accept"
            :class="{ 'is-ready': canAccept }"
            :disabled="!canAccept"
            @click="acceptDocument"
          >
            {{ t('pages.companyDocuments.actions.accept') }}
          </button>
        </div>
      </section>
    </main>

    <main
      v-else
      class="company-document-view__state"
    >
      {{ t('pages.companyDocuments.documentNotFound') }}
    </main>

    <footer class="company-document-view__footer">
      {{ t('common.copyright', { year: 2026 }) }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { sanitizeControlledHtml } from '~/utils/sanitizeHtml'
import type {
  CompanyDocumentDetail,
  CompanyDocumentDetailResponseItem,
  CompanyDocumentPreviewFile,
  CompanyDocumentPreviewResponse,
  CompanyDocumentStatus,
} from '~/types/documentManagement'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const { t } = useAppI18n()
const documentStore = useDocumentManagementStore()

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const folderbaseid = computed(() => groupSlug.value)
const groupTitle = computed(() => String(route.query.groupTitle || route.query.title || groupSlug.value))
const documentSlug = computed(() => String(route.params.document || ''))
const documentTitle = computed(() => String(route.query.title || t('pages.companyDocuments.documentFallback')))
const loading = ref(false)
const accepted = ref(false)

const currentDocument = computed<CompanyDocumentDetailResponseItem | null>(() => {
  return documentStore.documentsList.find((document) => {
    return String(document.mainTable?.id || '') === documentSlug.value
  }) || null
})

const groupDetail = computed(() => {
  return currentDocument.value?.mainTable || null
})

const previewFileList = computed<CompanyDocumentPreviewFile[]>(() => {
  return currentDocument.value?.detail2 || []
})

const getStatus = (item: CompanyDocumentDetailResponseItem): CompanyDocumentStatus => {
  const readstatus = item.mainTable?.readstatus || ''

  if (readstatus === '已签署' || readstatus === 'Acknowledged' || item.mainTable?.acknowledgedate_display) {
    return 'Acknowledged'
  }

  return 'Not Acknowledged'
}

const formatDocumentStatus = (status?: CompanyDocumentStatus) => {
  return status === 'Acknowledged'
    ? t('pages.companyDocuments.filters.acknowledged')
    : t('pages.companyDocuments.filters.notAcknowledged')
}

const formatStatusSummary = (status?: CompanyDocumentStatus) => {
  return status === 'Acknowledged'
    ? t('pages.companyDocuments.filters.acknowledged')
    : t('pages.companyDocuments.states.acknowledgmentRequired')
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

const splitDateTime = (value?: string) => {
  const [date = '', time = ''] = String(value || '').split(' ')

  return {
    date,
    time,
  }
}

const documentDetail = computed<CompanyDocumentDetail | null>(() => {
  if (!currentDocument.value || !groupDetail.value) {
    return null
  }

  const { code, version } = getDocumentCodeAndVersion(groupDetail.value.Number_Version)
  const title = groupDetail.value.RequestName || documentTitle.value || code
  const createdDateTime = splitDateTime(groupDetail.value.createddate || groupDetail.value.RequestPublishDate)

  return {
    title,
    code,
    version,
    fileName: previewFileList.value[0]?.filename || title,
    serverRelativeUrl: '',
    createdBy: groupDetail.value.createdby || '-',
    createdDate: createdDateTime.date || '-',
    createdTime: createdDateTime.time || '',
    publishedDateTime: groupDetail.value.RequestPublishDate || groupDetail.value.createddate || '-',
    contentHtml: sanitizeControlledHtml(groupDetail.value.content_display || ''),
    footerHtml: sanitizeControlledHtml(groupDetail.value.footer_display || ''),
    status: getStatus(currentDocument.value),
  }
})

const isAcknowledged = computed(() => {
  return documentDetail.value?.status === 'Acknowledged'
})

const canAccept = computed(() => {
  return accepted.value && !isAcknowledged.value
})

const loadDocumentsList = async () => {
  if (currentDocument.value) {
    return
  }

  loading.value = true

  try {
    await documentStore.fetchDocumentList({
      folderbaseid: folderbaseid.value,
      pageNo: 1,
      pageSize: 10,
    })
  }
  finally {
    loading.value = false
  }
}

const downloadDocument = async (file: CompanyDocumentPreviewFile) => {
  const fileName = file.filename || ''

  if (!fileName || !import.meta.client) {
    return
  }

  const response = await $fetch<CompanyDocumentPreviewResponse>('/api/documentManagement/detail', {
    method: 'GET',
    query: {
      fileName,
    },
  })

  if (!response.data) {
    return
  }

  const byteCharacters = window.atob(response.data)
  const byteNumbers = Array.from(byteCharacters, character => character.charCodeAt(0))
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: response.contentType || 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = response.fileName || fileName
  link.click()
  URL.revokeObjectURL(url)
}

const acceptDocument = () => {
  if (!canAccept.value) {
    return
  }

  documentStore.acknowledgeDocument(documentSlug.value)
  accepted.value = true
  return navigateTo({
    path: '/desktop/company-documents',
    query: {
      approvedTitle: documentDetail.value?.code || documentDetail.value?.title || documentSlug.value,
    },
  })
}

watch([folderbaseid, documentSlug], () => {
  void loadDocumentsList()
})

watch(isAcknowledged, (value) => {
  accepted.value = value
}, { immediate: true })

onMounted(() => {
  void loadDocumentsList()
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
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
}

.company-document-view__breadcrumb a {
  color: inherit;
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
  font-size: 24px;
  font-weight: 700;
  line-height: 110%;
}

.company-document-view__content {
  flex: 1;
  width: 100%;
  padding: 18px 82px 72px;
}

.company-document-view__summary {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 22px;
  align-items: start;
}

.company-document-view__status-panel {
  border-radius: 7px;
  overflow: hidden;
}

.company-document-view__status-bar {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  background: #ff0000;
  color: #ffffff;
  font-family: var(--font-source-sans-pro);
  font-weight: 600;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

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
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;

  span {
    font-family: var(--font-source-sans-pro);
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0;
    vertical-align: middle;

  }
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
  width: 39px;
  height: 39px;
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

  time {
    display: block;
    color: #a3aab2;
    font-family: var(--font-source-sans-pro);
    font-family: var(--font-source-sans-pro);
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0;
    vertical-align: middle;

  }
}

.company-document-view__creator-copy span,
.company-document-view__published span,
/* .company-document-view__creator time {
  display: block;
  color: #a3aab2;
  font-family: var(--font-source-sans-pro);
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

}

.company-document-view__creator-copy strong,
.company-document-view__published strong {
  display: block;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

} */

.company-document-view__creator time {
  text-align: right;
}

.company-document-view__file {
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr) auto;
  align-items: start;
  gap: 8px;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

}

.company-document-view__file span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company-document-view__file button {
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

}

.company-document-view__policy {
  position: relative;
  margin-top: 52px;
  padding: 19px 20px 23px;
  border-radius: 7px;
  background: #f5f5f5;
  color: #000000;
  font-family: var(--font-source-sans-pro);
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
  accent-color: #A60A3A;
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
  font-family: var(--font-source-sans-pro);
  font-weight: 700;
  line-height: 100%;
  cursor: pointer;
}

.company-document-view__accept:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.company-document-view__accept.is-ready {
  background: #a60a3a;
  color: #ffffff;
  opacity: 1;
}

.company-document-view__state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: var(--font-source-sans-pro);
}

.company-document-view__footer {
  margin-top: auto;
  padding: 16px;
  background: #a60a3a;
  color: #ffffff;
  text-align: center;
  font-family: var(--font-source-sans-pro);
  line-height: 100%;
}
</style>
