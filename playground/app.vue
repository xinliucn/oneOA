<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NetworkGuardOverlay />
</template>

<script setup lang="ts">
const { t } = useAppI18n()

useHead(() => ({
  title: t('common.appName'),
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
}))
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 62.5%;
}

body {
  font-family: 'PingFang SC', 'Noto Sans TC', 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
  opacity: 1;
  transition: opacity 0.1s ease-in;
}

#__nuxt {
  min-height: 100vh;
}
</style>
