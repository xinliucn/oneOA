<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8A3 3 0 0 0 9 11V13A3 3 0 0 0 15 13V11A3 3 0 0 0 12 8Z"
      :stroke="color"
      stroke-width="1.8"
      stroke-linejoin="round"
    />
    <path
      d="M9 8L8 6M15 8L16 6M8 12H5M19 12H16M8.5 16L7 18M15.5 16L17 18"
      :stroke="color"
      stroke-width="1.8"
      stroke-linecap="round"
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
