<template>
  <div class="group-news">
    <div class="group-news__header">
      <h3 class="group-news__title">Group News</h3>
      <a href="#" class="group-news__link">View All ></a>
    </div>
    <div class="group-news__grid">
      <div
        v-for="news in newsList"
        :key="news.id"
        class="news-card"
        @click="handleClick(news)"
      >
        <div class="news-card__image">
          <img :src="news.image" :alt="news.title" />
        </div>
        <div class="news-card__content">
          <h4 class="news-card__title">{{ news.title }}</h4>
          <p class="news-card__date">{{ news.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newsList = ref([
  {
    id: 1,
    title: 'DCH Foods Hosts Trade Event to Promote New Branding',
    date: '24 October, 2024',
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=News+1'
  },
  {
    id: 2,
    title: 'DCH Foods Hosts Trade Event to Promote New Branding and Platform',
    date: '24 October, 2024',
    image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=News+2'
  },
  {
    id: 3,
    title: 'DCH Logistics promotes regional capabilities with a refreshed look',
    date: '6 March, 2024',
    image: 'https://via.placeholder.com/300x200/95E1D3/FFFFFF?text=News+3'
  },
  {
    id: 4,
    title: 'China CITIC Bank International and Dah Chong Hong to sign str...',
    date: '1 November, 2022',
    image: 'https://via.placeholder.com/300x200/F38181/FFFFFF?text=News+4'
  },
  {
    id: 5,
    title: 'DCH launches new app for better productivity while on the go',
    date: '6 October, 2022',
    image: 'https://via.placeholder.com/300x200/AA96DA/FFFFFF?text=News+5'
  },
  {
    id: 6,
    title: 'New for 2022',
    date: '5 January, 2022',
    image: 'https://via.placeholder.com/300x200/FCBAD3/FFFFFF?text=News+6'
  }
])

const handleClick = (news) => {
  console.log('Clicked news:', news.title)
}
</script>

<style scoped>
.group-news {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.group-news__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;
}

.group-news__title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.group-news__link {
  font-size: 14px;
  color: #A60A3A;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.group-news__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.news-card {
  background: #F5F5F5;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.news-card__image {
  width: 100%;
  height: 140px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.news-card__content {
  padding: 16px;
}

.news-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__date {
  font-size: 12px;
  color: #666666;
  margin: 0;
}
</style>