<template>
  <!-- eslint-disable vue/no-v-html -->
  <NuxtPage v-if="isChildRoute" />

  <div
    v-else-if="currentDocument"
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
        {{ groupDetail.Number_Version }}
      </div>

      <h1 class="mobile-company-document-detail__title">
        {{ groupDetail.RequestName }}
      </h1>

      <div
        v-if="previewFileList.length"
        class="mobile-company-document-detail__files"
      >
        <button
          v-for="file in visiblePreviewFileList"
          :key="file.id || file.osid || file.filename"
          type="button"
          class="mobile-company-document-detail__file"
          @click="openPreview"
        >
          <IconCustom
            name="document"
            :size="20"
            color="#B10F49"
          />
          <span>{{ file.filename }}</span>
        </button>
        <span
          v-if="morePreviewFileCount"
          class="mobile-company-document-detail__file-more"
          @click="openAttachmentList"
        >
          +{{ morePreviewFileCount }}
        </span>
      </div>

      <div class="mobile-company-document-detail__meta">
        <div class="mobile-company-document-detail__meta-item">
          <span class="mobile-company-document-detail__meta-label">{{ t('pages.companyDocuments.fields.createdBy') }}</span>
          <span class="mobile-company-document-detail__meta-value">{{ groupDetail.createdby }}</span>
        </div>
        <div class="mobile-company-document-detail__meta-item">
          <span class="mobile-company-document-detail__meta-label">{{ t('pages.companyDocuments.fields.createdDate') }}</span>
          <span class="mobile-company-document-detail__meta-value">{{ groupDetail.createddate }}</span>
        </div>
        <div class="mobile-company-document-detail__meta-item">
          <span class="mobile-company-document-detail__meta-label">{{ t('pages.companyDocuments.fields.publishedDate') }}</span>
          <span class="mobile-company-document-detail__meta-value">{{ groupDetail.RequestPublishDate }}</span>
        </div>
      </div>
      <div
        class="mobile-company-document-detail__paragraphs"
        v-html="groupDetail.content_display"
      />
      <div class="mobile-company-document-detail__checkboxes">
        <label class="mobile-company-document-detail__checkbox-row">
          <input
            v-model="accepted"
            :disabled="isAcknowledged"
            type="checkbox"
            class="mobile-company-document-detail__checkbox"
          >
          <div
            v-if="groupDetail.footer_display"
            class="mobile-company-document-detail__footer"
            v-html="groupDetail.footer_display"
          />
        </label>
        <button
          v-if="!isAcknowledged"
          type="button"
          class="mobile-company-document-detail__accept"
          :class="{ 'is-ready': canAccept }"
          :disabled="!canAccept"
          @click="acceptDocument"
        >
          <span>{{ t('pages.companyDocuments.actions.accept') }}</span>
          <IconCustom
            name="check"
            :size="20"
            color="currentColor"
            class="mobile-company-document-detail__accept-icon"
          />
        </button>
      </div>
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
import type { CompanyDocumentDetailResponseItem, CompanyDocumentPreviewFile } from '~/types/documentManagement'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()
const documentStore = useDocumentManagementStore()

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const groupTitle = computed(() => String(route.query.groupTitle || groupSlug.value))
const documentSlug = computed(() => String(route.params.document || ''))
const isChildRoute = computed(() => route.path.endsWith('/preview') || route.path.endsWith('/list'))
const accepted = ref(false)

const currentDocument = computed<CompanyDocumentDetailResponseItem | null>(() => {
  return documentStore.documentsList.find((document) => {
    return String(document.mainTable?.id || '') === documentSlug.value
  }) || null
})

const groupDetail = computed<any>(() => {
  return currentDocument.value?.mainTable
})

const isAcknowledged = computed(() => {
  return groupDetail.value?.readstatus === '已签署'
    || groupDetail.value?.readstatus === 'Acknowledged'
    || Boolean(groupDetail.value?.acknowledgedate_display)
})

const canAccept = computed(() => accepted.value && !isAcknowledged.value)

const previewFileList = computed<CompanyDocumentPreviewFile[]>(() => {
  return currentDocument.value?.detail2 || []
})

const visiblePreviewFileList = computed(() => {
  return previewFileList.value.slice(0, 1)
})

const morePreviewFileCount = computed(() => {
  return Math.max(0, previewFileList.value.length - visiblePreviewFileList.value.length)
})

const handleBack = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}`,
    query: {
      title: groupTitle.value,
    },
  })
}

const openAttachmentList = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(documentSlug.value)}/list`,
  })
}

const openPreview = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(documentSlug.value)}/list`,
  })
}

const acceptDocument = () => {
  if (!canAccept.value) {
    return
  }

  documentStore.acknowledgeDocument(documentSlug.value)
  accepted.value = true
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}`,
    query: {
      title: groupTitle.value,
      acknowledgedTitle: groupDetail.value?.Number_Version || groupDetail.value?.RequestName || documentSlug.value,
    },
  })
}

watch(isAcknowledged, (value) => {
  accepted.value = value
}, { immediate: true })
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
  font-size: 15px;

  span {
    font-family: Source Sans Pro;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #A60A3A;
  }
}

.mobile-company-document-detail__content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 40px;
}

.mobile-company-document-detail__code {
  margin-bottom: 8px;
  color: #000000;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

}

.mobile-company-document-detail__title {
  margin: 0 0 16px;
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  color: #000000;
}

.mobile-company-document-detail__files {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  margin-bottom: 18px;
  overflow: hidden;
}

.mobile-company-document-detail__file {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 999px;
  font-size: 13px;
  line-height: 1.3;
  min-width: 0;
  max-width: calc(100% - 58px);
}

.mobile-company-document-detail__file span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #616161;

}

.mobile-company-document-detail__file-more {
  min-width: 52px;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid #d7d7d7;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #616161;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.mobile-company-document-detail__meta {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}

.mobile-company-document-detail__meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-company-document-detail__meta-label {
  color: #000000;
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 20px;
  letter-spacing: 0%;

}

.mobile-company-document-detail__meta-value {
  color: #000000;
  font-family: Source Sans Pro;
  font-weight: 4000;
  font-style: SemiBold;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 20px;
  letter-spacing: 0%;
}

.mobile-company-document-detail__paragraphs {
  margin-bottom: 18px;
  font-size: 15px;
  line-height: 1.58;
  color: #252525;
}

.mobile-company-document-detail__footer {
  font-size: 15px;
  line-height: 1.58;
  color: #252525;
}

.mobile-company-document-detail__paragraphs :deep(*),
.mobile-company-document-detail__footer :deep(*) {
  font-size: inherit !important;
  line-height: inherit !important;
  color: inherit;
}

.mobile-company-document-detail__paragraphs :deep(p),
.mobile-company-document-detail__footer :deep(p) {
  margin: 0;
}

.mobile-company-document-detail__paragraphs :deep(p + p),
.mobile-company-document-detail__footer :deep(p + p) {
  margin-top: 12px;
}

.mobile-company-document-detail__checkboxes {
  margin-top: 22px;
}

.mobile-company-document-detail__checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  max-width: 100%;
  font-size: 14px;
  line-height: 1.45;
  color: #252525;
}

.mobile-company-document-detail__acknowledgement-text {
  margin: 0 0 16px;
  text-align: center;
  font-size: 14px;
  line-height: 1.45;
  color: #252525;
}

.mobile-company-document-detail__checkbox {
  width: 16px;
  height: 16px;
  margin: 2px 0 0;
  accent-color: #A60A3A;
  flex-shrink: 0;
}

.mobile-company-document-detail__accept {
  width: 134px;
  height: 42px;
  margin: 20px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 6px;
  background: #a60a3a;
  color: #ffffff;

  span {
    font-family: Source Sans Pro;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    box-shadow: 0 5px 10px rgba(166, 10, 58, 0.22);
    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
}

.mobile-company-document-detail__accept.is-ready {
  background: #b10f49;
  color: #ffffff;
  box-shadow: 0 6px 14px rgba(177, 15, 73, 0.32);
}

.mobile-company-document-detail__accept.is-ready:active {
  transform: translateY(1px);
}

.mobile-company-document-detail__accept:disabled {
  background: #f2f2f2;
  color: #b4b4b4;
  box-shadow: none;
  transform: none;
}

.mobile-company-document-detail__accept-icon {
  font-size: 14px;
  line-height: 1;
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
