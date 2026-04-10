<template>
  <div class="mobile-notifications">
    <NotificationPanel />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})
</script>

<style scoped>
.mobile-notifications {
  height: 100%;
  background: #f5f5f5;
  overflow-y: auto;
}

.mobile-notifications :deep(.notification-panel) {
  max-width: none;
  max-height: none;
  min-height: 100%;
  background: #ffffff;
  box-sizing: border-box;
}
</style>
