<template>
  <div
    class="desktop-layout"
    style="display: flex; flex-direction: column; width: 100%; height: 100vh; overflow: hidden; background: #FFFFFF;"
  >
    <header class="desktop__header">
      <button
        type="button"
        class="desktop__logo"
        :aria-label="t('common.home')"
        @click="handleLogoClick"
      >
        <img
          src="~/assets/images/dchLogo.png"
          alt="SuperApp Logo"
          width="200"
          height="40"
        >
      </button>
      <div class="desktop_header_actions">
        <el-button
          circle
          class="action-btn"
        >
          <IconCustom
            name="share"
            :size="20"
          />
        </el-button>
        <LocaleDropdown />

        <NotificationBell />
        <el-dropdown @command="handleCommand">
          <span class="avatar-dropdown">
            <img
              class="desktop__avatar-img"
              src="/favicon.png"
              alt="User avatar"
              width="40"
              height="40"
            >
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                {{ t('user.profile') }}
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                {{ t('user.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <div class="desktop_layout_content">
      <div class="desktop__sidebar">
        <el-menu
          :default-active="activeMenu"
          :default-openeds="openMenuKeys"
          @select="handleMenuSelect"
        >
          <template
            v-for="item in menuItems"
            :key="item.key"
          >
            <el-sub-menu
              v-if="item.children?.length"
              :index="item.key"
            >
              <template #title>
                <span class="desktop__menu-icon">
                  <IconCustom
                    :name="item.icon"
                    :size="24"
                  />
                </span>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item
                v-for="childItem in item.children"
                :key="childItem.key"
                :index="childItem.key"
              >
                {{ childItem.label }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item
              v-else
              :index="item.key"
            >
              <span class="desktop__menu-icon">
                <IconCustom
                  :name="item.icon"
                  :size="24"
                />
              </span>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <main
        ref="desktopMainRef"
        class="desktop__main"
      >
        <slot />
        <div
          v-if="!isLayoutReady"
          class="desktop__main-loading"
        >
          <CommonLoadingScreen :title="t('common.loading')" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePushSubscriptionStore } from '~/stores/pushSubscription'
import { createUserWatermark, removeWatermark } from '~/utils/watermark'

const { logout, user } = useAuth()
const pushSubscriptionStore = usePushSubscriptionStore()
const { t } = useAppI18n()
const { menuItems, getMenuItem, navigateByMenuItem } = useSidebarMenu('desktop')
const route = useRoute()
const isLayoutReady = ref(false)
const desktopMainRef = ref<HTMLElement | null>(null)
let loadingVersion = 0

const activeMenu = computed(() => {
  const findActiveMenuKey = (items: typeof menuItems.value): string => {
    for (const item of items) {
      const childMenuKey = findActiveMenuKey(item.children || [])
      if (childMenuKey) {
        return childMenuKey
      }

      if (item.target.type === 'route' && route.path.startsWith(item.resolvedPath)) {
        return item.key
      }
    }

    return ''
  }

  return findActiveMenuKey(menuItems.value)
})

const openMenuKeys = computed(() => {
  return menuItems.value
    .filter(item => item.children?.some(child => child.key === activeMenu.value))
    .map(item => item.key)
})

const handleMenuSelect = async (key: string) => {
  const item = getMenuItem(key)
  if (!item) {
    return
  }

  return navigateByMenuItem(item)
}

const handleLogoClick = () => navigateTo('/')

const handleCommand = async (command: string) => {
  if (command === 'profile') {
    console.log('Open profile page')
    // TODO: 导航到个人信息页面
  }
  else if (command === 'logout') {
    try {
      await pushSubscriptionStore.unsubscribe()
      await logout()
      await navigateTo('/')
    }
    catch (error) {
      console.error('Logout failed:', error)
    }
  }
}

const waitForAnimationFrame = () => {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

const hasRenderedPageContent = () => {
  const main = desktopMainRef.value
  if (!main) {
    return false
  }

  return Array.from(main.children).some((child) => {
    return child instanceof HTMLElement && !child.classList.contains('desktop__main-loading')
  })
}

const waitForDesktopContent = async (timeout = 4000) => {
  const startedAt = Date.now()

  while (!hasRenderedPageContent() && Date.now() - startedAt < timeout) {
    await waitForAnimationFrame()
  }
}

const waitForDesktopReady = async () => {
  const currentLoadingVersion = ++loadingVersion
  isLayoutReady.value = false

  await nextTick()
  await waitForDesktopContent()
  await waitForAnimationFrame()
  await waitForAnimationFrame()

  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 300)),
    ])
  }

  await new Promise(resolve => setTimeout(resolve, route.path === '/desktop' ? 650 : 180))

  if (currentLoadingVersion !== loadingVersion) {
    return
  }

  isLayoutReady.value = true
}

// 在组件挂载后创建水印
onMounted(async () => {
  await waitForDesktopReady()

  if (user.value) {
    createUserWatermark(user.value)
  }
})

watch(
  () => route.path,
  async (path, previousPath) => {
    if (path !== '/desktop' || previousPath === undefined) {
      return
    }

    await waitForDesktopReady()
  },
)

// 在组件卸载前移除水印
onBeforeUnmount(() => {
  removeWatermark()
})
</script>

<style scoped>
.desktop-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.desktop__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    margin: 0 80px 0 16px;
    flex-shrink: 0;
    background: white;
    z-index: 100;
}

.desktop__logo {
    width: 200px;
    height: 40px;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.desktop__logo img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

.desktop_header_actions {
    width: auto;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn {
    width: 40px;
    height: 40px;
    margin-left: 0 !important;
    margin-right: 0 !important;
    border: none;
    background-color: #fce4ec;
    color: #c2185b;
}

.action-btn:hover {
    background-color: #f8bbd0;
}

.avatar-dropdown {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
}

.avatar-dropdown:hover {
    opacity: 0.8;
}

.desktop_layout_content {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
}

.desktop__sidebar {
    width: 220px;
    height: 100%;
    border-right: 1px solid #D9D9D9;
    background-color: #F5F5F5;
    flex-shrink: 0;
    overflow-y: auto;
}

.desktop__sidebar :deep(.el-menu) {
    min-height: 100%;
    border-right: 0;
    --el-menu-bg-color: #F5F5F5;
    --el-menu-text-color: #000000;
    --el-menu-active-color: #A60A3A;
    --el-menu-hover-bg-color: #EEEEEE;
}

.desktop__sidebar :deep(.el-menu-item),
.desktop__sidebar :deep(.el-sub-menu__title) {
    height: 48px;
    padding-left: 22px !important;
    color: #000000;
    font-size: 13px;
    font-weight: 600;
}

.desktop__sidebar :deep(.el-sub-menu .el-menu-item) {
    min-width: 0;
    padding-left: 56px !important;
    font-weight: 500;
}

.desktop__sidebar :deep(.el-menu-item.is-active) {
    padding-left: 18px !important;
    border-left: 4px solid #A60A3A;
    background-color: #E7E7E7;
    color: #A60A3A;
    font-weight: 700;
}

.desktop__sidebar :deep(.el-sub-menu .el-menu-item.is-active) {
    padding-left: 52px !important;
}

.desktop__menu-icon {
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
    color: #A60A3A;
}

.desktop__main {
    position: relative;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background: #FFFFFF;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.desktop__main::-webkit-scrollbar {
    display: none;
}

.desktop__main-loading {
    position: absolute;
    inset: 0;
    z-index: 50;
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
}

:deep(.el-dropdown-menu__item:hover) {
    background-color: #FFE4E8;
    color: #A60A3A;
}
</style>
