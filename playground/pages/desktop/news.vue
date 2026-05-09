<template>
  <div class="desktop-news">
    <section
      class="desktop-news__hero"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <h1>News</h1>
    </section>

    <section class="desktop-news__body">
      <nav
        class="desktop-news__breadcrumb"
        aria-label="Breadcrumb"
      >
        <NuxtLink to="/desktop">
          Home
        </NuxtLink>
        <span>&gt;</span>
        <span>News</span>
      </nav>

      <div class="desktop-news__toolbar">
        <div
          class="desktop-news__filters"
          aria-label="News categories"
        >
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="['desktop-news__filter', { 'is-active': activeCategory === category }]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <label class="desktop-news__sort">
          <span>Sort By</span>
          <select>
            <option>Most recent</option>
          </select>
        </label>
      </div>

      <div class="desktop-news__cards">
        <article
          v-for="item in newsItems"
          :key="item.id"
          class="desktop-news-card"
        >
          <img
            :src="item.image"
            :alt="item.title"
          >
          <div class="desktop-news-card__content">
            <h2>{{ item.title }}</h2>
            <time>{{ item.date }}</time>
          </div>
        </article>
      </div>

      <div class="desktop-news__view">
        <button type="button">
          View All
        </button>
      </div>
    </section>

    <footer class="desktop-news__copyright">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import heroImage from '~/assets/images/desktop-banner.jpg'
import news1 from '~/assets/images/news/news1.png'
import news2 from '~/assets/images/news/news2.png'
import news3 from '~/assets/images/news/news3.png'
import news4 from '~/assets/images/news/news4.png'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const categories = ['All', 'Group News', 'Internal Publish', 'Promotions']
const activeCategory = ref('All')

const newsItems = [
  {
    id: 1,
    image: news1,
    title: 'DCH Foods Hosts Trade Event to Promote New Branding',
    date: '24 October, 2024',
  },
  {
    id: 2,
    image: news2,
    title: 'DCH Foods Hosts Trade Event to Promote New Branding and Platform...',
    date: '24 October, 2024',
  },
  {
    id: 3,
    image: news3,
    title: 'DCH Logistics promotes regional capabilities with a refreshed brand...',
    date: '6 March, 2024',
  },
  {
    id: 4,
    image: news4,
    title: 'China CITIC Bank International and Dah Chong Hong to sign str...',
    date: '1 November, 2022',
  },
]
</script>

<style scoped>
.desktop-news {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.desktop-news__hero {
  width: 100%;
  height: 222px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 84px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.desktop-news__hero h1 {
  margin: 0;
  color: #ffffff;
  font-size: 44px;
  line-height: 1.2;
  font-weight: 700;
}

.desktop-news__body {
  flex: 1;
  min-height: 0;
  padding: 18px 84px 0;
}

.desktop-news__breadcrumb {
  width: 662px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 19px;
  border-bottom: 1px solid #d9d9d9;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.desktop-news__breadcrumb a {
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

.desktop-news__breadcrumb span {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.desktop-news__breadcrumb span:last-child {
  font-weight: 700;
}

.desktop-news__toolbar {
  width: 662px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin: 42px 0 20px;
}

.desktop-news__filters {
  display: flex;
  align-items: center;
  gap: 8px;
}

.desktop-news__filter {
  min-height: 22px;
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  padding: 0 10px;
  background: #ffffff;
  color: #555555;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}

.desktop-news__filter.is-active {
  border-color: #a60a3a;
  background: #a60a3a;
  color: #ffffff;
}

.desktop-news__sort {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #555555;
  font-size: 8px;
  line-height: 1.2;
}

.desktop-news__sort select {
  width: 128px;
  height: 29px;
  padding: 0 33px 0 10px;
  border: 1px solid #9aa1a8;
  border-radius: 5px;
  appearance: none;
  background:
    linear-gradient(45deg, transparent 50%, #6f6f6f 50%) calc(100% - 17px) 10px / 7px 7px no-repeat,
    linear-gradient(135deg, #6f6f6f 50%, transparent 50%) calc(100% - 12px) 10px / 7px 7px no-repeat,
    #ffffff;
  color: #666666;
  font-size: 10px;
}

.desktop-news__cards {
  display: grid;
  grid-template-columns: repeat(4, 158px);
  gap: 10px;
}

.desktop-news-card {
  width: 158px;
  height: 172px;
  overflow: hidden;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.16);
}

.desktop-news-card img {
  display: block;
  width: 100%;
  height: 86px;
  object-fit: cover;
}

.desktop-news-card__content {
  height: 86px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 13px 8px;
}

.desktop-news-card h2 {
  margin: 0;
  color: #000000;
  font-size: 11px;
  line-height: 1.24;
  font-weight: 700;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.desktop-news-card time {
  color: #999999;
  font-size: 8px;
  line-height: 1.2;
}

.desktop-news__view {
  display: flex;
  justify-content: flex-end;
  width: 662px;
  margin-top: 17px;
}

.desktop-news__view button {
  min-width: 102px;
  height: 28px;
  border: 0;
  border-radius: 5px;
  background: #f8dbe6;
  color: #a60a3a;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.desktop-news__copyright {
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.2;
}
</style>
