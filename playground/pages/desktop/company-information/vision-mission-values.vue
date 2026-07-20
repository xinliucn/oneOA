<template>
  <main class="company-information-page">
    <h1>{{ t('pages.intranets.navigation.visionMissionValues') }}</h1>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const { t } = useAppI18n()
</script>

<style scoped>
.company-information-page {
  padding: 48px;
}
</style>
