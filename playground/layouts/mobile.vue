<template>
    <div class="mobile">
        <header class="mobile__header">
            <div class="mobile__header-left">
                <IconCustom name="menu" :size="24" class="menu-icon" @click="openMenu"/>
                <div class="mobile__logo">
                    <img src="~/assets/images/dchLogo.png" alt="SuperApp Logo">
                </div>
            </div>
            <div class="mobile__header-right">
                <!-- <el-button circle class="action-btn active-btn">
                    <IconCustom name="share" :size="20" />
                </el-button> -->
                <LocaleDropdown variant="mobile" placement="bottom-end" />
                <!-- <NotificationBell
                    :button-size="36"
                    :icon-size="20"
                />
                <el-avatar :size="40" src="/favicon.png" /> -->
            </div>
        </header>
        <main class="mobile__main">
            <slot />
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
                        <IconCustom :name="tab.icon" :size="24" />
                    </template>
                    <span class="tab-label">{{ tab.label }}</span>
                </div>
            </div>
        </footer>
        <MobileSidebar v-model="isSidebarOpen" />
    </div>
</template>


<script setup lang="ts">
import { provide, watch } from 'vue'
import { createUserWatermark, removeWatermark } from '~/utils/watermark'
import MobileSidebar from '~/components/MobileSidebar.vue'

const { user } = useAuth()
const { t } = useAppI18n()
const route = useRoute()
const activeTab = useState('mobile:activeTab', () => 1)
const isSidebarOpen = useState('mobile:isSidebarOpen', () => false)
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
    { index: 4, icon: 'search', label: 'Profile', type: 'profile' }
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
    { immediate: true }
)

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
.mobile {
    height: 100vh;
    display: flex;
    flex-direction: column;
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
    overflow: hidden;
}

:deep(.notification-bell-popover--mobile) {
    max-width: calc(100vw - 24px);
}

:deep(.notification-bell-popover--mobile .el-popper__arrow) {
    display: none;
}

.mobile__footer {
    background-color: #ffffff;
    border-top: 0;
    padding: 8px 0 6px;
    box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.04);
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
