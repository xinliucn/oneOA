<template>
  <button
    :class="['notification-item', `notification-item--${props.variant}`, { unread: isUnread }]"
    @click="handleClick"
  >
    <div class="notification-item__main">
      <div class="notification-item__top">
        <span class="notification-item__title">{{ displayTitle }}</span>
        <span class="notification-item__time">{{ timeText }}</span>
      </div>

      <p
        v-if="subtitle"
        class="notification-item__subtitle"
      >
        {{ subtitle }}
      </p>
      <!-- <p class="notification-item__reference">
        {{ referenceText }}
      </p> -->
    </div>

    <span
      v-if="isUnread"
      class="notification-item__dot"
    />
  </button>
</template>

<script setup lang="ts">
import type { NotificationItem as NotificationItemModel } from '~/types/notification'
import {
  formatNotificationListTitle,
  formatNotificationSubtitle,
  getNotificationTimestamp,
  isNotificationUnread,
} from '~/utils/notification'

const props = withDefaults(defineProps<{
  item: NotificationItemModel
  variant?: 'page' | 'desktop-popover'
}>(), {
  variant: 'page',
})

const emit = defineEmits<{
  select: [item: NotificationItemModel]
}>()

const isUnread = computed(() => isNotificationUnread(props.item))
const { locale } = useAppI18n()

const displayTitle = computed(() => {
  return formatNotificationListTitle(props.item, locale.value)
})

const subtitle = computed(() => {
  return formatNotificationSubtitle(props.item, locale.value)
})

const timeText = computed(() => {
  const timestamp = getNotificationTimestamp(props.item)

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
})

const handleClick = () => {
  emit('select', props.item)
}
</script>

<style scoped>
.notification-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-bottom: 1px solid #ece7ea;
  background: #ffffff;
  padding: 10px 14px 11px;
  text-align: left;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background: #faf7f8;
}

.notification-item.unread {
  background: #fbf4f7;
}

.notification-item__main {
  min-width: 0;
  flex: 1;
}

.notification-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.notification-item__title {
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

.notification-item__time {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.3;
  color: #9b97a0;
  white-space: nowrap;
}

.notification-item__subtitle {
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

.notification-item__reference {
  margin: 2px 0 0;
  font-size: 10px;
  line-height: 1.25;
  color: #161616;
}

.notification-item__dot {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: #b10f49;
}

.notification-item--desktop-popover {
  padding: 16px 16px;
}

.notification-item--desktop-popover .notification-item__title {
  font-size: 16px;
  line-height: 1.32;
}

.notification-item--desktop-popover .notification-item__subtitle {
  font-size: 12px;
  margin-top: 3px;
}

.notification-item--desktop-popover .notification-item__reference {
  font-size: 11px;
  margin-top: 3px;
}

.notification-item--desktop-popover .notification-item__time {
  font-size: 11px;
}

.notification-item--desktop-popover .notification-item__dot {
  width: 13px;
  height: 13px;
}
</style>
