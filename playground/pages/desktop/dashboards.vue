<script setup lang="ts">
definePageMeta({ layout: 'desktop', middleware: 'auth' })

const { t } = useAppI18n()
</script>

<template>
  <DesktopComingSoon
    :title="t('pages.dashboards.title')"
    :description="t('pages.dashboards.placeholder')"
    :status="t('pages.comingSoon.status')"
    :action-label="t('pages.comingSoon.action')"
    icon="dashboard"
  />
</template>
