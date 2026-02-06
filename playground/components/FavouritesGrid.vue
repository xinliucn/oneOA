<template>
  <div class="favourites-grid">
    <div class="favourites-grid__header">
      <h3 class="favourites-grid__title">My Favourites</h3>
      <a href="#" class="favourites-grid__edit">Edit</a>
    </div>
    <div class="favourites-grid__items">
      <div v-for="app in apps" :key="app.id" class="favourite-card" @click="handleClick(app)">
        <div class="favourite-card__icon">
          <IconCustom :name="app.icon" :size="32" />
        </div>
        <div class="favourite-card__label">{{ app.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apps = ref([
  // { id: 1, icon: 'document', label: 'ePolicy', color: '#FFC0CB', url:"" },
  // { id: 2, icon: 'info', label: 'eClaim', color: '#FFB6C1', url:"" },
  // { id: 3, icon: 'apps', label: 'eTravel', color: '#FFC0CB', url:"" },
  // { id: 4, icon: 'education', label: 'eLearning', color: '#FFB6C1', url:"" },
  { id: 1, icon: 'document', label: 'GLC Portal', color: '#FFC0CB', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appid=1' },
  { id: 2, icon: 'info', label: 'CCA 手機申請', color: '#FFB6C1', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=4' },
  { id: 3, icon: 'apps', label: 'CCA 審批/查看', color: '#FFC0CB', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=3' },
  { id: 4, icon: 'education', label: 'CCA 合同列表', color: '#FFB6C1', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=2' },
  { id: 5, icon: 'building', label: 'Admin Portal', color: '#FFC0CB', url: "" },
  { id: 6, icon: 'dashboard', label: 'Dashboards', color: '#FFB6C1', url: "" }
])

const handleClick = (app) => {
  if (app.url) {
    window.open(app.url, '_blank')
  } else {
    console.log('点击了:', app.label)
  }
}
</script>

<style scoped>
.favourites-grid {
  background: #FFFFFF;
  padding: 24px;
}

.favourites-grid__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;
}

.favourites-grid__title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.favourites-grid__edit {
  font-size: 14px;
  color: #A60A3A;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.favourites-grid__items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.favourite-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  background: #A60A3A26;
  cursor: pointer;
  transition: all 0.3s;
}

.favourite-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #A60A3A;
}

.favourite-card__label {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  text-align: center;
}
</style>
