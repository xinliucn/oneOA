<template>
  <div :class="['notification-panel', `notification-panel--${props.variant}`]">
    <div class="notification-panel__header">
      <div class="notification-panel__title-row">
        <h1 class="notification-panel__title">
          Notifications
        </h1>
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
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '~/types/notification'
import {
  formatNotificationLocalizedText,
  formatNotificationTitle,
  isNotificationUnread,
  sortNotificationsForDisplay,
} from '~/utils/notification'

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
const route = useRoute()
const toDoFrom: any = useState('mobile:todo-form', () => null)
const { locale, t } = useAppI18n()

const activeFilter = ref('all')

const getNotificationCategoryText = (item: NotificationItem) => {
  return [
    formatNotificationLocalizedText(item.category, locale.value),
    formatNotificationLocalizedText(getPayloadString(item.payload, ['msgCategory', 'msg_category', 'category', 'type']), locale.value),
    item.source,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

const isSystemNotification = (item: NotificationItem) => {
  const categoryText = getNotificationCategoryText(item)

  return categoryText.includes('系统公告')
    || categoryText.includes('系統公告')
    || categoryText.includes('system announcement')
    || categoryText.includes('system notice')
}

const isPersonalNotification = (item: NotificationItem) => {
  const categoryText = getNotificationCategoryText(item)

  return categoryText.includes('个人讯息')
    || categoryText.includes('個人訊息')
    || categoryText.includes('个人消息')
    || categoryText.includes('個人消息')
    || categoryText.includes('personal message')
    || !isSystemNotification(item)
}

const filters = computed(() => {
  const systemCount = notifications.value.filter(item => isSystemNotification(item)).length
  const personalCount = notifications.value.filter(item => isPersonalNotification(item)).length

  return [
    { label: t('notification.filters.all'), value: 'all', count: null as number | null },
    { label: t('notification.filters.unread'), value: 'unread', count: unreadCount.value || null },
    { label: t('notification.filters.system'), value: 'system', count: systemCount || null },
    { label: t('notification.filters.personal'), value: 'personal', count: personalCount || null },
  ]
})

const filteredNotifications = computed(() => {
  const sortedNotifications = sortNotificationsForDisplay(notifications.value)

  if (activeFilter.value === 'all') {
    return sortedNotifications
  }

  if (activeFilter.value === 'unread') {
    return sortedNotifications.filter(item => isNotificationUnread(item))
  }

  if (activeFilter.value === 'system') {
    return sortedNotifications.filter(item => isSystemNotification(item))
  }

  if (activeFilter.value === 'personal') {
    return sortedNotifications.filter(item => isPersonalNotification(item))
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
      requestName: formatNotificationTitle(item.title, locale.value),
      status: formatNotificationLocalizedText(item.category, locale.value) || 'Pending',
      creatorName: item.creator || item.source,
      createTime: item.createdAt,
      receiveTime: item.createdAt,
      workflowBaseInfo: {
        workflowName: item.sourceSystem || item.summary,
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

onMounted(async () => {
  await bootstrap()
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

.notification-panel__filters {
  display: flex;
  align-items: center;
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
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  vertical-align: middle;
}

.notification-panel__filter-label {
  font-size: 16px;
}

.notification-panel__filter-count {
  font-size: 12px;
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
