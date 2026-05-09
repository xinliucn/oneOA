<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.33268 18.2917L5.16602 17.1042L12.3118 9.95833L5.16602 2.8125L6.33268 1.625L14.666 9.95833L6.33268 18.2917Z"
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
    color: '#A60A3A',
  },
)
</script>
