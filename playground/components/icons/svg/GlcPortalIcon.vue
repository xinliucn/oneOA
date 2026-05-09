<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 39 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.375 26H14.625V6.5H11.375V26ZM9.75 35.75C8.39583 35.75 7.24479 35.276 6.29688 34.3281C5.34896 33.3802 4.875 32.2292 4.875 30.875V8.125C4.875 6.77083 5.34896 5.61979 6.29688 4.67188C7.24479 3.72396 8.39583 3.25 9.75 3.25H27.625V29.25H9.75C9.28958 29.25 8.90365 29.4057 8.59219 29.7172C8.28073 30.0286 8.125 30.4146 8.125 30.875C8.125 31.3354 8.28073 31.7214 8.59219 32.0328C8.90365 32.3443 9.28958 32.5 9.75 32.5H30.875V6.5H34.125V35.75H9.75Z"
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
