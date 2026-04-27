<template>
  <div class="mobile-search-page">
    <MobileSearchTab />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})
</script>

<style scoped>
.mobile-search-page {
  height: 100%;
}
</style>
