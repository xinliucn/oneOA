<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.33333 8.16667H23.3333V5.83333H9.33333V8.16667ZM9.33333 15.1667H23.3333V12.8333H9.33333V15.1667ZM9.33333 22.1667H23.3333V19.8333H9.33333V22.1667ZM4.66667 8.16667H7V5.83333H4.66667V8.16667ZM4.66667 15.1667H7V12.8333H4.66667V15.1667ZM4.66667 22.1667H7V19.8333H4.66667V22.1667Z"
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
