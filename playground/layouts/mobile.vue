<template>
  <div class="mobile">
    <header class="mobile__header">
      <div class="mobile__header-left">
        <IconCustom
          name="menu"
          :size="24"
          class="menu-icon"
          @click="openMenu"
        />
        <button
          type="button"
          class="mobile__logo"
          aria-label="Back to mobile home"
          @click="handleLogoClick"
        >
          <img
            src="~/assets/images/dchLogo.png"
            alt="SuperApp Logo"
            width="160"
            height="32"
          >
        </button>
      </div>
      <div class="mobile__header-right">
        <!-- <el-button circle class="action-btn active-btn">
                    <IconCustom name="share" :size="20" />
                </el-button> -->
        <LocaleDropdown
          variant="mobile"
          placement="bottom-end"
        />
        <NotificationBell
          :button-size="36"
          :icon-size="20"
        />
        <!-- <el-avatar :size="40" src="/favicon.png" /> -->
      </div>
    </header>
    <main class="mobile__main">
      <div
        v-if="!isLayoutReady"
        class="mobile__main-loading"
      >
        <div class="mobile__loading-content">
          <div class="mobile__loading-title">
            Loading...
          </div>
          <div
            class="mobile__loading-track"
            aria-hidden="true"
          >
            <span class="mobile__loading-bar" />
          </div>
        </div>
      </div>
      <slot v-else />
    </main>
    <footer class="mobile__footer">
      <div class="tab-bar">
        <div
          v-for="tab in tabs"
          :key="tab.index"
          :class="['tab-item', { active: displayActiveTab === tab.index }]"
          @click="handleTabClick(tab.index)"
        >
          <template v-if="tab.type === 'profile'">
            <div class="tab-item__profile-avatar">
              {{ profileInitials }}
            </div>
          </template>
          <template v-else>
            <IconCustom
              :name="tab.icon"
              :size="24"
            />
          </template>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </footer>
    <template v-if="isLayoutReady">
      <MobileToast />
      <MobileIOSNotificationPermissionPrompt />
      <MobileSidebar v-model="isSidebarOpen" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { provide, watch } from 'vue'
import { createUserWatermark, removeWatermark } from '~/utils/watermark'
import MobileSidebar from '~/components/MobileSidebar.vue'
import MobileToast from '~/components/MobileToast.vue'
import MobileIOSNotificationPermissionPrompt from '~/components/MobileIOSNotificationPermissionPrompt.vue'
import NotificationBell from '~/components/NotificationBell.vue'

const { user } = useAuth()
const { t } = useAppI18n()
const route = useRoute()
const activeTab = useState('mobile:activeTab', () => 1)
const isSidebarOpen = useState('mobile:isSidebarOpen', () => false)
const isLayoutReady = ref(false)
const displayName = computed(() => user.value?.name || user.value?.displayName || user.value?.username || 'Profile')
const profileInitials = computed(() => {
  const source = displayName.value.trim()
  if (!source) {
    return 'P'
  }

  const parts = source.split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'P'
})

const tabs = computed(() => [
  { index: 1, icon: 'home', label: t('mobile.tabs.home') },
  { index: 2, icon: 'todo', label: t('mobile.tabs.todo') },
  { index: 3, icon: 'apps', label: t('mobile.tabs.applications') },
  { index: 4, icon: 'search', label: 'Profile', type: 'profile' },
])

const displayActiveTab = computed<number | null>(() => {
  if (route.path === '/mobile') {
    return activeTab.value
  }

  if (route.path.startsWith('/mobile/search')) {
    return null
  }

  if (route.path.startsWith('/mobile/notifications')) {
    return null
  }

  if (route.path.startsWith('/mobile/applications')) {
    return 3
  }

  if (route.path.startsWith('/mobile/approval')) {
    return 2
  }

  return null
})

const handleTabClick = (tabIndex: number) => {
  activeTab.value = tabIndex
  if (route.path !== '/mobile') {
    return navigateTo('/mobile')
  }
}

const handleLogoClick = () => {
  activeTab.value = 1
  return navigateTo('/mobile')
}

const openMenu = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Provide activeTab to child components
provide('activeTab', activeTab)

watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/mobile/search')) {
      return
    }

    if (path.startsWith('/mobile/notifications')) {
      return
    }

    if (path.startsWith('/mobile/applications')) {
      activeTab.value = 3
      return
    }

    if (path.startsWith('/mobile/approval')) {
      activeTab.value = 2
    }
  },
  { immediate: true },
)

const waitForAnimationFrame = () => {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

const waitForMobileReady = async () => {
  await nextTick()
  await waitForAnimationFrame()
  await waitForAnimationFrame()

  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 300)),
    ])
  }

  await new Promise(resolve => setTimeout(resolve, 120))
  isLayoutReady.value = true
}

// 在组件挂载后创建水印
onMounted(async () => {
  await waitForMobileReady()

  if (user.value) {
    createUserWatermark(user.value)
  }
})

// 在组件卸载前移除水印
onBeforeUnmount(() => {
  removeWatermark()
})
</script>

<style scoped>
.mobile {
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.mobile__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    height: 64px;
}

.mobile__header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-icon {
        cursor: pointer;
        color: #333333;
    }

    .mobile__logo {
        height: 32px;
        border: 0;
        padding: 0;
        background: transparent;
        cursor: pointer;

        img {
            height: 100%;
            object-fit: contain;
        }
    }
}

.mobile__header-right {
    display: flex;
    align-items: center;
    gap: 4px;

    .action-btn {
        width: 36px;
        height: 36px;
        background-color: #f5f5f5;
        border: none;
        color: #666666;
        margin: 0 !important;

        &:hover {
            background-color: #e0e0e0;
        }

        &.active-btn {
            background-color: #fce4ec;
            color: #A60A3A;

            &:hover {
                background-color: #f8bbd0;
            }
        }
    }
}

.mobile__main {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.mobile__main-loading {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
}

.mobile__loading-content {
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-20px);
}

.mobile__loading-title {
    margin-bottom: 22px;
    color: #000000;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
}

.mobile__loading-track {
    width: 180px;
    height: 5px;
    overflow: hidden;
    border-radius: 999px;
    background: #E3E3E3;
}

.mobile__loading-bar {
    display: block;
    width: 58px;
    height: 100%;
    border-radius: inherit;
    background: #A60A3A;
    animation: mobile-loading-slide 1.1s ease-in-out infinite;
}

@keyframes mobile-loading-slide {
    0% {
        transform: translateX(-58px);
    }

    45%,
    55% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(180px);
    }
}

:deep(.notification-bell-popover--mobile) {
    max-width: calc(100vw - 24px);
}

:deep(.notification-bell-popover--mobile .el-popper__arrow) {
    display: none;
}

:global(.mobile-global-toast) {
    position: fixed;
    z-index: 2147483647;
    top: calc(env(safe-area-inset-top, 0px) + 18px);
    left: 50%;
    max-width: calc(100vw - 96px);
    transform: translate(-50%, -8px);
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 15px;
    line-height: 1.2;
    text-align: center;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

:global(.mobile-global-toast.is-visible) {
    opacity: 1;
    transform: translateX(-50%);
}

:global(.mobile-global-toast--success) {
    border: 1px solid #43b563;
    background: #d9f3df;
    color: #007a1d;
}

:global(.mobile-global-toast--error) {
    border: 1px solid #d4586f;
    background: #fde7ec;
    color: #a60a3a;
}

.mobile__footer {
    background-color: #ffffff;
    border-top: 0;
    padding: 8px 0 calc(6px + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
}

.tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 4px 0;
    cursor: pointer;
    position: relative;
    color: #999999;
    transition: color 0.3s;

    svg {
        margin-bottom: 4px;
    }

    .tab-label {
        font-size: 10px;
        line-height: 1.2;
    }

    &.active {
        color: #A60A3A;
    }
}

.tab-item__profile-avatar {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: linear-gradient(135deg, #cb7291 0%, #8b0f3b 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-bottom: 4px;
    box-shadow: 0 6px 12px rgba(166, 10, 58, 0.16);
}

.tab-item.active .tab-item__profile-avatar {
    box-shadow: 0 8px 16px rgba(166, 10, 58, 0.22);
    transform: translateY(-1px);
}
</style>
