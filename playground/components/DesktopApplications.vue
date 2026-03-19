<template>
  <div class="desktop-apps">
    <div class="desktop-apps__header">
      <h3 class="desktop-apps__title">Applications</h3>
      <a href="#" class="desktop-apps__link">View All ></a>
    </div>
    <div class="desktop-apps__columns">
      <div v-for="category in categories" :key="category.id" class="app-column">
        <div class="app-column__top" :style="{ borderTopColor: category.color }">
          <div class="app-column__icon" :style="{ color: category.color }">
            <IconCustom :name="category.icon" :size="28" />
          </div>
          <div class="app-column__name">{{ category.name }}</div>
          <div class="app-column__desc">{{ category.description }}</div>
          <a href="#" class="app-column__intranet">{{ category.intranetLabel }} ></a>
        </div>
        <div class="app-column__list">
          <div v-for="app in category.apps" :key="app.id" class="app-row" @click="handleClick(app)">
            <div class="app-row__info">
              <div class="app-row__name">{{ app.name }}</div>
              <div class="app-row__sub">{{ app.subtitle }}</div>
            </div>
            <IconCustom name="chevron-right" :size="14" class="app-row__arrow" />
          </div>
          <a href="#" class="app-column__view-all">View All ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    id: 1, name: 'Digital & Technology', icon: 'monitor', color: '#1976D2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, s...',
    intranetLabel: 'Group IT Intranet',
    apps: [
      { id: 1, name: 'Staff Onboarding IT Service', subtitle: 'Process Name' },
      { id: 2, name: 'IT Demand Creation', subtitle: 'Process Name' },
      { id: 3, name: 'IT Project Change Submission', subtitle: 'Process Name' },
      { id: 4, name: 'IT Project Creation', subtitle: 'Process Name' },
    ]
  },
  {
    id: 2, name: 'Finance', icon: 'chart', color: '#00897B',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, s...',
    intranetLabel: 'Group Finance Intranet',
    apps: [
      { id: 5, name: 'Bounced Cheque Record', subtitle: 'Process Name' },
      { id: 6, name: 'Bounced Cheque Refund Application', subtitle: 'Process Name' },
      { id: 7, name: 'TBC', subtitle: 'TBC ref id' },
      { id: 8, name: 'Bounced Cheque Data List', subtitle: 'Process Name' },
    ]
  },
  {
    id: 3, name: 'Legal & Compliance', icon: 'users', color: '#A60A3A',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, s...',
    intranetLabel: 'Group Legal Intranet',
    apps: [
      { id: 9, name: 'Dispute Submission', subtitle: 'Process Name' },
      { id: 10, name: 'Group Contract Clearance & Approval', subtitle: 'Process Name' },
      { id: 11, name: 'Signed Contract Submission (Group...)', subtitle: 'Process Name' },
      { id: 12, name: 'Trademark Registration', subtitle: 'Process Name' },
    ]
  },
])

const handleClick = (app) => {
  console.log('App clicked:', app.name)
}
</script>

<style scoped>
.desktop-apps {
  background: white;
  padding: 24px;
  border-top: 1px solid #F0F0F0;
}

.desktop-apps__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.desktop-apps__title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.desktop-apps__link {
  font-size: 13px;
  color: #A60A3A;
  text-decoration: none;
}

.desktop-apps__columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.app-column {
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  overflow: hidden;
}

.app-column__top {
  padding: 16px;
  border-top: 3px solid;
  background: #FAFAFA;
}

.app-column__icon {
  margin-bottom: 8px;
}

.app-column__name {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 6px;
}

.app-column__desc {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.app-column__intranet {
  font-size: 12px;
  color: #A60A3A;
  text-decoration: none;
  font-weight: 500;
}

.app-column__list {
  padding: 8px 0;
}

.app-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #F5F5F5;
  transition: background 0.2s;
}

.app-row:hover {
  background: #F5F5F5;
}

.app-row__info {
  flex: 1;
  min-width: 0;
}

.app-row__name {
  font-size: 13px;
  font-weight: 500;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-row__sub {
  font-size: 11px;
  color: #999999;
}

.app-row__arrow {
  color: #CCCCCC;
  flex-shrink: 0;
}

.app-column__view-all {
  display: block;
  padding: 10px 16px;
  font-size: 13px;
  color: #A60A3A;
  text-decoration: none;
  font-weight: 500;
}
</style>
