<template>
  <div class="mobile-todo">
    <div v-if="!isLoadingScreenVisible" class="mobile-todo__header">
      <template v-if="isSearchOpen">
        <div class="mobile-todo__search">
          <IconCustom name="search" :size="20" class="mobile-todo__search-icon" />
          <input ref="searchInputRef" v-model.trim="searchQuery" type="text" class="mobile-todo__search-input"
            :placeholder="searchPlaceholder">
        </div>
        <button type="button" class="mobile-todo__search-cancel" @click="closeSearch">
          {{ text('mobile.todo.actions.cancel', { 'zh-CN': '取消', 'zh-TW': '取消', en: 'Cancel' }) }}
        </button>
      </template>

      <template v-else>
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

        <div class="mobile-todo__actions">
          <div ref="filterTriggerRef" class="mobile-todo__filter-trigger">
            <el-button circle class="action-btn_left" :class="{ 'is-active': isFilterPanelOpen }"
              @click="toggleFilterPanel">
              <IconCustom name="filterIcon" :size="20" />
            </el-button>
          </div>
          <el-button circle class="action-btn" @click="openSearch">
            <IconCustom name="search" :size="20" />
          </el-button>
        </div>
      </template>
    </div>

    <div v-if="!isLoadingScreenVisible && isFilterPanelOpen && !isSearchOpen" ref="filterPanelRef"
      class="mobile-todo__filter-panel">
      <div class="mobile-todo__filter-group">
        <div class="mobile-todo__filter-label">{{ text('mobile.todo.filters.category', {
          'zh-CN': '筛选 1', 'zh-TW': '篩選1',
          en: 'Filter 1'
        }) }}</div>
        <div class="mobile-todo__filter-options">
          <button v-for="filter in categoryFilters" :key="filter.value" type="button" class="mobile-todo__filter-chip"
            :class="{ 'is-active': draftCategoryFilter === filter.value }" @click="draftCategoryFilter = filter.value">
            {{ filter.label }}{{ filter.count ? ` ${filter.count}` : '' }}
          </button>
        </div>
      </div>

      <div class="mobile-todo__filter-group">
        <div class="mobile-todo__filter-label">{{ text('mobile.todo.filters.status', {
          'zh-CN': '筛选 2', 'zh-TW': '篩選 2',
          en:
            'Filter 2'
        }) }}</div>
        <div class="mobile-todo__filter-options">
          <button v-for="filter in statusFilters" :key="filter.value" type="button" class="mobile-todo__filter-chip"
            :class="{ 'is-active': draftStatusFilter === filter.value }" @click="draftStatusFilter = filter.value">
            {{ filter.label }}{{ filter.count ? ` ${filter.count}` : '' }}
          </button>
        </div>
      </div>

      <div class="mobile-todo__filter-actions">
        <button type="button" class="mobile-todo__panel-btn" @click="cancelFilters">
          {{ text('mobile.todo.actions.cancel', { 'zh-CN': '取消', 'zh-TW': '取消', en: 'Cancel' }) }}
        </button>
        <button type="button" class="mobile-todo__panel-btn" @click="applyFilters">
          {{ text('mobile.todo.actions.apply', { 'zh-CN': '应用', 'zh-TW': '套用', en: 'Apply' }) }}
        </button>
      </div>
    </div>

    <div class="mobile-todo__list">
      <div v-if="isLoadingScreenVisible" class="mobile-todo__loading-screen">
        <div class="mobile-todo__loading-content">
          <div class="mobile-todo__loading-title">{{ loadingLabel }}</div>
          <div class="mobile-todo__loading-track" aria-hidden="true">
            <span class="mobile-todo__loading-bar" />
          </div>
        </div>
      </div>
      <div v-else-if="!loading && filteredTasks.length === 0" class="mobile-todo__state">{{
        text('mobile.todo.states.empty',
          { 'zh-CN': '暂无消息', 'zh-TW': '暫無消息', en: 'No items' }) }}</div>
      <template v-else>
        <div v-if="selectedViewValue === 'approvals'" v-for="task in filteredTasks" :key="task.id" class="todo-item"
          @click="handleTaskClick(selectedViewValue, task)">
          <div class="todo-item__content">
            <div class="todo-item__header">
              <div class="todo-item__meta">
                <span class="todo-item__code">{{ getTaskReference(task) }}</span>
                <span class="todo-item__status" :class="`status-pending`">
                  {{ t(`${task.status}`) }}
                </span>
              </div>
              <div class="todo-item__date">{{ task.createTime }}</div>
            </div>
            <div class="todo-item__title">{{ task.requestName }}</div>
            <div class="todo-item__subtitle">
              <span>{{ task.creatorName }}</span>
              <span>{{ ' | ' }}</span>
              <span class="todo-item__portfolio">{{ task.workflowBaseInfo.workflowName
                }}</span>
            </div>
          </div>
          <IconCustom name="chevron-right" :size="20" color="#A60A3A" class="todo-item__arrow" />
        </div>
        <div v-if="selectedViewValue === 'requests'" v-for="task in filteredTasks" :key="task.id" class="todo-item"
          @click="handleTaskClick(selectedViewValue, task)">
          <div class="todo-item__content">
            <div class="todo-item__header">
              <div class="todo-item__meta">
                <span class="todo-item__code">{{ task.requestmark }}</span>
              </div>
            </div>
            <div class="todo-item__title">{{ task.requestName }} <span class="todo-item__status"
                :class="`status-pending`">
                {{ t(`${task.currentNodeName}`) }}
              </span>
              <div class="todo-item__date">{{ task.createTime }}</div>
            </div>
            <div class="todo-item__title">
              <span>{{ task.creatorSubcompanyName }}</span>
              <span>-></span>
              <span>{{ task.creatorDepartmentName }}</span>
            </div>
            <div class="todo-item__subtitle">
              <span>{{ task.creatorName }}</span>
              <span>{{ ' | ' }}</span>
              <span class="todo-item__portfolio">{{ task.workflowBaseInfo.workflowName
                }}</span>
            </div>
          </div>
        </div>
        <div v-if="selectedViewValue === 'tasks'" v-for="task in filteredTasks" :key="task.id" class="todo-item"
          @click="handleTaskClick(selectedViewValue, task)">
          <div class="todo-item__content">
            <div class="todo-item__header">
              <div class="todo-item__meta">
                <span class="todo-item__code">{{ getTaskReference(task) }}</span>
              </div>
              <div class="todo-item__date">{{ task.createTime }}</div>
            </div>
            <div class="todo-item__title">{{ task.requestName }}</div>
            <span class="todo-item__status" :class="`status-pending`">
              {{ t(`${task.status}`) }}
            </span>
            <div class="todo-item__subtitle">
              <span>{{ task.creatorName }}</span>
              <span>{{ ' | ' }}</span>
              <span class="todo-item__portfolio">{{ task.workflowBaseInfo.workflowName
                }}</span>
            </div>
          </div>

        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { ApprovalItem } from '~/types/approval'
const toDoFrom: any = useState('mobile:todo-form', () => null)

type TodoOption = {
  label: string
  value: string
}

type LocaleMessages = Record<string, string>

const { locale, t } = useAppI18n()
const dropdownRef = ref<HTMLElement | null>(null)
const filterTriggerRef = ref<HTMLElement | null>(null)
const filterPanelRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isDropdownOpen = ref(false)
const isFilterPanelOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const todoOptions = computed<TodoOption[]>(() => [
  { label: t('tasks.tabs.approval'), value: 'approvals' },
  { label: t('tasks.tabs.requests'), value: 'requests' },
  { label: t('tasks.tabs.tasks'), value: 'tasks' },
])
const selectedViewValue = ref('approvals')
const selectedView = computed<TodoOption>(() => {
  return todoOptions.value.find(option => option.value === selectedViewValue.value)
    ?? todoOptions.value[0]
    ?? { label: '', value: '' }
})
const appliedCategoryFilter = ref('all')
const appliedStatusFilter = ref('all')
const draftCategoryFilter = ref('all')
const draftStatusFilter = ref('all')
const { list, loading, fetchByView } = useToDoData()


const defaultFallbacks = {
  all: 'All',
  search: 'Search',
  others: 'Others',
}

const localizedFallbacks: Record<string, { all: string, search: string, others: string }> = {
  'zh-CN': {
    all: '全部',
    search: '搜索',
    others: '其他',
  },
  'zh-TW': {
    all: '全部',
    search: '搜尋',
    others: '其他',
  },
  en: defaultFallbacks,
}

const text = (key: string, fallback: LocaleMessages) => {
  const message = t(key)
  return message === key ? fallback[locale.value] || fallback.en || '' : message
}

const searchPlaceholder = computed(() => {
  const prefix = localizedFallbacks[locale.value]?.search || defaultFallbacks.search
  return `${prefix} ${selectedView.value.label}`.trim()
})

const isLoadingScreenVisible = computed(() => loading.value && list.value.length === 0)

const loadingLabel = computed(() => {
  return t('mobile.todo.states.loadingScreen', {
    view: selectedView.value.label,
  })
})

const normalizeFilterValue = (value?: string | null) => {
  return String(value || '').trim().toLowerCase()
}

const getTaskStatus = (task: any) => {
  return normalizeFilterValue(task.status || task.currentNodeName)
}

const getTaskStatusLabel = (task: any) => {
  return String(task.status || task.currentNodeName || '').trim()
}

const getTaskSearchFields = (task: any) => {
  return [
    task.code,
    task.title,
    task.submittedBy,
    task.portfolio,
    task.category,
    task.status,
    task.requestmark,
    task.requestName,
    task.creatorName,
    task.creatorDepartmentName,
    task.creatorSubcompanyName,
    task.currentNodeName,
    task.workflowBaseInfo?.workflowName,
    task.workflowBaseInfo?.workflowTypeName,
  ].map(field => normalizeFilterValue(field))
}

const getTaskTitleCodeFields = (task: any) => {
  return [
    task.code,
    task.title,
    task.referenceNo,
    task.requestmark,
    task.requestName,
  ].map(field => normalizeFilterValue(field))
}

const getTaskReference = (task: any) => {
  return String(task?.requestmark || task?.requestId || task?.id || '').trim()
}

const categoryFilterPresets = computed(() => {
  return [
    {
      label: t('mobile.todo.filters.all'),
      value: 'all',
    },
    {
      label: t('mobile.todo.filters.it'),
      value: 'IT',
    },
    {
      label: t('Finance'),
      value: 'Finance',
    },
    {
      label: t('mobile.todo.filters.legal'),
      value: 'Legal',
    },
    {
      label: t('mobile.todo.filters.motor'),
      value: 'Motor',
    },
  ]
})

const getCategoryKeywords = (filterValue: string) => {
  const normalizedFilterValue = normalizeFilterValue(filterValue)
  const activeCategory = categoryFilterPresets.value.find((filter) => {
    return normalizeFilterValue(filter.value) === normalizedFilterValue
  })

  return [
    activeCategory?.label,
    activeCategory?.value,
    filterValue,
  ]
    .map(value => normalizeFilterValue(value))
    .filter((value, index, values) => value && value !== 'all' && values.indexOf(value) === index)
}

const matchesCategoryFilter = (task: any, filterValue: string) => {
  const normalizedFilterValue = normalizeFilterValue(filterValue)
  if (normalizedFilterValue === 'all') {
    return true
  }

  const categoryKeywords = getCategoryKeywords(filterValue)
  const taskTitleCodeFields = getTaskTitleCodeFields(task)
  return categoryKeywords.some(categoryKeyword => taskTitleCodeFields.some(field => field.includes(categoryKeyword)))
}

const matchesStatusFilter = (task: any, filterValue: string) => {
  const normalizedFilterValue = normalizeFilterValue(filterValue)
  return normalizedFilterValue === 'all'
    || getTaskStatus(task) === normalizedFilterValue
}

const matchesSearchFilter = (task: any, keyword: string) => {
  return !keyword
    || getTaskSearchFields(task).some(field => field.includes(keyword))
}

const searchFilteredTasks = computed(() => {
  const keyword = normalizeFilterValue(searchQuery.value)
  return list.value.filter((task) => {
    return matchesSearchFilter(task, keyword)
  })
})

const categoryCountBaseTasks = computed(() => {
  return searchFilteredTasks.value.filter((task) => {
    return matchesStatusFilter(task, appliedStatusFilter.value)
  })
})

const categoryFilters = computed(() => {
  return categoryFilterPresets.value.map((filter) => {
    if (filter.value === 'all') {
      return {
        ...filter,
        count: null,
      }
    }

    const count = categoryCountBaseTasks.value.filter((task) => {
      return matchesCategoryFilter(task, filter.value)
    }).length

    return {
      ...filter,
      count,
    }
  })
})

const statusCountBaseTasks = computed(() => {
  return searchFilteredTasks.value.filter((task) => {
    return matchesCategoryFilter(task, appliedCategoryFilter.value)
  })
})

const statusFilters = computed(() => {
  const statusMap = new Map<string, { label: string, value: string, count: number }>()

  statusCountBaseTasks.value.forEach((task) => {
    const value = getTaskStatus(task)
    const label = getTaskStatusLabel(task)

    if (!value || !label) {
      return
    }

    const current = statusMap.get(value)
    if (current) {
      current.count += 1
      return
    }

    statusMap.set(value, {
      label,
      value,
      count: 1,
    })
  })

  return [
    {
      label: t('mobile.todo.filters.all'),
      value: 'all',
      count: null,
    },
    ...Array.from(statusMap.values()),
  ]
})

const filteredTasks = computed(() => {
  return statusCountBaseTasks.value.filter((task) => {
    return matchesStatusFilter(task, appliedStatusFilter.value)
  })
})

const handleTaskClick = (selectedViewValue: string, task: ApprovalItem) => {
  toDoFrom.value = task
  const targetId = getTaskReference(task)

  if (!targetId) {
    return
  }

  return navigateTo({
    path: `/mobile/approval/${encodeURIComponent(targetId)}`,
    query: {
      requestId: task.requestId,
    },
  })
}

const toggleDropdown = () => {
  isSearchOpen.value = false
  isFilterPanelOpen.value = false
  isDropdownOpen.value = !isDropdownOpen.value
}

const toggleFilterPanel = () => {
  const nextOpenState = !isFilterPanelOpen.value

  if (nextOpenState) {
    isSearchOpen.value = false
    draftCategoryFilter.value = appliedCategoryFilter.value
    draftStatusFilter.value = appliedStatusFilter.value
    isDropdownOpen.value = false
  }

  isFilterPanelOpen.value = nextOpenState
}

const openSearch = async () => {
  isSearchOpen.value = true
  isDropdownOpen.value = false
  isFilterPanelOpen.value = false
  await nextTick()
  searchInputRef.value?.focus()
}

const closeSearch = () => {
  searchQuery.value = ''
  isSearchOpen.value = false
}

const selectView = (option: TodoOption) => {
  selectedViewValue.value = option.value
  isDropdownOpen.value = false
}

const cancelFilters = () => {
  draftCategoryFilter.value = appliedCategoryFilter.value
  draftStatusFilter.value = appliedStatusFilter.value
  isFilterPanelOpen.value = false
}

const applyFilters = () => {
  appliedCategoryFilter.value = draftCategoryFilter.value
  appliedStatusFilter.value = draftStatusFilter.value
  isFilterPanelOpen.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (!dropdownRef.value?.contains(target)) {
    isDropdownOpen.value = false
  }

  const isInsideFilterArea = filterPanelRef.value?.contains(target) || filterTriggerRef.value?.contains(target)

  if (!isInsideFilterArea) {
    isFilterPanelOpen.value = false
  }
}

watch(
  statusFilters,
  (filters) => {
    const hasAppliedStatus = filters.some(filter => filter.value === appliedStatusFilter.value)
    if (!hasAppliedStatus) {
      appliedStatusFilter.value = 'all'
    }

    const hasDraftStatus = filters.some(filter => filter.value === draftStatusFilter.value)
    if (!hasDraftStatus) {
      draftStatusFilter.value = 'all'
    }
  },
  { immediate: true },
)

watch(
  selectedViewValue,
  async (view) => {
    await fetchByView(view as 'approvals' | 'requests' | 'tasks')
  },
  { immediate: true },
)

onMounted(async () => {
  document.addEventListener('click', handleDocumentClick)
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
  gap: 12px;
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

  .action-btn_left.is-active {
    background-color: #a60a3a;
    color: #ffffff;
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

.mobile-todo__actions {
  display: flex;
  align-items: center;
}

.mobile-todo__search {
  flex: 1;
  min-width: 0;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-radius: 12px;
  background: #f5f5f5;
}

.mobile-todo__search-icon {
  flex-shrink: 0;
  color: #6b6b6b;
}

.mobile-todo__search-input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: #1f1f1f;
  font-size: 15px;
  line-height: 1.4;
}

.mobile-todo__search-input::placeholder {
  color: #6b6b6b;
}

.mobile-todo__search-cancel {
  flex-shrink: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 16px;
  font-weight: 500;
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

.mobile-todo__filter-panel {
  padding: 12px 16px 16px;
  border-top: 1px solid #e8e2e5;
  background: #ffffff;
}

.mobile-todo__filter-group+.mobile-todo__filter-group {
  margin-top: 12px;
}

.mobile-todo__filter-label {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #5f5f5f;
}

.mobile-todo__filter-options {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mobile-todo__filter-options::-webkit-scrollbar {
  display: none;
}

.mobile-todo__filter-chip {
  flex: 0 0 auto;
  border: 1px solid #d9d9d9;
  background: #ffffff;
  color: #666666;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
}

.mobile-todo__filter-chip.is-active {
  border-color: #b0124b;
  background: #b0124b;
  color: #ffffff;
}

.mobile-todo__filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.mobile-todo__panel-btn {
  flex: 1;
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: #f3dce3;
  color: #b0124b;
  font-size: 16px;
  font-weight: 600;
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

.mobile-todo__loading-screen {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px 112px;
  background: #ffffff;
}

.mobile-todo__loading-content {
  width: min(100%, 250px);
}

.mobile-todo__loading-title {
  margin-bottom: 22px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: #111111;
}

.mobile-todo__loading-track {
  position: relative;
  width: 100%;
  height: 6px;
  overflow: hidden;
  background: #dcdde1;
}

.mobile-todo__loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background: #b20d45;
  animation: mobile-todo-loading 1.4s ease-in-out infinite;
}

.mobile-todo__state {
  padding: 32px 16px;
  text-align: center;
  font-size: 13px;
  color: #999999;
}

@keyframes mobile-todo-loading {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(235%);
  }

  100% {
    transform: translateX(0);
  }
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
