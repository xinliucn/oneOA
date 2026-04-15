<template>
  <div class="mobile-favourites">
    <div class="mobile-favourites__header">
      <h2 class="mobile-favourites__title">{{ t('favourites.title') }}</h2>
      <button class="mobile-favourites__edit-btn">Edit</button>
    </div>

    <div class="mobile-favourites__grid">
      <div v-for="app in apps" :key="app.id" class="favourite-card" @click="handleClick(app)">
        <div class="favourite-card__icon">
          <IconCustom :name="app.icon" :size="39" />
        </div>
        <div class="favourite-card__label">{{ app.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { t } = useAppI18n()

const apps = ref([
  { id: 1, icon: 'glc-portal', label: 'GLC Portal', color: '#FFC0CB', url: 'https://oa.dchbipoc.cc/wui/cas-entrance.jsp?path=https://oa.dchbipoc.cc/mobilemode/mobile/view.html?appid=1' },
  { id: 2, icon: 'cca-mobile-apply', label: 'CCA 手機申請', color: '#FFB6C1', url: 'https://oa.dchbipoc.cc/wui/cas-entrance.jsp?path=https://oa.dchbipoc.cc/mobilemode/mobile/view.html?appHomepageId=4' },
  { id: 3, icon: 'cca-approval-view', label: 'CCA 審批/查看', color: '#FFC0CB', url: 'https://oa.dchbipoc.cc/wui/cas-entrance.jsp?path=https://oa.dchbipoc.cc/mobilemode/mobile/view.html?appHomepageId=3' },
  { id: 4, icon: 'cca-contract-list', label: 'CCA 合同列表', color: '#FFB6C1', url: 'https://oa.dchbipoc.cc/wui/cas-entrance.jsp?path=https://oa.dchbipoc.cc/mobilemode/mobile/view.html?appHomepageId=2' },
  { id: 5, icon: 'analytics', label: 'eLearning' },
  { id: 6, icon: 'settings-list', label: 'Admin Portal' },
  { id: 7, icon: 'files-grid', label: 'Dashboards' },
  { id: 8, icon: 'notifications-bag', label: 'eShop' }
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
  border: none;
  border-radius: 20px;
  color: #A60A3A;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s;
}

.mobile-favourites__edit-btn:active {
  background: #A60A3A;
  color: white;
}

.mobile-favourites__grid {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;
}

.favourite-card {
  width: 179px;
  height: 124px;
  display: flex;
  margin: 6px;
  padding: 32px 0;
  border-radius: 12px;
  color: #A60A3A;
  background: #A60A3A26;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.favourite-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.3s;
}

.favourite-card:active .favourite-card__icon {
  transform: scale(0.9);
  background: #A60A3A;
  color: white;
}

.favourite-card__label {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}
</style>
