<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.85419 17.5002L6.20835 11.646L1.66669 7.7085L7.66669 7.18766L10 1.66683L12.3334 7.18766L18.3334 7.7085L13.7917 11.646L15.1459 17.5002L10 14.396L4.85419 17.5002ZM14.375 5.8335L14.8125 3.97933L13.3334 2.75016L15.2917 2.5835L16.0417 0.833496L16.7917 2.5835L18.75 2.75016L17.2709 3.97933L17.7084 5.8335L16.0417 4.85433L14.375 5.8335Z"
      fill="#A60A3A"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number | string
}>()
</script>
