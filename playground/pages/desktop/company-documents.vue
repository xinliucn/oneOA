<script setup>
definePageMeta({ layout: 'desktop', middleware: 'auth' })
</script>

<template>
  <div class="page">
    <h1 class="page__title">Company Documents</h1>
    <p class="page__placeholder">公司文档内容区域</p>
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
