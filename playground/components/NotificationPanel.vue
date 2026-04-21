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
        <el-dropdown
          v-else
          trigger="click"
          placement="bottom-end"
          popper-class="notification-panel__dropdown-popper"
          @command="handlePageSubscriptionCommand"
        >
          <button
            type="button"
            class="notification-panel__accent-button"
            :disabled="isPushToggleLoading"
          >
            •••
          </button>

          <template #dropdown>
            <el-dropdown-menu class="notification-panel__dropdown-menu">
              <el-dropdown-item command="enable">
                <span class="notification-panel__dropdown-item">
                  <span class="notification-panel__dropdown-check">
                    {{ desktopToggleOn ? '✓' : '' }}
                  </span>
                  <span>Enabled</span>
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="disable">
                <span class="notification-panel__dropdown-item">
                  <span class="notification-panel__dropdown-check">
                    {{ !desktopToggleOn ? '✓' : '' }}
                  </span>
                  <span>Disabled</span>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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

      <div
        v-if="hasMore"
        class="notification-panel__load-more"
      >
        <el-button
          class="notification-panel__load-more-btn"
          :loading="syncing"
          @click="loadMore"
        >
          Load more
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '~/types/notification'

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
  hasMore,
  loading,
  syncing,
  bootstrap,
  loadMore,
} = useNotification()
const {
  status: pushStatus,
  subscribe,
  unsubscribe,
  init: initPushSubscription,
} = usePushSubscription()
const route = useRoute()

const activeFilter = ref('all')
const isPushToggleLoading = ref(false)
const desktopToggleOn = computed(() => pushStatus.value === 'subscribed')

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
  if (activeFilter.value === 'all') {
    return notifications.value
  }

  if (activeFilter.value === 'pending') {
    return notifications.value.filter(item => !item.readAt)
  }

  if (activeFilter.value.startsWith('category:')) {
    const targetCategory = activeFilter.value.replace('category:', '')
    return notifications.value.filter(item => formatCategoryLabel(item.category) === targetCategory)
  }

  return notifications.value
})

const handleSelect = async (item: NotificationItem) => {
  // const targetLink = await openNotification(item)
  const isMobileRoute = route.path.startsWith('/mobile')
  const fallback = isMobileRoute
    ? `/mobile/notifications/${encodeURIComponent(item.id)}`
    : `/desktop/notification/${encodeURIComponent(item.id)}`

  emit('close')

  // if (targetLink) {
  //   const isExternalLink = /^https?:\/\//i.test(targetLink)
  //   await navigateTo(targetLink, isExternalLink ? { external: true } : undefined)
  //   return
  // }

  await navigateTo(fallback)
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

    await subscribe()
  }
  finally {
    isPushToggleLoading.value = false
  }
}

const handlePageSubscriptionCommand = async (command: string | number | object) => {
  if (isPushToggleLoading.value) {
    return
  }

  if (command !== 'enable' && command !== 'disable') {
    return
  }

  isPushToggleLoading.value = true

  try {
    if (command === 'enable') {
      if (!desktopToggleOn.value) {
        await subscribe()
      }
      return
    }

    if (desktopToggleOn.value) {
      await unsubscribe()
    }
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
  margin-bottom: 12px;
}

.notification-panel__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.15;
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

.notification-panel__accent-button {
  width: 28px;
  height: 28px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #b10f49;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  letter-spacing: -1px;
  cursor: pointer;
}

.notification-panel__accent-button:disabled {
  opacity: 0.6;
}

.notification-panel__toggle {
  position: relative;
  width: 34px;
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
  transform: translateX(12px);
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
  gap: 7px;
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
  font-size: 16px;
  line-height: 1;
  padding: 8px 12px;
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
  padding: 32px 16px;
  text-align: center;
  font-size: 13px;
  color: #8b8b8b;
}

.notification-panel__list {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.notification-panel__load-more {
  display: flex;
  justify-content: center;
  padding: 18px 16px 24px;
}

.notification-panel__load-more-btn {
  width: 100%;
  max-width: 220px;
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

:global(.notification-panel__dropdown-popper.el-popper) {
  border: 0 !important;
  border-radius: 14px !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 6px 0 0 !important;
}

:global(.notification-panel__dropdown-popper .el-popper__arrow) {
  display: none;
}

:global(.notification-panel__dropdown-menu.el-dropdown-menu) {
  width: 86px;
  min-width: 86px;
  padding: 10px 0;
  border: 0;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.18);
}

:global(.notification-panel__dropdown-menu .el-dropdown-menu__item) {
  min-height: 36px;
  padding: 0 12px;
  color: #161616;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}

:global(.notification-panel__dropdown-menu .el-dropdown-menu__item:focus) {
  background: #fff7fa;
  color: #161616;
}

:global(.notification-panel__dropdown-menu .el-dropdown-menu__item:not(.is-disabled):hover) {
  background: #fff7fa;
  color: #161616;
}

.notification-panel__dropdown-item {
  width: 100%;
  display: grid;
  grid-template-columns: 12px 1fr;
  align-items: center;
  gap: 8px;
}

.notification-panel__dropdown-check {
  width: 12px;
  color: #b10f49;
  font-size: 13px;
  font-weight: 700;
}
</style>
