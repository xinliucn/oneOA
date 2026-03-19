<template>
  <div class="mobile-applications">
    <div class="mobile-applications__header">
      <h2 class="mobile-applications__title">Applications</h2>
      <el-button circle class="search-btn">
        <IconCustom name="search" :size="20" />
      </el-button>
    </div>

    <div class="mobile-applications__tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'application' }]"
        @click="activeTab = 'application'"
      >By Application</button>
      <button
        :class="['tab-btn', { active: activeTab === 'business' }]"
        @click="activeTab = 'business'"
      >By Business</button>
    </div>

    <!-- By Application -->
    <div v-if="activeTab === 'application'" class="app-grid">
      <div
        v-for="app in applications"
        :key="app.id"
        class="app-card"
        @click="handleAppClick(app)"
      >
        <div class="app-card__logo">
          <img v-if="app.image" :src="app.image" :alt="app.name" class="app-card__img" />
          <IconCustom v-else :name="app.icon" :size="36" />
        </div>
        <div class="app-card__name">{{ app.name }}</div>
      </div>
    </div>

    <!-- By Business -->
    <div v-else class="business-grid">
      <div
        v-for="biz in businesses"
        :key="biz.id"
        class="biz-card"
        @click="handleBizClick(biz)"
      >
        <div class="biz-card__icon" :style="{ color: biz.color }">
          <IconCustom :name="biz.icon" :size="32" />
        </div>
        <div class="biz-card__name">{{ biz.name }}</div>
        <div class="biz-card__desc">{{ biz.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('application')

const applications = ref([
  { id: 1, name: 'eLeave', icon: 'calendar', image: null },
  { id: 2, name: 'YonYou', icon: 'briefcase', image: null },
  { id: 3, name: 'eLearning', icon: 'book', image: null },
  { id: 4, name: 'eAppraisal', icon: 'laptop', image: null },
  { id: 5, name: 'IT Service Desk', icon: 'settings', image: null },
])

const businesses = ref([
  { id: 1, name: 'Digital & Technology', icon: 'monitor', color: '#1976D2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, s...' },
  { id: 2, name: 'Finance', icon: 'chart', color: '#00897B', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, s...' },
  { id: 3, name: 'Legal & Compliance', icon: 'users', color: '#A60A3A', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, s...' },
])

const handleAppClick = (app) => {
  console.log('App clicked:', app.name)
}

const handleBizClick = (biz) => {
  console.log('Business clicked:', biz.name)
}
</script>

<style scoped>
.mobile-applications {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F5F5F5;
}

.mobile-applications__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;

  .search-btn {
    height: 40px;
    width: 40px;
    background-color: #fce4ec;
    border: none;
    color: #c2185b;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

.mobile-applications__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.mobile-applications__tabs {
  display: flex;
  padding: 12px 16px;
  background: white;
  gap: 8px;
  border-bottom: 1px solid #E0E0E0;
}

.tab-btn {
  flex: 1;
  padding: 10px 0;
  border: 1px solid #E0E0E0;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #A60A3A;
  color: white;
  border-color: #A60A3A;
}

/* By Application Grid */
.app-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.app-card {
  background: white;
  border-radius: 12px;
  padding: 20px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.app-card:active {
  transform: scale(0.97);
}

.app-card__logo {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
}

.app-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-card__name {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  text-align: center;
}

/* By Business Grid */
.business-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.biz-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.biz-card:active {
  transform: scale(0.97);
}

.biz-card__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.biz-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.biz-card__desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
