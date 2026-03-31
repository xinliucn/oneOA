<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 39 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 34.125V30.875H16.25V27.625H6.5C5.60625 27.625 4.84115 27.3068 4.20469 26.6703C3.56823 26.0339 3.25 25.2687 3.25 24.375V8.125C3.25 7.23125 3.56823 6.46615 4.20469 5.82969C4.84115 5.19323 5.60625 4.875 6.5 4.875H32.5C33.3937 4.875 34.1589 5.19323 34.7953 5.82969C35.4318 6.46615 35.75 7.23125 35.75 8.125V24.375C35.75 25.2687 35.4318 26.0339 34.7953 26.6703C34.1589 27.3068 33.3937 27.625 32.5 27.625H22.75V30.875H26V34.125H13Z"
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
