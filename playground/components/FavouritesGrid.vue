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
  { id: 1, icon: 'document', label: 'ePolicy', url: '' },
  { id: 2, icon: 'info', label: 'eClaim', url: '' },
  { id: 3, icon: 'apps', label: 'eTravel', url: '' },
  { id: 4, icon: 'users', label: 'HR Intranet', url: '' },
  { id: 5, icon: 'education', label: 'eLearning', url: '' },
  { id: 6, icon: 'building', label: 'Admin Portal', url: '' },
  { id: 7, icon: 'dashboard', label: 'Dashboards', url: '' },
  { id: 8, icon: 'shop', label: 'eShop', url: '' },
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
  grid-template-columns: repeat(4, 1fr);
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
