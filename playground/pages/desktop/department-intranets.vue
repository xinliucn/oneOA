<template>
  <div class="department-intranets">
    <section
      class="department-intranets__hero"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <h1>Department Intranets</h1>
    </section>

    <main class="department-intranets__body">
      <nav
        class="department-intranets__breadcrumb"
        aria-label="Breadcrumb"
      >
        <NuxtLink to="/desktop">
          Home
        </NuxtLink>
        <span>&gt;</span>
        <span>Department Intranets</span>
      </nav>

      <div class="department-intranets__grid">
        <button
          v-for="card in cards"
          :key="card.title"
          type="button"
          class="department-intranets-card"
          @click="handleCardClick"
        >
          <div
            v-if="card.image"
            class="department-intranets-card__image-wrap"
          >
            <img
              :src="card.image"
              :alt="card.title"
              class="department-intranets-card__image"
            >
          </div>

          <div
            v-else
            class="department-intranets-card__image-wrap department-intranets-card__image-wrap--scenic"
          />

          <div class="department-intranets-card__body">
            <h2>{{ card.title }}</h2>
          </div>
        </button>
      </div>
    </main>

    <footer class="department-intranets__copyright">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import heroImage from '~/assets/images/Rectangle 194.png'
import { getDepartmentIntranetUrl } from '~/utils/departmentIntranet'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const { locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const departmentIntranetUrl = computed(() => getDepartmentIntranetUrl(locale.value))

const cards = [
  {
    title: 'Group Human Resources',
    image: heroImage,
  },
  {
    title: 'Environmental, Social, Governance',
    image: '',
  },
]

const handleCardClick = async () => {
  await openGuardedUrl(departmentIntranetUrl.value, '_blank')
}
</script>

<style scoped>
.department-intranets {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.department-intranets__hero {
  min-height: 250px;
  display: flex;
  align-items: center;
  padding: 0 110px;
  background-size: cover;
  background-position: center;
}

.department-intranets__hero h1 {
  margin: 0;
  color: #ffffff;
  font-size: 34px;
  line-height: 1.2;
  font-weight: 700;
}

.department-intranets__body {
  flex: 1;
  padding: 0 110px 56px;
}

.department-intranets__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 -110px 35px;
  padding: 22px 110px;
  border-bottom: 1px solid #d9d9d9;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.department-intranets__breadcrumb a {
  color: inherit;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0%;
  text-underline-offset: 0%;
  text-decoration-skip-ink: auto;
}

.department-intranets__breadcrumb span {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.department-intranets__breadcrumb span:last-child {
  font-weight: 700;
}

.department-intranets__grid {
  display: grid;
  grid-template-columns: repeat(2, 230px);
  gap: 12px;
  align-items: start;
}

.department-intranets-card {
  width: 230px;
  height: 248px;
  overflow: hidden;
  border: 0;
  border-radius: 12px 12px 6px 6px;
  padding: 0;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
  text-align: left;
  cursor: pointer;
}

.department-intranets-card__image-wrap {
  width: 230px;
  height: 120px;
  overflow: hidden;
  background: #eef2f7;
}

.department-intranets-card__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: 72% center;
}

.department-intranets-card__image-wrap--scenic {
  position: relative;
  background:
    radial-gradient(circle at 76% 16%, rgba(255, 246, 191, 0.96), transparent 20%),
    linear-gradient(180deg, #95d8ff 0%, #c9eafd 42%, #75a04d 43%, #98bd6a 62%, #456f34 100%);
}

.department-intranets-card__image-wrap--scenic::before {
  content: '';
  position: absolute;
  inset: 34px -26px -10px 22px;
  background:
    linear-gradient(140deg, rgba(70, 111, 45, 0.98) 0%, rgba(118, 158, 78, 0.94) 44%, rgba(48, 85, 40, 0.98) 100%);
  clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.department-intranets-card__image-wrap--scenic::after {
  content: '';
  position: absolute;
  inset: 47px -6px 0 0;
  background:
    radial-gradient(circle at 18% 34%, rgba(246, 248, 225, 0.92) 0%, rgba(246, 248, 225, 0.2) 11%, transparent 12%),
    radial-gradient(circle at 32% 52%, rgba(40, 74, 31, 0.96) 0%, rgba(40, 74, 31, 0.96) 14%, transparent 15%),
    radial-gradient(circle at 47% 45%, rgba(53, 88, 36, 0.96) 0%, rgba(53, 88, 36, 0.96) 14%, transparent 15%),
    radial-gradient(circle at 60% 57%, rgba(43, 76, 32, 0.98) 0%, rgba(43, 76, 32, 0.98) 14%, transparent 15%),
    radial-gradient(circle at 75% 50%, rgba(52, 89, 36, 0.98) 0%, rgba(52, 89, 36, 0.98) 13%, transparent 14%),
    radial-gradient(circle at 88% 41%, rgba(38, 68, 30, 0.98) 0%, rgba(38, 68, 30, 0.98) 12%, transparent 13%);
}

.department-intranets-card__body {
  height: 128px;
  display: flex;
  align-items: flex-start;
  padding: 25px 14px 14px;
}

.department-intranets-card__body h2 {
  margin: 0;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  line-height: 130%;
  font-weight: 700;
  letter-spacing: 0;
}

.department-intranets__copyright {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-size: 10px;
  line-height: 1.2;
}
</style>
