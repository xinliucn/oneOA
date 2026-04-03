<template>
  <div class="desktop-apps">
    <div class="desktop-apps__header">
      <h3 class="desktop-apps__title">{{ t('desktopApps.title') }}</h3>
      <a href="#" class="desktop-apps__link">{{ t('desktopApps.viewAll') }}</a>
    </div>
    <div class="desktop-apps__columns">
      <div v-for="category in categories" :key="category.id" class="app-column">
        <div class="app-column__top" :style="{ borderTopColor: category.color }">
          <div class="app-column__icon" :style="{ color: category.color }">
            <IconCustom :name="category.icon" :size="28" />
          </div>
          <div class="app-column__name">{{ category.name }}</div>
          <div class="app-column__desc">{{ category.description }}</div>
          <a href="#" class="app-column__intranet">{{ category.intranetLabel }}</a>
        </div>
        <div class="app-column__list">
          <div v-for="app in category.apps" :key="app.id" class="app-row" @click="handleClick(app)">
            <div class="app-row__info">
              <div class="app-row__name">{{ app.name }}</div>
              <div class="app-row__sub">{{ app.subtitle }}</div>
            </div>
            <IconCustom name="chevron-right" :size="14" class="app-row__arrow" />
          </div>
          <a href="#" class="app-column__view-all">{{ t('desktopApps.viewAll') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useAppI18n()

const categories = computed(() => [
  {
    id: 1, name: t('desktopApps.categories.digitalTechnology.name'), icon: 'digital-technology', color: '#1976D2',
    description: t('desktopApps.categories.digitalTechnology.description'),
    intranetLabel: t('desktopApps.categories.digitalTechnology.intranet'),
    apps: [
      { id: 1, name: 'Staff Onboarding IT Service', subtitle: t('desktopApps.processName') },
      { id: 2, name: 'IT Demand Creation', subtitle: t('desktopApps.processName') },
      { id: 3, name: 'IT Project Change Submission', subtitle: t('desktopApps.processName') },
      { id: 4, name: 'IT Project Creation', subtitle: t('desktopApps.processName') },
    ]
  },
  {
    id: 2, name: t('desktopApps.categories.finance.name'), icon: 'finance-bars', color: '#00897B',
    description: t('desktopApps.categories.finance.description'),
    intranetLabel: t('desktopApps.categories.finance.intranet'),
    apps: [
      { id: 5, name: 'Bounced Cheque Record', subtitle: t('desktopApps.processName') },
      { id: 6, name: 'Bounced Cheque Refund Application', subtitle: t('desktopApps.processName') },
      { id: 7, name: 'TBC', subtitle: 'TBC ref id' },
      { id: 8, name: 'Bounced Cheque Data List', subtitle: t('desktopApps.processName') },
    ]
  },
  {
    id: 3, name: t('desktopApps.categories.legalCompliance.name'), icon: 'legal-compliance', color: '#A60A3A',
    description: t('desktopApps.categories.legalCompliance.description'),
    intranetLabel: t('desktopApps.categories.legalCompliance.intranet'),
    apps: [
      { id: 9, name: 'Dispute Submission', subtitle: t('desktopApps.processName') },
      { id: 10, name: 'Group Contract Clearance & Approval', subtitle: t('desktopApps.processName') },
      { id: 11, name: 'Signed Contract Submission (Group...)', subtitle: t('desktopApps.processName') },
      { id: 12, name: 'Trademark Registration', subtitle: t('desktopApps.processName') },
    ]
  },
])

const handleClick = (app: { name: string }) => {
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
