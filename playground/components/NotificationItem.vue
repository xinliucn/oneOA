<template>
  <button
    :class="['notification-item', `notification-item--${props.variant}`, { unread: !item.readAt }]"
    @click="handleClick"
  >
    <div class="notification-item__main">
      <div class="notification-item__top">
        <span class="notification-item__title">{{ item.title }}</span>
        <span class="notification-item__time">{{ timeText }}</span>
      </div>

      <p
        v-if="subtitle"
        class="notification-item__subtitle"
      >
        {{ subtitle }}
      </p>
      <p class="notification-item__reference">
        {{ referenceText }}
      </p>
    </div>

    <span
      v-if="!item.readAt"
      class="notification-item__dot"
    />
  </button>
</template>

<script setup lang="ts">
import type { NotificationItem as NotificationItemModel } from '~/types/notification'

const props = withDefaults(defineProps<{
  item: NotificationItemModel
  variant?: 'page' | 'desktop-popover'
}>(), {
  variant: 'page',
})

const emit = defineEmits<{
  select: [item: NotificationItemModel]
}>()

const subtitle = computed(() => {
  return props.item.source || props.item.summary || props.item.content || ''
})

const referenceText = computed(() => {
  if (props.item.summary?.trim()) {
    return props.item.summary
  }

  const category = props.item.category?.trim()
  return category ? `${category.toUpperCase()}-${props.item.id}` : props.item.id
})

const timeText = computed(() => {
  const createdAt = new Date(props.item.createdAt).getTime()
  const diff = Math.max(0, Date.now() - createdAt)
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
  border-bottom: 1px solid #e8e1e4;
  background: #ffffff;
  padding: 14px 14px 13px;
  text-align: left;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background: #faf5f7;
}

.notification-item.unread {
  background: #f8eff2;
}

.notification-item__main {
  min-width: 0;
  flex: 1;
}

.notification-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.notification-item__title {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 1.3;
  font-weight: 600;
  color: #171717;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
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
  margin: 3px 0 0;
  font-size: 14px;
  line-height: 1.3;
  color: #242424;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.notification-item__reference {
  margin: 2px 0 0;
  font-size: 11px;
  line-height: 1.3;
  color: #6f6a71;
}

.notification-item__dot {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: #b10f49;
}

.notification-item--desktop-popover {
  padding: 14px 14px 13px;
}

.notification-item--desktop-popover .notification-item__title {
  font-size: 14px;
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
