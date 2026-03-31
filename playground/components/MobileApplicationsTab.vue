<template>
  <div class="mobile-applications">
    <div class="mobile-applications__header">
      <h2 class="mobile-applications__title">Applications</h2>
      <el-button circle class="search-btn">
        <IconCustom name="search" :size="20" />
      </el-button>
    </div>

    <div class="mobile-applications__tabs">
      <div class="applications__tabs__box">
        <button :class="['tab-btn', { active: activeTab === 'application' }]" @click="activeTab = 'application'">By
          Application</button>
        <button :class="['tab-btn', { active: activeTab === 'business' }]" @click="activeTab = 'business'">By
          Business</button>
      </div>
    </div>

    <!-- By Application -->
    <div v-if="activeTab === 'application'" class="app-grid">
      <div v-for="app in applications" :key="app.id" class="app-card" @click="handleAppClick(app)">
        <div class="app-card__logo">
          <img v-if="app.image" :src="app.image" :alt="app.name" class="app-card__img" />
          <IconCustom v-else :name="app.icon" :size="36" />
        </div>
        <div class="app-card__name">{{ app.name }}</div>
      </div>
    </div>

    <!-- By Business -->
    <div v-else class="business-grid">
      <div v-for="biz in businesses" :key="biz.id" class="biz-card" @click="handleBizClick(biz)">
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
import { computed, ref } from 'vue'
import { applicationDepartments } from '~/composables/useApplicationCatalog'
import eLeaveImg from '~/assets/images/applications/eLeave.png'
import yonYouImg from '~/assets/images/applications/yonyou.png'
import eAppraisalImg from '~/assets/images/applications/eAppraisal.png'
import itServiceDeskImg from '~/assets/images/applications/ITServiceDesk.png'
import italcant from '~/assets/images/applications/italcant.png'

const activeTab = ref('application')

const applications = ref([
  { id: 1, name: 'eLeave', icon: 'calendar', image: eLeaveImg },
  { id: 2, name: 'YonYou', icon: 'briefcase', image: yonYouImg },
  { id: 3, name: 'eLearning', icon: 'book', image: italcant },
  { id: 4, name: 'eAppraisal', icon: 'laptop', image: eAppraisalImg },
  { id: 5, name: 'IT Service Desk', icon: 'settings', image: itServiceDeskImg },
])

const businesses = computed(() =>
  applicationDepartments.map((department) => ({
    id: department.slug,
    name: department.name,
    icon: department.icon,
    color: department.color,
    description: department.description,
  })),
)

const handleAppClick = (app) => {
  console.log('App clicked:', app.name)
}

const handleBizClick = (biz) => {
  return navigateTo(`/mobile/applications/${encodeURIComponent(biz.id)}`)
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
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f2f2f2;
}

.applications__tabs__box {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(217, 217, 217, 0.75);
}

.tab-btn {
  flex: 1;
  min-height: 48px;
  padding: 0 20px;
  border: 0;
  background: transparent;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  color: #171717;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(166, 10, 58, 0.28);
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
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.applications__tabs__box {
  display: flex;
  ;
  align-items: center;
  width: 100%;
  box-shadow: 0 4px 12px #D9D9D9;
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
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
