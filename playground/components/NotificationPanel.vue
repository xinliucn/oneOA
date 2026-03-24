<template>
  <div class="notification-panel">
    <div class="notification-panel__header">
      <h3 class="notification-panel__title">消息中心</h3>
      <div class="notification-panel__actions">
        <el-button
          v-if="isSupported && status !== 'subscribed'"
          text
          type="primary"
          :loading="status === 'subscribing'"
          @click="handleSubscribe"
        >
          开启推送
        </el-button>
        <el-button
          v-if="isSupported && status === 'subscribed'"
          text
          type="danger"
          @click="handleUnsubscribe"
        >
          关闭推送
        </el-button>
        <el-button text type="primary" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <div class="notification-panel__body">
      <div v-if="loading && notifications.length === 0" class="notification-panel__state">加载中...</div>
      <div v-else-if="notifications.length === 0" class="notification-panel__state">暂无消息</div>
      <template v-else>
        <section v-if="unreadNotifications.length > 0" class="notification-panel__section">
          <p class="notification-panel__section-title">未读</p>
          <div class="notification-panel__list">
            <NotificationItem
              v-for="item in unreadNotifications"
              :key="item.id"
              :item="item"
              @select="handleSelect"
            />
          </div>
        </section>

        <section v-if="readNotifications.length > 0" class="notification-panel__section">
          <p class="notification-panel__section-title">已读</p>
          <div class="notification-panel__list">
            <NotificationItem
              v-for="item in readNotifications"
              :key="item.id"
              :item="item"
              @select="handleSelect"
            />
          </div>
        </section>

        <div v-if="hasMore" class="notification-panel__load-more">
          <el-button :loading="syncing" @click="loadMore">加载更多</el-button>
        </div>
      </template>
    </div>

    <div class="notification-panel__footer">
      <ClientOnly fallback="上次同步：尚未同步">
        上次同步：{{ lastSyncText }}
        <span v-if="status === 'subscribed'" class="notification-panel__push-status"> · 推送已开启</span>
        <span v-if="errorMessage" class="notification-panel__push-error"> · {{ errorMessage }}</span>
      </ClientOnly>
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
  unreadNotifications,
  readNotifications,
  hasMore,
  loading,
  syncing,
  lastSyncedAt,
  bootstrap,
  refreshFromServer,
  loadMore,
  openNotification,
} = useNotification()

const { status, isSupported, subscribe, unsubscribe, errorMessage, init } = usePushSubscription()

const lastSyncText = computed(() => {
  if (!lastSyncedAt.value) {
    return '尚未同步'
  }

  return new Date(lastSyncedAt.value).toLocaleString('zh-CN', {
    hour12: false,
  })
})

const handleRefresh = async () => {
  await refreshFromServer()
}

const handleSelect = async (item: NotificationItem) => {
  await openNotification(item)
  emit('close')
}

const handleSubscribe = async () => {
  await subscribe()
}

const handleUnsubscribe = async () => {
  await unsubscribe()
}

onMounted(async () => {
  await Promise.all([
    bootstrap(),
    init(),
  ])

})
</script>

<style scoped>
.notification-panel {
  width: 100%;
  max-width: 360px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.notification-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-panel__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notification-panel__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
}

.notification-panel__body {
  overflow-y: auto;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-panel__state {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 13px;
}

.notification-panel__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-panel__section-title {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 600;
}

.notification-panel__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-panel__load-more {
  display: flex;
  justify-content: center;
  padding-top: 4px;
}

.notification-panel__footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  font-size: 12px;
  color: #999;
}

.notification-panel__push-status {
  color: #5c8b35;
}

.notification-panel__push-error {
  color: #c75146;
}
</style>
