<!-- eslint-disable vue/no-v-html -->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g v-html="pathContent" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { customIconPaths } from '../customIconPaths'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    color?: string
  }>(),
  {
    size: 20,
    color: 'currentColor',
  },
)

const pathContent = computed(() => customIconPaths[props.name] || customIconPaths.form)
</script>
