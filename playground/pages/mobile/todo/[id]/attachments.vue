<template>
  <NuxtPage v-if="isPreviewRoute" />

  <div
    v-else
    class="mobile-todo-attachments"
  >
    <header class="mobile-todo-attachments__header">
      <button
        type="button"
        class="mobile-todo-attachments__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
      </button>
      <h1 class="mobile-todo-attachments__title">
        {{ t('mobile.todo.detail.attachments') }}
      </h1>
      <div class="mobile-todo-attachments__spacer" />
    </header>

    <main class="mobile-todo-attachments__content">
      <div
        v-if="loading"
        class="mobile-todo-attachments__state"
      >
        {{ t('common.loading') }}
      </div>

      <div
        v-else-if="attachments && attachments.length === 0"
        class="mobile-todo-attachments__state"
      >
        {{ t('mobile.todo.detail.emptyAttachments') }}
      </div>

      <template v-else-if="attachments">
        <button
          v-for="attachment in attachments"
          :key="attachment.id"
          type="button"
          class="mobile-todo-attachments__item"
          @click="openAttachment(attachment.id)"
        >
          <span class="mobile-todo-attachments__icon">
            <IconCustom
              name="document"
              :size="17"
              color="#ffffff"
            />
          </span>
          <span class="mobile-todo-attachments__info">
            <span class="mobile-todo-attachments__name">{{ attachment.name || attachment.filename || attachment.fileName }}</span>
            <span class="mobile-todo-attachments__meta">{{ attachment.createdate }} {{ attachment.createtime }}</span>
          </span>
        </button>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth',
})

const route = useRoute()
const todosStore = useTodosStore()
const { t } = useAppI18n()

const requestId = computed(() => String(route.params.id || '').trim())
const isPreviewRoute = computed(() => /\/attachments\/[^/]+/.test(route.path))
const attachments = computed(() => {
  return requestId.value ? todosStore.workflowFormAttachments[requestId.value] : undefined
})
const loading = computed(() => {
  return requestId.value ? todosStore.workflowFormAttachmentsLoadingById[requestId.value] : false
})

const handleBack = () => {
  return navigateTo(`/mobile/todo/${requestId.value}`)
}

const openAttachment = (attachmentId: string | number) => {
  return navigateTo(`/mobile/todo/${requestId.value}/attachments/${attachmentId}`)
}

onMounted(() => {
  void todosStore.fetchWorkflowFormAttachments(requestId.value)
})
</script>

<style scoped>
.mobile-todo-attachments {
  min-height: 100vh;
  background: #f3f3f3;
  color: #111827;
}

.mobile-todo-attachments__header {
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

.mobile-todo-attachments__back {
  width: 34px;
  height: 34px;
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.mobile-todo-attachments__title {
  margin: 0;
  color: #111111;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.mobile-todo-attachments__spacer {
  width: 34px;
  height: 34px;
}

.mobile-todo-attachments__content {
  padding: 14px;
}

.mobile-todo-attachments__state {
  padding: 48px 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.mobile-todo-attachments__item {
  width: 100%;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #111827;
  text-align: left;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.mobile-todo-attachments__item + .mobile-todo-attachments__item {
  margin-top: 10px;
}

.mobile-todo-attachments__icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #3b82f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 34px;
}

.mobile-todo-attachments__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-todo-attachments__name {
  overflow: hidden;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-todo-attachments__meta {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.2;
}
</style>
