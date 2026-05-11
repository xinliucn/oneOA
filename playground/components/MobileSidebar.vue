<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="overlay"
      @click="emit('update:modelValue', false)"
    />

    <Transition name="slide">
      <div
        v-if="modelValue"
        class="sidebar"
      >
        <div class="sidebar__header">
          <IconCustom
            name="menu"
            :size="24"
            class="close-icon"
            @click="emit('update:modelValue', false)"
          />
          <div class="sidebar__logo">
            <img
              src="~/assets/images/dchLogo.png"
              alt="DCH Logo"
            >
          </div>
        </div>

        <nav class="sidebar__nav">
          <div
            v-for="item in menuItems"
            :key="item.key"
            class="sidebar__item"
            @click="onNavigateTo(item)"
          >
            <div class="sidebar__icon">
              <IconCustom
                :name="item.icon"
                :size="22"
              />
            </div>
            <span class="sidebar__label">{{ item.label }}</span>
          </div>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sidebarMenuConfig, type SidebarMenuConfigItem } from '~/constants/sidebarMenu'

type SidebarMenuItem = SidebarMenuConfigItem & {
  label: string
}

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
const { t } = useAppI18n()
const activeTab = useState('mobile:activeTab', () => 1)

const menuItems = computed<SidebarMenuItem[]>(() => {
  return sidebarMenuConfig.map(item => ({
    ...item,
    label: t(item.labelKey),
  }))
})

const onNavigateTo = (item: SidebarMenuItem) => {
  emit('update:modelValue', false)

  if (!item.path) {
    return
  }

  if (typeof item.tabIndex === 'number') {
    activeTab.value = item.tabIndex
  }

  return navigateTo(item.path)
}
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
  padding: 10px 0 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar__nav::-webkit-scrollbar {
  display: none;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }
}

.sidebar__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
  flex-shrink: 0;
}

.sidebar__label {
  font-size: 16px;
  line-height: 1.4;
  font-weight: 500;
  color: #111111;
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
