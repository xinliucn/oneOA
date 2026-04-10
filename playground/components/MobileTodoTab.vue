<template>
  <div class="mobile-todo">
    <div class="mobile-todo__header">
      <div ref="dropdownRef" class="mobile-todo__dropdown">
        <button type="button" class="mobile-todo__title" @click="toggleDropdown">
          <h2>{{ selectedView.label }}</h2>
          <span class="mobile-todo__arrow" :class="{ 'is-open': isDropdownOpen }">
            <IconCustom name="downArrowIcon" :size="20" />
          </span>
        </button>

        <div v-if="isDropdownOpen" class="mobile-todo__menu">
          <button v-for="option in todoOptions" :key="option.value" type="button" class="mobile-todo__menu-item"
            :class="{ 'is-active': selectedView.value === option.value }" @click="selectView(option)">
            <span class="mobile-todo__menu-check" :class="{ 'is-visible': selectedView.value === option.value }" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>
      <div>
        <el-button circle class="action-btn_left" @click="filterDropdown">
          <IconCustom name="filterIcon" :size="20" />
        </el-button>
        <el-button circle class="action-btn">
          <IconCustom name="search" :size="20" @click="filterDropdown"/>
        </el-button>
      </div>
    </div>

    <!-- <div class="mobile-todo__filters">
      <button v-for="filter in filters" :key="filter.value"
        :class="['filter-btn', { active: activeFilter === filter.value }]" @click="activeFilter = filter.value">
        {{ filter.label }}{{ filter.count ? ' ' + filter.count : '' }}
      </button>
    </div> -->
    
    <div class="mobile-todo__list">
      <div v-if="loading && filteredTasks.length === 0" class="mobile-todo__state">加载中...</div>
      <div v-else-if="!loading && filteredTasks.length === 0" class="mobile-todo__state">暂无消息</div>
      <div v-for="task in filteredTasks" :key="task.id" class="todo-item" @click="handleTaskClick(task)">
        <div class="todo-item__content">
          <div class="todo-item__header">
            <div class="todo-item__meta">
              <span class="todo-item__code">{{ task.code }}</span>
              <span class="todo-item__status" :class="`status-${task.status.toLowerCase()}`">
                {{ task.status }}
              </span>
            </div>
            <div class="todo-item__date">{{ task.date }}</div>
          </div>
          <div class="todo-item__title">{{ task.title }}</div>
          <div class="todo-item__subtitle">
            <span>{{ task.submittedBy }}</span><span>via</span><span class="todo-item__portfolio">{{ task.portfolio
            }}</span>
          </div>
        </div>
        <IconCustom name="chevron-right" :size="20" color="#A60A3A" class="todo-item__arrow" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApprovalItem } from '~/types/approval'

const activeFilter = ref('all')
const dropdownRef = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)
const isfilterDropdown = ref(false)
const todoOptions = [
  { label: 'My Approvals', value: 'approvals' },
  { label: 'My Requests', value: 'requests' },
  { label: 'My Tasks', value: 'tasks' },
  { label: 'Watchlist', value: 'watchlist' },
]
const selectedView = ref(todoOptions[0]) as any
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

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const filterDropdown = () => {
  isfilterDropdown.value = !isfilterDropdown.value
}

const selectView = (option: (typeof todoOptions)[number]) => {
  selectedView.value = option
  isDropdownOpen.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (!dropdownRef.value?.contains(target)) {
    isDropdownOpen.value = false
  }
}


onMounted(async () => {
  document.addEventListener('click', handleDocumentClick)
  await bootstrap()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
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

  .action-btn_left {
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
    margin-right: 16px !important;
  }

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

.mobile-todo__dropdown {
  position: relative;
}

.mobile-todo__title {
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  padding: 0;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  span {
    display: flex;
    align-items: center;
  }
}

.mobile-todo__arrow {
  transition: transform 0.2s ease;
}

.mobile-todo__arrow.is-open {
  transform: rotate(180deg);
}

.mobile-todo__menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  min-width: 176px;
  padding: 14px 0;
  border-radius: 32px;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.14);
  z-index: 20;
}

.mobile-todo__menu-item {
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 28px;
  text-align: left;
  font-size: 17px;
  font-weight: 600;
  color: #111111;
}

.mobile-todo__menu-check {
  width: 12px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0;
  border-right: 4px solid #a60a3a;
  border-bottom: 4px solid #a60a3a;
  transform: rotate(45deg) translateY(-2px);
}

.mobile-todo__menu-check.is-visible {
  opacity: 1;
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
  gap: 12px;
  padding: 18px 16px;
  background: white;
  cursor: pointer;
  border-bottom: 0.5px solid #d9d9d9;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.todo-item:active {
  transform: scale(0.98);
}

.todo-item__content {
  flex: 1;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.todo-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  width: 100%;
}

.todo-item__meta {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
}

.todo-item__code {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #1f1f1f;
}

.todo-item__status {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.status-pending {
  color: #d69a00;
}

.status-approved {
  color: #2e7d32;
}

.status-rejected {
  color: #c62828;
}

.todo-item__title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  color: #111111;
  margin-bottom: 6px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.todo-item__subtitle {
  font-size: 13px;
  line-height: 1.35;
  color: #666666;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-item__date {
  flex-shrink: 0;
  font-size: 13px;
  line-height: 1.3;
  color: #9ca3af;
}

.todo-item__arrow {
  flex-shrink: 0;
  align-self: center;
}

.todo-item__portfolio {
  color: #A60A3A;
}
</style>
