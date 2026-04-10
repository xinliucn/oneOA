<template>
  <el-badge :value="badgeValue" :hidden="unreadCount === 0" class="notification-bell__badge">
    <el-button circle :class="['action-btn', { 'action-btn--active': isActive }]" @click="handleClick">
      <IconCustom name="bell" :size="props.iconSize" :color="isActive ? '#ffffff' : '#c2185b'" />
    </el-button>
  </el-badge>
</template>

<script setup lang="ts">
const NOTIFICATION_CENTER_PATH = '/mobile/notifications'

const props = withDefaults(defineProps<{
  buttonSize?: number
  iconSize?: number
}>(), {
  buttonSize: 40,
  iconSize: 20,
})

const route = useRoute()
const returnPath = useState<string>('mobile:notification:return-path', () => '/mobile')
const { unreadCount, bootstrap, startPolling, stopPolling } = useNotification()
const buttonSizePx = computed(() => `${props.buttonSize}px`)
const isActive = computed(() => route.path.startsWith(NOTIFICATION_CENTER_PATH))

const badgeValue = computed(() => {
  if (unreadCount.value > 99) {
    return '99+'
  }

  return unreadCount.value
})

const handleClick = async () => {
  if (isActive.value) {
    const targetPath = returnPath.value && returnPath.value !== NOTIFICATION_CENTER_PATH
      ? returnPath.value
      : '/mobile'

    await navigateTo(targetPath)
    return
  }

  returnPath.value = route.fullPath
  await navigateTo(NOTIFICATION_CENTER_PATH)
}

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
  margin-left: 0 !important;
  margin-right: 0 !important;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.action-btn:hover {
  background-color: #f8bbd0;
}

.action-btn--active {
  background-color: #b10f49;
}

.action-btn--active:hover {
  background-color: #980d3f;
}
</style>
