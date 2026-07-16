<template>
  <div class="intranets-newsletter-page">
    <div class="intranets-newsletter-page__body">
      <IntranetsNewsletterDirectory
        title-key="pages.intranets.navigation.dchConnect"
        :issues="issues"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const issues = [
  { title: 'DCH Connect (Autumn 2025) Flipbook' },
  { title: 'DCH Connect (Summer 2025) Flipbook' },
  { title: 'DCH Connect (Spring 2025) Flipbook' },
  { title: 'DCH Connect (Autumn 2024) Flipbook' },
  { title: 'DCH Connect (Winter 2024) Flipbook' },
  { title: 'DCH Connect (Summer 2024) Flipbook' },
  { title: 'DCH Connect (Spring 2024) Flipbook' },
  { title: 'DCH Connect (Winter 2023) Minisite' },
  { title: 'DCH Connect (Winter 2023) Flipbook' },
  { title: 'DCH Connect (Autumn 2023) Minisite' },
  { title: 'DCH Connect (Autumn 2023) Flipbook' },
  { title: 'DCH Connect (Summer 2023) Minisite', featured: true },
  { title: 'DCH Connect (Summer 2023) Flipbook' },
  { title: 'DCH Connect (Spring 2023) Minisite' },
  { title: 'DCH Connect (Spring 2023) Flipbook' },
  { title: 'DCH Connect (Winter 2022) Minisite' },
  { title: 'DCH Connect (Winter 2022) Flipbook' },
  { title: 'DCH Connect (Autumn 2022) Minisite' },
  { title: 'DCH Connect (Autumn 2022) Flipbook' },
  { title: 'DCH Connect (Summer 2022) Minisite' },
  { title: 'DCH Connect (Summer 2022) Flipbook' },
  { title: 'DCH Connect (Spring 2022) Minisite' },
  { title: 'DCH Connect (Spring 2022) Flipbook' },
  { title: 'DCH Connect (Winter 2021) Flipbook' },
  { title: 'DCH Connect (Winter 2021) Minisite' },
  { title: 'Newsletter Nov 2021 Site' },
]
</script>

<style scoped>
.intranets-newsletter-page {
  height: 100%;
  min-height: 0;
  background: #efefef;
}

.intranets-newsletter-page__body {
  height: 100%;
  overflow-y: auto;
}
</style>
