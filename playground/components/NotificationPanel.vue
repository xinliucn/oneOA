<template>
  <div :class="['notification-panel', `notification-panel--${props.variant}`]">
    <div class="notification-panel__header">
      <div class="notification-panel__title-row">
        <h1 class="notification-panel__title">
          {{ t('notification.title') }}
        </h1>
        <el-switch
          v-if="!isMobileRoute"
          class="notification-panel__push-toggle"
          :model-value="pushToggleOn"
          :loading="isPushToggleLoading"
          :disabled="isPushToggleLoading || !pushToggleEnabled"
          :active-value="true"
          :inactive-value="false"
          active-color="#a60a3a"
          inactive-color="#d8d2d5"
          :aria-label="t('notification.push.title')"
          :before-change="handlePushSwitchBeforeChange"
        />
      </div>
      <p
        v-if="!isMobileRoute && pushInlineError"
        class="notification-panel__push-error"
      >
        {{ pushInlineError }}
      </p>

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
        {{ t('notification.states.loading') }}
      </div>
      <div
        v-else-if="filteredNotifications.length === 0"
        class="notification-panel__state"
      >
        {{ t('notification.states.empty') }}
      </div>
      <div
        v-else
        ref="listRef"
        class="notification-panel__list"
      >
        <FixedSizeList
          v-if="virtualListHeight > 0"
          :key="virtualListKey"
          ref="virtualListRef"
          class-name="notification-panel__virtual-list"
          :data="filteredNotifications"
          :height="virtualListHeight"
          :item-size="itemHeight"
          :total="filteredNotifications.length"
          :cache="6"
          :scrollbar-always-on="false"
          @item-rendered="handleItemRendered"
        >
          <template #default="{ data, index, style }">
            <div
              v-if="data[index]"
              :style="style"
            >
              <button
                :key="data[index].id"
                :class="['notification-panel__item', `notification-panel__item--${props.variant}`, { unread: isNotificationUnread(data[index]) }]"
                type="button"
                @click="handleSelect(data[index])"
              >
                <div class="notification-panel__item-main">
                  <div class="notification-panel__item-top">
                    <span class="notification-panel__item-title">
                      {{ formatNotificationListTitle(data[index], locale) }}
                    </span>
                    <span class="notification-panel__item-time">
                      {{ formatNotificationTime(data[index]) }}
                    </span>
                  </div>

                  <p
                    v-if="formatNotificationSubtitle(data[index])"
                    class="notification-panel__item-subtitle"
                  >
                    {{ formatNotificationSubtitle(data[index]) }}
                  </p>
                </div>

                <span
                  v-if="isNotificationUnread(data[index])"
                  class="notification-panel__item-dot"
                />
              </button>
            </div>
          </template>
        </FixedSizeList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FixedSizeList } from 'element-plus/es/components/virtual-list'
import type { FixedSizeListInstance } from 'element-plus/es/components/virtual-list'
import { usePushSubscriptionStore } from '~/stores/pushSubscription'
import type { NotificationItem } from '~/types/notification'
import {
  formatNotificationLocalizedText,
  formatNotificationListTitle,
  formatNotificationSubtitle,
  getNotificationTimestamp,
  isNotificationUnread,
  sortNotificationsForDisplay,
} from '~/utils/notification'

const props = withDefaults(defineProps<{
  variant?: 'page' | 'desktop-popover'
}>(), {
  variant: 'page',
})

const notificationsStore = useNotificationsStore()
const pushSubscriptionStore = usePushSubscriptionStore()
const route = useRoute()
const { openGuardedUrl } = useNetworkGuard()
const { locale, t } = useAppI18n()
const { showToast } = useMobileToast()

const ITEM_HEIGHT_BY_VARIANT = {
  page: 86,
  desktopPopover: 86,
}
const LOAD_MORE_THRESHOLD = 5

const activeFilter = ref('all')
const listRef = shallowRef<HTMLElement>()
const listHeight = ref(0)
const virtualListRef = ref<FixedSizeListInstance>()
const pushInlineError = ref('')
let resizeObserver: ResizeObserver | null = null
const notifications = computed(() => notificationsStore.notificationItems)
const unreadCount = computed(() => notificationsStore.unreadCount)
const loading = computed(() => notificationsStore.loading)
const pushToggleOn = computed(() => pushSubscriptionStore.isSubscribed)
const isPushToggleLoading = computed(() => pushSubscriptionStore.toggling)
const pushToggleEnabled = computed(() => pushSubscriptionStore.canToggle)
const isMobileRoute = computed(() => route.path.startsWith('/mobile'))
const itemHeight = computed(() => props.variant === 'desktop-popover'
  ? ITEM_HEIGHT_BY_VARIANT.desktopPopover
  : ITEM_HEIGHT_BY_VARIANT.page)
const virtualListKey = computed(() => `notifications:${activeFilter.value}`)
const virtualListHeight = computed(() => {
  if (listHeight.value > 0) {
    return listHeight.value
  }

  return props.variant === 'desktop-popover' ? 480 : 0
})

const getNotificationCategoryText = (item: NotificationItem) => {
  return [
    formatNotificationLocalizedText(item.category, locale.value),
    formatNotificationLocalizedText(item.msg_category || '', locale.value),
    formatNotificationLocalizedText(getPayloadString(item.payload_json, ['msgCategory', 'msg_category', 'category', 'type']), locale.value),
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

const handleItemRendered = (_cacheStart: number, _cacheEnd: number, _visibleStart: number, visibleEnd: number) => {
  if (!notificationsStore.hasMore || notificationsStore.loading) {
    return
  }

  if (visibleEnd >= filteredNotifications.value.length - LOAD_MORE_THRESHOLD) {
    void notificationsStore.loadMore()
  }
}

const showPushError = () => {
  const message = pushSubscriptionStore.error || t('notification.push.subscribeFailed')

  if (route.path.startsWith('/mobile')) {
    showToast(message, 'error', 4500)
    return
  }

  pushInlineError.value = message
}

const handlePushSwitchBeforeChange = async () => {
  if (isPushToggleLoading.value || !pushToggleEnabled.value) {
    return false
  }

  pushInlineError.value = ''

  const result = await pushSubscriptionStore.setEnabled(!pushToggleOn.value)

  if (result === 'failed') {
    showPushError()
    return false
  }

  return true
}

const updateListHeight = () => {
  listHeight.value = listRef.value?.clientHeight || 0
}

const formatNotificationTime = (item: NotificationItem) => {
  const timestamp = getNotificationTimestamp(item)

  if (!timestamp) {
    return ''
  }

  const diff = Math.max(0, Date.now() - timestamp)
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))}m ago`
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}h ago`
  }

  return `${Math.floor(diff / day)}d ago`
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

const getNotificationRequestId = (item: NotificationItem) => {
  return getPayloadString(item.payload_json, ['requestId', 'requestid', 'request_id'])
    || item.request_id?.trim()
    || item.requestId?.trim()
    || ''
}

const handleSelect = async (item: NotificationItem) => {
  await notificationsStore.markAsReadLocal(item.id)

  const requestId = getNotificationRequestId(item)
  const numericRequestId = Number(requestId)

  if (!Number.isInteger(numericRequestId) || numericRequestId === 0) {
    return
  }

  if (numericRequestId < 0) {
    const workflowUrl = `https://platform-uat.dchbi.app/workflow/request/ViewRequestForwardSPA.jsp?requestid=${encodeURIComponent(String(numericRequestId))}`
    void openGuardedUrl(workflowUrl, '_self')
    return
  }

  return navigateTo({
    path: route.path.startsWith('/mobile')
      ? `/mobile/todo/${encodeURIComponent(String(numericRequestId))}`
      : `/desktop/todo/${encodeURIComponent(String(numericRequestId))}`,
    query: route.path.startsWith('/mobile')
      ? { notificationReference: String(numericRequestId) }
      : undefined,
  })
}

onMounted(async () => {
  void pushSubscriptionStore.init()
  await notificationsStore.hydrateFromCache()
  await notificationsStore.fetchNotificationList({ force: true })
  await nextTick()
  updateListHeight()

  if (import.meta.client && listRef.value) {
    resizeObserver = new ResizeObserver(updateListHeight)
    resizeObserver.observe(listRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

watch(
  activeFilter,
  async () => {
    await nextTick()
    updateListHeight()
    virtualListRef.value?.resetScrollTop()
  },
  { flush: 'post' },
)
</script>

<style scoped>
.notification-panel {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.notification-panel--desktop-popover {
  max-height: 72vh;
  min-height: 420px;
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

.notification-panel__push-toggle {
  flex: 0 0 auto;
  --el-switch-on-color: #a60a3a;
  --el-switch-off-color: #d8d2d5;
}

.notification-panel__push-error {
  margin: -4px 0 8px;
  color: #a60a3a;
  font-size: 12px;
  line-height: 1.35;
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
  font-family: var(--font-source-sans-pro);
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
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  background: #ffffff;
  overflow: hidden;
}

.notification-panel__state {
  text-align: center;
  font-size: 13px;
  color: #8b8b8b;
}

.notification-panel__list {
  min-height: 0;
  flex: 1;
  background: #ffffff;
}

.notification-panel__list :deep(.el-vl__wrapper),
.notification-panel__list :deep(.notification-panel__virtual-list) {
  height: 100%;
}

.notification-panel__list :deep(.el-virtual-scrollbar) {
  display: none !important;
}

.notification-panel__list :deep(.el-vl__window) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.notification-panel__list :deep(.el-vl__window)::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.notification-panel__item {
  width: 100%;
  height: 86px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px solid #ece7ea;
  background: #ffffff;
  padding: 12px 14px;
  text-align: left;
  transition: background-color 0.2s ease;
}

.notification-panel__item:hover {
  background: #faf7f8;
}

.notification-panel__item.unread {
  background: #fbf4f7;
}

.notification-panel__item-main {
  min-width: 0;
  flex: 1;
}

.notification-panel__item-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.notification-panel__item-title {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 600;
  color: #171717;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.notification-panel__item-time {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.3;
  color: #9b97a0;
  white-space: nowrap;
}

.notification-panel__item-subtitle {
  margin: 2px 0 0;
  font-size: 13px;
  line-height: 1.28;
  color: #1c1c1c;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.notification-panel__item-dot {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: #b10f49;
}

.notification-panel__item--desktop-popover {
  padding: 12px 16px;
}

.notification-panel__item--desktop-popover .notification-panel__item-title {
  font-size: 16px;
  line-height: 1.32;
}

.notification-panel__item--desktop-popover .notification-panel__item-subtitle {
  font-size: 12px;
  margin-top: 3px;
}

.notification-panel__item--desktop-popover .notification-panel__item-time {
  font-size: 11px;
}

.notification-panel__item--desktop-popover .notification-panel__item-dot {
  width: 13px;
  height: 13px;
}

:global(.notification-panel__dropdown-popper.el-popper),
:global(.notification-panel__dropdown-menu.el-dropdown-menu),
:global(.notification-panel__dropdown-popper .el-popper__arrow),
:global(.notification-panel__dropdown-menu .el-dropdown-menu__item) {
  display: none !important;
}

.notification-panel--desktop-popover .notification-panel__header {
  padding: 14px 16px 12px;
  background: #ffffff;
  border-bottom: 1px solid #eadfe3;
}

.notification-panel--desktop-popover .notification-panel__title-row {
  margin-bottom: 10px;
}

.notification-panel--desktop-popover .notification-panel__title {
  font-size: 16px;
  line-height: 1.25;
}

.notification-panel--desktop-popover .notification-panel__filters {
  flex-wrap: wrap;
  gap: 8px;
  overflow: visible;
  padding-bottom: 0;
}

.notification-panel--desktop-popover .notification-panel__filter {
  flex-shrink: 1;
  min-height: 32px;
  padding: 6px 12px;
  font-size: 12px;
  color: #7a7477;
}

.notification-panel--desktop-popover .notification-panel__filter-label {
  font-size: 14px;
}

.notification-panel--desktop-popover .notification-panel__filter.is-active {
  color: #ffffff !important;
  box-shadow: none;
}

.notification-panel--desktop-popover .notification-panel__filter.is-active span {
  color: #ffffff;
}

.notification-panel--desktop-popover .notification-panel__body {
  padding-bottom: 0;
  background: #ffffff;
}

.notification-panel--desktop-popover .notification-panel__list {
  background: #ffffff;
}
.el-scrollbar__thumb {
  background-color: none !important;
}
</style>
