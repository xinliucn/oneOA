<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4V7M12 17V20M4 12H7M17 12H20"
      :stroke="color"
      stroke-width="1.8"
      stroke-linecap="round"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      :stroke="color"
      stroke-width="1.8"
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
</script>
