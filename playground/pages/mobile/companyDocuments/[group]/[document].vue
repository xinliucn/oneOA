<template>
  <div
    v-if="group && documentDetail"
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
        <span>{{ group.title }}</span>
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

      <div class="mobile-company-document-detail__paragraphs">
        <p>请你在同意之前，仔细阅读本政策。点击“同意”按钮，代表你愿意遵守本政策内容。</p>
        <p>请你在同意之前，仔细阅读本政策。点击“同意”按钮，代表你愿意遵守本政策内容。</p>
        <p>Please read this policy carefully before clicking the "Accept" button. Your acceptance to this policy means you agree to comply with the policy content.</p>
      </div>

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
import { findCompanyDocumentDetail, findCompanyDocumentGroup } from '../data'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const documentSlug = computed(() => String(route.params.document || ''))
const group = computed(() => findCompanyDocumentGroup(groupSlug.value))
const documentDetail = computed(() => findCompanyDocumentDetail(groupSlug.value, documentSlug.value))
const accepted = ref(false)

const handleBack = () => {
  return navigateTo(`/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}`)
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

.mobile-company-document-detail__paragraphs p {
  margin: 0;
}

.mobile-company-document-detail__paragraphs p + p {
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
