<template>
  <div class="intranets-newsletter-directory">
    <div class="intranets-newsletter-directory__hero">
      <img
        :src="overviewHero"
        :alt="t('pages.intranets.navigation.newsletter')"
        class="intranets-newsletter-directory__hero-image"
      >
      <h1 class="intranets-newsletter-directory__hero-title">
        {{ t('pages.intranets.navigation.newsletter') }}
      </h1>
    </div>

    <nav class="intranets-newsletter-directory__breadcrumb">
      <NuxtLink to="/mobile/intranets">
        {{ t('pages.intranets.navigation.home') }}
      </NuxtLink>
      <span aria-hidden="true">›</span>
      <NuxtLink to="/mobile/intranets/newsletter">
        {{ t('pages.intranets.navigation.newsletter') }}
      </NuxtLink>
      <span aria-hidden="true">›</span>
      <span>{{ t(props.titleKey) }}</span>
    </nav>

    <article class="intranets-newsletter-directory__content-card">
      <h2 class="intranets-newsletter-directory__title">
        {{ t(props.titleKey) }}
      </h2>

      <ul class="intranets-newsletter-directory__issue-list">
        <li
          v-for="issue in props.issues"
          :key="issue.title"
          :class="{ 'is-featured': issue.featured }"
        >
          {{ issue.title }}
        </li>
      </ul>
    </article>
  </div>

  <IntranetsSharedFooter />
</template>

<script setup lang="ts">
import overviewHero from '~/assets/images/desktop-banner.jpg'

type NewsletterIssue = {
  title: string
  featured?: boolean
}

const props = defineProps<{
  titleKey: string
  issues: NewsletterIssue[]
}>()

const { t } = useAppI18n()
</script>

<style scoped>
.intranets-newsletter-directory {
  padding-bottom: 40px;
  background: #efefef;
}

.intranets-newsletter-directory__hero {
  position: relative;
  aspect-ratio: 20 / 7;
  overflow: hidden;
  background: #dfeef8;
}

.intranets-newsletter-directory__hero-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: 72% center;
}

.intranets-newsletter-directory__hero-title {
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

.intranets-newsletter-directory__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 6px;
  padding: 56px 16px 38px;
  color: #666666;
  font-size: 14px;
  line-height: 1.4;
}

.intranets-newsletter-directory__breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.intranets-newsletter-directory__breadcrumb span:last-child {
  color: #c4385e;
}

.intranets-newsletter-directory__content-card {
  margin: 0 12px;
  padding: 16px 24px 18px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.intranets-newsletter-directory__title {
  margin: 0 0 30px;
  color: #171717;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 500;
}

.intranets-newsletter-directory__issue-list {
  margin: 0;
  border-left: 2px solid #cf365d;
  padding: 0 0 0 10px;
  list-style: none;
}

.intranets-newsletter-directory__issue-list li {
  color: #606060;
  font-size: 14px;
  line-height: 1.6;
}

.intranets-newsletter-directory__issue-list li.is-featured {
  color: #cf365d;
}
</style>
