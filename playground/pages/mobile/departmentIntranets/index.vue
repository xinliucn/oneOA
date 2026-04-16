<template>
  <div class="mobile-department-intranets">
    <header class="mobile-department-intranets__header">
      <h1 class="mobile-department-intranets__title">
        {{ pageTitle }}
      </h1>
    </header>

    <main class="mobile-department-intranets__grid">
      <button
        v-for="card in cards"
        :key="card.title"
        type="button"
        class="mobile-department-intranets__card"
        @click="handleCardClick(card)"
      >
        <div
          v-if="card.image"
          class="mobile-department-intranets__card-image-wrap"
        >
          <img
            :src="card.image"
            :alt="card.title"
            class="mobile-department-intranets__card-image"
          >
        </div>

        <div
          v-else
          :class="['mobile-department-intranets__card-image-wrap', 'mobile-department-intranets__card-image-wrap--scenic']"
        />

        <div class="mobile-department-intranets__card-body">
          <h2 class="mobile-department-intranets__card-title">
            {{ card.title }}
          </h2>
        </div>
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import humanResourcesImage from '~/assets/images/news/news2.png'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()

const pageTitle = computed(() => t('pages.departmentIntranets.title'))

const cards = [
  {
    title: 'Group Human Resources',
    image: humanResourcesImage,
    url: 'https://intranet.dch.com.hk/',
  },
  {
    title: 'Environmental, Social, Governance',
    image: '',
    url: 'https://intranet.dch.com.hk/',
  },
]

const handleCardClick = async (card: typeof cards[number]) => {
  await openGuardedUrl(card.url, '_blank')
}
</script>

<style scoped>
.mobile-department-intranets {
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
}

.mobile-department-intranets__header {
  padding: 14px 16px 10px;
  background: #ffffff;
}

.mobile-department-intranets__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
  color: #171717;
}

.mobile-department-intranets__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 0 16px 16px;
}

.mobile-department-intranets__card {
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.12);
  text-align: left;
}

.mobile-department-intranets__card-image-wrap {
  height: 118px;
  background: #eef2f7;
}

.mobile-department-intranets__card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-department-intranets__card-image-wrap--scenic {
  position: relative;
  background:
    radial-gradient(circle at 68% 18%, rgba(255, 245, 195, 0.9), transparent 28%),
    linear-gradient(180deg, #8fd4ff 0%, #c7e6fb 40%, #648f3d 41%, #88b159 63%, #35592d 100%);
}

.mobile-department-intranets__card-image-wrap--scenic::before {
  content: '';
  position: absolute;
  inset: 36px -18px -8px 18px;
  background:
    linear-gradient(140deg, rgba(56, 92, 37, 0.95) 0%, rgba(100, 145, 67, 0.92) 42%, rgba(60, 96, 44, 0.98) 100%);
  clip-path: polygon(24% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.mobile-department-intranets__card-image-wrap--scenic::after {
  content: '';
  position: absolute;
  inset: 50px -8px 0 0;
  background:
    radial-gradient(circle at 22% 42%, rgba(244, 247, 220, 0.9) 0%, rgba(244, 247, 220, 0.2) 12%, transparent 13%),
    radial-gradient(circle at 34% 56%, rgba(44, 76, 31, 0.96) 0%, rgba(44, 76, 31, 0.96) 14%, transparent 15%),
    radial-gradient(circle at 48% 51%, rgba(49, 84, 35, 0.96) 0%, rgba(49, 84, 35, 0.96) 13%, transparent 14%),
    radial-gradient(circle at 58% 63%, rgba(42, 72, 30, 0.98) 0%, rgba(42, 72, 30, 0.98) 14%, transparent 15%),
    radial-gradient(circle at 70% 57%, rgba(52, 85, 36, 0.98) 0%, rgba(52, 85, 36, 0.98) 13%, transparent 14%),
    radial-gradient(circle at 84% 48%, rgba(41, 69, 29, 0.98) 0%, rgba(41, 69, 29, 0.98) 12%, transparent 13%);
}

.mobile-department-intranets__card-body {
  min-height: 62px;
  padding: 10px 10px 12px;
}

.mobile-department-intranets__card-title {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 700;
  color: #171717;
}
</style>
