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
import GlobeIcon from './svg/GlobeIcon.vue'
import SearchIcon from './svg/SearchIcon.vue'
import BellIcon from './svg/BellIcon.vue'

const props = withDefaults(
  defineProps<{
    name: 'globe' | 'search' | 'bell'
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
  bell: BellIcon
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