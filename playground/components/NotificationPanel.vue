<template>
  <div :class="['notification-panel', `notification-panel--${props.variant}`]">
    <div class="notification-panel__header">
      <div class="notification-panel__title-row">
        <h1 class="notification-panel__title">
          Notifications
        </h1>
        <button
          v-if="props.variant === 'desktop-popover'"
          type="button"
          class="notification-panel__toggle"
          :class="{ 'is-on': desktopToggleOn, 'is-loading': isPushToggleLoading }"
          :disabled="isPushToggleLoading"
          @click="toggleDesktopSubscription"
        >
          <span class="notification-panel__toggle-knob" />
        </button>
        <button
          v-else
          type="button"
          class="notification-panel__toggle"
          :class="{ 'is-on': desktopToggleOn, 'is-loading': isPushToggleLoading }"
          :disabled="isPushToggleLoading"
          @click="togglePageSubscription"
        >
          <span class="notification-panel__toggle-knob" />
        </button>
      </div>

      <div class="notification-panel__filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :class="['notification-panel__filter', { 'is-active': activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          <span class="notification-panel__filter-label">
            {{ filter.label }}
          </span>
          <span
            v-if="filter.count !== null"
            class="notification-panel__filter-count"
          >
            {{ filter.count }}
          </span>
        </button>
      </div>
    </div>

    <div class="notification-panel__body">
      <div
        v-if="loading && filteredNotifications.length === 0"
        class="notification-panel__state"
      >
        加载中...
      </div>
      <div
        v-else-if="filteredNotifications.length === 0"
        class="notification-panel__state"
      >
        暂无消息
      </div>
      <div
        v-else
        class="notification-panel__list"
      >
        <NotificationItem
          v-for="item in filteredNotifications"
          :key="item.id"
          :item="item"
          :variant="props.variant"
          @select="handleSelect"
        />
      </div>
    </div>

    <div
      v-if="subscriptionPrompt.visible"
      class="notification-panel__ios-overlay"
    >
      <section class="notification-panel__ios-dialog">
        <h2 class="notification-panel__ios-title">
          Notifications {{ subscriptionPrompt.type === 'enabled' ? 'Enabled' : 'Disabled' }}
        </h2>
        <p class="notification-panel__ios-message">
          {{ subscriptionPrompt.type === 'enabled'
            ? 'Notifications are on. You’ll receive alerts for new to-do list items.'
            : 'You won’t receive to-do list alerts unless notifications are enabled. Enable in Settings > Notifications.' }}
        </p>
        <div class="notification-panel__ios-actions">
          <button
            type="button"
            class="notification-panel__ios-action"
            @click="dismissSubscriptionPrompt"
          >
            Dismiss
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '~/types/notification'
import { isNotificationUnread, sortNotificationsForDisplay } from '~/utils/notification'

const props = withDefaults(defineProps<{
  variant?: 'page' | 'desktop-popover'
}>(), {
  variant: 'page',
})

const emit = defineEmits<{
  close: []
}>()

const {
  notifications,
  unreadCount,
  loading,
  bootstrap,
  markAsRead,
} = useNotification()
const {
  status: pushStatus,
  subscribe,
  unsubscribe,
  init: initPushSubscription,
} = usePushSubscription()
const route = useRoute()
const toDoFrom: any = useState('mobile:todo-form', () => null)

const activeFilter = ref('all')
const isPushToggleLoading = ref(false)
const subscriptionPrompt = reactive({
  visible: false,
  type: 'enabled' as 'enabled' | 'disabled',
})
const desktopToggleOn = computed(() => pushStatus.value === 'subscribed')

const dismissSubscriptionPrompt = () => {
  subscriptionPrompt.visible = false
}

const showSubscriptionResultPrompt = (enabled: boolean) => {
  console.info('[NotificationPanel subscription result]', {
    enabled,
    pushStatus: pushStatus.value,
  })

  subscriptionPrompt.type = enabled ? 'enabled' : 'disabled'
  subscriptionPrompt.visible = true
}

const formatCategoryLabel = (value?: string) => {
  const raw = value?.trim()
  if (!raw) {
    return ''
  }

  if (/^[a-z]{1,3}$/i.test(raw)) {
    return raw.toUpperCase()
  }

  return raw
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const categoryFilters = computed(() => {
  const counts = new Map<string, number>()

  for (const item of notifications.value) {
    const category = formatCategoryLabel(item.category)
    if (!category) {
      continue
    }

    counts.set(category, (counts.get(category) || 0) + 1)
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([label, count]) => ({
      label,
      value: `category:${label}`,
      count,
    }))
})

const filters = computed(() => {
  return [
    { label: 'All', value: 'all', count: null as number | null },
    ...categoryFilters.value,
    { label: 'Pending', value: 'pending', count: unreadCount.value },
  ]
})

const filteredNotifications = computed(() => {
  const sortedNotifications = sortNotificationsForDisplay(notifications.value)

  if (activeFilter.value === 'all') {
    return sortedNotifications
  }

  if (activeFilter.value === 'pending') {
    return sortedNotifications.filter(item => isNotificationUnread(item))
  }

  if (activeFilter.value.startsWith('category:')) {
    const targetCategory = activeFilter.value.replace('category:', '')
    return sortedNotifications.filter(item => formatCategoryLabel(item.category) === targetCategory)
  }

  return sortedNotifications
})

const isExternalLink = (link: string) => /^https?:\/\//i.test(link)

const isApiLink = (link: string) => {
  try {
    const parsed = new URL(link, 'https://superapp.local')
    return parsed.pathname.startsWith('/api/')
  }
  catch {
    return link.startsWith('/api/')
  }
}

const getPayloadString = (payload: Record<string, any> | null | undefined, keys: string[]) => {
  if (!payload) {
    return ''
  }

  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'string' || typeof value === 'number') {
      const normalized = String(value).trim()
      if (normalized) {
        return normalized
      }
    }
  }

  return ''
}

const getRequestIdFromLink = (link?: string) => {
  if (!link) {
    return ''
  }

  try {
    const parsed = new URL(link, 'https://superapp.local')
    return parsed.searchParams.get('requestId')
      || parsed.searchParams.get('requestid')
      || parsed.searchParams.get('request_id')
      || ''
  }
  catch {
    return ''
  }
}

const getNotificationRequestId = (item: NotificationItem) => {
  return item.requestId?.trim()
    || getPayloadString(item.payload, ['requestId', 'requestid', 'request_id'])
    || getRequestIdFromLink(item.link)
    || ''
}

const getNotificationReference = (item: NotificationItem, requestId: string) => {
  return getPayloadString(item.payload, ['requestMark', 'requestmark', 'requestNo', 'request_no', 'referenceNo', 'referenceId'])
    || item.referenceId?.trim()
    || requestId
}

const handleSelect = async (item: NotificationItem) => {
  void markAsRead(item.id)

  const isMobileRoute = route.path.startsWith('/mobile')

  const requestId = getNotificationRequestId(item)

  if (requestId) {
    const reference = getNotificationReference(item, requestId)
    toDoFrom.value = {
      requestId,
      requestmark: reference,
      requestName: item.title,
      status: item.category || 'Pending',
      creatorName: item.source,
      createTime: item.createdAt,
      receiveTime: item.createdAt,
      workflowBaseInfo: {
        workflowName: item.summary,
      },
    }

    emit('close')

    await navigateTo({
      path: isMobileRoute
        ? `/mobile/approval/${encodeURIComponent(reference)}`
        : `/desktop/todo/${encodeURIComponent(reference)}`,
      query: {
        requestId,
        source: 'notification',
        notificationId: item.id,
      },
    })
    return
  }

  const fallback = isMobileRoute
    ? `/mobile/notifications/${encodeURIComponent(item.id)}`
    : `/desktop/notification/${encodeURIComponent(item.id)}`
  const itemLink = item.link?.trim() || ''
  const target = itemLink && !isApiLink(itemLink) ? itemLink : fallback

  emit('close')

  await navigateTo(target, {
    external: isExternalLink(target),
  })
}

const toggleDesktopSubscription = async () => {
  if (props.variant !== 'desktop-popover' || isPushToggleLoading.value) {
    return
  }

  isPushToggleLoading.value = true

  try {
    if (desktopToggleOn.value) {
      await unsubscribe()
      return
    }

    const nextSubscription = await subscribe()
    showSubscriptionResultPrompt(Boolean(nextSubscription))
  }
  finally {
    isPushToggleLoading.value = false
  }
}

const togglePageSubscription = async () => {
  if (isPushToggleLoading.value) {
    return
  }

  isPushToggleLoading.value = true

  try {
    if (desktopToggleOn.value) {
      await unsubscribe()
      showSubscriptionResultPrompt(false)
      return
    }

    const nextSubscription = await subscribe()
    showSubscriptionResultPrompt(Boolean(nextSubscription))
  }
  finally {
    isPushToggleLoading.value = false
  }
}

onMounted(async () => {
  await bootstrap()
  await initPushSubscription()
})
</script>

<style scoped>
.notification-panel {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.notification-panel--desktop-popover {
  min-height: auto;
  max-height: min(72vh, 680px);
  width: 100%;
  background: #ffffff;
}

.notification-panel__header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 16px 14px 10px;
  background: #ffffff;
}

.notification-panel__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.notification-panel__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 600;
  color: #000000;
}

.notification-panel__title-row .notification-panel__title {
  flex: 1;
}

.notification-panel__accent {
  color: #b10f49;
  font-size: 15px;
  line-height: 1;
  letter-spacing: 1px;
}

.notification-panel__toggle {
  position: relative;
  width: 38px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  background: #b10f49;
  padding: 2px;
  transition: background-color 0.2s ease;
}

.notification-panel__toggle:disabled {
  cursor: default;
  opacity: 0.72;
}

.notification-panel__toggle-knob {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
  transform: translateX(16px);
  transition: transform 0.2s ease;
}

.notification-panel__toggle:not(.is-on) {
  background: #d7d0d3;
}

.notification-panel__toggle:not(.is-on) .notification-panel__toggle-knob {
  transform: translateX(0);
}

.notification-panel__toggle.is-loading .notification-panel__toggle-knob {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.notification-panel__filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.notification-panel__filters::-webkit-scrollbar {
  display: none;
}

.notification-panel__filter {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border: 1px solid #d7d0d3;
  border-radius: 999px;
  background: #ffffff;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1;
  padding: 7px 12px;
  transition: all 0.2s ease;
}

.notification-panel__filter.is-active {
  background: #b10f49;
  border-color: #b10f49;
  color: #ffffff;
  box-shadow: none;
}

.notification-panel__filter-label,
.notification-panel__filter-count {
  line-height: 1;
}

.notification-panel__filter-count {
  color: #8c8588;
}

.notification-panel__filter.is-active .notification-panel__filter-count {
  color: #ffffff;
}

.notification-panel__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  background: #ffffff;
}

.notification-panel__state {
  text-align: center;
  font-size: 13px;
  color: #8b8b8b;
}

.notification-panel__list {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.notification-panel__ios-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 28%);
}

.notification-panel__ios-dialog {
  width: min(290px, calc(100vw - 64px));
  overflow: hidden;
  border-radius: 18px;
  background: #f7f7f7;
  color: #111111;
  text-align: center;
  box-shadow: 0 16px 40px rgb(0 0 0 / 22%);
}

.notification-panel__ios-title {
  margin: 0;
  padding: 18px 20px 6px;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 700;
}

.notification-panel__ios-message {
  margin: 0;
  padding: 0 20px 18px;
  color: #111111;
  font-size: 12px;
  line-height: 1.28;
}

.notification-panel__ios-actions {
  display: flex;
  padding: 0 12px 12px;
}

.notification-panel__ios-actions--split {
  gap: 8px;
}

.notification-panel__ios-action {
  flex: 1;
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  background: #d9d9d9;
  color: #111111;
  font-size: 12px;
  font-weight: 700;
}

:global(.notification-panel__dropdown-popper.el-popper),
:global(.notification-panel__dropdown-menu.el-dropdown-menu),
:global(.notification-panel__dropdown-popper .el-popper__arrow),
:global(.notification-panel__dropdown-menu .el-dropdown-menu__item) {
  display: none !important;
}

.notification-panel--desktop-popover .notification-panel__header {
  padding: 18px 14px 12px;
  background: #ffffff;
  border-bottom: 1px solid #eadfe3;
}

.notification-panel--desktop-popover .notification-panel__title-row {
  margin-bottom: 12px;
}

.notification-panel--desktop-popover .notification-panel__title {
  font-size: 18px;
}

.notification-panel--desktop-popover .notification-panel__filters {
  gap: 6px;
  padding-bottom: 2px;
}

.notification-panel--desktop-popover .notification-panel__filter {
  padding: 8px 13px;
  font-size: 12px;
  color: #7a7477;
}

.notification-panel--desktop-popover .notification-panel__filter.is-active {
  color: #ffffff !important;
  box-shadow: none;
}

.notification-panel--desktop-popover .notification-panel__filter.is-active span {
  color: #ffffff;
}

.notification-panel--desktop-popover .notification-panel__body {
  overflow-y: auto;
  padding-bottom: 0;
  background: #ffffff;
}

.notification-panel--desktop-popover .notification-panel__list {
  background: #ffffff;
}
</style>
