<template>
  <div class="mobile-company-document-attachments">
    <header class="mobile-company-document-attachments__header">
      <button
        type="button"
        class="mobile-company-document-attachments__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
      </button>
      <h1 class="mobile-company-document-attachments__title">
        Attachments
      </h1>
      <div class="mobile-company-document-attachments__spacer" />
    </header>

    <main class="mobile-company-document-attachments__content">
      <button
        v-for="file in previewFileList"
        :key="file.id || file.osid || file.filename"
        type="button"
        class="mobile-company-document-attachments__item"
        @click="openPreview(file)"
      >
        <span class="mobile-company-document-attachments__icon">
          <IconCustom
            name="document"
            :size="16"
            color="#ffffff"
          />
        </span>
        <span class="mobile-company-document-attachments__copy">
          <span class="mobile-company-document-attachments__name">
            {{ file.filename }}
          </span>
          <span class="mobile-company-document-attachments__size">
            4 KB
          </span>
        </span>
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { CompanyDocumentDetailResponseItem, CompanyDocumentPreviewFile } from '~/types/documentManagement'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const documentStore = useDocumentManagementStore()
const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const documentSlug = computed(() => String(route.params.document || ''))

const currentDocument = computed<CompanyDocumentDetailResponseItem | null>(() => {
  return documentStore.documentsList.find((document) => {
    return String(document.mainTable?.id || '') === documentSlug.value
  }) || null
})

const previewFileList = computed<CompanyDocumentPreviewFile[]>(() => {
  return currentDocument.value?.detail2 || []
})

const handleBack = () => {
  return navigateTo(`/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(documentSlug.value)}`)
}

const openPreview = (file: CompanyDocumentPreviewFile) => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(documentSlug.value)}/preview`,
    query: {
      fileName: file.filename || '',
    },
  })
}
</script>

<style scoped>
.mobile-company-document-attachments {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #f7f7f7 0%, #f1f1f1 100%);
}

.mobile-company-document-attachments__header {
  height: 100px;
  display: flex;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 14px 18px;
  background: #ffffff;
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.mobile-company-document-attachments__back {
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-company-document-attachments__title {
  margin: 0;
  color: #111111;
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
  text-align: center;
}

.mobile-company-document-attachments__spacer {
  width: 36px;
  height: 36px;
}

.mobile-company-document-attachments__content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 32px;
  background: #FFFFFF;
}

.mobile-company-document-attachments__item {
  width: 100%;
  min-height: 82px;
  display: grid;
  grid-template-columns: 64px 1fr;
  align-items: center;
  padding: 0;
  border: 0;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.06);
  text-align: left;
}

.mobile-company-document-attachments__item + .mobile-company-document-attachments__item {
  margin-top: 12px;
}

.mobile-company-document-attachments__icon {
  height: 100%;
  min-height: 82px;
  width: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f3f3;
}

.mobile-company-document-attachments__icon :deep(svg) {
  width: 34px;
  height: 34px;
  padding: 9px;
  border-radius: 999px;
  background: #3b82ff;
}

.mobile-company-document-attachments__copy {
  min-width: 100%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 14px;
}

.mobile-company-document-attachments__name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #151515;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 700;
}

.mobile-company-document-attachments__size {
  color: #a4a4a4;
  font-size: 10px;
  line-height: 1.1;
  font-weight: 400;
}
</style>
