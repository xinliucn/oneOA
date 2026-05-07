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
            <IconCustom :name="category.icon" :size="34" />
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
    id: 1, name: t('desktopApps.categories.digitalTechnology.name'), icon: 'digital-technology', color: '#3B82F6',
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
    id: 2, name: t('desktopApps.categories.finance.name'), icon: 'finance-bars', color: '#00A78E',
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
    id: 3, name: t('desktopApps.categories.legalCompliance.name'), icon: 'legal-compliance', color: '#E11D8D',
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
  background: #ffffff;
  padding: 20px 48px 28px;
  border-top: 1px solid #f0f0f0;
}

.desktop-apps__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 26px;
  margin-bottom: 40px;
  border-bottom: 1px solid #d9d9d9;
}

.desktop-apps__title {
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.desktop-apps__link {
  font-size: 13px;
  line-height: 1.2;
  color: #a60a3a;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.desktop-apps__columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.app-column {
  min-width: 0;
  border: 1px solid #d9d9d9;
  border-radius: 0;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.app-column__top {
  min-height: 180px;
  padding: 38px 24px 24px;
  border-top: 3px solid;
  background: #ffffff;
  text-align: center;
}

.app-column__icon {
  margin-bottom: 12px;
}

.app-column__name {
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.app-column__desc {
  max-width: 250px;
  margin: 0 auto 16px;
  font-size: 10px;
  color: #666666;
  line-height: 1.35;
}

.app-column__intranet {
  font-size: 10px;
  line-height: 1.2;
  color: #a60a3a;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}

.app-column__list {
  padding: 0;
  border-top: 1px solid #e3e3e3;
}

.app-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 8px 18px;
  cursor: pointer;
  border-bottom: 1px solid #d9d9d9;
  transition: background 0.2s;
}

.app-row:hover {
  background: #f5f5f5;
}

.app-row__info {
  flex: 1;
  min-width: 0;
}

.app-row__name {
  font-size: 13px;
  line-height: 1.2;
  font-weight: 500;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-row__sub {
  margin-top: 2px;
  font-size: 9px;
  line-height: 1.2;
  color: #666666;
}

.app-row__arrow {
  color: #5f5f5f;
  flex-shrink: 0;
}

.app-column__view-all {
  display: block;
  padding: 18px 16px 22px;
  font-size: 13px;
  line-height: 1.2;
  color: #a60a3a;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 700;
}
</style>
