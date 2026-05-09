<script setup lang="ts">
import type { ApprovalAction } from '~/types/approval'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

type WorkflowField = {
  fieldId?: string
  fieldName?: string
  fieldShowName?: string
  fieldValue?: string
  fieldShowValue?: string
  filedHtmlShow?: string
}

type TimelineItem = {
  id: string
  nodeName: string
  action: string
  date: string
}

const route = useRoute()
const approvalId = computed(() => String(route.params.id || ''))
const toDoFrom: any = useState('mobile:todo-form', () => null)
const { form, getFormData } = useApplicationCatalog()
const { formAttachments, getFormAttachments } = useToDoData()
const { showTodoToast } = useDesktopTodoToast()

const showAllApprovers = ref(false)
const actionComment = ref('')
const selectedAction = ref<ApprovalAction | ''>('')
const submittingAction = ref(false)
const actionOptions: ApprovalAction[] = ['Approve', 'Reject', 'Return']

const requestId = computed(() => String(route.query.requestId || toDoFrom.value?.requestId || ''))
const processInfo = computed(() => form.value?.processInfo ?? {})
const workflowBaseInfo = computed(() => processInfo.value?.workflowBaseInfo ?? toDoFrom.value?.workflowBaseInfo ?? {})
const workflowFields = computed<WorkflowField[]>(() => {
  return processInfo.value?.workflowMainTableInfo?.requestRecords?.[0]?.workflowRequestTableFields ?? []
})

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
  return workflowFields.value.find(field => field.fieldName === name)
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

const getFieldValue = (name: string, fallbackFieldId?: string) => {
  return getFieldDisplayValue(getFieldByName(name) || (fallbackFieldId ? getFieldById(fallbackFieldId) : undefined))
}

const approvalSummary = computed(() => {
  const referenceNumber = toDoFrom.value?.requestmark || getFieldValue('casenumber', '14904') || approvalId.value
  const status = processInfo.value?.status || toDoFrom.value?.status || 'Pending'
  const currentNodeName = processInfo.value?.currentNodeName || toDoFrom.value?.currentNodeName || ''

  return {
    referenceNumber,
    status,
    processStatus: currentNodeName ? `${status} (${currentNodeName})` : status,
    title: processInfo.value?.requestName || toDoFrom.value?.requestName || referenceNumber,
    submittedBy: processInfo.value?.creatorName || toDoFrom.value?.creatorName || '-',
    submittedDate: formatDate(processInfo.value?.createTime || toDoFrom.value?.createTime || toDoFrom.value?.receiveTime),
    requestDate: formatDate(processInfo.value?.createTime || toDoFrom.value?.createTime),
    portfolio: workflowBaseInfo.value?.workflowTypeName || workflowBaseInfo.value?.workflowName || '-',
    businessUnit: getFieldValue('bu', '14576') || toDoFrom.value?.userSubcompanyName || '-',
    workflowName: workflowBaseInfo.value?.workflowName || '-',
  }
})

const statusClass = computed(() => {
  const status = approvalSummary.value.status.toLowerCase()

  if (status.includes('reject')) {
    return 'is-rejected'
  }

  if (status.includes('approv') || status.includes('complete')) {
    return 'is-approved'
  }

  return 'is-pending'
})

const statusBarLabel = computed(() => approvalSummary.value.status || 'Pending')

const statusBarColor = computed(() => {
  if (statusClass.value === 'is-rejected') {
    return '#d53535'
  }

  if (statusClass.value === 'is-approved') {
    return '#139222'
  }

  return '#d8a300'
})

const formFields = computed(() => [
  {
    label: 'Reference No.',
    value: approvalSummary.value.referenceNumber,
  },
  {
    label: 'Process Status',
    value: approvalSummary.value.processStatus,
    highlight: true,
  },
  {
    label: 'Requestor',
    value: approvalSummary.value.submittedBy,
  },
  {
    label: 'Request Date',
    value: approvalSummary.value.requestDate || '-',
  },
  {
    label: 'Portfolio',
    value: approvalSummary.value.portfolio,
  },
  {
    label: 'Business Unit',
    value: approvalSummary.value.businessUnit,
  },
])

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
    url: file.downloadUrl || file.url || file.fileUrl,
  }))
})

const getApproverStatusClass = (action: string) => {
  const normalizedAction = action.toLowerCase()

  if (normalizedAction.includes('reject')) {
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

  if (items.length > 0) {
    return items
  }

  return [
    {
      id: 'current',
      nodeName: currentNodeName || 'Current Step',
      action: approvalSummary.value.status,
      date: '',
    },
  ]
})

const visibleTimelineItems = computed(() => {
  return showAllApprovers.value ? timelineItems.value : timelineItems.value.slice(0, 2)
})

const currentRequestId = computed(() => requestId.value || approvalId.value)
const workflowFormActionEndpoint = '/api/todo/workflowFormAction' as string
const rejectRequestEndpoint = '/api/todo/rejectRequest' as string

const handleConfirm = async () => {
  if (!selectedAction.value || submittingAction.value) {
    return
  }

  const action = selectedAction.value
  const comment = actionComment.value
  const submitParams = form.value?.submitParams ?? {}
  const targetRequestId = String(submitParams.requestid ?? currentRequestId.value)
  const referenceNumber = approvalSummary.value.referenceNumber || currentRequestId.value

  if (!targetRequestId) {
    console.error('Missing request id')
    return
  }

  submittingAction.value = true

  try {
    if (action === 'Reject') {
      await $fetch(rejectRequestEndpoint, {
        method: 'POST',
        body: {
          requestId: targetRequestId,
        },
      })
    } else {
      await $fetch(workflowFormActionEndpoint, {
        method: 'POST',
        body: {
          ...submitParams,
          action,
          remark: comment,
          requestid: targetRequestId,
          requestId: targetRequestId,
        },
      })
    }

    showTodoToast(referenceNumber, action === 'Reject' ? 'rejected' : 'approved')
    selectedAction.value = ''
    actionComment.value = ''
    await navigateTo('/desktop/todo')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submit failed'
    console.error(message)
    console.error('Failed to submit approval action:', error)
  } finally {
    submittingAction.value = false
  }
}

watch(
  [approvalId, requestId],
  async ([id, reqId]) => {
    const targetId = reqId || id
    if (!targetId) {
      return
    }

    await Promise.all([
      getFormData(targetId),
      getFormAttachments(targetId),
    ])
  },
  { immediate: true },
)
</script>

<template>
  <div class="todo-detail">
    <header class="todo-detail__header">
      <nav class="todo-detail__breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/desktop">Home</NuxtLink>
        <span>&gt;</span>
        <NuxtLink to="/desktop/todo">To-Do</NuxtLink>
        <span>&gt;</span>
        <span>{{ approvalSummary.referenceNumber }}</span>
      </nav>
      <h1>{{ approvalSummary.title }}</h1>
    </header>

    <main class="todo-detail__content">
      <section class="todo-detail__summary">
        <div class="todo-detail__progress">
          <div class="todo-detail__status-bar" :style="{ backgroundColor: statusBarColor }">
            {{ statusBarLabel }}
          </div>
          <div class="todo-detail__timeline">
            <div
              v-for="(item, index) in visibleTimelineItems"
              :key="item.id"
              class="todo-detail__timeline-item"
            >
              <div class="todo-detail__timeline-marker">
                <div class="todo-detail__timeline-avatar" :class="getApproverStatusClass(item.action)">
                  <IconCustom name="personnel" :size="16" color="#ffffff" />
                </div>
                <div v-if="index < visibleTimelineItems.length - 1" class="todo-detail__timeline-line" />
              </div>
              <div class="todo-detail__timeline-copy">
                <strong>{{ item.nodeName }}</strong>
                <span>{{ item.action }}<template v-if="item.date"> {{ item.date }}</template></span>
              </div>
            </div>
            <button
              v-if="timelineItems.length > 2"
              type="button"
              class="todo-detail__show-more"
              @click="showAllApprovers = !showAllApprovers"
            >
              {{ showAllApprovers ? 'Show less' : 'Show more' }}
            </button>
          </div>
        </div>

        <aside class="todo-detail__meta">
          <div class="todo-detail__submitter">
            <div class="todo-detail__submitter-avatar">
              <IconCustom name="personnel" :size="18" color="#ffffff" />
            </div>
            <div>
              <span>Submitted by:</span>
              <strong>{{ approvalSummary.submittedBy }}</strong>
              <small>via {{ approvalSummary.workflowName }}</small>
            </div>
            <time>{{ approvalSummary.submittedDate }}</time>
          </div>

          <div v-if="attachments.length > 0" class="todo-detail__attachments">
            <div v-for="attachment in attachments" :key="attachment.id" class="todo-detail__attachment">
              <span class="todo-detail__attachment-name">
                <IconCustom name="document" :size="13" color="#3b82f6" />
                {{ attachment.name }}
              </span>
              <a v-if="attachment.url" :href="attachment.url" target="_blank" rel="noreferrer">Download</a>
              <span v-else>Download</span>
            </div>
          </div>
        </aside>
      </section>

      <section class="todo-detail__fields">
        <div
          v-for="field in formFields"
          :key="field.label"
          class="todo-detail__field"
        >
          <label>{{ field.label }}</label>
          <span :class="{ 'is-highlight': field.highlight }">{{ field.value }}</span>
        </div>
      </section>

      <section class="todo-detail__action-panel">
        <textarea v-model="actionComment" placeholder="Add Comments" />
        <div class="todo-detail__action-row">
          <select v-model="selectedAction">
            <option value="" disabled>Action</option>
            <option v-for="option in actionOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <button type="button" :disabled="!selectedAction || submittingAction" @click="handleConfirm">
            {{ submittingAction ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </section>
    </main>

    <footer class="todo-detail__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.todo-detail {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.todo-detail__header {
  padding: 22px 82px 24px;
  border-bottom: 1px solid #d9d9d9;
  background: #f5f5f5;
}

.todo-detail__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 100%;
}

.todo-detail__breadcrumb a {
  color: inherit;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  text-decoration: underline;
}

.todo-detail__breadcrumb span {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
}

.todo-detail__breadcrumb span:last-child {
  font-weight: 700;
}

.todo-detail__header h1 {
  margin: 28px 0 0;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 110%;
}

.todo-detail__content {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  padding: 24px 82px 72px;
}

.todo-detail__summary {
  display: grid;
  grid-template-columns: 684px 1fr;
  gap: 30px;
  align-items: start;
}

.todo-detail__status-bar {
  height: 35px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 8px 8px 0 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

.todo-detail__timeline {
  min-height: 154px;
  padding: 24px 16px 18px;
  border-radius: 0 0 8px 8px;
  background: #f5f5f5;
}

.todo-detail__timeline-item {
  display: flex;
  gap: 12px;
}

.todo-detail__timeline-marker {
  width: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.todo-detail__timeline-avatar {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #139222;
}

.todo-detail__timeline-avatar.is-pending {
  background: #d8a300;
}

.todo-detail__timeline-avatar.is-rejected {
  background: #d53535;
}

.todo-detail__timeline-line {
  width: 0;
  height: 28px;
  margin: 6px 0;
  border-left: 2px dotted #9aa0a6;
}

.todo-detail__timeline-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 3px;
}

.todo-detail__timeline-copy strong {
  font-size: 14px;
  font-weight: 500;
}

.todo-detail__timeline-copy span {
  color: #9aa0a6;
  font-size: 14px;
}

.todo-detail__show-more {
  margin-top: 8px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 12px;
  cursor: pointer;
}

.todo-detail__meta {
  padding-top: 0;
}

.todo-detail__submitter {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 10px;
  align-items: start;
}

.todo-detail__submitter-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #d9d9d9;
}

.todo-detail__submitter span,
.todo-detail__submitter small {
  display: block;
  color: #9aa0a6;
  font-size: 12px;
}

.todo-detail__submitter strong {
  display: block;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
}

.todo-detail__submitter time {
  color: #9aa0a6;
  font-size: 12px;
}

.todo-detail__attachments {
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.todo-detail__attachment {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  max-width: 326px;
  color: #666666;
  font-size: 14px;
}

.todo-detail__attachment-name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.todo-detail__attachment a,
.todo-detail__attachment > span:last-child {
  color: #a60a3a;
  text-decoration: underline;
}

.todo-detail__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 150px;
  margin-top: 30px;
  padding: 0 22px 28px;
  border-bottom: 1px solid #d9d9d9;
}

.todo-detail__field {
  display: grid;
  grid-template-columns: 105px 327px;
  gap: 12px;
  align-items: center;
}

.todo-detail__field label {
  justify-self: end;
  color: #666666;
  font-size: 14px;
}

.todo-detail__field span {
  width: 327px;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #a3aab2;
  border-radius: 3px;
  color: #666666;
  font-size: 14px;
}

.todo-detail__field span.is-highlight {
  width: auto;
  border: 0;
  padding: 0;
  color: #d8a300;
  font-weight: 700;
}

.todo-detail__action-panel {
  margin-top: 24px;
  padding: 22px 24px 24px;
  border-radius: 8px;
  background: #f5f5f5;
}

.todo-detail__action-panel textarea {
  width: 100%;
  height: 78px;
  resize: none;
  padding: 12px;
  border: 1px solid #a3aab2;
  border-radius: 3px;
  color: #666666;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
}

.todo-detail__action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 16px;
}

.todo-detail__action-row select {
  width: 240px;
  height: 40px;
  border: 1px solid #a3aab2;
  border-radius: 3px;
  background: #ffffff;
  color: #9aa0a6;
  font-size: 14px;
}

.todo-detail__action-row button {
  width: 120px;
  height: 40px;
  border: 0;
  border-radius: 7px;
  background: #a60a3a;
  color: #ffffff;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 600;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}

.todo-detail__action-row button:disabled {
  background: #d9d9d9;
}

.todo-detail__footer {
  margin-top: auto;
  padding: 16px;
  background: #a60a3a;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
}
</style>
