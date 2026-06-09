<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      v-for="dot in dots"
      :key="`${dot.cx}-${dot.cy}`"
      :cx="dot.cx"
      :cy="dot.cy"
      r="2.35"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string
    color?: string
  }>(),
  {
    size: 20,
    color: 'currentColor',
  },
)

const dots = [
  { cx: 8, cy: 8 },
  { cx: 15, cy: 8 },
  { cx: 22, cy: 8 },
  { cx: 8, cy: 15 },
  { cx: 15, cy: 15 },
  { cx: 22, cy: 15 },
  { cx: 8, cy: 22 },
  { cx: 15, cy: 22 },
  { cx: 22, cy: 22 },
]
</script>
