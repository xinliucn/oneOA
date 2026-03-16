<script setup>
definePageMeta({ layout: 'desktop', middleware: 'auth' })
</script>

<template>
  <div class="page">
    <h1 class="page__title">To-Do</h1>
    <p class="page__placeholder">待办事项内容区域</p>
  </div>
</template>

<style scoped>
.page {
  padding: 32px;
}
.page__title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2328;
  margin: 0 0 16px;
}
.page__placeholder {
  color: #999;
  font-size: 14px;
}
</style>
