<template>
  <div class="group-news">
    <div class="group-news__header">
      <h3 class="group-news__title">
        {{ t('groupNews.title') }}
      </h3>
      <button type="button" class="group-news__link" @click="navigateTo('/desktop/news')">
        {{ t('groupNews.viewAll') }}
      </button>
    </div>

    <div v-if="loading" class="group-news__state">
      Loading news...
    </div>
    <div v-else-if="error" class="group-news__state group-news__state--error">
      Failed to load news.
    </div>
    <div v-else-if="homeNewsList.length === 0" class="group-news__state">
      No news found.
    </div>

    <div v-else class="group-news__grid">
      <div v-for="news in homeNewsList" :key="news.id" class="news-card" @click="handleClick(news)">
        <div class="news-card__image">
          <img :src="news.image" :alt="news.title">
        </div>
        <div class="news-card__content">
          <h4 class="news-card__title">
            {{ news.title }}
          </h4>
          <p class="news-card__date">
            {{ formatNewsDate(news.date, locale.value) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { NewsItem } from '~/composables/useNewsList'
import { formatNewsDate } from '~/utils/date'

const { locale, t } = useAppI18n()
const { newsList, loading, error, fetchNewsList } = useNewsList()
const { addRecentItem } = useRecentItems('desktop')

const homeNewsList = computed(() => newsList.value.slice(0, 4))

const handleClick = (news: NewsItem) => {
  addRecentItem({
    id: `news:${news.id}`,
    type: 'news',
    label: news.title,
    subtitle: formatNewsDate(news.date, locale.value),
    icon: 'document',
    path: '/desktop/news',
  })

  navigateTo('/desktop/news')
}

onMounted(() => {
  fetchNewsList()
})
</script>

<style scoped>
.group-news {
  background: white;
  width: 458px;
  min-width: 0;
  padding: 0;
}

.group-news__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
  margin-bottom: 23px;
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 23px;
}

.group-news__title {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

}

.group-news__link {
  border: 0;
  padding: 0;
  background: transparent;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  text-decoration-style: solid;
  text-decoration-offset: 0%;
  text-decoration-thickness: 0%;
  text-decoration-skip-ink: auto;
  color: #A60A3A;
  text-underline-offset: 2px;
  cursor: pointer;
}

.group-news__state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-size: 14px;
}

.group-news__state--error {
  color: #A60A3A;
}

.group-news__grid {
  display: grid;
  grid-template-columns: repeat(2, 220px);
  gap: 18px;
}

.news-card {
  width: 220px;
  height: 248px;
  border: 1px solid #D9D9D9;
  border-radius: 12px 12px 0 0;
  background: #FFFFFF;
  overflow: hidden;
  opacity: 1;
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.news-card__image {
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.news-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-card__content {
  display: flex;
  height: 128px;
  flex-direction: column;
  padding: 12px 14px 10px;
}

.news-card__title {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__date {
  margin: 12px -14px -10px;
  padding: 10px 14px 8px;
  border-top: 1px solid #E0E0E0;
  color: #9AA1A8;
  font-size: 10px;
  line-height: 1;
}
</style>
