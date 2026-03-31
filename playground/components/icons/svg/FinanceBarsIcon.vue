<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 39 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.125 34.125C7.23125 34.125 6.46615 33.8068 5.82969 33.1703C5.19323 32.5339 4.875 31.7687 4.875 30.875V4.875H8.125V30.875H34.125V34.125H8.125ZM9.75 29.25V14.625H16.25V29.25H9.75ZM17.875 29.25V6.5H24.375V29.25H17.875ZM26 29.25V21.125H32.5V29.25H26Z"
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
