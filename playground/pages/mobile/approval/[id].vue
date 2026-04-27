<template>
  <div class="mobile-approval">
    <header class="mobile-approval__header">
      <button class="mobile-approval__back" type="button" @click="handleBack">
        <IconCustom name="chevron-right" :size="18" :rotate="180" />
      </button>
      <h1 class="mobile-approval__header-title">My Approvals</h1>
      <div class="mobile-approval__header-spacer" />
    </header>

    <main class="mobile-approval__content">
      <section class="mobile-approval__sheet">
        <div class="mobile-approval__meta">
          <span class="mobile-approval__ref">{{ approvalSummary.referenceNumber }}</span>
          <span class="mobile-approval__status-text" :class="statusClass">{{ approvalSummary.status }}</span>
        </div>

        <h2 class="mobile-approval__title">{{ approvalSummary.title }}</h2>

        <div class="mobile-approval__submitter">
          <div class="mobile-approval__submitter-avatar">
            <IconCustom name="personnel" :size="18" color="#ffffff" />
          </div>
          <div class="mobile-approval__submitter-info">
            <span class="mobile-approval__submitter-label">Submitted by</span>
            <span class="mobile-approval__submitter-name">{{ approvalSummary.submittedBy }}</span>
          </div>
          <span class="mobile-approval__submitter-date">{{ approvalSummary.submittedDate }}</span>
        </div>

        <div class="mobile-approval__progress">
          <div class="mobile-approval__progress-bar" :class="statusClass">{{ approvalSummary.status }}</div>
          <div class="mobile-approval__timeline">
            <div v-for="approver in visibleTimelineItems" :key="approver.id"
              class="mobile-approval__timeline-item">
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
              {{ showAllApprovers ? 'Show less' : 'Show more' }}
            </button>
          </div>
        </div>

        <div v-if="attachments.length > 0" class="mobile-approval__attachments">
          <span class="mobile-approval__attachment">
            <IconCustom name="document" :size="14" color="#5a78a5" />
            {{ attachments[0]?.name }}
          </span>
          <span v-if="attachments.length > 1" class="mobile-approval__attachment mobile-approval__attachment--count">
            +{{ attachments.length - 1 }}
          </span>
        </div>

        <div class="mobile-approval__fields">
          <div v-for="field in formFields" :key="field.label" class="mobile-approval__field">
            <span class="mobile-approval__field-label">{{ field.label }}</span>
            <span class="mobile-approval__field-value">{{ field.value }}</span>
          </div>
        </div>

        <!-- <div v-if="approval.latestComment" class="mobile-approval__field mobile-approval__field--comment">
          <span class="mobile-approval__field-label">Latest Comment</span>
          <span class="mobile-approval__field-value">{{ approval.latestComment }}</span>
        </div> -->

        <button type="button" class="mobile-approval__link">
          {{ 'View details in WOA-DPM' }} &gt;
        </button>
      </section>
    </main>

    <footer class="mobile-approval__footer">
      <textarea v-model="actionComment" class="mobile-approval__comment" placeholder="Add a comment..." />
      <div class="mobile-approval__actions">
        <button type="button" class="mobile-approval__action mobile-approval__action--approve"
          :class="{ active: selectedAction === 'Approve' }" @click="selectAction('Approve')">
          Approve
        </button>
        <button type="button" class="mobile-approval__action mobile-approval__action--reject"
          :class="{ active: selectedAction === 'Reject' }" @click="selectAction('Reject')">
          Reject
        </button>
        <button type="button" class="mobile-approval__action mobile-approval__action--more"
          :class="{ active: selectedAction === 'Return' }" @click="selectAction('Return')">
          ...
        </button>
      </div>
      <button type="button" class="mobile-approval__confirm" :disabled="!selectedAction" @click="handleConfirm">
        {{ submitButtonName }}
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
const { form, getFormData } = useApplicationCatalog()
const toDoFrom: any = useState('mobile:todo-form', () => null)

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const route = useRoute()
const approvalId = computed(() => String(route.params.id || ''))
const requestId = computed(() => String(route.query.requestId || toDoFrom.value?.requestId || ''))
const showAllApprovers = ref(false)
const selectedAction = ref<ApprovalAction | ''>('')
const actionComment = ref('')
const timelinePreviewCount = 2

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

type TimelineItem = {
  id: string
  nodeName: string
  action: string
  date: string
}

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
  const requestMark = toDoFrom.value?.requestmark || getFieldValue('casenumber', '14904') || approvalId.value
  const status = processInfo.value?.status || toDoFrom.value?.status || 'Pending'
  const currentNodeName = processInfo.value?.currentNodeName || toDoFrom.value?.currentNodeName || ''

  return {
    referenceNumber: requestMark,
    status,
    processStatus: currentNodeName ? `${status} (${currentNodeName})` : status,
    title: processInfo.value?.requestName || toDoFrom.value?.requestName || requestMark,
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
      label: 'Reference Number',
      value: approvalSummary.value.referenceNumber,
    },
    {
      label: 'Process Status',
      value: approvalSummary.value.processStatus,
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
  ]
})

const attachments = computed(() => {
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
    return 'Submit'
  }

  return label
})

const handleBack = () => navigateTo('/mobile')

const selectAction = (action: ApprovalAction) => {
  selectedAction.value = action
}

const handleConfirm = () => {
  if (!selectedAction.value) {
    return
  }
  selectedAction.value = ''
  actionComment.value = ''
  navigateTo('/mobile')
}

// onMounted(async () => {
//   await bootstrap()
//   await ensureApproval(approvalId.value)
// })
watch(
  [approvalId, requestId],
  async ([id, currentRequestId]) => {
    if (!id && !currentRequestId) {
      return
    }

    await getFormData(currentRequestId || id)
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

.mobile-approval__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 10px;
  color: #3d2f2f;
}

.mobile-approval__back {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: #7a454f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(166, 10, 58, 0.12);
}

.mobile-approval__header-title {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  margin: 0;
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
  margin-bottom: 14px;
}

.mobile-approval__progress-bar {
  padding: 6px 10px;
  border-radius: 8px 8px 0 0;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.mobile-approval__timeline {
  background: #f3f3f3;
  border-radius: 0 0 10px 10px;
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
  margin-bottom: 16px;
}

.mobile-approval__attachment {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #d9d9d9;
  background: #ffffff;
  color: #646464;
  font-size: 13px;
  line-height: 1;
}

.mobile-approval__attachment--count {
  justify-content: center;
  min-width: 40px;
  padding: 0 10px;
  color: #8f8f8f;
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
  color: #5f5f5f;
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
</style>
