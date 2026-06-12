<template>
  <NuxtPage v-if="isAttachmentRoute" />

  <div
    v-else-if="isPageLoading"
    class="mobile-approval mobile-approval--loading"
  >
    <main class="mobile-approval__loading">
      <span class="mobile-approval__loading-spinner" />
      <p class="mobile-approval__loading-text">
        {{ t('common.loading') }}
      </p>
    </main>
  </div>

  <div v-else class="mobile-approval">
    <MobileToast />

    <header class="mobile-approval__header">
      <button class="mobile-approval__back" type="button" @click="handleBack">
        <IconCustom name="chevron-right" :size="18" :rotate="180" />
        <span class="mobile-approval__back-label">{{ backLabel }}</span>
      </button>
      <h1 class="mobile-approval__header-title">
        {{ headerTitle }}
      </h1>
      <div class="mobile-approval__header-spacer" />
    </header>

    <main class="mobile-approval__content">
      <section class="mobile-approval__sheet">
        <div class="mobile-approval__meta">
          <span class="mobile-approval__ref">{{ approvalSummary.referenceNumber }}</span>
          <span class="mobile-approval__status-text" :class="statusClass">{{ approvalSummary.status }}</span>
        </div>

        <h2 class="mobile-approval__title">
          {{ approvalSummary.title }}
        </h2>

        <div class="mobile-approval__submitter">
          <div class="mobile-approval__submitter-avatar">
            <IconCustom name="personnel" :size="18" color="#ffffff" />
          </div>
          <div class="mobile-approval__submitter-info">
            <span class="mobile-approval__submitter-label">{{ t('mobile.approval.submitterLabel') }}</span>
            <span class="mobile-approval__submitter-name">{{ approvalSummary.submittedBy }}</span>
          </div>
          <span class="mobile-approval__submitter-date">{{ approvalSummary.submittedDate }}</span>
        </div>

        <div class="mobile-approval__progress">
          <div class="mobile-approval__progress-bar" :class="statusClass">
            {{ approvalSummary.status }}
          </div>
          <div class="mobile-approval__timeline">
            <div v-for="approver in visibleTimelineItems" :key="approver.id" class="mobile-approval__timeline-item">
              <div class="mobile-approval__timeline-marker">
                <div class="mobile-approval__timeline-avatar" :class="getApproverStatusClass(approver.action)">
                  <IconCustom name="personnel" :size="14" color="#ffffff" />
                </div>
              </div>
              <div class="mobile-approval__timeline-info">
                <span class="mobile-approval__timeline-name">{{ approver.nodeName }}</span>
                <span class="mobile-approval__timeline-date">
                  {{ approver.action }}<template v-if="approver.date"> {{ approver.date }}</template>
                </span>
              </div>
            </div>
            <button v-if="timelineItems.length > timelinePreviewCount" type="button" class="mobile-approval__show-more"
              @click="showAllApprovers = !showAllApprovers">
              {{ showAllApprovers ? t('mobile.approval.actions.showLess') : t('mobile.approval.actions.showMore') }}
            </button>
          </div>
        </div>

        <div v-if="attachments.length > 0" class="mobile-approval__attachments">
          <NuxtLink :to="attachmentRoute" class="mobile-approval__attachment">
            <span class="mobile-approval__attachment-icon">
              <IconCustom name="document" :size="13" color="#3b82f6" />
            </span>
            <span class="mobile-approval__attachment-name">{{ attachments[0]?.name }}</span>
          </NuxtLink>
          <NuxtLink v-if="attachments.length > 1" :to="attachmentRoute"
            class="mobile-approval__attachment mobile-approval__attachment--count">
            +{{ attachments.length - 1 }}
          </NuxtLink>
        </div>

        <div class="mobile-approval__fields">
          <div v-for="field in formFields" :key="field.label" class="mobile-approval__field">
            <span class="mobile-approval__field-label">{{ field.label }}</span>
            <span class="mobile-approval__field-value">{{ field.value }}</span>
          </div>
        </div>

        <button type="button" class="mobile-approval__link" @click="openWorkflowDetail">
          {{ workflowDetailLabel }} &gt;
        </button>
      </section>
    </main>

    <footer v-if="actionMode !== 'viewOnly'" class="mobile-approval__footer">
      <textarea v-if="actionMode === 'approveReject'" v-model="actionComment" class="mobile-approval__comment"
        :placeholder="t('mobile.approval.actions.commentPlaceholder')" />
      <div v-if="actionMode === 'approveReject'" class="mobile-approval__actions mobile-approval__actions--approval">
        <button type="button" class="mobile-approval__action mobile-approval__action--approve"
          :class="{ active: selectedAction === 'Approve' }" @click="selectAction('Approve')">
          {{ t('mobile.approval.actions.approve') }}
        </button>
        <button type="button" class="mobile-approval__action mobile-approval__action--reject"
          :class="{ active: selectedAction === 'Reject' }" @click="selectAction('Reject')">
          {{ t('mobile.approval.actions.reject') }}
        </button>
      </div>
      <button type="button" class="mobile-approval__confirm" :disabled="isConfirmDisabled" @click="handleConfirm">
        {{ submittingAction ? t('mobile.approval.actions.submitting') : confirmButtonLabel }}
      </button>
    </footer>
  </div>

  <!-- <div v-else class="mobile-approval__empty">
    <p class="mobile-approval__empty-title">Approval not found</p>
    <button type="button" class="mobile-approval__empty-back" @click="handleBack">Back to list</button>
  </div> -->
</template>

<script setup lang="ts">
import type { ApprovalAction } from '~/types/approval'
import { formatRequestName } from '~/utils/todo'

const { form, getFormData } = useApplicationCatalog()
const { formAttachments, getFormAttachments } = useToDoData()
const toDoFrom: any = useState('mobile:todo-form', () => null)
const { showToast } = useMobileToast()
const { t } = useAppI18n()

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const route = useRoute()
const approvalId = computed(() => String(route.params.id || ''))
const requestId = computed(() => String(route.query.requestId || toDoFrom.value?.requestId || ''))
const todoView = computed(() => String(route.query.todoView || toDoFrom.value?.todoView || 'approvals'))
const isNotificationSource = computed(() => route.query.source === 'notification')
const isAttachmentRoute = computed(() => route.path.includes('/attachments'))
const showAllApprovers = ref(false)
const selectedAction = ref<ApprovalAction | ''>('')
const actionComment = ref('')
const submittingAction = ref(false)
const isPageLoading = ref(true)
const mobileActiveTab = useState('mobile:activeTab', () => 1)
const timelinePreviewCount = 2
let pageLoadVersion = 0

type WorkflowField = {
  fieldId?: string
  fieldName?: string
  fieldShowName?: string
  fieldValue?: string
  fieldShowValue?: string
  filedHtmlShow?: string
  view?: boolean
  edit?: boolean
  mand?: boolean
}

type MainFieldInfo = {
  fieldid?: string | number
  fieldname?: string
  selectattr?: {
    selectitemlist?: Array<{
      selectname?: string
      selectvalue?: string | number
    }>
  }
}

type TimelineItem = {
  id: string
  nodeName: string
  action: string
  date: string
}

const processInfo = computed(() => form.value?.processInfo ?? {})
const workflowBaseInfo = computed(() => processInfo.value?.workflowBaseInfo ?? toDoFrom.value?.workflowBaseInfo ?? {})
const workflowDetailLabel = computed(() => {
  const workflowName = stripHtml(
    workflowBaseInfo.value?.workflowName
    || workflowBaseInfo.value?.workFlowName
    || workflowBaseInfo.value?.workflowTypeName
    || toDoFrom.value?.workFlowName
    || toDoFrom.value?.workflowName
    || 'Workflow',
  )

  return t('mobile.approval.workflowDetailLabel', {
    workflowName: workflowName || 'Workflow',
  })
})
const workflowFields = computed<WorkflowField[]>(() => {
  return processInfo.value?.workflowMainTableInfo?.requestRecords?.[0]?.workflowRequestTableFields ?? []
})

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const stripHtml = (value?: string | number | null) => {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

const formatDate = (value?: string | null) => {
  const normalized = stripHtml(value)
  return normalized.split(' ')[0] || ''
}

const formatDateTime = (date?: string | null, time?: string | null) => {
  return [formatDate(date), stripHtml(time)].filter(Boolean).join(' at ')
}

const getFieldByName = (name: string) => {
  const normalizedName = name.toLowerCase()
  return workflowFields.value.find(field => field.fieldName === name || field.fieldName?.toLowerCase() === normalizedName)
}

const getFieldById = (id: string) => {
  return workflowFields.value.find(field => String(field.fieldId) === id)
}

const getFieldDisplayValue = (field?: WorkflowField) => {
  if (!field) {
    return ''
  }

  return stripHtml(field.fieldShowValue || field.filedHtmlShow || field.fieldValue)
}

const getMainFieldInfoByName = (name: string): MainFieldInfo | undefined => {
  const fieldInfoMap = form.value?.formInfo?.tableInfo?.main?.fieldinfomap
  if (!isRecord(fieldInfoMap)) {
    return undefined
  }

  const normalizedName = name.toLowerCase()
  return Object.values(fieldInfoMap).find((fieldInfo): fieldInfo is MainFieldInfo => {
    return isRecord(fieldInfo)
      && (fieldInfo.fieldname === name || String(fieldInfo.fieldname || '').toLowerCase() === normalizedName)
  })
}

const getSpecialObjectDisplayValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (isRecord(item)) {
        return stripHtml(String(item.name || item.showname || item.value || item.id || ''))
      }

      return stripHtml(String(item || ''))
    }).filter(Boolean).join(', ')
  }

  if (isRecord(value)) {
    return stripHtml(String(value.name || value.showname || value.value || value.id || ''))
  }

  return ''
}

const getMainFieldSelectValue = (fieldInfo: MainFieldInfo | undefined, value: unknown) => {
  const normalizedValue = String(value ?? '')
  const selectItem = fieldInfo?.selectattr?.selectitemlist?.find(item => String(item.selectvalue) === normalizedValue)
  return stripHtml(selectItem?.selectname || '')
}

const getMainFieldValue = (name: string) => {
  const fieldInfo = getMainFieldInfoByName(name)
  const fieldId = fieldInfo?.fieldid
  if (fieldId === undefined || fieldId === null) {
    return ''
  }

  const mainData = form.value?.formInfo?.maindata
  const fieldData = isRecord(mainData) ? mainData[`field${fieldId}`] : undefined
  if (!isRecord(fieldData)) {
    return ''
  }

  return getSpecialObjectDisplayValue(fieldData.specialobj)
    || getMainFieldSelectValue(fieldInfo, fieldData.value)
    || stripHtml(String(fieldData.value ?? ''))
}

const getFieldValue = (name: string, fallbackFieldId?: string) => {
  return getFieldDisplayValue(getFieldByName(name) || (fallbackFieldId ? getFieldById(fallbackFieldId) : undefined))
    || getMainFieldValue(name)
}

const getContractFieldValue = (name: string) => {
  return getFieldValue(name) || '-'
}

const approvalSummary = computed(() => {
  const requestMark = toDoFrom.value?.requestmark || getFieldValue('casenumber', '14904') || approvalId.value
  const status = processInfo.value?.status || toDoFrom.value?.status || 'Pending'
  const currentNodeName = processInfo.value?.currentNodeName || toDoFrom.value?.currentNodeName || ''

  return {
    referenceNumber: requestMark,
    status,
    processStatus: currentNodeName ? `${status} (${currentNodeName})` : status,
    title: formatRequestName(processInfo.value?.requestName || toDoFrom.value?.requestName) || requestMark,
    submittedBy: processInfo.value?.creatorName || toDoFrom.value?.creatorName || '-',
    submittedDate: formatDate(processInfo.value?.createTime || toDoFrom.value?.createTime || toDoFrom.value?.receiveTime),
    requestDate: formatDate(processInfo.value?.createTime || toDoFrom.value?.createTime),
    portfolio: workflowBaseInfo.value?.workflowTypeName || workflowBaseInfo.value?.workflowName || '-',
    businessUnit: getFieldValue('bu', '14576') || toDoFrom.value?.userSubcompanyName || '-',
  }
})

const formFields = computed(() => {
  return [
    {
      label: t('mobile.approval.fields.contractName'),
      value: getContractFieldValue('TitleReferenceNoOfContract'),
    },
    {
      label: t('mobile.approval.fields.dchSigningEntity'),
      value: getContractFieldValue('dchsigningentity1'),
    },
    {
      label: t('mobile.approval.fields.counterpartyName'),
      value: getContractFieldValue('CounterpartyName_MultiLine'),
    },
    {
      label: t('mobile.approval.fields.contractAmountHkd'),
      value: getContractFieldValue('ContractAmountHKD'),
    },
    {
      label: t('mobile.approval.fields.contractStartDate'),
      value: getContractFieldValue('contractstartdate'),
    },
    {
      label: t('mobile.approval.fields.contractEndDate'),
      value: getContractFieldValue('contractenddate'),
    },
  ]
})

const attachments = computed(() => {
  if (formAttachments.value.length > 0) {
    return formAttachments.value
  }

  const fileDatas = form.value?.formInfo?.maindata?.field14582?.specialobj?.filedatas

  if (!Array.isArray(fileDatas)) {
    return []
  }

  return fileDatas.map((file: Record<string, any>, index: number) => ({
    id: String(file.fileid || file.id || index),
    name: stripHtml(file.filename || file.name || file.fileName || `File ${index + 1}`),
  }))
})

const statusClass = computed(() => {
  const status = approvalSummary.value.status.toLowerCase()
  if (status.includes('reject') || status.includes('驳回')) {
    return 'is-rejected'
  }

  if (status.includes('approv') || status.includes('complete') || status.includes('submitted')) {
    return 'is-approved'
  }

  return 'is-pending'
})

const getApproverStatusClass = (action: string) => {
  const normalizedAction = action.toLowerCase()
  if (normalizedAction.includes('reject') || normalizedAction.includes('驳回')) {
    return 'is-rejected'
  }

  if (normalizedAction.includes('pending')) {
    return 'is-pending'
  }

  return 'is-approved'
}

const timelineItems = computed<TimelineItem[]>(() => {
  const logs = processInfo.value?.workflowRequestLogs
  const items: TimelineItem[] = Array.isArray(logs)
    ? logs.map((log: Record<string, any>, index: number) => ({
      id: String(log.id || `${log.nodeId || 'log'}-${index}`),
      nodeName: stripHtml(log.nodeName || log.operatorName || `Step ${index + 1}`),
      action: stripHtml(log.operateType || 'Processed'),
      date: formatDateTime(log.operateDate, log.operateTime),
    }))
    : []

  const currentNodeName = stripHtml(processInfo.value?.currentNodeName || toDoFrom.value?.currentNodeName)
  if (currentNodeName && !items.some(item => item.nodeName === currentNodeName)) {
    items.push({
      id: `current-${processInfo.value?.currentNodeId || toDoFrom.value?.currentNodeId || 'node'}`,
      nodeName: currentNodeName,
      action: approvalSummary.value.status,
      date: '',
    })
  }

  return items
})

const visibleTimelineItems = computed(() => {
  if (showAllApprovers.value) {
    return timelineItems.value
  }

  return timelineItems.value.slice(0, timelinePreviewCount)
})

const submitButtonName = computed(() => {
  const label = stripHtml(processInfo.value?.submitButtonName)
  if (!label || label === '提交') {
    return t('mobile.approval.actions.submit')
  }

  return label
})

const toBoolean = (value: any) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes'].includes(value.trim().toLowerCase())
  }

  if (typeof value === 'number') {
    return value === 1
  }

  return false
}

const formParams = computed(() => form.value?.formInfo?.params ?? {})
const hasEditableFields = computed(() => workflowFields.value.some(field => field.edit))
const hasSubmitParams = computed(() => Object.keys(form.value?.submitParams ?? {}).length > 0)
const currentNodeLabel = computed(() => {
  return stripHtml(
    processInfo.value?.currentNodeName
    || toDoFrom.value?.currentNodeName
    || approvalSummary.value.processStatus,
  )
})
const isApprovalLikeRequestNode = computed(() => {
  const label = [
    currentNodeLabel.value,
    stripHtml(processInfo.value?.submitButtonName),
    stripHtml(processInfo.value?.rejectButtonName),
  ].join(' ').toLowerCase()

  return /approval|approve|review|批准|審批|审批|審核|审核|復核|复核/.test(label)
})
const canRejectFromForm = computed(() => {
  return toBoolean(formParams.value.canSubmitToRejectNode)
    || Boolean(stripHtml(processInfo.value?.rejectButtonName))
})
const actionMode = computed<'approveReject' | 'submit' | 'viewOnly'>(() => {
  if (todoView.value === 'approvals') {
    return 'approveReject'
  }

  if (todoView.value === 'tasks') {
    return 'submit'
  }

  if (todoView.value === 'requests') {
    if (canRejectFromForm.value && isApprovalLikeRequestNode.value) {
      return 'approveReject'
    }

    if (hasEditableFields.value || hasSubmitParams.value || Boolean(stripHtml(processInfo.value?.submitButtonName))) {
      return 'submit'
    }

    return 'viewOnly'
  }

  return 'viewOnly'
})

const confirmButtonLabel = computed(() => {
  if (actionMode.value === 'approveReject') {
    return t('mobile.approval.actions.confirm')
  }

  return submitButtonName.value || t('mobile.approval.actions.submit')
})

const isConfirmDisabled = computed(() => {
  return submittingAction.value || (actionMode.value === 'approveReject' && !selectedAction.value)
})

const backLabel = computed(() => isNotificationSource.value ? t('notification.title') : '')

const headerTitle = computed(() => {
  if (isNotificationSource.value) {
    const reference = approvalSummary.value.referenceNumber || approvalId.value
    return reference
      ? t('mobile.approval.notificationTitleWithReference', { reference })
      : t('mobile.approval.notificationTitle')
  }

  if (todoView.value === 'requests') {
    return t('tasks.tabs.requests')
  }

  if (todoView.value === 'tasks') {
    return t('tasks.tabs.tasks')
  }

  return t('tasks.tabs.approval')
})

const handleBack = () => navigateTo(isNotificationSource.value ? '/mobile/notifications' : '/mobile')

const attachmentRoute = computed(() => {
  const requestQuery = {
    requestId: requestId.value || approvalId.value,
  }
  const attachment = attachments.value[0]

  if (attachments.value.length === 1 && attachment) {
    return {
      path: `/mobile/approval/${approvalId.value}/attachments/${attachment.id}`,
      query: requestQuery,
    }
  }

  return {
    path: `/mobile/approval/${approvalId.value}/attachments`,
    query: requestQuery,
  }
})

const getWorkflowDetailUrl = () => {
  const params = form.value?.formInfo?.params ?? {}
  const currentRequestId = String(params.requestid || requestId.value || approvalId.value)

  if (!currentRequestId) {
    return ''
  }

  return `https://platform-uat.dchbi.app/spa/workflow/static4mobileform/index.html#/req?requestid=${encodeURIComponent(currentRequestId)}`
}

const openWorkflowDetail = async () => {
  const detailUrl = getWorkflowDetailUrl()

  if (!detailUrl) {
    return
  }

  await navigateTo(detailUrl, {
    external: true,
  })
}

const selectAction = (action: ApprovalAction) => {
  selectedAction.value = action
}

const getActionToastMessage = (action: ApprovalAction, referenceNumber: string) => {
  if (action === 'Reject') {
    return `${referenceNumber} Rejected!`
  }

  return `${referenceNumber} Approved!`
}

const workflowFormActionEndpoint = '/api/todo/workflowFormAction' as string
const rejectRequestEndpoint = '/api/todo/rejectRequest' as string

const handleConfirm = async () => {
  if (isConfirmDisabled.value) {
    return
  }

  const action = actionMode.value === 'approveReject' ? selectedAction.value : ''
  const comment = actionComment.value
  const submitParams = form.value?.submitParams ?? {}
  const currentRequestId = String(submitParams.requestid ?? requestId.value ?? approvalId.value)
  const referenceNumber = approvalSummary.value.referenceNumber || requestId.value || approvalId.value

  submittingAction.value = true

  try {
    if (actionMode.value === 'approveReject' && action === 'Reject') {
      await $fetch(rejectRequestEndpoint, {
        method: 'POST',
        body: {
          requestId: currentRequestId,
        },
      })
    }
    else {
      await $fetch(workflowFormActionEndpoint, {
        method: 'POST',
        body: {
          ...submitParams,
          ...(actionMode.value === 'approveReject' ? { action } : {}),
          remark: comment,
          requestid: currentRequestId,
          requestId: currentRequestId,
        },
      })
    }

    showToast(
      actionMode.value === 'approveReject' && action
        ? getActionToastMessage(action, referenceNumber)
        : `${referenceNumber} ${t('mobile.approval.actions.submitted')}!`,
      actionMode.value === 'approveReject' && action === 'Reject' ? 'reject' : 'success',
      5000,
    )
    selectedAction.value = ''
    actionComment.value = ''
    mobileActiveTab.value = 2
    await navigateTo('/mobile')
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Submit failed'
    showToast(message, 'error')
    console.error('Failed to submit approval action:', error)
  }
  finally {
    submittingAction.value = false
  }
}

watch(
  [approvalId, requestId],
  async ([id, currentRequestId]) => {
    if (!id && !currentRequestId) {
      isPageLoading.value = false
      return
    }

    const currentLoadVersion = pageLoadVersion + 1
    pageLoadVersion = currentLoadVersion
    isPageLoading.value = true

    await Promise.all([
      getFormData(currentRequestId || id),
      getFormAttachments(currentRequestId || id),
    ])

    if (currentLoadVersion === pageLoadVersion) {
      isPageLoading.value = false
    }
  },
  { immediate: true },
)
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
