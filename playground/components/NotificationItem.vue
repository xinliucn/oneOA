<template>
  <button class="notification-item" :class="{ unread: !item.readAt }" @click="handleClick">
    <div class="notification-item__header">
      <span class="notification-item__title">{{ item.title }}</span>
      <span class="notification-item__time">{{ timeText }}</span>
    </div>
    <p class="notification-item__content">{{ item.summary || item.content }}</p>
    <div class="notification-item__meta">
      <span v-if="item.category" class="notification-item__tag">{{ item.category }}</span>
      <span v-if="!item.readAt" class="notification-item__dot" />
    </div>
  </button>
</template>

<script setup lang="ts">
import type { NotificationItem as NotificationItemModel } from '~/types/notification'

const props = defineProps<{
  item: NotificationItemModel
}>()

const emit = defineEmits<{
  select: [item: NotificationItemModel]
}>()

const timeText = computed(() => {
  const date = new Date(props.item.createdAt)
  return date.toLocaleString('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const handleClick = () => {
  emit('select', props.item)
}
</script>

<style scoped>
.notification-item {
  width: 100%;
  border: 1px solid #ececec;
  border-radius: 10px;
  background-color: #fff;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-item:hover {
  border-color: #d7a0b2;
  background-color: #fff8fa;
}

.notification-item.unread {
  border-color: #f1c4d3;
}

.notification-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.notification-item__title {
  font-size: 14px;
  color: #1f2328;
  font-weight: 600;
  line-height: 1.4;
}

.notification-item__time {
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
}

.notification-item__content {
  margin: 8px 0;
  color: #4f4f4f;
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-item__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-item__tag {
  font-size: 12px;
  color: #a60a3a;
  background: #ffeaf0;
  border-radius: 999px;
  padding: 2px 8px;
}

.notification-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #a60a3a;
}
</style>
