<template>
    <div class="mobile">
        <header class="mobile__header">
            <div class="mobile__header-left">
                <IconCustom name="menu" :size="24" class="menu-icon" />
                <div class="mobile__logo">
                    <img src="~/assets/images/dchLogo.png" alt="SuperApp Logo">
                </div>
            </div>
            <div class="mobile__header-right">
                
                <el-button circle class="action-btn active-btn">
                    <IconCustom name="share" :size="20" />
                </el-button>
                 <el-button circle class="action-btn active-btn">
                    <IconCustom name="globe" :size="20" />
                </el-button>
                <el-button circle class="action-btn active-btn">
                    <IconCustom name="bell" :size="20" />
                </el-button>
                <el-avatar :size="40" src="/path/to/avatar.jpg" />
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
                    :class="['tab-item', { active: activeTab === tab.index }]"
                    @click="handleTabClick(tab.index)"
                >
                    <IconCustom :name="tab.icon" :size="24" />
                    <span class="tab-label">{{ tab.label }}</span>
                </div>
            </div>
        </footer>
    </div>
</template>


<script setup>
import { ref, provide } from 'vue'
import { createUserWatermark, removeWatermark } from '~/utils/watermark'

const { user } = useAuth()
const activeTab = ref(1)

const tabs = [
    { index: 1, icon: 'document', label: 'To-Do' },
    { index: 2, icon: 'bell', label: 'My Favourites' },
    { index: 3, icon: 'apps', label: 'Applications' },
    { index: 4, icon: 'search', label: 'Search' }
]

const handleTabClick = (tabIndex) => {
    activeTab.value = tabIndex
}

// Provide activeTab to child components
provide('activeTab', activeTab)

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

.mobile__footer {
    background-color: #ffffff;
    border-top: 1px solid #e0e0e0;
    padding: 8px 0;
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
        font-size: 12px;
        line-height: 1.2;
    }

    &.active {
        color: #A60A3A;

        &::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background-color: #A60A3A;
            border-radius: 2px;
        }
    }
}
</style>