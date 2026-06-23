<template>
  <div class="desktop-notifications">
    <NotificationPanel />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})
</script>

<style scoped>
.desktop-notifications {
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
  padding: 0;
}

.desktop-notifications :deep(.notification-panel) {
  height: 100%;
  max-width: 960px;
  margin: 0 auto;
  background: #ffffff;
}
</style>
