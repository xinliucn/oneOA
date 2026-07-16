<template>
  <div class="mobile-intranets-home">
    <section class="mobile-intranets-home__hero-section">
      <div
        v-if="activeHero"
        class="mobile-intranets-home__hero-card"
      >
        <div
          class="mobile-intranets-home__hero-media"
          :class="{ 'mobile-intranets-home__hero-media--fallback': !getHeroDisplayImage(activeHero) }"
        >
          <img
            v-if="getHeroDisplayImage(activeHero)"
            :src="getHeroDisplayImage(activeHero)"
            :alt="pageTitle"
            class="mobile-intranets-home__hero-image"
          >
          <span
            v-else
            class="mobile-intranets-home__hero-fallback-text"
          >
            {{ pageTitle }}
          </span>
        </div>
      </div>

      <div
        v-else
        class="mobile-intranets-home__hero-card mobile-intranets-home__hero-card--empty"
      >
        <div class="mobile-intranets-home__hero-media mobile-intranets-home__hero-media--fallback">
          <span class="mobile-intranets-home__hero-fallback-text">
            {{ pageTitle }}
          </span>
        </div>
      </div>

      <div
        v-if="heroSlides.length > 1"
        class="mobile-intranets-home__hero-indicators"
      >
        <button
          v-for="(_slide, index) in heroSlides"
          :key="index"
          type="button"
          class="mobile-intranets-home__hero-indicator"
          :class="{ 'is-active': index === activeHeroIndex }"
          :aria-label="`${pageTitle} ${index + 1}`"
          @click="setActiveHero(index)"
        />
      </div>
    </section>

    <section class="mobile-intranets-home__news-section">
      <header class="mobile-intranets-home__section-header">
        <h2 class="mobile-intranets-home__section-title">
          {{ t('pages.news.title') }}
        </h2>
      </header>

      <div
        class="mobile-intranets-home__filters"
        role="tablist"
        :aria-label="t('pages.news.title')"
      >
        <button
          v-for="filter in newsFilters"
          :key="filter.value"
          type="button"
          class="mobile-intranets-home__filter"
          :class="{ 'is-active': activeFilter === filter.value }"
          role="tab"
          :aria-selected="activeFilter === filter.value"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div
        v-if="loading && !sortedNewsItems.length"
        class="mobile-intranets-home__state"
      >
        {{ t('pages.news.states.loading') }}
      </div>

      <div
        v-else-if="error && !sortedNewsItems.length"
        class="mobile-intranets-home__state mobile-intranets-home__state--error"
      >
        {{ t('pages.news.states.error') }}
      </div>

      <div
        v-else-if="filteredNewsItems.length === 0"
        class="mobile-intranets-home__state"
      >
        {{ t('pages.news.states.empty') }}
      </div>

      <div
        v-else
        class="mobile-intranets-home__news-list"
      >
        <button
          v-for="item in filteredNewsItems"
          :key="item.id"
          type="button"
          class="mobile-intranets-home__news-card"
          @click="handleNewsClick(item)"
        >
          <div
            class="mobile-intranets-home__news-card-media"
            :class="{ 'mobile-intranets-home__news-card-media--fallback': !getNewsDisplayImage(item) }"
          >
            <img
              v-if="getNewsDisplayImage(item)"
              :src="getNewsDisplayImage(item)"
              :alt="item.title"
              class="mobile-intranets-home__news-card-image"
            >
          </div>

          <div class="mobile-intranets-home__news-card-body">
            <span
              v-if="getCategoryLabel(item.category)"
              class="mobile-intranets-home__news-card-tag"
              :class="resolveCategoryClass(item.category)"
            >
              {{ getCategoryLabel(item.category) }}
            </span>

            <time class="mobile-intranets-home__news-card-date">
              {{ formatCompactDate(item.date) }}
            </time>

            <h3 class="mobile-intranets-home__news-card-title">
              {{ item.title }}
            </h3>

            <span class="mobile-intranets-home__news-card-link">
              {{ readMoreLabel }}
              <IconCustom
                name="chevron-right"
                :size="14"
              />
            </span>
          </div>
        </button>
      </div>
    </section>

    <IntranetsSharedFooter />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { NewsItem } from '~/types/news'
import newsImage1 from '~/assets/images/news/news1.png'
import newsImage2 from '~/assets/images/news/news2.png'
import newsImage3 from '~/assets/images/news/news3.png'
import newsImage4 from '~/assets/images/news/news4.png'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

type NewsFilterValue = 'all' | 'Group News' | 'Internal Publish' | 'Promotion'

const { locale, t } = useAppI18n()
const { newsList, loading, error, fetchNewsList } = useNewsList()
const { openGuardedUrl } = useNetworkGuard()
const intranetsBannerStore = useIntranetsBannerStore()
const { bannerItems } = storeToRefs(intranetsBannerStore)

const pageTitle = computed(() => t('pages.departmentIntranets.title'))
const readMoreLabel = computed(() => {
  const translated = t('pages.departmentIntranets.actions.readMore')

  if (translated !== 'pages.departmentIntranets.actions.readMore') {
    return translated
  }

  if (locale.value === 'zh-CN') {
    return '阅读更多'
  }

  if (locale.value === 'zh-TW') {
    return '閱讀更多'
  }

  return 'Read more'
})
const activeFilter = ref<NewsFilterValue>('all')
const activeHeroIndex = ref(0)

let heroTimer: ReturnType<typeof setInterval> | null = null
const mockNewsImages = [newsImage1, newsImage2, newsImage3, newsImage4] as const

const newsFilters = computed(() => [
  { label: t('pages.news.filters.all'), value: 'all' as const },
  { label: t('pages.news.filters.groupNews'), value: 'Group News' as const },
  { label: t('pages.news.filters.internalPublish'), value: 'Internal Publish' as const },
  { label: t('pages.news.filters.promotion'), value: 'Promotion' as const },
])

const newsCategoryLabelMap = computed<Record<Exclude<NewsFilterValue, 'all'>, string>>(() => ({
  'Group News': t('pages.news.filters.groupNews'),
  'Internal Publish': t('pages.news.filters.internalPublish'),
  'Promotion': t('pages.news.filters.promotion'),
}))

const getNewsTimestamp = (item: NewsItem) => {
  const timestamp = new Date(item.date).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const getMockImageIndex = (item: NewsItem) => {
  return Math.abs(Number(item.id) || 0) % mockNewsImages.length
}

const getNewsDisplayImage = (item: NewsItem) => {
  return mockNewsImages[getMockImageIndex(item)]
}

const getHeroDisplayImage = (item: { imageUrl: string }) => {
  return item.imageUrl
}

const sortedNewsItems = computed(() => {
  return [...newsList.value].sort((left, right) => getNewsTimestamp(right) - getNewsTimestamp(left))
})

const heroSlides = computed(() => {
  return bannerItems.value
})

const activeHero = computed(() => {
  return heroSlides.value[activeHeroIndex.value] || heroSlides.value[0] || null
})

const filteredNewsItems = computed(() => {
  const source = activeFilter.value === 'all'
    ? sortedNewsItems.value
    : sortedNewsItems.value.filter(item => item.category === activeFilter.value)

  return source.slice(0, 8)
})

const getCategoryLabel = (category?: string) => {
  if (!category) {
    return ''
  }

  return newsCategoryLabelMap.value[category as Exclude<NewsFilterValue, 'all'>] || category
}

const resolveCategoryClass = (category?: string) => {
  if (category === 'Group News') {
    return 'mobile-intranets-home__news-card-tag--group'
  }

  if (category === 'Internal Publish') {
    return 'mobile-intranets-home__news-card-tag--internal'
  }

  if (category === 'Promotion') {
    return 'mobile-intranets-home__news-card-tag--promotion'
  }

  return ''
}
const formatCompactDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  if (locale.value === 'en') {
    return new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    }).format(date).replace(',', '')
  }

  return new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }).format(date)
}

const stopHeroRotation = () => {
  if (!heroTimer) {
    return
  }

  clearInterval(heroTimer)
  heroTimer = null
}

const restartHeroRotation = () => {
  stopHeroRotation()

  if (!import.meta.client || heroSlides.value.length < 2) {
    return
  }

  heroTimer = setInterval(() => {
    activeHeroIndex.value = (activeHeroIndex.value + 1) % heroSlides.value.length
  }, 5000)
}

const setActiveHero = (index: number) => {
  activeHeroIndex.value = index
  restartHeroRotation()
}

const handleNewsClick = async (item: NewsItem) => {
  if (item.url) {
    await openGuardedUrl(item.url, '_self')
    return
  }

  await navigateTo('/mobile/news')
}
onMounted(() => {
  intranetsBannerStore.fetchBanners().catch((fetchError) => {
    console.error('Get intranets banner failed:', fetchError)
  })

  fetchNewsList().catch((fetchError) => {
    console.error('Get intranets home news failed:', fetchError)
  })

  restartHeroRotation()
})

watch(heroSlides, (slides) => {
  if (!slides.length) {
    activeHeroIndex.value = 0
    stopHeroRotation()
    return
  }

  if (activeHeroIndex.value >= slides.length) {
    activeHeroIndex.value = 0
  }

  restartHeroRotation()
})

watch(locale, (nextLocale, previousLocale) => {
  if (nextLocale === previousLocale) {
    return
  }

  activeFilter.value = 'all'

  fetchNewsList({ locale: nextLocale }).catch((fetchError) => {
    console.error('Refresh intranets home news failed:', fetchError)
  })
})

onBeforeUnmount(() => {
  stopHeroRotation()
})
</script>

<style scoped>
.mobile-intranets-home {
  height: 100%;
  overflow-y: auto;
  background: #efefef;
}

.mobile-intranets-home__hero-section {
  position: relative;
  background: #efefef;
}

.mobile-intranets-home__hero-card {
  position: relative;
  width: 100%;
  display: block;
  border: 0;
  aspect-ratio: 1280 / 462;
  padding: 0;
  background: #7f0b1f;
  color: #ffffff;
  text-align: left;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(52, 10, 20, 0.12);
}

.mobile-intranets-home__hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(17, 12, 14, 0.06) 0%, rgba(17, 12, 14, 0.16) 42%, rgba(17, 12, 14, 0.72) 100%),
    linear-gradient(90deg, rgba(17, 12, 14, 0.58) 0%, rgba(17, 12, 14, 0.18) 42%, rgba(17, 12, 14, 0.06) 72%, rgba(17, 12, 14, 0.2) 100%);
}

.mobile-intranets-home__hero-card--empty {
  cursor: default;
}

.mobile-intranets-home__hero-media,
.mobile-intranets-home__news-card-media {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.mobile-intranets-home__hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.08);
  z-index: 0;
}

.mobile-intranets-home__hero-media--fallback,
.mobile-intranets-home__news-card-media--fallback {
  background:
    radial-gradient(circle at 72% 18%, rgba(255, 230, 166, 0.92), transparent 24%),
    linear-gradient(140deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.02) 38%, rgba(0, 0, 0, 0.16) 100%);
}

.mobile-intranets-home__hero-image,
.mobile-intranets-home__news-card-image {
  width: 100%;
  height: 100%;
  display: block;
}

.mobile-intranets-home__hero-image {
  object-fit: contain;
}

.mobile-intranets-home__news-card-image {
  object-fit: cover;
}

.mobile-intranets-home__hero-fallback-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.mobile-intranets-home__hero-content {
  position: relative;
  z-index: 2;
  min-width: 0;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px 104px 34px 16px;
}

.mobile-intranets-home__hero-badge {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff5e1;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.mobile-intranets-home__hero-title {
  margin: 10px 0 0;
  font-size: 18px;
  line-height: 1.24;
  font-weight: 700;
  color: #ffffff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.mobile-intranets-home__hero-date {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 244, 224, 0.92);
}

.mobile-intranets-home__hero-cta {
  position: absolute;
  top: 50%;
  right: 16px;
  z-index: 3;
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(166, 10, 58, 0.94);
  box-shadow: 0 8px 20px rgba(84, 7, 27, 0.24);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
  transform: translateY(-50%);
}

.mobile-intranets-home__hero-indicators {
  position: absolute;
  left: 50%;
  bottom: 30px;
  z-index: 4;
  display: flex;
  gap: 6px;
  padding: 0;
  transform: translateX(-50%);
}

.mobile-intranets-home__hero-indicator {
  width: 34px;
  height: 3px;
  border: 0;
  border-radius: 999px;
  background: #d9d9d9;
}

.mobile-intranets-home__hero-indicator.is-active {
  background: #a60a3a;
}

.mobile-intranets-home__news-section {
  padding: 22px 0 24px;
}

.mobile-intranets-home__section-header {
  padding: 0 16px;
}

.mobile-intranets-home__section-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 700;
  color: #5b5b5b;
}

.mobile-intranets-home__filters {
  display: flex;
  gap: 10px;
  padding: 18px 16px 10px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-intranets-home__filters::-webkit-scrollbar,
.mobile-intranets-home__news-list::-webkit-scrollbar {
  display: none;
}

.mobile-intranets-home__filter {
  flex-shrink: 0;
  height: 38px;
  border: 0;
  padding: 0 16px;
  border-radius: 999px;
  background: transparent;
  color: #5f5f5f;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.mobile-intranets-home__filter.is-active {
  background: #bf2358;
  color: #ffffff;
  box-shadow: 0 10px 16px rgba(191, 35, 88, 0.22);
}

.mobile-intranets-home__state {
  padding: 26px 16px 8px;
  color: #666666;
  text-align: center;
  font-size: 14px;
}

.mobile-intranets-home__state--error {
  color: #a60a3a;
}

.mobile-intranets-home__news-list {
  display: flex;
  gap: 14px;
  padding: 8px 16px 0;
  overflow-x: auto;
  scroll-snap-type: x proximity;
}

.mobile-intranets-home__news-card {
  width: 148px;
  min-width: 148px;
  display: flex;
  flex-direction: column;
  border: 0;
  padding: 0;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(32, 32, 32, 0.08);
  text-align: left;
  overflow: hidden;
  scroll-snap-align: start;
}

.mobile-intranets-home__news-card-media {
  width: 100%;
  height: 138px;
  background: #ffffff;
}

.mobile-intranets-home__news-card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px 14px 18px;
}

.mobile-intranets-home__news-card-tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #ef7e48;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.mobile-intranets-home__news-card-tag--group {
  background: #a60a3a;
}

.mobile-intranets-home__news-card-tag--internal {
  background: #ef7e48;
}

.mobile-intranets-home__news-card-tag--promotion {
  background: #d8a337;
}

.mobile-intranets-home__news-card-date {
  margin-top: 14px;
  font-size: 12px;
  color: #b0b0b0;
}

.mobile-intranets-home__news-card-title {
  margin: 8px 0 0;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #292929;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.mobile-intranets-home__news-card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: auto;
  padding-top: 18px;
  color: #cf4d6e;
  font-size: 13px;
  font-weight: 700;
}
</style>
