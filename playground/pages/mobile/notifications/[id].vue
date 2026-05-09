<template>
  <div class="mobile-notification-detail">
    <header class="mobile-notification-detail__header">
      <button
        type="button"
        class="mobile-notification-detail__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
        <span class="mobile-notification-detail__back-label">{{ headerTitle }}</span>
      </button>
    </header>

    <main class="mobile-notification-detail__content">
      <div
        v-if="loading"
        class="mobile-notification-detail__state"
      >
        {{ loadingText }}
      </div>
      <div
        v-else-if="!notification"
        class="mobile-notification-detail__state"
      >
        {{ emptyText }}
      </div>

      <div
        v-else-if="detailVariant === 'approval'"
        class="mobile-notification-detail__approval"
      >
        <section class="notification-approval__sheet">
          <div class="notification-approval__meta">
            <span class="notification-approval__ref">{{ approvalData.reference || notification.summary }}</span>
            <span class="notification-approval__status">{{ approvalData.status || 'Pending' }}</span>
          </div>

          <h2 class="notification-approval__title">
            {{ notification.title }}
          </h2>

          <div class="notification-approval__submitter">
            <div class="notification-approval__submitter-avatar">
              <IconCustom
                name="personnel"
                :size="18"
                color="#ffffff"
              />
            </div>
            <div class="notification-approval__submitter-info">
              <span class="notification-approval__submitter-label">
                {{ approvalData.submittedLabel || 'Submitted by:' }}
              </span>
              <span class="notification-approval__submitter-name">
                {{ approvalData.submittedBy || notification.source }}
              </span>
            </div>
            <div class="notification-approval__submitter-time">
              <span>{{ approvalData.submittedDate || fallbackDateParts.date }}</span>
              <span>{{ approvalData.submittedTime || fallbackDateParts.time }}</span>
            </div>
          </div>

          <div class="notification-approval__progress">
            <div class="notification-approval__progress-bar">
              {{ approvalData.status || 'Pending' }}
            </div>

            <div class="notification-approval__timeline">
              <div
                v-for="step in visibleApprovalTimeline"
                :key="`${step.name}-${step.date}`"
                class="notification-approval__timeline-item"
              >
                <div
                  class="notification-approval__timeline-avatar"
                  :class="getApprovalStepClass(step.status)"
                >
                  <IconCustom
                    name="personnel"
                    :size="14"
                    color="#ffffff"
                  />
                </div>

                <div class="notification-approval__timeline-info">
                  <span class="notification-approval__timeline-name">{{ step.name }}</span>
                  <span class="notification-approval__timeline-date">{{ step.date }}</span>
                </div>
              </div>

              <button
                v-if="approvalTimeline.length > 2"
                type="button"
                class="notification-approval__show-more"
                @click="showAllApprovalSteps = !showAllApprovalSteps"
              >
                {{ showAllApprovalSteps ? 'Show less' : 'Show more' }}
              </button>
            </div>
          </div>

          <div
            v-if="approvalAttachments.length"
            class="notification-approval__attachments"
          >
            <span class="notification-approval__attachment">
              <IconCustom
                name="document"
                :size="14"
                color="#5A78A5"
              />
              {{ firstApprovalAttachment?.name }}
            </span>
            <span
              v-if="approvalAttachments.length > 1"
              class="notification-approval__attachment notification-approval__attachment--count"
            >
              +{{ approvalAttachments.length - 1 }}
            </span>
          </div>

          <div class="notification-approval__fields">
            <div
              v-for="field in approvalFields"
              :key="field.label"
              class="notification-approval__field"
            >
              <span class="notification-approval__field-label">{{ field.label }}</span>
              <span class="notification-approval__field-value">{{ field.value }}</span>
            </div>
          </div>

          <button
            type="button"
            class="notification-approval__link"
            @click="openOriginalLink"
          >
            {{ approvalData.detailLabel || linkText }}
          </button>
        </section>

        <footer class="notification-approval__footer">
          <textarea
            v-model="actionComment"
            class="notification-approval__comment"
            placeholder="Add a comment..."
          />

          <div class="notification-approval__actions">
            <button
              type="button"
              class="notification-approval__action notification-approval__action--approve"
              :class="{ active: selectedAction === 'Approve' }"
              @click="selectedAction = 'Approve'"
            >
              Approve
            </button>
            <button
              type="button"
              class="notification-approval__action notification-approval__action--reject"
              :class="{ active: selectedAction === 'Reject' }"
              @click="selectedAction = 'Reject'"
            >
              Reject
            </button>
            <button
              type="button"
              class="notification-approval__action notification-approval__action--more"
              :class="{ active: selectedAction === 'Return' }"
              @click="selectedAction = 'Return'"
            >
              ...
            </button>
          </div>

          <button
            type="button"
            class="notification-approval__submit"
            :disabled="!selectedAction"
            @click="handleApprovalSubmit"
          >
            Submit
          </button>
        </footer>
      </div>

      <article
        v-else-if="detailVariant === 'message'"
        class="notification-message"
      >
        <h2 class="notification-message__title">
          {{ notification.title }}
        </h2>

        <div class="notification-message__meta">
          <div class="notification-message__author-group">
            <div class="notification-message__avatar">
              <IconCustom
                name="personnel"
                :size="18"
                color="#ffffff"
              />
            </div>

            <div class="notification-message__author-info">
              <span class="notification-message__author">{{ messageData.author || notification.source }}</span>
              <span class="notification-message__recipient">{{ messageData.recipient || 'to me' }}</span>
            </div>
          </div>

          <div class="notification-message__time">
            <span>{{ messageData.date || fallbackDateParts.date }}</span>
            <span>{{ messageData.time || fallbackDateParts.time }}</span>
          </div>
        </div>

        <div class="notification-message__body">
          <p>{{ notification.content || emptyContentText }}</p>
        </div>

        <button
          v-if="notification.link"
          type="button"
          class="notification-message__link"
          @click="openOriginalLink"
        >
          {{ messageData.linkLabel || linkText }}
        </button>
      </article>

      <article
        v-else
        class="notification-article"
      >
        <h2 class="notification-article__title">
          {{ notification.title }}
        </h2>

        <div class="notification-article__body">
          <p
            v-for="paragraph in articleParagraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '~/types/notification'

type ApprovalField = {
  label: string
  value: string
}

type ApprovalStep = {
  name: string
  status: string
  date: string
}

type ApprovalAttachment = {
  name: string
}

type NotificationDetailPayload = {
  variant?: 'approval' | 'message' | 'article'
  approval?: {
    reference?: string
    status?: string
    submittedLabel?: string
    submittedBy?: string
    submittedDate?: string
    submittedTime?: string
    timeline?: ApprovalStep[]
    attachments?: ApprovalAttachment[]
    fields?: ApprovalField[]
    detailLabel?: string
  }
  message?: {
    author?: string
    recipient?: string
    date?: string
    time?: string
    linkLabel?: string
  }
}

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { locale, t } = useAppI18n()
const notificationId = computed(() => String(route.params.id || ''))
const returnPath = useState<string>('mobile:notification:return-path', () => '/mobile')
const { notifications } = useNotification()

const loading = ref(true)
const notification = ref<NotificationItem | null>(null)
const showAllApprovalSteps = ref(false)
const selectedAction = ref<'Approve' | 'Reject' | 'Return' | ''>('')
const actionComment = ref('')

const localText = (key: string, fallback: Record<string, string>) => {
  const message = t(key)
  return message === key ? fallback[locale.value] || fallback.en || '' : message
}

const headerTitle = computed(() => {
  return localText('mobile.notifications.title', {
    'zh-CN': '通知',
    'zh-TW': '通知',
    'en': 'Notifications',
  })
})

const loadingText = computed(() => {
  return localText('mobile.notifications.detail.loading', {
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    'en': 'Loading...',
  })
})

const emptyText = computed(() => {
  return localText('mobile.notifications.detail.empty', {
    'zh-CN': '未找到通知内容',
    'zh-TW': '找不到通知內容',
    'en': 'Notification not found',
  })
})

const emptyContentText = computed(() => {
  return localText('mobile.notifications.detail.emptyContent', {
    'zh-CN': '暂无详细内容',
    'zh-TW': '暫無詳細內容',
    'en': 'No detail available',
  })
})

const linkText = computed(() => {
  return localText('mobile.notifications.detail.openLink', {
    'zh-CN': '打开原始链接',
    'zh-TW': '開啟原始連結',
    'en': 'Open Original Link',
  })
})

const detailPayload = computed(() => {
  return (notification.value?.payload || {}) as NotificationDetailPayload
})

const detailVariant = computed(() => {
  return detailPayload.value.variant || 'article'
})

const approvalData = computed(() => {
  return detailPayload.value.approval || {}
})

const approvalTimeline = computed(() => {
  return approvalData.value.timeline || []
})

const visibleApprovalTimeline = computed(() => {
  return showAllApprovalSteps.value ? approvalTimeline.value : approvalTimeline.value.slice(0, 2)
})

const approvalAttachments = computed(() => {
  return approvalData.value.attachments || []
})

const firstApprovalAttachment = computed(() => {
  return approvalAttachments.value[0]
})

const approvalFields = computed(() => {
  return approvalData.value.fields || []
})

const messageData = computed(() => {
  return detailPayload.value.message || {}
})

const fallbackDateParts = computed(() => {
  if (!notification.value?.createdAt) {
    return { date: '', time: '' }
  }

  const date = new Date(notification.value.createdAt)
  if (Number.isNaN(date.getTime())) {
    return {
      date: notification.value.createdAt,
      time: '',
    }
  }

  return {
    date: new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date).replaceAll('/', '-'),
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date),
  }
})

const articleParagraphs = computed(() => {
  const content = notification.value?.content || emptyContentText.value
  return content
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
})

const loadNotification = async () => {
  loading.value = true

  try {
    const cached = notifications.value.find(item => item.id === notificationId.value)
    if (cached) {
      notification.value = cached
    }

    const detail = await $fetch<{ item: NotificationItem | null }>(`/api/notifications/${encodeURIComponent(notificationId.value)}`)
    if (detail?.item) {
      notification.value = detail.item
    }
  }
  catch (error) {
    console.error('Load mobile notification detail failed:', error)
  }
  finally {
    loading.value = false
  }
}

const handleBack = async () => {
  const targetPath = returnPath.value && returnPath.value !== route.fullPath
    ? returnPath.value
    : '/mobile/notifications'

  await navigateTo(targetPath)
}

const openOriginalLink = async () => {
  if (!notification.value?.link) {
    return
  }

  await navigateTo(notification.value.link, {
    external: true,
  })
}

const getApprovalStepClass = (status?: string) => {
  return status?.toLowerCase() === 'pending'
    ? 'is-pending'
    : 'is-approved'
}

const handleApprovalSubmit = () => {
  if (!selectedAction.value) {
    return
  }

  selectedAction.value = ''
  actionComment.value = ''
}

watch(notificationId, async (id) => {
  showAllApprovalSteps.value = false
  selectedAction.value = ''
  actionComment.value = ''

  if (!id) {
    loading.value = false
    return
  }

  await loadNotification()
}, { immediate: true })
</script>

<style scoped>
.mobile-notification-detail {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.mobile-notification-detail__header {
  padding: 18px 16px 14px;
  background: #ffffff;
  border-bottom: 1px solid #f0e7ea;
}

.mobile-notification-detail__back {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  color: #b10f49;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mobile-notification-detail__back-label {
  font-size: 15px;
  line-height: 1.2;
  font-weight: 500;
  color: #b10f49;
}

.mobile-notification-detail__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.mobile-notification-detail__state {
  padding: 48px 16px;
  text-align: center;
  font-size: 14px;
  color: #8b8b8b;
}

.mobile-notification-detail__approval {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.notification-approval__sheet {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 18px;
}

.notification-approval__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.notification-approval__ref,
.notification-approval__status {
  font-size: 11px;
}

.notification-approval__ref {
  color: #353535;
}

.notification-approval__status {
  color: #d79e00;
  font-weight: 600;
}

.notification-approval__title {
  margin: 0 0 14px;
  font-size: 21px;
  line-height: 1.24;
  font-weight: 700;
  color: #181818;
}

.notification-approval__submitter {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.notification-approval__submitter-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-approval__submitter-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.notification-approval__submitter-label,
.notification-approval__submitter-time {
  font-size: 10px;
  color: #a2a2a2;
}

.notification-approval__submitter-label,
.notification-approval__submitter-name,
.notification-approval__submitter-time span,
.notification-approval__timeline-name,
.notification-approval__timeline-date,
.notification-approval__field-label,
.notification-approval__field-value,
.notification-message__author,
.notification-message__recipient,
.notification-message__time span {
  display: block;
}

.notification-approval__submitter-name {
  font-size: 12px;
  color: #c42d4f;
  line-height: 1.35;
}

.notification-approval__submitter-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.notification-approval__progress {
  margin-bottom: 14px;
}

.notification-approval__progress-bar {
  padding: 6px 10px;
  border-radius: 8px 8px 0 0;
  background: #d79e00;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.notification-approval__timeline {
  padding: 10px 12px 12px;
  border-radius: 0 0 10px 10px;
  background: #f4f4f4;
}

.notification-approval__timeline-item {
  display: flex;
  gap: 10px;
}

.notification-approval__timeline-avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #199d34;
}

.notification-approval__timeline-avatar.is-pending {
  background: #d79e00;
}

.notification-approval__timeline-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
  min-width: 0;
}

.notification-approval__timeline-name {
  font-size: 12px;
  font-weight: 600;
  color: #1f1f1f;
}

.notification-approval__timeline-date {
  font-size: 10px;
  color: #898989;
}

.notification-approval__show-more {
  appearance: none;
  -webkit-appearance: none;
  padding: 0;
  border: 0;
  background: transparent;
  color: #b10f49;
  font-size: 12px;
}

.notification-approval__attachments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.notification-approval__attachment {
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
}

.notification-approval__attachment--count {
  min-width: 40px;
  justify-content: center;
  color: #8f8f8f;
}

.notification-approval__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-approval__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-approval__field-label {
  font-size: 11px;
  color: #000000;
  font-weight: 600;
}

.notification-approval__field-value {
  font-size: 13px;
  color: #171717;
  line-height: 1.4;
}

.notification-approval__link {
  appearance: none;
  -webkit-appearance: none;
  margin-top: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #d14b60;
  font-size: 12px;
  text-align: left;
}

.notification-approval__footer {
  padding: 12px 12px calc(14px + env(safe-area-inset-bottom, 0px));
  background: #ffffff;
  border-top: 1px solid #efefef;
  position: sticky;
  bottom: 0;
}

.notification-approval__comment {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  min-height: 72px;
  padding: 12px;
  margin-bottom: 12px;
  border: 0;
  border-radius: 10px;
  resize: none;
  background: #f5f5f5;
  color: #222222;
  font-size: 13px;
}

.notification-approval__actions {
  display: grid;
  grid-template-columns: 1fr 1fr 28px;
  gap: 8px;
  margin-bottom: 10px;
}

.notification-approval__action {
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  border-radius: 6px;
  padding: 10px 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
}

.notification-approval__action--approve {
  background: #dff4dc;
  color: #2d8c38;
}

.notification-approval__action--reject {
  background: #ffd8d8;
  color: #db2f2f;
}

.notification-approval__action--more {
  background: transparent;
  color: #b10f49;
  padding: 10px 0;
}

.notification-approval__action.active.notification-approval__action--approve {
  background: #199d34;
  color: #ffffff;
}

.notification-approval__action.active.notification-approval__action--reject {
  background: #d04848;
  color: #ffffff;
}

.notification-approval__action.active.notification-approval__action--more {
  background: #b10f49;
  color: #ffffff;
}

.notification-approval__submit {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 12px;
  background: #efefef;
  color: #b8b8b8;
  font-size: 13px;
  font-weight: 600;
}

.notification-approval__submit:not(:disabled) {
  background: #efd4dc;
  color: #b10f49;
}

.notification-message,
.notification-article {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px 24px;
}

.notification-message__title,
.notification-article__title {
  margin: 0 0 16px;
  font-size: 19px;
  line-height: 1.25;
  font-weight: 700;
  color: #1b1b1b;
}

.notification-message__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.notification-message__author-group {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.notification-message__avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-message__author-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.notification-message__author {
  font-size: 13px;
  color: #666666;
}

.notification-message__recipient {
  font-size: 12px;
  color: #9b9b9b;
}

.notification-message__time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 11px;
  color: #9b9b9b;
  flex-shrink: 0;
}

.notification-message__body,
.notification-article__body {
  font-size: 15px;
  line-height: 1.5;
  color: #282828;
  word-break: break-word;
}

.notification-message__body p,
.notification-article__body p {
  margin: 0;
}

.notification-message__body p + p,
.notification-article__body p + p {
  margin-top: 10px;
}

.notification-message__link {
  appearance: none;
  -webkit-appearance: none;
  margin-top: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #d14b60;
  font-size: 12px;
}
</style>
