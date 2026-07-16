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
          <template
            v-for="item in menuItems"
            :key="item.key"
          >
            <div
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

            <div
              v-if="item.key === 'department-intranets'"
              class="sidebar__intranets"
            >
              <template
                v-for="intranetsItem in intranetsNavigationItems"
                :key="intranetsItem.key"
              >
                <button
                  type="button"
                  class="sidebar__intranets-item"
                  :class="{ 'is-active': isIntranetsItemActive(intranetsItem) }"
                  @click="onNavigateToIntranets(intranetsItem.path)"
                >
                  {{ t(intranetsItem.labelKey) }}
                </button>

                <div
                  v-if="intranetsItem.children?.length"
                  class="sidebar__intranets-children"
                >
                  <button
                    v-for="childItem in intranetsItem.children"
                    :key="childItem.key"
                    type="button"
                    class="sidebar__intranets-child"
                    :class="{ 'is-active': route.path === childItem.path }"
                    @click="onNavigateToIntranets(childItem.path)"
                  >
                    {{ t(childItem.labelKey) }}
                  </button>
                </div>
              </template>
            </div>
          </template>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { intranetsNavigationItems, type IntranetsNavigationItem } from '~/constants/intranetsNavigation'
import type { SidebarMenuResolvedItem } from '~/types/sidebarMenu'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
const { menuItems, navigateByMenuItem } = useSidebarMenu('mobile')
const { t } = useAppI18n()
const route = useRoute()

const onNavigateTo = async (item: SidebarMenuResolvedItem) => {
  emit('update:modelValue', false)
  return navigateByMenuItem(item)
}

const onNavigateToIntranets = async (path: string) => {
  emit('update:modelValue', false)
  return navigateTo(path)
}

const isIntranetsItemActive = (item: IntranetsNavigationItem) => {
  return route.path === item.path || item.children?.some(child => route.path === child.path)
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

.sidebar__intranets {
  margin: -4px 16px 8px 56px;
  border-top: 1px solid #e6e6e6;
}

.sidebar__intranets-item {
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: center;
  border: 0;
  border-bottom: 1px solid #e6e6e6;
  padding: 8px 12px;
  background: transparent;
  color: #4d4d4d;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
}

.sidebar__intranets-item.is-active {
  color: #a60a3a;
  font-weight: 600;
}

.sidebar__intranets-children {
  margin: 0 0 4px 16px;
  border-left: 2px solid #cf365d;
}

.sidebar__intranets-child {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  border: 0;
  padding: 8px 12px;
  background: transparent;
  color: #5a5a5a;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
}

.sidebar__intranets-child.is-active {
  color: #a60a3a;
  font-weight: 600;
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
