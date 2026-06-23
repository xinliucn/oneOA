<template>
  <div class="todo-page">
    <DesktopTodoToast />
    <section class="todo-page__content">
      <div class="todo-page__header">
        <nav
          class="todo-page__breadcrumb"
          aria-label="Breadcrumb"
        >
          <NuxtLink to="/desktop">
            Home
          </NuxtLink>
          <span>&gt;</span>
          <span>To-Do</span>
        </nav>

        <div class="todo-page__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            :class="['todo-page__tab', { 'is-active': todosStore.activeListKey === tab.value }]"
            @click="selectTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="todo-page__toolbar">
        <label class="todo-page__search">
          <IconCustom
            name="search"
            :size="18"
          />
          <input
            v-model.trim="searchQuery"
            type="search"
            :placeholder="searchPlaceholder"
          >
        </label>

        <div class="todo-page__filters">
          <div
            v-for="filter in filters"
            :key="filter.key"
            class="todo-page__filter"
          >
            <span>{{ filter.label }}</span>
            <div class="todo-page__select-wrap">
              <button
                type="button"
                class="todo-page__select"
                :aria-expanded="openFilterKey === filter.key"
                @click="toggleFilter(filter.key)"
              >
                <span>{{ getSelectedFilterLabel(filter.key) }}</span>
                <IconCustom
                  name="chevron-right"
                  :size="18"
                  :rotate="openFilterKey === filter.key ? 270 : 90"
                />
              </button>

              <div
                v-if="openFilterKey === filter.key"
                class="todo-page__select-menu"
              >
                <button
                  v-for="option in filter.options"
                  :key="option.value"
                  type="button"
                  :class="['todo-page__select-option', { 'is-selected': selectedFilters[filter.key] === option.value }]"
                  @click="selectFilter(filter.key, option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="todo-table">
        <div class="todo-table__row todo-table__row--head">
          <button type="button">
            Approval No.
          </button>
          <button type="button">
            Subject
          </button>
          <button type="button">
            Submitted By
          </button>
          <button type="button">
            Platform
          </button>
          <button type="button">
            Status
          </button>
          <button type="button">
            Date Submitted
          </button>
        </div>

        <div
          v-if="loading && tableRows.length === 0"
          class="todo-table__state"
        >
          Loading {{ activeTabLabel }}...
        </div>
        <div
          v-else-if="!loading && tableRows.length === 0"
          class="todo-table__state"
        >
          No records found.
        </div>

        <template v-else>
          <div
            v-for="item in tableRows"
            :key="item.cid || item.requestId"
            class="todo-table__row todo-table__row--body"
            @click="handleRowClick(item)"
          >
            <button
              type="button"
              class="todo-table__link"
              @click.stop="handleRowClick(item)"
            >
              {{ getTaskReference(item) || '-' }}
            </button>
            <span>{{ formatRequestName(item.requestName) || '-' }}</span>
            <span>{{ item.creatorName || '-' }}</span>
            <button
              type="button"
              class="todo-table__link"
              @click.stop="handleRowClick(item)"
            >
              {{ item.workflowBaseInfo?.workflowName || item.workflowBaseInfo?.workflowTypeName || '-' }}
            </button>
            <span
              class="todo-table__status"
              :class="getTaskStatusClass(getTaskStatus(item))"
            >
              {{ getTaskStatus(item) }}
            </span>
            <span>{{ formatTaskDate(item.createTime) }}</span>
          </div>
        </template>
      </div>

      <div class="todo-page__footer-row">
        <span class="todo-page__record-count">
          {{ recordCountText }}
        </span>

        <div class="todo-page__actions">
          <div
            class="todo-page__pagination"
            aria-label="Pagination"
          >
            <button
              type="button"
              class="todo-page__page-nav"
            >
              <IconCustom
                name="chevron-right"
                :size="16"
                :rotate="180"
              />
            </button>
            <button
              type="button"
              class="todo-page__page is-active"
            >
              1
            </button>
            <button
              type="button"
              class="todo-page__page"
            >
              2
            </button>
            <button
              type="button"
              class="todo-page__page"
            >
              3
            </button>
            <button
              type="button"
              class="todo-page__page-nav"
            >
              <IconCustom
                name="chevron-right"
                :size="16"
              />
            </button>
          </div>

          <button
            type="button"
            class="todo-page__export"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </section>

    <footer class="todo-page__copyright">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { TodoListKey, WorkflowTodoItem } from '~/types/todo'
import { formatRequestName } from '~/utils/todo'
import {
  createTodoFilterOptions,
  getTodoCategoryLabel,
  getTodoStatusLabel,
  normalizeTodoFilterValue,
} from '~/utils/todoFilters'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const { t } = useAppI18n()
const todosStore = useTodosStore()
const activeTodo = useState<WorkflowTodoItem | null>('desktop:todo:active', () => null)
const legacyTodoForm = useState<WorkflowTodoItem | null>('mobile:todo-form', () => null)

const tabs = computed(() => [
  { label: t('tasks.tabs.approval'), value: 'myApproval' as const },
  { label: t('tasks.tabs.requests'), value: 'myRequests' as const },
  { label: t('tasks.tabs.tasks'), value: 'myTasks' as const },
  { label: t('tasks.tabs.approved'), value: 'approved' as const },
])

const activeTabLabel = computed(() => tabs.value.find(tab => tab.value === todosStore.activeListKey)?.label || t('tasks.tabs.approval'))
const loading = computed(() => todosStore.activeLoading)
const filters = computed(() => [
  {
    key: 'filter1',
    label: `${activeTabLabel.value} Business`,
    options: [
      { label: t('mobile.todo.filters.all'), value: 'all' },
      ...createTodoFilterOptions(todosStore.activeTodoList, getTodoCategoryLabel).map(option => ({
        label: option.label,
        value: option.value,
      })),
    ],
  },
  {
    key: 'filter2',
    label: `${activeTabLabel.value} Status`,
    options: [
      { label: t('mobile.todo.filters.all'), value: 'all' },
      ...createTodoFilterOptions(categoryFilteredTasks.value, getTodoStatusLabel).map(option => ({
        label: option.label,
        value: option.value,
      })),
    ],
  },
] as const)
type FilterKey = 'filter1' | 'filter2'

const openFilterKey = ref<FilterKey | null>(null)
const searchQuery = ref('')
const selectedFilters = reactive<Record<FilterKey, string>>({
  filter1: 'all',
  filter2: 'all',
})

const searchPlaceholder = computed(() => `Search ${activeTabLabel.value.replace(/^My\s+/, '')}`)

const toggleFilter = (key: FilterKey) => {
  openFilterKey.value = openFilterKey.value === key ? null : key
}

const selectFilter = (key: FilterKey, option: string) => {
  selectedFilters[key] = option
  openFilterKey.value = null
}

const getSelectedFilterLabel = (key: FilterKey) => {
  return filters.value
    .find(filter => filter.key === key)
    ?.options.find(option => option.value === selectedFilters[key])
    ?.label || t('mobile.todo.filters.all')
}

const normalizeFilterValue = (value?: string | number | null) => {
  return normalizeTodoFilterValue(String(value || '').replace(/\s*\(\d+\)\s*$/, ''))
}

const getTaskReference = (task: WorkflowTodoItem) => {
  return task.requestmark || task.requestId || task.cid
}

const getTaskStatus = (task: WorkflowTodoItem) => {
  return task.status
    || task.currentNodeName
    || 'Pending'
}

const getTaskStatusClass = (status: string) => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus.includes('reject')) {
    return 'todo-table__status--rejected'
  }

  if (normalizedStatus.includes('approv') || normalizedStatus.includes('complete')) {
    return 'todo-table__status--approved'
  }

  return 'todo-table__status--pending'
}

const formatTaskDate = (date: string) => {
  return date.length > 10 ? date.slice(0, 10) : date
}

const getSearchFields = (task: WorkflowTodoItem) => {
  return [
    getTaskReference(task),
    task.requestName,
    task.creatorName,
    task.workflowBaseInfo?.workflowName,
    task.workflowBaseInfo?.workflowTypeName,
    getTaskStatus(task),
    task.createTime,
  ].map(field => normalizeFilterValue(field))
}

const categoryFilteredTasks = computed(() => {
  const selectedCategory = normalizeFilterValue(selectedFilters.filter1)

  if (selectedCategory === 'all') {
    return todosStore.activeTodoList
  }

  return todosStore.activeTodoList.filter((task) => {
    return normalizeFilterValue(getTodoCategoryLabel(task)) === selectedCategory
  })
})

const statusFilteredTasks = computed(() => {
  const selectedStatus = normalizeFilterValue(selectedFilters.filter2)

  if (selectedStatus === 'all') {
    return categoryFilteredTasks.value
  }

  return categoryFilteredTasks.value.filter((task) => {
    return normalizeFilterValue(getTodoStatusLabel(task)) === selectedStatus
  })
})

const matchesSearchFilter = (task: WorkflowTodoItem) => {
  const keyword = normalizeFilterValue(searchQuery.value)

  if (!keyword) {
    return true
  }

  return getSearchFields(task).some(field => field.includes(keyword))
}

const tableRows = computed(() => {
  return statusFilteredTasks.value.filter(matchesSearchFilter)
})

const recordCountText = computed(() => {
  if (tableRows.value.length === 0) {
    return '0 records'
  }

  return `1 to ${tableRows.value.length} of ${tableRows.value.length} records`
})

const handleRowClick = (task: WorkflowTodoItem) => {
  activeTodo.value = task
  legacyTodoForm.value = task

  if (!task.requestId) {
    return
  }

  return navigateTo({
    path: `/desktop/todo/${encodeURIComponent(task.requestId)}`,
    query: {
      requestId: task.requestId,
    },
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedFilters.filter1 = 'all'
  selectedFilters.filter2 = 'all'
  openFilterKey.value = null
}

const selectTab = (listKey: TodoListKey) => {
  resetFilters()
  void todosStore.selectTodoList(listKey, { query: { pageSize: 100 } })
}

onMounted(() => {
  void todosStore.selectTodoList('myApproval', { query: { pageSize: 100 } })
})
</script>

<style scoped>
.todo-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: relative;
}

.todo-page__content {
  flex: 1;
}

.todo-page__header {
  background: #f5f5f5;
  padding: 22px 82px 22px 82px;
  border-bottom: 1px solid #d9d9d9;
}

.todo-page__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 28px;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.todo-page__breadcrumb a {
  color: inherit;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 0%;
  text-underline-offset: 0%;
  text-decoration-skip-ink: auto;
}

.todo-page__breadcrumb span {
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.todo-page__breadcrumb span:last-child {
  font-weight: 700;
}

.todo-page__tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #D9D9D9;
}

.todo-page__tab {
  position: relative;
  border: 0;
  padding: 0 0 14px;
  background: transparent;
  color: #000000;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 500;
  cursor: pointer;
}

.todo-page__tab.is-active {
  color: #a60a3a;
  font-weight: 700;
}

.todo-page__tab.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: #a60a3a;
}

.todo-page__toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin: 54px 82px 48px;
}

.todo-page__search {
  width: 340px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  border-radius: 6px;
  background: #f5f5f5;
  color: #777777;
}

.todo-page__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #333333;
  font-size: 13px;
}

.todo-page__search input::placeholder {
  color: #a8a8a8;
}

.todo-page__filters {
  display: flex;
  gap: 31px;
}

.todo-page__filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #4f4f4f;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
}

.todo-page__filter > span {
  display: block;
  color: #4f4f4f;
  font-family: var(--font-source-sans-pro);
  font-size: 12px !important;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.todo-page__select-wrap {
  position: relative;
  width: 185px;
}

.todo-page__select {
  width: 185px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 18px;
  border: 1px solid #a3aab2;
  border-radius: 8px;
  background: #ffffff;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
  cursor: pointer;
}

.todo-page__select > span {
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 16px !important;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
}

.todo-page__select svg {
  color: #666666;
  flex-shrink: 0;
}

.todo-page__select-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: 100%;
  margin-top: 6px;
  padding: 6px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.todo-page__select-option {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 6px;
  padding: 0 12px;
  background: #ffffff;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  text-align: left;
  cursor: pointer;
}

.todo-page__select-option:hover {
  background: #f5f5f5;
}

.todo-page__select-option.is-selected {
  color: #a60a3a;
  font-weight: 600;
}

.todo-table {
  width: calc(100% - 164px);
  margin: 0 82px;
}

.todo-table__row {
  display: grid;
  grid-template-columns: 1.15fr 2fr 0.9fr 0.8fr 0.8fr 0.9fr;
  align-items: center;
  min-height: 40px;
  padding: 0 24px;
  column-gap: 16px;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.todo-table__row:not(.todo-table__row--head) > span,
.todo-table__row:not(.todo-table__row--head) > button {
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
}

.todo-table__row:nth-child(even):not(.todo-table__row--head) {
  background: #f5f5f5;
  border-radius: 8px;
}

.todo-table__row--body {
  cursor: pointer;
}

.todo-table__row--body:hover {
  background: #f5f5f5;
  border-radius: 8px;
}

.todo-table__row--head {
  min-height: 31px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d9d9d9;
  background: transparent;
  border-radius: 0;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 600;
  line-height: 100%;
}

.todo-table__row--head button {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0;
  text-align: left;
  white-space: nowrap;
}

.todo-table__row--head button::after {
  content: "↕";
  margin-left: 5px;
  color: #000000;
  font-size: 12px;
  line-height: 1;
}

.todo-table__link {
  justify-self: start;
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.todo-table__state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 14px;
  line-height: 1.2;
}

.todo-table__status {
  justify-self: start;
  min-width: 58px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 6px;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  text-align: center;
}

.todo-table__status--pending {
  background: #fff0c7;
  color: #d59a00;
}

.todo-table__status--approved {
  background: #d9f4dd;
  color: #2f9f46;
}

.todo-table__status--rejected {
  background: #ffdede;
  color: #d53535;
}

.todo-page__footer-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin: 30px 82px 0;
}

.todo-page__record-count {
  color: #555555;
  font-size: 11px;
}

.todo-page__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 30px;
}

.todo-page__pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo-page__page,
.todo-page__page-nav {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 7px;
  background: #ffffff;
  color: #666666;
  font-size: 14px;
}

.todo-page__page-nav {
  background: #f8dbe6;
  color: #a60a3a;
}

.todo-page__page.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.todo-page__export {
  min-width: 156px;
  height: 44px;
  border: 0;
  border-radius: 7px;
  background: #f8dbe6;
  color: #a60a3a;
  font-size: 13px;
  font-weight: 700;
}

.todo-page__copyright {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.2;
}
</style>
