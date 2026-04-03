<script setup lang="ts">
definePageMeta({ layout: 'desktop', middleware: 'auth' })

const { t } = useAppI18n()
</script>

<template>
  <div class="page">
    <h1 class="page__title">{{ t('pages.companyDocuments.title') }}</h1>
    <p class="page__placeholder">{{ t('pages.companyDocuments.placeholder') }}</p>
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
