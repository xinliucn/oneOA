<template>
<svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.36668 5.06666L2.31668 4.13333L8.03335 9.85L13.75 4.13333L14.7 5.06666L8.03335 11.7333L1.36668 5.06666Z" fill="#A60A3A"/>
</svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number | string
}>()
</script>