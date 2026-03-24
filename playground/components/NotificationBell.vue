<template>
  <el-popover
    v-model:visible="visible"
    :placement="props.placement"
    :width="props.popoverWidth"
    :popper-class="popperClassName"
  >
    <template #reference>
      <el-badge :value="badgeValue" :hidden="unreadCount === 0" class="notification-bell__badge">
        <el-button circle class="action-btn" @click="handleOpen">
          <IconCustom name="bell" :size="props.iconSize" />
        </el-button>
      </el-badge>
    </template>

    <NotificationPanel @close="visible = false" />
  </el-popover>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  placement?: 'bottom' | 'bottom-start' | 'bottom-end'
  popoverWidth?: number
  popoverClass?: string
  buttonSize?: number
  iconSize?: number
}>(), {
  placement: 'bottom-end',
  popoverWidth: 390,
  popoverClass: '',
  buttonSize: 40,
  iconSize: 20,
})

const visible = ref(false)

const { unreadCount, bootstrap, refreshFromServer, startPolling, stopPolling } = useNotification()
const buttonSizePx = computed(() => `${props.buttonSize}px`)
const popperClassName = computed(() => {
  return ['notification-bell-popover', props.popoverClass].filter(Boolean).join(' ')
})

const badgeValue = computed(() => {
  if (unreadCount.value > 99) {
    return '99+'
  }

  return unreadCount.value
})

const handleOpen = async () => {
  visible.value = !visible.value
  if (visible.value) {
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
  height: v-bind(buttonSizePx);
  width: v-bind(buttonSizePx);
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
