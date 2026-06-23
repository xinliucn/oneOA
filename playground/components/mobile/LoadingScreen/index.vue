<template>
  <CommonLoadingScreen
    :title="title"
    variant="mobile"
  />
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
