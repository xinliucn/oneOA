<template>
  <div class="notification-panel">
    <div class="notification-panel__header">
      <div class="notification-panel__title-row">
        <h1 class="notification-panel__title">Notifications</h1>
        <span class="notification-panel__accent">•••</span>
      </div>

      <div class="notification-panel__filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :class="['notification-panel__filter', { 'is-active': activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}<span v-if="filter.count !== null"> {{ filter.count }}</span>
        </button>
      </div>
    </div>

    <div class="notification-panel__body">
      <div v-if="loading && filteredNotifications.length === 0" class="notification-panel__state">加载中...</div>
      <div v-else-if="filteredNotifications.length === 0" class="notification-panel__state">暂无消息</div>
      <div v-else class="notification-panel__list">
        <NotificationItem
          v-for="item in filteredNotifications"
          :key="item.id"
          :item="item"
          @select="handleSelect"
        />
      </div>

      <div v-if="hasMore" class="notification-panel__load-more">
        <el-button class="notification-panel__load-more-btn" :loading="syncing" @click="loadMore">
          Load more
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '~/types/notification'

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
  openNotification,
} = useNotification()

const activeFilter = ref('all')

const formatCategoryLabel = (value?: string) => {
  const raw = value?.trim()
  if (!raw) {
    return ''
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
  await openNotification(item)
  emit('close')
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
  background: #f7f2f4;
}

.notification-panel__header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 18px 14px 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fbf8f9 100%);
  border-bottom: 1px solid #e5d9de;
}

.notification-panel__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.notification-panel__title {
  margin: 0;
  font-size: 19px;
  line-height: 1.2;
  font-weight: 700;
  color: #161616;
}

.notification-panel__accent {
  color: #b10f49;
  font-size: 15px;
  line-height: 1;
  letter-spacing: 1px;
}

.notification-panel__filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.notification-panel__filters::-webkit-scrollbar {
  display: none;
}

.notification-panel__filter {
  flex-shrink: 0;
  border: 1px solid #d7d0d3;
  border-radius: 999px;
  background: #ffffff;
  color: #6d6d6d;
  font-size: 13px;
  line-height: 1;
  padding: 8px 14px;
  transition: all 0.2s ease;
}

.notification-panel__filter.is-active {
  background: #b10f49;
  border-color: #b10f49;
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(177, 15, 73, 0.16);
}

.notification-panel__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
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

.notification-panel__load-more {
  display: flex;
  justify-content: center;
  padding: 18px 16px 0;
}

.notification-panel__load-more-btn {
  width: 100%;
  max-width: 220px;
}
</style>
