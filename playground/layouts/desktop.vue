<template>
    <div class="desktop-layout">
        <header class="desktop__header">
            <button
                type="button"
                class="desktop__logo"
                aria-label="Back to desktop home"
                @click="handleLogoClick"
            >
                <img src="~/assets/images/dchLogo.png" alt="SuperApp Logo">
            </button>
            <div class="desktop_header_actions">
                <LocaleDropdown />
                <el-button circle class="action-btn">
                    <IconCustom name="search" :size="20" />
                </el-button>
                <NotificationBell />
                <el-dropdown @command="handleCommand">
                    <span class="avatar-dropdown">
                        <el-avatar :size="40" src="/favicon.png" />
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile">{{ t('user.profile') }}</el-dropdown-item>
                            <el-dropdown-item command="logout">{{ t('user.logout') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </header>
        <div class="desktop_layout_content">
            <div class="desktop__sidebar">
                <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect"
                    background-color="#D9D9D9" text-color="#000000" active-text-color="#000000">
                    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
                        <template #title>
                            <IconCustom :name="item.icon" :size="26" />
                            {{ item.label }}
                        </template>
                    </el-menu-item>
                </el-menu>
            </div>
            <main class="desktop__main">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createUserWatermark, removeWatermark } from '~/utils/watermark'

const { logout, user } = useAuth()
const { unsubscribe } = usePushSubscription()
const { t } = useAppI18n()
const route = useRoute()

const menuRoutes: Record<string, string> = {
    '1': '/desktop/news',
    '2': '/desktop/company-information',
    '3': '/desktop/company-documents',
    '4': '/desktop/applications',
    '5': '/desktop/department-intranets',
    '6': '/desktop/dashboards',
    '7': '/desktop/todo',
    '8': '/desktop/elearning',
    '9': '/desktop/eshop',
}

const menuItems = computed(() => [
    { index: '1', icon: 'document', label: t('nav.news') },
    { index: '2', icon: 'info', label: t('nav.companyInformation') },
    { index: '3', icon: 'download', label: t('nav.companyDocuments') },
    { index: '4', icon: 'apps', label: t('nav.applications') },
    { index: '5', icon: 'building', label: t('nav.departmentIntranets') },
    { index: '6', icon: 'dashboard', label: t('nav.dashboards') },
    { index: '7', icon: 'document', label: t('nav.todo') },
    { index: '8', icon: 'education', label: t('nav.eLearning') },
    { index: '9', icon: 'shop', label: t('nav.eShop') },
])

const activeMenu = computed(() => {
    const matched = Object.entries(menuRoutes).find(([, path]) => route.path.startsWith(path))
    return matched?.[0] ?? '1'
})

const handleMenuSelect = (index: string) => {
    const path = menuRoutes[index]
    if (path) navigateTo(path)
}

const handleLogoClick = () => navigateTo('/desktop/news')

const handleCommand = async (command: string) => {
    if (command === 'profile') {
        console.log('打开个人信息页面')
        // TODO: 导航到个人信息页面
    } else if (command === 'logout') {
        try {
            await unsubscribe()
            await logout()
            await navigateTo('/')
        } catch (error) {
            console.error('退出登录失败:', error)
        }
    }
}

// 在组件挂载后创建水印
onMounted(() => {
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
.desktop-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* 防止整个页面滚动 */
}

.desktop__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    margin: 0 80px 0 16px;
    flex-shrink: 0;
    /* 防止 header 被压缩 */
    background: white;
    z-index: 100;

    .desktop__logo {
        width: 200px;
        height: 40px;
        border: 0;
        padding: 0;
        background: transparent;
        cursor: pointer;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .desktop_header_actions {
        width: auto;
        height: 40px;
        display: flex;
        align-items: center;
        gap: 8px;

        .action-btn {
            height: 40px;
            width: 40px;
            background-color: #fce4ec;
            /* 浅粉色背景 */
            border: none;
            color: #c2185b;
            /* 深粉色图标 */

            &:hover {
                background-color: #f8bbd0;
                /* hover 时稍深的粉色 */
            }

            /* 移除 Element Plus 默认的 margin */
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        .avatar-dropdown {
            cursor: pointer;
            display: inline-flex;
            align-items: center;

            &:hover {
                opacity: 0.8;
            }
        }
    }
}

.desktop_layout_content {
    display: flex;
    flex: 1;
    overflow: hidden;
    /* 防止内容区域整体滚动 */
    min-height: 0;
    /* 重要：允许 flex 子元素缩小 */
}

.desktop__sidebar {
    height: 100%;
    background-color: #D9D9D9;
    flex-shrink: 0;
    /* 防止侧边栏被压缩 */
    overflow-y: auto;
    /* 如果菜单项过多，侧边栏可以滚动 */

    /* 菜单项样式 */
    :deep(.el-menu-item) {
        display: flex;
        align-items: center;
        padding-left: 20px;
        height: 48px;
        color: #000000;
        font-size: 16px;

        /* 图标和文字之间的间距 */
        svg {
            margin-right: 12px;
            flex-shrink: 0;
            color: #A60A3A;  /* 图标始终为红色 */
        }

        /* hover 状态 */
        &:hover {
            background-color: #c0c0c0;
        }
    }
}

.desktop__main {
    flex: 1;
    overflow-y: auto;
    /* 内容区域可以滚动 */
    overflow-x: hidden;
    /* 防止横向滚动 */
    background: #FFFFFF;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */

    &::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Opera */
    }
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu__item) {
    &:hover {
        background-color: #FFE4E8;
        color: #A60A3A;
    }
}
</style>
