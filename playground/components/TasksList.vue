<template>
  <div class="tasks-list">
    <div class="tasks-list__header">
      <h3 class="tasks-list__title">{{ t('tasks.title') }}</h3>
      <a href="#" class="tasks-list__link">{{ t('tasks.link') }}</a>
    </div>
    <div class="tasks-list__tabs">
      <button v-for="tab in tabs" :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>
    <div class="tasks-list__items">
      <div v-for="task in visibleTasks" :key="task.id" class="task-item" @click="handleClick(task)">
        <div class="task-item__content">
          <div class="task-item__meta">
            <span class="task-item__code">{{ task.code }}</span>
            <span class="task-item__status" :class="`status-${task.status.toLowerCase()}`">{{ t(`tasks.status.${task.status}`) }}</span>
          </div>
          <div class="task-item__title">{{ task.title }}</div>
          <div class="task-item__subtitle">{{ task.subtitle }}</div>
        </div>
        <div class="task-item__right">
          <div class="task-item__date">{{ task.date }}</div>
          <IconCustom name="chevron-right" :size="16" class="task-item__arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { t } = useAppI18n()

const activeTab = ref('pending')

const tabs = computed(() => [
  { label: t('tasks.tabs.approval'), value: 'pending' },
  { label: t('tasks.tabs.requests'), value: 'approved' },
  { label: t('tasks.tabs.tasks'), value: 'rejected' }
])

const tasks = ref([
  { id: 1, code: 'YY-CCA-20250890', status: 'pending', title: 'DCH Foods Contract Clearance Approval', subtitle: 'Thomas Chiu Au Yeung', date: '2025-10-24' },
  { id: 2, code: 'YY-ICAPER-20250094', status: 'pending', title: 'DCH Foods eICAPES Approval', subtitle: 'Thomas Chiu Au Yeung', date: '2025-11-N' },
  { id: 3, code: 'BIPO-EAPPRAISAL-20250893', status: 'approved', title: 'Victor Ho eAppraisal 2025', subtitle: 'Thomas Chiu Au Yeung', date: '2025-10-24' },
  { id: 4, code: 'YY-CLAIM-20250092', status: 'rejected', title: 'Kelvin Leung eClaim', subtitle: 'Kelvin Leung Au Yeung', date: '2025-10-24' },
  { id: 5, code: 'YY-ETRAVEL-20250895', status: 'approved', title: 'Kelvin Leung eTravel (Singapore)', subtitle: 'Kelvin Leung Au Yeung', date: '2025-10-24' },
])

const visibleTasks = computed(() => tasks.value.filter(task => task.status === activeTab.value))

const handleClick = (task: { code: string }) => {
  console.log('Clicked task:', task.code)
}
</script>

<style scoped>
.tasks-list {
  background: white;
  padding: 24px;
  border-left: 1px solid #F0F0F0;
}

.tasks-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tasks-list__title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.tasks-list__link {
  font-size: 13px;
  color: #A60A3A;
  text-decoration: none;
}

.tasks-list__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 0;
}

.tab-btn {
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #666666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
}

.tab-btn.active {
  color: #A60A3A;
  border-bottom-color: #A60A3A;
  font-weight: 600;
}

.tasks-list__items {
  display: flex;
  flex-direction: column;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
  gap: 8px;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item__content {
  flex: 1;
  min-width: 0;
}

.task-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.task-item__code {
  font-size: 12px;
  color: #666666;
}

.task-item__status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.status-pending { background: #FFF3E0; color: #F57C00; }
.status-approved { background: #E8F5E9; color: #2E7D32; }
.status-rejected { background: #FFEBEE; color: #C62828; }

.task-item__title {
  font-size: 13px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-item__subtitle {
  font-size: 12px;
  color: #999999;
}

.task-item__right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.task-item__date {
  font-size: 11px;
  color: #999999;
}

.task-item__arrow {
  color: #CCCCCC;
}
</style>
