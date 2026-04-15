<template>
  <el-popover
    v-if="!isMobileContext"
    v-model:visible="isDesktopPopoverOpen"
    trigger="click"
    placement="bottom-end"
    :width="360"
    popper-class="notification-bell-popover notification-bell-popover--desktop"
  >
    <template #reference>
      <el-badge :value="badgeValue" :hidden="unreadCount === 0" class="notification-bell__badge">
        <el-button circle :class="['action-btn', { 'action-btn--active': isActive }]" type="button">
          <IconCustom name="bell" :size="props.iconSize" :color="isActive ? '#ffffff' : '#c2185b'" />
        </el-button>
      </el-badge>
    </template>

    <NotificationPanel variant="desktop-popover" @close="isDesktopPopoverOpen = false" />
  </el-popover>

  <el-badge v-else :value="badgeValue" :hidden="unreadCount === 0" class="notification-bell__badge">
    <el-button circle :class="['action-btn', { 'action-btn--active': isActive }]" @click="handleClick">
      <IconCustom name="bell" :size="props.iconSize" :color="isActive ? '#ffffff' : '#c2185b'" />
    </el-button>
  </el-badge>
</template>

<script setup lang="ts">
const MOBILE_NOTIFICATION_CENTER_PATH = '/mobile/notifications'

const props = withDefaults(defineProps<{
  buttonSize?: number
  iconSize?: number
}>(), {
  buttonSize: 40,
  iconSize: 20,
})

const route = useRoute()
const mobileReturnPath = useState<string>('mobile:notification:return-path', () => '/mobile')
const { unreadCount, bootstrap, startPolling, stopPolling } = useNotification()
const buttonSizePx = computed(() => `${props.buttonSize}px`)
const isMobileContext = computed(() => route.path.startsWith('/mobile'))
const isDesktopPopoverOpen = ref(false)
const isActive = computed(() => {
  if (isMobileContext.value) {
    return route.path.startsWith(MOBILE_NOTIFICATION_CENTER_PATH)
  }

  return isDesktopPopoverOpen.value || route.path.startsWith('/desktop/notification/')
})

const badgeValue = computed(() => {
  if (unreadCount.value > 99) {
    return '99+'
  }

  return unreadCount.value
})

const handleClick = async () => {
  if (isActive.value) {
    const targetPath = mobileReturnPath.value && mobileReturnPath.value !== MOBILE_NOTIFICATION_CENTER_PATH
      ? mobileReturnPath.value
      : '/mobile'

    await navigateTo(targetPath)
    return
  }

  mobileReturnPath.value = route.fullPath
  await navigateTo(MOBILE_NOTIFICATION_CENTER_PATH)
}

watch(
  () => route.fullPath,
  () => {
    if (!isMobileContext.value) {
      isDesktopPopoverOpen.value = false
    }
  },
)

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

:global(.notification-bell-popover--desktop.el-popper) {
  border: none !important;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.22) !important;
  border-radius: 12px !important;
  overflow: hidden;
  padding: 0 !important;
}

:global(.notification-bell-popover--desktop .el-popper__arrow) {
  display: none !important;
}
</style>
