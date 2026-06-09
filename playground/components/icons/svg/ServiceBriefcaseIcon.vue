<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5 5.5H18.5C19.33 5.5 20 6.17 20 7V9H25C25.83 9 26.5 9.67 26.5 10.5V24C26.5 24.83 25.83 25.5 25 25.5H5C4.17 25.5 3.5 24.83 3.5 24V10.5C3.5 9.67 4.17 9 5 9H10V7C10 6.17 10.67 5.5 11.5 5.5ZM12.5 9H17.5V8H12.5V9ZM6.5 12V16H23.5V12H6.5ZM6.5 22.5H23.5V18.8H6.5V22.5Z"
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
</script>
