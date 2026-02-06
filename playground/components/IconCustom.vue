<template>
  <component
    :is="iconComponent"
    :size="size"
    :color="color"
    :class="className"
    :style="style"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GlobeIcon from './icons/svg/GlobeIcon.vue'
import SearchIcon from './icons/svg/SearchIcon.vue'
import BellIcon from './icons/svg/BellIcon.vue'
import DocumentIcon from './icons/svg/DocumentIcon.vue'
import InfoIcon from './icons/svg/InfoIcon.vue'
import DownloadIcon from './icons/svg/DownloadIcon.vue'
import AppsIcon from './icons/svg/AppsIcon.vue'
import BuildingIcon from './icons/svg/BuildingIcon.vue'
import DashboardIcon from './icons/svg/DashboardIcon.vue'
import EducationIcon from './icons/svg/EducationIcon.vue'
import ShopIcon from './icons/svg/ShopIcon.vue'
import MenuIcon from './icons/svg/MenuIcon.vue'
import ShareIcon from './icons/svg/ShareIcon.vue'
import ChevronRightIcon from './icons/svg/ChevronRightIcon.vue'

const props = withDefaults(
  defineProps<{
    name: 'globe' | 'search' | 'bell' | 'document' | 'info' | 'download' | 'apps' | 'building' | 'dashboard' | 'education' | 'shop' | 'menu' | 'share' | 'chevron-right'
    size?: number | string
    color?: string
    className?: string
    rotate?: number
    spin?: boolean
  }>(),
  {
    size: 20,
    color: 'currentColor',
    rotate: 0,
    spin: false
  }
)

// 图标映射表
const iconMap: Record<string, any> = {
  globe: GlobeIcon,
  search: SearchIcon,
  bell: BellIcon,
  document: DocumentIcon,
  info: InfoIcon,
  download: DownloadIcon,
  apps: AppsIcon,
  building: BuildingIcon,
  dashboard: DashboardIcon,
  education: EducationIcon,
  shop: ShopIcon,
  menu: MenuIcon,
  share: ShareIcon,
  'chevron-right': ChevronRightIcon
}

// 动态获取图标组件
const iconComponent = computed(() => {
  return iconMap[props.name] || null
})

// 动态样式
const style = computed(() => ({
  transform: `rotate(${props.rotate}deg)`,
  animation: props.spin ? 'icon-spin 1s linear infinite' : 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}))
</script>

<style scoped>
@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>