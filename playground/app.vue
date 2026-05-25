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
    { name: 'application-name', content: 'One OA' },
    { name: 'theme-color', content: '#A60A3A' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'One OA' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },
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
  font-family: var(--font-source-sans-pro);
  line-height: 1.6;
  color: #333;
  opacity: 1;
  transition: opacity 0.1s ease-in;
}

#__nuxt {
  min-height: 100vh;
}
</style>
