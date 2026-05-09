<script setup lang="ts">
definePageMeta({ layout: 'desktop', middleware: 'auth' })

const { t } = useAppI18n()
</script>

<template>
  <DesktopComingSoon
    :title="t('pages.eLearning.title')"
    :description="t('pages.eLearning.placeholder')"
    :status="t('pages.comingSoon.status')"
    :action-label="t('pages.comingSoon.action')"
    icon="education"
  />
</template>
