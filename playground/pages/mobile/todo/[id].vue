<template>
  <NuxtPage v-if="isAttachmentRoute" />

  <MobileLoadingScreen
    v-else-if="isPageLoading"
    :title="t('common.loading')"
  />

  <div
    v-else
    class="mobile-approval"
  >
    <MobileToast />

    <header class="mobile-approval__header">
      <button
        class="mobile-approval__back"
        type="button"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
        />
      </button>
      <h1 class="mobile-approval__header-title">
        {{ headerTitle }}
      </h1>
      <div class="mobile-approval__header-spacer" />
    </header>

    <main class="mobile-approval__content">
      <section
        v-if="workflowDetail"
        class="mobile-approval__sheet"
      >
        <div class="mobile-approval__meta">
          <span class="mobile-approval__ref">
            {{ workflowDetail.processInfo?.requestId }}
          </span>
          <span
            class="mobile-approval__status-text"
            :class="'is-pending'"
          >
            {{ workflowDetail.processInfo?.status }}
          </span>
        </div>

        <h2 class="mobile-approval__title">
          {{ workflowDetail.processInfo?.requestName }}
        </h2>

        <div class="mobile-approval__submitter">
          <div class="mobile-approval__submitter-avatar">
            <IconCustom
              name="personnel"
              :size="18"
              color="#ffffff"
            />
          </div>
          <div class="mobile-approval__submitter-info">
            <span class="mobile-approval__submitter-label">{{ t('mobile.approval.submitterLabel') }}</span>
            <span class="mobile-approval__submitter-name">{{ workflowDetail.processInfo?.submittedBy }}</span>
          </div>
          <span class="mobile-approval__submitter-date">{{ workflowDetail.processInfo?.submittedDate }}</span>
        </div>

        <div class="mobile-approval__progress">
          <div
            class="mobile-approval__progress-bar"
            :class="'is-pending'"
          >
            {{ workflowDetail.processInfo?.status }}
          </div>
          <div
            v-if="timelineItems"
            class="mobile-approval__timeline"
          >
            <div
              v-for="approver in timelineItems"
              :key="approver.id"
              class="mobile-approval__timeline-item"
            >
              <div class="mobile-approval__timeline-marker">
                <div
                  class="mobile-approval__timeline-avatar"
                  :class="'is-approved'"
                >
                  <IconCustom
                    name="personnel"
                    :size="14"
                    color="#ffffff"
                  />
                </div>
              </div>
              <div class="mobile-approval__timeline-info">
                <span class="mobile-approval__timeline-name">{{ approver.nodeName }}</span>
                <span class="mobile-approval__timeline-date">
                  {{ approver.userName }}<template v-if="approver.receivedate"> {{ approver.receivedate }}</template>
                </span>
              </div>
            </div>
            <button
              v-if="allTimelineItems && allTimelineItems.length > timelinePreviewCount"
              type="button"
              class="mobile-approval__show-more"
              @click="showAllApprovers = !showAllApprovers"
            >
              {{ showAllApprovers ? t('mobile.approval.actions.showLess') : t('mobile.approval.actions.showMore') }}
            </button>
          </div>
        </div>

        <div
          v-if="attachments && firstAttachment"
          class="mobile-approval__attachments"
        >
          <NuxtLink
            :to="attachmentRoute"
            class="mobile-approval__attachment"
          >
            <span class="mobile-approval__attachment-icon">
              <IconCustom
                name="document"
                :size="13"
                color="#3b82f6"
              />
            </span>
            <span class="mobile-approval__attachment-name">{{ firstAttachment.name }}</span>
          </NuxtLink>
          <NuxtLink
            v-if="attachments.length > 1"
            :to="attachmentRoute"
            class="mobile-approval__attachment mobile-approval__attachment--count"
          >
            +{{ attachments.length - 1 }}
          </NuxtLink>
        </div>

        <div class="mobile-approval__fields">
          <div
            v-for="field in formFields"
            :key="field.label"
            class="mobile-approval__field"
          >
            <span class="mobile-approval__field-label">{{ field.label }}</span>
            <span class="mobile-approval__field-value">{{ field.value || '-' }}</span>
          </div>
        </div>

        <button
          type="button"
          class="mobile-approval__link"
          @click="openWorkflowDetail"
        >
          {{ t('mobile.approval.workflowDetailLabel', {
            workflowName:
              workflowDetail.processInfo?.workflowBaseInfo?.workflowName
              || 'Workflow' }) }} &gt;
        </button>
      </section>
      <section
        v-else
        class="mobile-approval__state"
      >
        {{ workflowError || t('mobile.todo.detail.empty') }}
      </section>
    </main>

    <footer
      v-if="actionMode !== 'viewOnly'"
      class="mobile-approval__footer"
    >
      <textarea
        v-if="actionMode === 'approveReject'"
        v-model="actionComment"
        class="mobile-approval__comment"
        :placeholder="t('mobile.approval.actions.commentPlaceholder')"
      />
      <div
        v-if="actionMode === 'approveReject'"
        class="mobile-approval__actions mobile-approval__actions--approval"
      >
        <button
          type="button"
          class="mobile-approval__action mobile-approval__action--approve"
          :class="{ active: selectedAction === 'Approve' }"
          @click="selectAction('Approve')"
        >
          {{ t('mobile.approval.actions.approve') }}
        </button>
        <button
          type="button"
          class="mobile-approval__action mobile-approval__action--reject"
          :class="{ active: selectedAction === 'Reject' }"
          @click="selectAction('Reject')"
        >
          {{ t('mobile.approval.actions.reject') }}
        </button>
      </div>
      <button
        type="button"
        class="mobile-approval__confirm"
        :disabled="isConfirmDisabled"
        @click="handleConfirm"
      >
        {{ submittingAction ? t('mobile.approval.actions.submitting') : confirmButtonLabel }}
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { ApprovalAction } from '~/types/approval'
import { getWorkflowFieldText } from '~/utils/todo'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const { t } = useAppI18n()
const route = useRoute()
const todosStore = useTodosStore()
const { openGuardedUrl } = useNetworkGuard()
const { showToast } = useMobileToast()
const requestId = computed(() => String(route.params.id || '').trim())
const isAttachmentRoute = computed(() => route.path.includes('/attachments'))
const headerTitle = computed(() => {
  const notificationReference = typeof route.query.notificationReference === 'string'
    ? route.query.notificationReference.trim()
    : ''

  if (notificationReference) {
    return t('mobile.approval.notificationTitleWithReference', {
      reference: notificationReference,
    })
  }

  const title = typeof route.query.title === 'string' ? route.query.title : 'approval'
  return t(`tasks.tabs.${title}`)
})
const isPageLoading = computed(() => {
  if (!requestId.value) {
    return false
  }
  return Boolean(todosStore.workflowFormLoadingById[requestId.value])
    || (!todosStore.workflowForms[requestId.value] && !todosStore.workflowFormErrorById[requestId.value])
})
const workflowDetail = computed(() => {
  return requestId.value ? todosStore.workflowForms[requestId.value] : undefined
})
const workflowError = computed(() => {
  return requestId.value ? todosStore.workflowFormErrorById[requestId.value] : null
})
const selectedAction = ref<ApprovalAction | ''>('')
const actionComment = ref('')
const submittingAction = ref(false)
const showAllApprovers = ref(false)
const timelinePreviewCount = 2
const allTimelineItems = computed(() => {
  return requestId.value ? todosStore.currentWorkflowOperators[requestId.value] : undefined
})
const timelineItems = computed(() => {
  if (!allTimelineItems.value) {
    return undefined
  }
  return showAllApprovers.value ? allTimelineItems.value : allTimelineItems.value.slice(0, timelinePreviewCount)
})
const attachments = computed(() => {
  return requestId.value ? todosStore.workflowFormAttachments[requestId.value] : undefined
})
const firstAttachment = computed(() => {
  return attachments.value?.[0]
})
const attachmentRoute = computed(() => {
  return {
    path: `/mobile/todo/${requestId.value}/attachments`,
  }
})

const formFields = computed(() => {
  const detail = workflowDetail.value
  if (!detail) {
    return []
  }

  const fieldConfigs: Array<[string, string]> = [
    ['mobile.approval.fields.contractName', 'TitleReferenceNoOfContract'],
    ['mobile.approval.fields.dchSigningEntity', 'dchsigningentity1'],
    ['mobile.approval.fields.counterpartyName', 'CounterpartyName_MultiLine'],
    ['mobile.approval.fields.contractAmountHkd', 'ContractAmountHKD'],
    ['mobile.approval.fields.contractStartDate', 'contractstartdate'],
    ['mobile.approval.fields.contractEndDate', 'contractenddate'],
  ]

  return fieldConfigs.map(([labelKey, fieldName]) => ({
    label: t(labelKey),
    value: getWorkflowFieldText(detail, fieldName),
  }))
})
const currentNodeType = computed(() => {
  return String(workflowDetail.value?.formInfo?.params?.currentnodetype || '')
})
const actionMode = computed<'approveReject' | 'submit' | 'viewOnly'>(() => {
  if (currentNodeType.value === '1') {
    return 'approveReject'
  }

  if (currentNodeType.value === '0' || currentNodeType.value === '2') {
    return 'submit'
  }

  return 'viewOnly'
})
const confirmButtonLabel = computed(() => {
  return workflowDetail.value?.processInfo?.submitButtonName || t('mobile.approval.actions.submit')
})
const isConfirmDisabled = computed(() => {
  return submittingAction.value || (actionMode.value === 'approveReject' && selectedAction.value !== 'Approve')
})
const approvePayload = computed(() => {
  const params = workflowDetail.value?.formInfo?.params

  return {
    requestId: requestId.value,
    nodeId: String(params?.nodeid ?? params?.currentnodeid ?? ''),
    workflowId: String(params?.workflowid ?? ''),
    remark: actionComment.value,
  }
})

const handleBack = () => navigateTo('/mobile/todo')

const rejectWorkflow = async () => {
  if (!requestId.value || submittingAction.value) {
    return
  }

  submittingAction.value = true
  try {
    const response = await todosStore.rejectWorkflowRequest(requestId.value)
    showToast(response?.code === 'SUCCESS' ? t('mobile.approval.actions.rejected') : t('mobile.approval.actions.rejectFailed'), response?.code === 'SUCCESS' ? 'reject' : 'error')
    if (response?.code === 'SUCCESS') {
      await navigateTo('/mobile/todo')
    }
  }
  catch {
    showToast(t('mobile.approval.actions.rejectFailed'), 'error')
  }
  finally {
    submittingAction.value = false
  }
}

const selectAction = (action: ApprovalAction) => {
  selectedAction.value = action

  if (action === 'Reject') {
    void rejectWorkflow()
  }
}

const handleConfirm = async () => {
  if (submittingAction.value) {
    return
  }

  if (actionMode.value === 'approveReject' && selectedAction.value !== 'Approve') {
    return
  }

  submittingAction.value = true
  try {
    const response = await todosStore.approveWorkflowRequest(approvePayload.value)
    showToast(response?.code === 'SUCCESS' ? t('mobile.approval.actions.submitted') : t('mobile.approval.actions.submitFailed'), response?.code === 'SUCCESS' ? 'success' : 'error')
    if (response?.code === 'SUCCESS') {
      await navigateTo('/mobile/todo')
    }
  }
  catch {
    showToast(t('mobile.approval.actions.submitFailed'), 'error')
  }
  finally {
    submittingAction.value = false
  }
}

const openWorkflowDetail = async () => {
  if (!requestId.value) {
    return
  }

  const workflowUrl = await todosStore.fetchWorkflowFormWeaverUrl(requestId.value)
  if (workflowUrl) {
    await openGuardedUrl(workflowUrl.mobileUrl, '_self')
  }
}

onMounted(() => {
  void todosStore.fetchWorkflowForm(requestId.value)
  void todosStore.fetchCurrentWorkflowOperators(requestId.value)
  void todosStore.fetchWorkflowFormAttachments(requestId.value)
})
</script>

<style scoped>
.mobile-approval {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.mobile-approval--loading {
  justify-content: center;
}

.mobile-approval__loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  color: #7a454f;
}

.mobile-approval__loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(166, 10, 58, 0.16);
  border-top-color: #a60a3a;
  border-radius: 999px;
  animation: mobile-approval-spin 0.9s linear infinite;
}

.mobile-approval__loading-text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.mobile-approval__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 10px;
  color: #3d2f2f;
}

.mobile-approval__back {
  min-width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: #7a454f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 8px;
  box-shadow: 0 8px 16px rgba(166, 10, 58, 0.12);
}

.mobile-approval__back-label {
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.mobile-approval__header-title {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-approval__header-spacer {
  width: 32px;
  height: 32px;
}

.mobile-approval__content {
  flex: 1;
  padding: 0;
}

.mobile-approval__sheet {
  background: #ffffff;
  border-radius: 0;
  padding: 6px 16px 18px;
  min-height: auto;
  box-shadow: none;
}

.mobile-approval__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.mobile-approval__ref,
.mobile-approval__status-text {
  font-size: 11px;
}

.mobile-approval__ref {
  color: #3d3d3d;
}

.mobile-approval__status-text {
  font-weight: 600;
}

.mobile-approval__title {
  margin: 0 0 14px;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 700;
  color: #181818;
}

.mobile-approval__submitter {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.mobile-approval__submitter-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #d2d6db;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-approval__submitter-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mobile-approval__submitter-label,
.mobile-approval__submitter-date {
  font-size: 10px;
  color: #a2a2a2;
}

.mobile-approval__submitter-name {
  font-size: 12px;
  color: #343434;
}

.mobile-approval__submitter-date {
  text-align: right;
}

.mobile-approval__progress {
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.mobile-approval__progress-bar {
  padding: 6px 10px;
  border-radius: 0;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.mobile-approval__timeline {
  background: #f3f3f3;
  border-radius: 0;
  padding: 10px 12px 12px;
}

.mobile-approval__timeline-item {
  display: flex;
  gap: 10px;
}

.mobile-approval__timeline-marker {
  width: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.mobile-approval__timeline-avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-approval__timeline-line {
  width: 0;
  flex: 1;
  border-left: 2px dotted #b8b8b8;
  margin: 4px 0;
}

.mobile-approval__timeline-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 10px;
}

.mobile-approval__timeline-name {
  font-size: 12px;
  font-weight: 600;
  color: #1f1f1f;
}

.mobile-approval__timeline-date {
  font-size: 10px;
  color: #7a7a7a;
}

.mobile-approval__show-more {
  margin-top: 2px;
  padding: 0;
  background: transparent;
  border: none;
  color: #a60a3a;
  font-size: 12px;
  text-align: left;
}

.mobile-approval__attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 0 16px;
}

.mobile-approval__attachment {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: min(190px, 100%);
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  border: 1px solid #d8dde6;
  background: #ffffff;
  color: #5f6673;
  font-size: 13px;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.mobile-approval__attachment-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
}

.mobile-approval__attachment-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-approval__attachment--count {
  justify-content: center;
  min-width: 38px;
  max-width: none;
  padding: 0 10px;
  color: #7f8794;
}

.mobile-approval__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-approval__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-approval__field--comment {
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f7f7f7;
}

.mobile-approval__field-label {
  font-size: 10px;
  color: #A3AAB2;
  font-weight: 600;
}

.mobile-approval__field-value {
  font-size: 13px;
  color: #171717;
  line-height: 1.4;
}

.mobile-approval__link {
  margin-top: 16px;
  padding: 0;
  border: none;
  background: transparent;
  color: #d14b60;
  font-size: 12px;
  text-align: left;
}

.mobile-approval__footer {
  position: sticky;
  bottom: 0;
  padding: 12px 12px calc(14px + env(safe-area-inset-bottom, 0px));
  background: #ffffff;
  border-top: 1px solid #efefef;
  box-shadow: none;
}

.mobile-approval__comment {
  width: 100%;
  min-height: 72px;
  border: none;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 12px;
  resize: none;
  font-size: 13px;
  color: #222222;
  margin-bottom: 10px;
}

.mobile-approval__actions {
  display: grid;
  grid-template-columns: 1fr 1fr 40px;
  gap: 8px;
  margin-bottom: 10px;
}

.mobile-approval__actions--approval {
  grid-template-columns: 1fr 1fr;
}

.mobile-approval__action {
  border: none;
  border-radius: 6px;
  padding: 10px 8px;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.mobile-approval__action--approve {
  background: #dff4dc;
  color: #2d8c38;
}

.mobile-approval__action--reject {
  background: #f3f3f3;
  color: #a0a0a0;
}

.mobile-approval__action--more {
  background: #fff6f8;
  color: #a60a3a;
}

.mobile-approval__action.active {
  outline: none;
}

.mobile-approval__action--approve.active {
  background: #199d34;
  color: #ffffff;
}

.mobile-approval__action--reject.active {
  background: #d04848;
  color: #ffffff;
}

.mobile-approval__action--more.active {
  background: #a60a3a;
  color: #ffffff;
}

.mobile-approval__confirm {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 12px;
  background: #efefef;
  color: #8f8f8f;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mobile-approval__confirm:not(:disabled) {
  background: #efd4dc;
  color: #a60a3a;
}

.mobile-approval__empty {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #111111;
  color: #ffffff;
}

.mobile-approval__empty-title {
  font-size: 16px;
  margin: 0;
}

.mobile-approval__empty-back {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 13px;
}

.mobile-approval__status-text.is-pending {
  color: #d48d00;
}

.mobile-approval__status-text.is-approved {
  color: #2f8d3a;
}

.mobile-approval__status-text.is-rejected {
  color: #d04848;
}

.mobile-approval__progress-bar.is-pending,
.mobile-approval__timeline-avatar.is-pending {
  background-color: #d79e00;
}

.mobile-approval__progress-bar.is-approved,
.mobile-approval__timeline-avatar.is-approved {
  background-color: #199d34;
}

.mobile-approval__progress-bar.is-rejected,
.mobile-approval__timeline-avatar.is-rejected {
  background-color: #d04848;
}

@keyframes mobile-approval-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
