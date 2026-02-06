<template>
  <div class="mobile-applications">
    <div class="mobile-applications__header">
      <h2 class="mobile-applications__title">Applications</h2>
      <button class="mobile-applications__filter-btn">
        <IconCustom name="filter" :size="20" />
      </button>
    </div>

    <div class="mobile-applications__categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-section"
      >
        <div class="category-section__header">
          <h3 class="category-section__title">{{ category.name }}</h3>
          <span class="category-section__count">{{ category.apps.length }}</span>
        </div>
        <div class="category-section__apps">
          <div
            v-for="app in category.apps"
            :key="app.id"
            class="app-item"
            @click="handleAppClick(app)"
          >
            <div class="app-item__icon">
              <IconCustom :name="app.icon" :size="24" />
            </div>
            <div class="app-item__content">
              <div class="app-item__name">{{ app.name }}</div>
              <div class="app-item__description">{{ app.description }}</div>
            </div>
            <div class="app-item__arrow">
              <IconCustom name="chevron-right" :size="20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    id: 1,
    name: 'Productivity',
    apps: [
      { id: 1, icon: 'document', name: 'Documents', description: 'Manage your documents' },
      { id: 2, icon: 'calendar', name: 'Calendar', description: 'Schedule and events' },
      { id: 3, icon: 'mail', name: 'Email', description: 'Send and receive emails' }
    ]
  },
  {
    id: 2,
    name: 'Communication',
    apps: [
      { id: 4, icon: 'users', name: 'Contacts', description: 'Manage contacts' },
      { id: 5, icon: 'message', name: 'Messages', description: 'Chat with team' },
      { id: 6, icon: 'video', name: 'Video Call', description: 'Video conferencing' }
    ]
  },
  {
    id: 3,
    name: 'Business',
    apps: [
      { id: 7, icon: 'chart', name: 'Analytics', description: 'View reports and data' },
      { id: 8, icon: 'briefcase', name: 'Projects', description: 'Manage projects' },
      { id: 9, icon: 'dollar', name: 'Finance', description: 'Financial management' }
    ]
  }
])

const handleAppClick = (app) => {
  console.log('App clicked:', app.name)
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
  margin-bottom: 8px;
}

.mobile-applications__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.mobile-applications__filter-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #F5F5F5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666666;
  transition: all 0.3s;
}

.mobile-applications__filter-btn:active {
  background: #A60A3A;
  color: white;
}

.mobile-applications__categories {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.category-section {
  margin-bottom: 24px;
}

.category-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-section__title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.category-section__count {
  font-size: 12px;
  color: #999999;
  background: #F5F5F5;
  padding: 4px 8px;
  border-radius: 10px;
}

.category-section__apps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.app-item:active {
  transform: scale(0.98);
}

.app-item__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #A60A3A26;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
  flex-shrink: 0;
}

.app-item__content {
  flex: 1;
}

.app-item__name {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 2px;
}

.app-item__description {
  font-size: 12px;
  color: #666666;
}

.app-item__arrow {
  color: #CCCCCC;
  flex-shrink: 0;
}
</style>