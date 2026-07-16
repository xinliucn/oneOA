<template>
  <div class="mobile-company-information">
    <div class="mobile-company-information__page-title">
      {{ pageTitle }}
    </div>

    <section class="mobile-company-information__section">
      <h1 class="mobile-company-information__title">
        {{ pageTitle }}
      </h1>

      <div class="mobile-company-information__hero">
        <img
          src="~/assets/images/desktop-banner.jpg"
          :alt="pageTitle"
          class="mobile-company-information__hero-image"
        >
      </div>

      <div class="mobile-company-information__content">
        <section
          v-for="block in contentBlocks"
          :key="block.heading"
          class="mobile-company-information__block"
        >
          <h2 class="mobile-company-information__heading">
            {{ block.heading }}
          </h2>
          <p
            v-for="paragraph in block.paragraphs"
            :key="paragraph"
            class="mobile-company-information__paragraph"
          >
            {{ paragraph }}
          </p>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()

const pageTitle = computed(() => t('pages.companyInformation.title'))
const { contentBlocks } = useCompanyInformationContent()
</script>

<style scoped>
.mobile-company-information {
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
}

.mobile-company-information__page-title {
  padding: 14px 16px 10px;
  font-size: 13px;
  line-height: 1.3;
  color: #4a4a4a;
}

.mobile-company-information__section {
  background: #ffffff;
}

.mobile-company-information__title {
  margin: 0;
  padding: 0 16px 10px;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 700;
  color: #171717;
}

.mobile-company-information__hero {
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  background: #dfeef8;
}

.mobile-company-information__hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-company-information__content {
  padding: 16px 16px 28px;
}

.mobile-company-information__block + .mobile-company-information__block {
  margin-top: 18px;
}

.mobile-company-information__heading {
  margin: 0 0 6px;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 700;
  color: #232323;
}

.mobile-company-information__paragraph {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: #323232;
}

.mobile-company-information__paragraph + .mobile-company-information__paragraph {
  margin-top: 10px;
}
</style>
