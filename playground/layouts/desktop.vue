<template>
  <div
    class="desktop-layout"
    style="display: flex; flex-direction: column; width: 100%; height: 100vh; overflow: hidden; background: #FFFFFF;"
  >
    <header class="desktop__header">
      <button
        type="button"
        class="desktop__logo"
        aria-label="Back to desktop home"
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
          class="el-menu-vertical-demo"
          background-color="#F5F5F5"
          text-color="#000000"
          active-text-color="#A60A3A"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.index"
            :index="item.index"
          >
            <template #title>
              <IconCustom
                :name="item.icon"
                :size="26"
              />
              {{ item.label }}
            </template>
          </el-menu-item>
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
          <div class="desktop__loading-content">
            <div class="desktop__loading-title">
              Loading...
            </div>
            <div
              class="desktop__loading-track"
              aria-hidden="true"
            >
              <span class="desktop__loading-bar" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createUserWatermark, removeWatermark } from '~/utils/watermark'
import { getDepartmentIntranetUrl, getEShopUrl } from '~/utils/departmentIntranet'

const { logout, user } = useAuth()
const { unsubscribe } = usePushSubscription()
const { locale, t } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const route = useRoute()
const isLayoutReady = ref(false)
const desktopMainRef = ref<HTMLElement | null>(null)
let loadingVersion = 0

const menuRoutes: Record<string, string> = {
  1: '/desktop/news',
  2: '/desktop/company-information',
  3: '/desktop/company-documents',
  4: '/desktop/applications',
  5: '/desktop/department-intranets',
  // 6: '/desktop/dashboards',
  7: '/desktop/todo',
  // 8: '/desktop/elearning',
  9: '/desktop/eshop',
}

const menuItems = computed(() => [
  { index: '1', icon: 'document', label: t('nav.news') },
  { index: '2', icon: 'info', label: t('nav.companyInformation') },
  { index: '3', icon: 'download', label: t('nav.companyDocuments') },
  { index: '4', icon: 'apps', label: t('nav.applications') },
  { index: '5', icon: 'building', label: t('nav.departmentIntranets') },
  // { index: '6', icon: 'dashboard', label: t('nav.dashboards') },
  { index: '7', icon: 'document', label: t('nav.todo') },
  // { index: '8', icon: 'education', label: t('nav.eLearning') },
  { index: '9', icon: 'shop', label: t('nav.eShop') },
])

const activeMenu = computed(() => {
  const matched = Object.entries(menuRoutes).find(([, path]) => route.path.startsWith(path))
  return matched?.[0] ?? ''
})

const handleMenuSelect = async (index: string) => {
  if (index === '5') {
    await openGuardedUrl(getDepartmentIntranetUrl(locale.value), '_blank')
    return
  }

  if (index === '9') {
    await openGuardedUrl(getEShopUrl(locale.value), '_blank')
    return
  }

  const path = menuRoutes[index]
  if (path) navigateTo(path)
}

const handleLogoClick = () => navigateTo('/')

const handleCommand = async (command: string) => {
  if (command === 'profile') {
    console.log('打开个人信息页面')
    // TODO: 导航到个人信息页面
  }
  else if (command === 'logout') {
    try {
      await unsubscribe()
      await logout()
      await navigateTo('/')
    }
    catch (error) {
      console.error('退出登录失败:', error)
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
    height: 100%;
    border-right: 1px solid #D9D9D9;
    background-color: #F5F5F5;
    flex-shrink: 0;
    overflow-y: auto;
}

.desktop__sidebar :deep(.el-menu) {
    background-color: #F5F5F5;
    border-right: 0;
}

.desktop__sidebar :deep(.el-menu-item) {
    display: flex;
    align-items: center;
    height: 48px;
    padding-left: 22px !important;
    background-color: #F5F5F5;
    color: #000000;
    font-size: 13px;
    font-weight: 600;
}

.desktop__sidebar :deep(.el-menu-item svg) {
    margin-right: 14px;
    flex-shrink: 0;
    color: #A60A3A;
}

.desktop__sidebar :deep(.el-menu-item:hover) {
    background-color: #eeeeee;
}

.desktop__sidebar :deep(.el-menu-item.is-active) {
    position: relative;
    padding-left: 18px !important;
    border-left: 4px solid #A60A3A;
    background-color: #d9d9d9 !important;
    color: #A60A3A !important;
    font-weight: 700;
}

.desktop__sidebar :deep(.el-menu-item.is-active svg) {
    color: #A60A3A !important;
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

.desktop__loading-content {
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateY(-24px);
}

.desktop__loading-title {
    margin-bottom: 28px;
    color: #000000;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
}

.desktop__loading-track {
    width: 252px;
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: #E3E3E3;
}

.desktop__loading-bar {
    display: block;
    width: 74px;
    height: 100%;
    border-radius: inherit;
    background: #A60A3A;
    animation: desktop-loading-slide 1.1s ease-in-out infinite;
}

@keyframes desktop-loading-slide {
    0% {
        transform: translateX(-74px);
    }

    45%,
    55% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(252px);
    }
}

:deep(.el-dropdown-menu__item:hover) {
    background-color: #FFE4E8;
    color: #A60A3A;
}
</style>
