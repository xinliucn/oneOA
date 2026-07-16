<template>
  <div class="intranets-page">
    <div class="intranets-page__body">
      <section class="intranets-overview">
        <div class="intranets-overview__hero">
          <img
            :src="overviewHero"
            :alt="t('pages.intranets.overview.title')"
            class="intranets-overview__hero-image"
          >
          <h1 class="intranets-overview__hero-title">
            {{ t('pages.intranets.overview.title') }}
          </h1>
        </div>

        <article class="intranets-overview__content-card">
          <h2 class="intranets-overview__content-title">
            {{ t('pages.intranets.overview.aboutTitle') }}
          </h2>

          <p
            v-for="paragraph in overviewParagraphs"
            :key="paragraph"
            class="intranets-overview__paragraph"
          >
            {{ paragraph }}
          </p>
        </article>
      </section>

      <IntranetsSharedFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import overviewHero from '~/assets/images/desktop-banner.jpg'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()

const overviewParagraphs = computed(() => [
  t('pages.intranets.overview.paragraph1'),
  t('pages.intranets.overview.paragraph2'),
  t('pages.intranets.overview.paragraph3'),
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

.intranets-overview {
  background: #efefef;
}

.intranets-overview__hero {
  position: relative;
  aspect-ratio: 20 / 7;
  overflow: hidden;
  background: #dfeef8;
}

.intranets-overview__hero-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: 72% center;
}

.intranets-overview__hero-title {
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

.intranets-overview__content-card {
  margin: 40px 8px 0;
  padding: 18px 16px 22px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.intranets-overview__content-title {
  margin: 0 0 16px;
  color: #171717;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
}

.intranets-overview__paragraph {
  margin: 0;
  color: #4d4d4d;
  font-size: 12px;
  line-height: 1.45;
}

.intranets-overview__paragraph + .intranets-overview__paragraph {
  margin-top: 16px;
}
</style>
