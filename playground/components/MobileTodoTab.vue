<template>
  <div class="mobile-todo">
    <div class="mobile-todo__header">
      <h2 class="mobile-todo__title">My Approvals</h2>
      <el-button circle class="action-btn">
        <IconCustom name="search" :size="20" />
      </el-button>
    </div>

    <div class="mobile-todo__filters">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', { active: activeFilter === filter.value }]" @click="activeFilter = filter.value">
        {{ filter.label }}{{ filter.count ? ' ' + filter.count : '' }}
      </button>
    </div>

    <div class="mobile-todo__list">
      <div v-if="loading && filteredTasks.length === 0" class="mobile-todo__state">加载中...</div>
      <div v-else-if="!loading && filteredTasks.length === 0" class="mobile-todo__state">暂无消息</div>
      <div v-for="task in filteredTasks" :key="task.id" class="todo-item" @click="handleTaskClick(task)">
        <div class="todo-item__content">
          <div class="todo-item__header">
            <span class="todo-item__code">{{ task.code }}</span>
            <span class="todo-item__status" :class="`status-${task.status.toLowerCase()}`">
              {{ task.status }}
            </span>
            <span v-if="task.badge" class="todo-item__badge">
              {{ task.badge }}
            </span>
          </div>
          <div class="todo-item__title">{{ task.title }}</div>
          <div class="todo-item__subtitle">{{ task.subtitle }}</div>
        </div>
        <div class="todo-item__right">
          <div class="todo-item__date">{{ task.date }}</div>
          <IconCustom name="chevron-right" :size="20" color="#A60A3A" class="todo-item__arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApprovalItem } from '~/types/approval'

const activeFilter = ref('all')
const { approvals, loading, bootstrap } = useApprovals()

const filters = computed(() => {
  const countBy = (matcher: (task: ApprovalItem) => boolean) => approvals.value.filter(matcher).length

  return [
    { label: 'All', value: 'all', count: null },
    { label: 'IT', value: 'it', count: countBy((task) => task.category.toLowerCase() === 'it') },
    { label: 'BU', value: 'bu', count: countBy((task) => task.category.toLowerCase() === 'bu') },
    { label: 'Legal', value: 'legal', count: countBy((task) => task.category.toLowerCase() === 'legal') },
    { label: 'Pending', value: 'pending', count: countBy((task) => task.status.toLowerCase() === 'pending') },
    { label: 'Approved', value: 'approved', count: countBy((task) => task.status.toLowerCase() === 'approved') },
  ]
})

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') {
    return approvals.value
  }

  return approvals.value.filter((task) => {
    const filterValue = activeFilter.value.toLowerCase()
    return task.status.toLowerCase() === filterValue || task.category.toLowerCase() === filterValue
  })
})

const handleTaskClick = (task: ApprovalItem) => {
  return navigateTo(`/mobile/approval/${encodeURIComponent(task.code)}`)
}

onMounted(async () => {
  await bootstrap()
})
</script>

<style scoped>
.mobile-todo {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F5F5F5;
}

.mobile-todo__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;

  .action-btn {
    height: 40px;
    width: 40px;
    background-color: #fce4ec;
    /* 浅粉色背景 */
    border: none;
    color: #c2185b;
    /* 深粉色图标 */

    &:hover {
      background-color: #f8bbd0;
      /* hover 时稍深的粉色 */
    }

    /* 移除 Element Plus 默认的 margin */
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

.mobile-todo__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.mobile-todo__add-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #A60A3A;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}

.mobile-todo__add-btn:hover {
  background: #8A0A2A;
}

.mobile-todo__filters {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
  background: white;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-bottom: #D9D9D9 0.5px solid;
}

.mobile-todo__filters::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  flex-shrink: 0;
  padding: 8px 16px;
  border: 1px solid #E0E0E0;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.filter-btn.active {
  background: #A60A3A;
  color: white;
  border-color: #A60A3A;
}

.mobile-todo__list {
  flex: 1;
  overflow-y: auto;
   -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */

    &::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Opera */
    }
}

.mobile-todo__state {
  padding: 32px 16px;
  text-align: center;
  font-size: 13px;
  color: #999999;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  cursor: pointer;
  border-bottom: #D9D9D9 0.5px solid;
}

.todo-item:active {
  transform: scale(0.98);
}

.todo-item__content {
  flex: 1;
  min-width: 0;
}

.todo-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.todo-item__code {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.todo-item__status {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.status-pending {
  background: #FFF3E0;
  color: #F57C00;
}

.status-approved {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-rejected {
  background: #FFEBEE;
  color: #C62828;
}

.todo-item__badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  background: #E3F2FD;
  color: #1976D2;
  font-weight: 600;
}

.todo-item__title {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-item__subtitle {
  font-size: 13px;
  color: #666666;
}

.todo-item__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;
}

.todo-item__date {
  font-size: 12px;
  color: #999999;
}

.todo-item__arrow {
  color: #CCCCCC;
}
</style>
