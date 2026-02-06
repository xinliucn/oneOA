<template>
  <svg :width="size" :height="size * 0.75" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1" y1="1" x2="23" y2="1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="1" y1="9" x2="23" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="1" y1="17" x2="23" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  size?: number | string
}>()
</script>