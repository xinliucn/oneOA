<template>
  <NuxtPage v-if="isPreviewRoute" />

  <div v-else class="mobile-approval-attachments">
    <header class="mobile-approval-attachments__header">
      <button
        type="button"
        class="mobile-approval-attachments__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
      </button>
      <h1 class="mobile-approval-attachments__title">
        Attachments
      </h1>
      <div class="mobile-approval-attachments__spacer" />
    </header>

    <main class="mobile-approval-attachments__content">
      <div
        v-if="loading"
        class="mobile-approval-attachments__state"
      >
        Loading...
      </div>

      <div
        v-else-if="attachments.length === 0"
        class="mobile-approval-attachments__state"
      >
        No attachments
      </div>

      <template v-else>
        <button
          v-for="attachment in attachments"
          :key="attachment.id"
          type="button"
          class="mobile-approval-attachments__item"
          @click="openAttachment(attachment)"
        >
          <span class="mobile-approval-attachments__icon">
            <IconCustom
              name="document"
              :size="17"
              color="#ffffff"
            />
          </span>
          <span class="mobile-approval-attachments__info">
            <span class="mobile-approval-attachments__name">{{ attachment.name }}</span>
            <span class="mobile-approval-attachments__meta">{{ getAttachmentSize(attachment) }}</span>
          </span>
        </button>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowFormAttachment } from '~/composables/useToDoData'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const route = useRoute()
const { formAttachments, getFormAttachments } = useToDoData()

const approvalId = computed(() => String(route.params.id || ''))
const requestId = computed(() => String(route.query.requestId || approvalId.value))
const isPreviewRoute = computed(() => /\/attachments\/[^/]+/.test(route.path))
const loading = ref(false)
const attachments = computed(() => formAttachments.value)

const getAttachmentSize = (attachment: WorkflowFormAttachment) => {
  const rawSize = attachment.raw.size || attachment.raw.filesize || attachment.raw.fileSize
  const size = Number(rawSize)

  if (!Number.isFinite(size) || size <= 0) {
    return '4 KB'
  }

  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

const handleBack = () => {
  return navigateTo({
    path: `/mobile/approval/${approvalId.value}`,
    query: {
      requestId: requestId.value,
    },
  })
}

const openAttachment = (attachment: WorkflowFormAttachment) => {
  return navigateTo({
    path: `/mobile/approval/${approvalId.value}/attachments/${attachment.id}`,
    query: {
      requestId: requestId.value,
    },
  })
}

watch(
  requestId,
  async (id) => {
    if (!id) {
      return
    }

    loading.value = true
    try {
      await getFormAttachments(id)
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.mobile-approval-attachments {
  min-height: 100vh;
  background: #f3f3f3;
  color: #111827;
}

.mobile-approval-attachments__header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  min-height: 68px;
  padding: 12px 18px 8px;
  background: #ffffff;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.05);
}

.mobile-approval-attachments__back {
  width: 34px;
  height: 34px;
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.mobile-approval-attachments__title {
  margin: 0;
  color: #111111;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.mobile-approval-attachments__spacer {
  width: 34px;
  height: 34px;
}

.mobile-approval-attachments__content {
  padding: 10px 36px 32px;
}

.mobile-approval-attachments__item {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 18px;
  border: 0;
  border-radius: 12px;
  padding: 13px 16px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  text-align: left;
}

.mobile-approval-attachments__item + .mobile-approval-attachments__item {
  margin-top: 14px;
}

.mobile-approval-attachments__icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #3b82f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
}

.mobile-approval-attachments__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mobile-approval-attachments__name {
  color: #161616;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-approval-attachments__meta {
  color: #a4adb8;
  font-size: 9px;
  line-height: 1.2;
}

.mobile-approval-attachments__state {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a94a3;
  font-size: 13px;
}
</style>
