<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0002 21.3333L9.3335 14.6667L11.2002 12.7333L14.6668 16.2V5.33333H17.3335V16.2L20.8002 12.7333L22.6668 14.6667L16.0002 21.3333ZM8.00016 26.6667C7.26683 26.6667 6.63905 26.4056 6.11683 25.8833C5.59461 25.3611 5.3335 24.7333 5.3335 24V20H8.00016V24H24.0002V20H26.6668V24C26.6668 24.7333 26.4057 25.3611 25.8835 25.8833C25.3613 26.4056 24.7335 26.6667 24.0002 26.6667H8.00016Z"
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