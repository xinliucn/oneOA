<template>
  <div class="intranets-page">
    <div class="intranets-page__body">
      <section class="intranets-vision">
        <div class="intranets-vision__hero">
          <img
            :src="overviewHero"
            :alt="t('pages.intranets.overview.title')"
            class="intranets-vision__hero-image"
          >
          <h1 class="intranets-vision__hero-title">
            {{ t('pages.intranets.overview.title') }}
          </h1>
        </div>

        <nav class="intranets-vision__breadcrumb">
          <NuxtLink to="/mobile/intranets">
            {{ t('pages.intranets.navigation.home') }}
          </NuxtLink>
          <span aria-hidden="true">›</span>
          <span>{{ t('pages.intranets.navigation.visionMissionValues') }}</span>
        </nav>

        <article class="intranets-vision__content-card">
          <h2 class="intranets-vision__title">
            {{ t('pages.intranets.navigation.visionMissionValues') }}
          </h2>

          <p
            v-for="paragraph in introParagraphs"
            :key="paragraph"
            class="intranets-vision__paragraph"
          >
            {{ paragraph }}
          </p>

          <section
            v-for="section in visionSections"
            :key="section.heading"
            class="intranets-vision__section"
          >
            <h3 class="intranets-vision__section-title">
              {{ section.heading }}
            </h3>
            <p
              v-for="paragraph in section.paragraphs"
              :key="paragraph"
              class="intranets-vision__paragraph"
            >
              {{ paragraph }}
            </p>
          </section>

          <div class="intranets-vision__values-visual">
            <img
              :src="valuesImage"
              :alt="t('pages.intranets.navigation.visionMissionValues')"
              class="intranets-vision__values-image"
            >
            <div class="intranets-vision__values-overlay">
              <div
                v-for="value in values"
                :key="value.label"
                class="intranets-vision__value"
              >
                <span class="intranets-vision__value-letter">{{ value.initial }}</span>
                <span class="intranets-vision__value-label">{{ value.label }}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <IntranetsSharedFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import overviewHero from '~/assets/images/desktop-banner.jpg'
import valuesImage from '~/assets/images/Group 120.png'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()
const { contentBlocks } = useCompanyInformationContent()

const introParagraphs = computed(() => {
  return contentBlocks.value[0]?.paragraphs || []
})
const visionSections = computed(() => {
  return contentBlocks.value.slice(1)
})
const values = computed(() => [
  { initial: 'P', label: t('pages.intranets.valuesVisual.partnership') },
  { initial: 'R', label: t('pages.intranets.valuesVisual.results') },
  { initial: 'I', label: t('pages.intranets.valuesVisual.integrity') },
  { initial: 'D', label: t('pages.intranets.valuesVisual.dynamism') },
  { initial: 'E', label: t('pages.intranets.valuesVisual.engagement') },
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

.intranets-vision {
  padding-bottom: 40px;
  background: #efefef;
}

.intranets-vision__hero {
  position: relative;
  aspect-ratio: 20 / 7;
  overflow: hidden;
  background: #dfeef8;
}

.intranets-vision__hero-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: 72% center;
}

.intranets-vision__hero-title {
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

.intranets-vision__breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 56px 20px 38px;
  color: #666666;
  font-size: 14px;
  line-height: 1.4;
}

.intranets-vision__breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.intranets-vision__breadcrumb span:last-child {
  color: #c4385e;
}

.intranets-vision__content-card {
  margin: 0 8px;
  padding: 24px 20px 20px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.intranets-vision__title {
  margin: 0 0 24px;
  color: #171717;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
}

.intranets-vision__section {
  margin-top: 30px;
}

.intranets-vision__section-title {
  margin: 0 0 18px;
  color: #c4385e;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
}

.intranets-vision__paragraph {
  margin: 0;
  color: #666666;
  font-size: 14px;
  line-height: 1.55;
}

.intranets-vision__paragraph + .intranets-vision__paragraph {
  margin-top: 14px;
}

.intranets-vision__values-visual {
  position: relative;
  aspect-ratio: 2 / 3;
  margin-top: 32px;
  overflow: hidden;
  background: #667887;
}

.intranets-vision__values-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.72);
}

.intranets-vision__values-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
}

.intranets-vision__value {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.intranets-vision__value:last-child {
  border-bottom: 0;
}

.intranets-vision__value-letter {
  color: rgba(255, 255, 255, 0.62);
  font-size: clamp(62px, 23vw, 110px);
  line-height: 1;
  font-weight: 700;
}

.intranets-vision__value-label {
  position: absolute;
  color: #ffffff;
  font-size: 11px;
  line-height: 1.2;
  font-weight: 700;
}
</style>
