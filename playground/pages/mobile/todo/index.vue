<template>
  <div class="mobile-todo">
    <MobileLoadingScreen
      v-if="isLoadingScreenVisible"
      :title="loadingLabel"
    />

    <div
      v-else
      class="mobile-todo__header"
    >
      <template v-if="isSearchOpen">
        <div class="mobile-todo__search">
          <IconCustom
            name="search"
            :size="20"
            class="mobile-todo__search-icon"
          />
          <input
            ref="searchInputRef"
            v-model.trim="searchQuery"
            type="text"
            class="mobile-todo__search-input"
            :placeholder="searchPlaceholder"
          >
        </div>
        <button
          type="button"
          class="mobile-todo__search-cancel"
          @click="closeSearch"
        >
          {{ t('mobile.todo.actions.cancel') }}
        </button>
      </template>

      <template v-else>
        <div
          ref="dropdownRef"
          class="mobile-todo__dropdown"
        >
          <button
            type="button"
            class="mobile-todo__title"
            @click="toggleDropdown"
          >
            <h2>{{ selectedView.label }}</h2>
            <span
              class="mobile-todo__arrow"
              :class="{ 'is-open': isDropdownOpen }"
            >
              <IconCustom
                name="downArrowIcon"
                :size="20"
              />
            </span>
          </button>

          <div
            v-if="isDropdownOpen"
            class="mobile-todo__menu"
          >
            <button
              v-for="option in todoOptions"
              :key="option.value"
              type="button"
              class="mobile-todo__menu-item"
              :class="{ 'is-active': selectedView.value === option.value }"
              @click="selectView(option)"
            >
              <span
                class="mobile-todo__menu-check"
                :class="{ 'is-visible': selectedView.value === option.value }"
              />
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <div class="mobile-todo__actions">
          <div
            ref="filterTriggerRef"
            class="mobile-todo__filter-trigger"
          >
            <el-button
              circle
              class="action-btn_left"
              :class="{ 'is-active': isFilterPanelOpen }"
              @click="toggleFilterPanel"
            >
              <IconCustom
                name="filterIcon"
                :size="20"
              />
            </el-button>
          </div>
          <el-button
            circle
            class="action-btn"
            @click="openSearch"
          >
            <IconCustom
              name="search"
              :size="20"
            />
          </el-button>
        </div>
      </template>
    </div>

    <div
      v-if="!isLoadingScreenVisible && isFilterPanelOpen && !isSearchOpen"
      ref="filterPanelRef"
      class="mobile-todo__filter-panel"
    >
      <div class="mobile-todo__filter-group">
        <div class="mobile-todo__filter-label">
          {{ t('mobile.todo.filters.category') }}
        </div>
        <div class="mobile-todo__filter-options">
          <button
            v-for="filter in categoryFilters"
            :key="filter.value"
            type="button"
            class="mobile-todo__filter-chip"
            :class="{ 'is-active': draftCategoryFilter === filter.value }"
            @click="draftCategoryFilter = filter.value"
          >
            {{ filter.label }}{{ filter.count ? ` ${filter.count}` : '' }}
          </button>
        </div>
      </div>

      <div class="mobile-todo__filter-group">
        <div class="mobile-todo__filter-label">
          {{ t('mobile.todo.filters.status') }}
        </div>
        <div class="mobile-todo__filter-options">
          <button
            v-for="filter in statusFilters"
            :key="filter.value"
            type="button"
            class="mobile-todo__filter-chip"
            :class="{ 'is-active': draftStatusFilter === filter.value }"
            @click="draftStatusFilter = filter.value"
          >
            {{ filter.label }}{{ filter.count ? ` ${filter.count}` : '' }}
          </button>
        </div>
      </div>

      <div class="mobile-todo__filter-actions">
        <button
          type="button"
          class="mobile-todo__panel-btn"
          @click="cancelFilters"
        >
          {{ t('mobile.todo.actions.cancel') }}
        </button>
        <button
          type="button"
          class="mobile-todo__panel-btn"
          @click="applyFilters"
        >
          {{ t('mobile.todo.actions.apply') }}
        </button>
      </div>
    </div>

    <div class="mobile-todo__list">
      <div
        v-if="!todosStore.activeLoading && filteredTasks.length === 0"
        class="mobile-todo__state"
      >
        {{ t('mobile.todo.states.empty') }}
      </div>
      <template v-else>
        <div
          v-for="task in filteredTasks"
          :key="task.cid"
          class="todo-item"
          @click="handleTaskClick(task)"
        >
          <div class="todo-item__content">
            <div class="todo-item__header">
              <div class="todo-item__meta">
                <span class="todo-item__code">{{ task.requestmark || task.requestId }}</span>
                <span
                  class="todo-item__status"
                  :class="'status-pending'"
                >
                  {{ task.status || task.currentNodeName || t('tasks.status.pending') }}
                </span>
              </div>
              <div class="todo-item__date">
                {{ String(task.createTime).split(/[ T]/)[0] }}
              </div>
            </div>
            <div class="todo-item__title">
              {{ formatRequestName(task.requestName) }}
            </div>
            <div class="todo-item__subtitle">
              <span>{{ task.creatorName }}</span>
              <span>{{ ' | ' }}</span>
              <span class="todo-item__portfolio">
                {{ task.workflowBaseInfo?.workflowName }}
              </span>
            </div>
          </div>
          <IconCustom
            name="chevron-right"
            :size="20"
            color="#A60A3A"
            class="todo-item__arrow"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { TodoListKey, WorkflowTodoItem } from '~/types/todo'
import {
  createTodoFilterOptions,
  getTodoCategoryLabel,
  getTodoStatusLabel,
  normalizeTodoFilterValue,
  type TodoFilterOption,
} from '~/utils/todoFilters'

definePageMeta({ layout: 'mobile', middleware: 'auth' })

type TodoOption = {
  label: string
  title: string
  value: TodoListKey
}

const { t } = useAppI18n()
const todosStore = useTodosStore()
const activeTodo = useState<WorkflowTodoItem | null>('mobile:todo:active', () => null)
const { openGuardedUrl } = useNetworkGuard()
const searchInputRef = ref<HTMLInputElement | null>(null)
const isDropdownOpen = ref(false)
const isFilterPanelOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const appliedCategoryFilter = ref('all')
const appliedStatusFilter = ref('all')
const draftCategoryFilter = ref('all')
const draftStatusFilter = ref('all')
// 页面数据加载状态：当正在加载数据且当前待办列表为空时，显示加载屏幕
const isLoadingScreenVisible = computed(() => {
  return todosStore.activeLoading && todosStore.activeTodoList.length === 0
})
const loadingLabel = computed(() => {
  return t('mobile.todo.states.loadingScreen', {
    view: selectedView.value.label,
  })
})
const searchPlaceholder = computed(() => {
  return `${t('mobile.todo.actions.search')} ${selectedView.value.label}`.trim()
})
// 下拉框选项
const todoOptions = computed<TodoOption[]>(() => [
  { label: t('tasks.tabs.approval'), title: 'approval', value: 'myApproval' },
  { label: t('tasks.tabs.requests'), title: 'requests', value: 'myRequests' },
  { label: t('tasks.tabs.tasks'), title: 'tasks', value: 'myTasks' },
  { label: t('tasks.tabs.approved'), title: 'approved', value: 'approved' },
])
const selectedView = computed<TodoOption>(() => {
  return todoOptions.value.find(option => option.value === todosStore.activeListKey)!
})
const activeTodoList = computed(() => todosStore.activeTodoList)
const categoryFilters = computed<TodoFilterOption[]>(() => {
  return [
    { label: t('mobile.todo.filters.all'), value: 'all', count: null },
    ...createTodoFilterOptions(activeTodoList.value, getTodoCategoryLabel),
  ]
})
const categoryFilteredTasks = computed(() => {
  if (appliedCategoryFilter.value === 'all') {
    return activeTodoList.value
  }

  return activeTodoList.value.filter((task) => {
    return normalizeTodoFilterValue(getTodoCategoryLabel(task)) === appliedCategoryFilter.value
  })
})
const statusFilteredTasks = computed(() => {
  if (appliedStatusFilter.value === 'all') {
    return categoryFilteredTasks.value
  }

  return categoryFilteredTasks.value.filter((task) => {
    return normalizeTodoFilterValue(getTodoStatusLabel(task)) === appliedStatusFilter.value
  })
})
const filteredTasks = computed(() => {
  const keyword = normalizeTodoFilterValue(searchQuery.value)

  if (!keyword) {
    return statusFilteredTasks.value
  }

  return statusFilteredTasks.value.filter((task) => {
    return [
      task.requestmark,
      task.requestName,
      task.creatorName,
      task.currentNodeName,
      task.workflowBaseInfo?.workflowName,
      task.workflowBaseInfo?.workflowTypeName,
    ].some(value => normalizeTodoFilterValue(value).includes(keyword))
  })
})

const statusFilters = computed<TodoFilterOption[]>(() => {
  return [
    { label: t('mobile.todo.filters.all'), value: 'all', count: null },
    ...createTodoFilterOptions(categoryFilteredTasks.value, getTodoStatusLabel),
  ]
})
const toggleDropdown = () => {
  isSearchOpen.value = false
  isFilterPanelOpen.value = false
  isDropdownOpen.value = !isDropdownOpen.value
}
const selectView = (option: TodoOption) => {
  isDropdownOpen.value = false
  isFilterPanelOpen.value = false
  appliedCategoryFilter.value = 'all'
  appliedStatusFilter.value = 'all'
  draftCategoryFilter.value = 'all'
  draftStatusFilter.value = 'all'
  void todosStore.selectTodoList(option.value)
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
// 搜索功能模块
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
// 任务点击处理：根据不同的待办类型，导航到不同的页面
const handleTaskClick = (task: WorkflowTodoItem) => {
  const requestId = Number(task.requestId)

  if (!Number.isInteger(requestId) || requestId === 0) {
    return
  }

  if (requestId < 0) {
    const workflowUrl = `https://platform-uat.dchbi.app/workflow/request/ViewRequestForwardSPA.jsp?requestid=${encodeURIComponent(String(requestId))}`
    void openGuardedUrl(workflowUrl, '_self')
    return
  }

  activeTodo.value = task

  return navigateTo({
    path: `/mobile/todo/${encodeURIComponent(String(requestId))}`,
    query: {
      title: selectedView.value.title,
    },
  })
}

onMounted(() => {
  void todosStore.selectTodoList('myApproval')
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
    font-size: 23px;
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
  min-height: 0;
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  scroll-padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  overscroll-behavior: contain;
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
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #1f1f1f;
}

.todo-item__status {
  font-size: 14px;
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
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: #111111;
  margin-bottom: 7px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.todo-item__subtitle {
  font-size: 12px;
  line-height: 1.4;
  color: #666666;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  span {
    font-family: var(--font-source-sans-pro);
    font-weight: 400;
    font-style: normal;
    font-size: 11px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0;
    vertical-align: middle;
  }
}

.todo-item__date {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.3;
  color: #9ca3af;
}

.todo-item__arrow {
  flex-shrink: 0;
  align-self: center;
}

.todo-item__portfolio {
  color: #A60A3A;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 11px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

}
</style>
