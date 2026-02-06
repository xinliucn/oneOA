<template>
  <div class="mobile-favourites">
    <div class="mobile-favourites__header">
      <h2 class="mobile-favourites__title">My Favourites</h2>
      <button class="mobile-favourites__edit-btn">Edit</button>
    </div>

    <div class="mobile-favourites__grid">
      <div
        v-for="app in apps"
        :key="app.id"
        class="favourite-card"
        @click="handleClick(app)"
      >
        <div class="favourite-card__icon">
          <IconCustom :name="app.icon" :size="28" />
        </div>
        <div class="favourite-card__label">{{ app.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apps = ref([
  // { id: 1, icon: 'document', label: 'Documents' },
  // { id: 2, icon: 'calendar', label: 'Calendar' },
  // { id: 3, icon: 'mail', label: 'Email' },
  // { id: 4, icon: 'users', label: 'Contacts' },
   { id: 1, icon: 'document', label: 'GLC Portal', color: '#FFC0CB', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appid=1' },
  { id: 2, icon: 'info', label: 'CCA 手機申請', color: '#FFB6C1', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=4' },
  { id: 3, icon: 'apps', label: 'CCA 審批/查看', color: '#FFC0CB', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=3' },
  { id: 4, icon: 'education', label: 'CCA 合同列表', color: '#FFB6C1', url: 'https://dchappsdev.dchbi.com/wui/cas-entrance.jsp?path=https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=2' },
  { id: 5, icon: 'chart', label: 'Analytics' },
  { id: 6, icon: 'settings', label: 'Settings' },
  { id: 7, icon: 'folder', label: 'Files' },
  { id: 8, icon: 'bell', label: 'Notifications' }
])

const handleClick = (app) => {
   if (app.url) {
    window.open(app.url, '_self')
  } else {
    console.log('点击了:', app.label)
  }
}
</script>

<style scoped>
.mobile-favourites {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F5F5F5;
}

.mobile-favourites__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  margin-bottom: 16px;
}

.mobile-favourites__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.mobile-favourites__edit-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #A60A3A;
  border-radius: 20px;
  color: #A60A3A;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.mobile-favourites__edit-btn:active {
  background: #A60A3A;
  color: white;
}

.mobile-favourites__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
}

.favourite-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.favourite-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #A60A3A26;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
  transition: all 0.3s;
}

.favourite-card:active .favourite-card__icon {
  transform: scale(0.9);
  background: #A60A3A;
  color: white;
}

.favourite-card__label {
  font-size: 12px;
  color: #000000;
  text-align: center;
  line-height: 1.2;
}
</style>