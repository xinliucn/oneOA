<template>
  <el-popover
    v-model:visible="visible"
    trigger="click"
    placement="bottom-end"
    :width="390"
    popper-class="notification-bell-popover"
  >
    <template #reference>
      <el-badge :value="badgeValue" :hidden="unreadCount === 0" class="notification-bell__badge">
        <el-button circle class="action-btn" @click="handleOpen">
          <IconCustom name="bell" :size="20" />
        </el-button>
      </el-badge>
    </template>

    <NotificationPanel @close="visible = false" />
  </el-popover>
</template>

<script setup lang="ts">
const visible = ref(false)

const { unreadCount, bootstrap, refreshFromServer, startPolling, stopPolling } = useNotification()

const badgeValue = computed(() => {
  if (unreadCount.value > 99) {
    return '99+'
  }

  return unreadCount.value
})

const handleOpen = async () => {
  if (!visible.value) {
    await refreshFromServer({ silent: true })
  }
}

watch(visible, async (nextVisible) => {
  if (nextVisible) {
    await refreshFromServer({ silent: true })
  }
})

onMounted(async () => {
  await bootstrap()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
.notification-bell__badge {
  display: inline-flex;
}

.action-btn {
  height: 40px;
  width: 40px;
  background-color: #fce4ec;
  border: none;
  color: #c2185b;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.action-btn:hover {
  background-color: #f8bbd0;
}
</style>
