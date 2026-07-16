<template>
  <NuxtPage v-if="isChildRoute" />

  <div
    v-else
    class="intranets-page"
  >
    <div class="intranets-page__body">
      <section class="intranets-newsletter">
        <div class="intranets-newsletter__hero">
          <img
            :src="overviewHero"
            :alt="t('pages.intranets.navigation.newsletter')"
            class="intranets-newsletter__hero-image"
          >
          <h1 class="intranets-newsletter__hero-title">
            {{ t('pages.intranets.navigation.newsletter') }}
          </h1>
        </div>

        <nav class="intranets-newsletter__breadcrumb">
          <NuxtLink to="/mobile/intranets">
            {{ t('pages.intranets.navigation.home') }}
          </NuxtLink>
          <span aria-hidden="true">›</span>
          <span>{{ t('pages.intranets.navigation.newsletter') }}</span>
        </nav>

        <div class="intranets-newsletter__cards">
          <NuxtLink
            v-for="item in newsletterItems"
            :key="item.path"
            :to="item.path"
            class="intranets-newsletter__card"
          >
            <img
              :src="item.image"
              :alt="item.label"
              class="intranets-newsletter__card-image"
            >
            <span class="intranets-newsletter__card-overlay" />
            <span class="intranets-newsletter__card-label">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </section>

      <IntranetsSharedFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import overviewHero from '~/assets/images/desktop-banner.jpg'
import dchConnectImage from '~/assets/images/Group 120.png'
import dchLetterImage from '~/assets/images/Rectangle 194.png'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()
const route = useRoute()
const isChildRoute = computed(() => route.path !== '/mobile/intranets/newsletter')

const newsletterItems = computed(() => [
  {
    label: t('pages.intranets.navigation.dchLetter'),
    path: '/mobile/intranets/newsletter/dch-letter',
    image: dchLetterImage,
  },
  {
    label: t('pages.intranets.navigation.dchConnect'),
    path: '/mobile/intranets/newsletter/dch-connect',
    image: dchConnectImage,
  },
])
</script>

<style scoped>
.intranets-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.intranets-page__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.intranets-newsletter {
  padding-bottom: 40px;
  background: #efefef;
}

.intranets-newsletter__hero {
  position: relative;
  aspect-ratio: 20 / 7;
  overflow: hidden;
  background: #dfeef8;
}

.intranets-newsletter__hero-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: 72% center;
}

.intranets-newsletter__hero-title {
  position: absolute;
  left: 12px;
  bottom: 12px;
  margin: 0;
  color: #ffffff;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.intranets-newsletter__breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 56px 16px 38px;
  color: #666666;
  font-size: 14px;
  line-height: 1.4;
}

.intranets-newsletter__breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.intranets-newsletter__breadcrumb span:last-child {
  color: #666666;
}

.intranets-newsletter__cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 16px;
}

.intranets-newsletter__card {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  color: #ffffff;
  text-decoration: none;
}

.intranets-newsletter__card-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.intranets-newsletter__card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04) 38%, rgba(0, 0, 0, 0.42) 100%);
}

.intranets-newsletter__card-label {
  position: absolute;
  left: 24px;
  bottom: 16px;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 400;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
</style>
