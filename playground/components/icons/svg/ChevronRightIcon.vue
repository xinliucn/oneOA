<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.33332 18.2917L5.16666 17.1042L12.3125 9.95833L5.16666 2.8125L6.33332 1.625L14.6667 9.95833L6.33332 18.2917Z"
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
    color: 'currentColor'
  }
)
</script>