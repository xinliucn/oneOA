<template>
    <Teleport to="body">
        <!-- 遮罩层 -->
        <div v-if="modelValue" class="overlay" @click="emit('update:modelValue', false)" />

        <!-- 侧边栏 -->
        <Transition name="slide">
            <div v-if="modelValue" class="sidebar">
                <!-- Header -->
                <div class="sidebar__header">
                    <IconCustom name="menu" :size="24" class="close-icon" @click="emit('update:modelValue', false)" />
                    <div class="sidebar__logo">
                        <img src="~/assets/images/dchLogo.png" alt="DCH Logo">
                    </div>
                </div>

                <!-- 菜单列表 -->
                <nav class="sidebar__nav">
                    <div v-for="item in menuItems" :key="item.label" class="sidebar__item">
                        <div class="sidebar__icon">
                            <IconCustom :name="item.icon" :size="20" />
                        </div>
                        <span class="sidebar__label">{{ item.label }}</span>
                    </div>
                </nav>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const menuItems = [
    { icon: 'document', label: 'News' },
    { icon: 'info', label: 'Company Information' },
    { icon: 'download', label: 'Company Documents' },
    { icon: 'apps', label: 'Applications' },
    { icon: 'building', label: 'Department Intranets' },
    { icon: 'dashboard', label: 'Dashboards' },
    { icon: 'todo', label: 'To-Do' },
    { icon: 'education', label: 'eLearning' },
    { icon: 'shop', label: 'eShop' },
]
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    max-width: 320px;
    height: 100%;
    background: #fff;
    z-index: 101;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar__header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    height: 64px;
    border-bottom: 1px solid #e0e0e0;

    .close-icon {
        cursor: pointer;
        color: #333;
    }

    .sidebar__logo {
        height: 32px;

        img {
            height: 100%;
            object-fit: contain;
        }
    }
}

.sidebar__nav {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

.sidebar__item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    cursor: pointer;

    &:hover {
        background-color: #f5f5f5;
    }
}

.sidebar__icon {
    width: 36px;
    height: 36px;
    background-color: #A60A3A;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
}

.sidebar__label {
    font-size: 15px;
    color: #333;
}

/* 滑入动画 */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}
</style>
