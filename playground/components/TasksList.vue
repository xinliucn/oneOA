<template>
  <div class="tasks-list">
    <div class="tasks-list__header">
      <h3 class="tasks-list__title">
        {{ t('tasks.title') }}
      </h3>
      <IconCustom
        name="rightArrowIcon"
        color="#A60A3A"
      />
    </div>
    <div class="tasks-list__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tasks-list__items">
      <div
        v-if="loading && visibleTasks.length === 0"
        class="tasks-list__state"
      >
        {{ t('mobile.todo.states.loadingScreen', { view: activeTabLabel }) }}
      </div>
      <div
        v-else-if="!loading && visibleTasks.length === 0"
        class="tasks-list__state"
      >
        {{ t('mobile.todo.states.empty') }}
      </div>
      <template v-else>
        <div
          v-for="task in visibleTasks"
          :key="task.id"
          class="task-item"
          @click="handleClick(task)"
        >
          <div class="task-item__content">
            <div class="task-item__meta">
              <span class="task-item__code">{{ task.reference }}</span>
              <span
                class="task-item__status"
                :class="task.statusClass"
              >
                {{ task.statusLabel }}
              </span>
            </div>
            <div class="task-item__title">
              {{ task.title }}
            </div>
            <div class="task-item__subtitle">
              <span>{{ task.submitter }}</span>
              <span v-if="task.workflowName">
                via
              </span>
              <span
                v-if="task.workflowName"
                class="task-item__workflow"
              >
                {{ task.workflowName }}
              </span>
            </div>
          </div>
          <div class="task-item__right">
            <div class="task-item__date">
              {{ task.date }}
            </div>
            <IconCustom
              name="chevron-right"
              :size="24"
              class="task-item__arrow"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { TodoView } from '~/composables/useToDoData'

const { list, loading, fetchByView } = useToDoData()
const toDoFrom = useState<unknown>('mobile:todo-form', () => null)
const { t } = useAppI18n()
const { addRecentItem } = useRecentItems('desktop')

type TodoRecord = Record<string, unknown>

type DisplayTask = {
  id: string
  reference: string
  statusLabel: string
  statusClass: string
  title: string
  submitter: string
  workflowName: string
  date: string
  raw: unknown
}

type DesktopTodoView = TodoView | 'watchlist'

const activeTab = ref<DesktopTodoView>('approvals')

const tabs = computed(() => [
  { label: t('tasks.tabs.approval'), value: 'approvals' as const },
  { label: t('tasks.tabs.requests'), value: 'requests' as const },
  { label: t('tasks.tabs.tasks'), value: 'tasks' as const },
  { label: t('tasks.tabs.watchlist'), value: 'watchlist' as const },
])

const activeTabLabel = computed(() => {
  return tabs.value.find(tab => tab.value === activeTab.value)?.label || ''
})

const isRecord = (value: unknown): value is TodoRecord => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const getStringValue = (record: TodoRecord, key: string) => {
  const value = record[key]
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim()
  }

  return ''
}

const getNestedStringValue = (record: TodoRecord, parentKey: string, key: string) => {
  const parent = record[parentKey]
  if (!isRecord(parent)) {
    return ''
  }

  return getStringValue(parent, key)
}

const getTaskReference = (task: TodoRecord) => {
  return getStringValue(task, 'requestmark')
    || getStringValue(task, 'requestId')
    || getStringValue(task, 'referenceNo')
    || getStringValue(task, 'code')
    || getStringValue(task, 'id')
}

const getTaskStatus = (task: TodoRecord) => {
  return getStringValue(task, 'status')
    || getStringValue(task, 'currentNodeName')
    || t('tasks.status.pending')
}

const getTaskStatusClass = (status: string) => {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus.includes('reject')) {
    return 'status-rejected'
  }

  if (normalizedStatus.includes('approv') || normalizedStatus.includes('complete')) {
    return 'status-approved'
  }

  return 'status-pending'
}

const visibleTasks = computed<DisplayTask[]>(() => {
  if (activeTab.value === 'watchlist') {
    return []
  }

  return list.value.slice(0, 5).map((item, index) => {
    const task = isRecord(item) ? item : {}
    const statusLabel = getTaskStatus(task)
    const workflowName = getNestedStringValue(task, 'workflowBaseInfo', 'workflowName')

    return {
      id: getStringValue(task, 'id') || getStringValue(task, 'requestId') || String(index),
      reference: getTaskReference(task),
      statusLabel,
      statusClass: getTaskStatusClass(statusLabel),
      title: getStringValue(task, 'requestName') || getStringValue(task, 'title') || '-',
      submitter: getStringValue(task, 'creatorName') || getStringValue(task, 'submittedBy'),
      workflowName,
      date: formatTaskDate(getStringValue(task, 'createTime') || getStringValue(task, 'date')),
      raw: item,
    }
  })
})

const formatTaskDate = (date: string) => {
  return date.length > 10 ? date.slice(0, 10) : date
}

const handleClick = (task: DisplayTask) => {
  toDoFrom.value = task.raw

  const rawTask = isRecord(task.raw) ? task.raw : {}
  const requestId = getStringValue(rawTask, 'requestId') || getStringValue(rawTask, 'id') || task.reference
  const targetId = task.reference || requestId

  if (!targetId) {
    return
  }

  addRecentItem({
    id: `todo:${targetId}`,
    type: 'todo',
    label: task.title,
    subtitle: activeTabLabel.value,
    icon: 'todo',
    path: `/desktop/todo/${encodeURIComponent(targetId)}`,
  })

  return navigateTo({
    path: `/desktop/todo/${encodeURIComponent(targetId)}`,
    query: {
      requestId: requestId || targetId,
    },
  })
}

watch(
  activeTab,
  async (view) => {
    if (view === 'watchlist') {
      return
    }

    await fetchByView(view)
  },
  { immediate: true },
)
</script>

<style scoped>
.tasks-list {
  background: white;
  padding: 0;
  border-left: 0;
  width: 504px;
  min-width: 0;
}

.tasks-list__header {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 2px;
  height: 34px;
  margin-bottom: 23px;
  padding-bottom: 23px;
  border-bottom: 1px solid #E0E0E0;
}

.tasks-list__title {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.2;
  margin: 0;
}

.tasks-list__tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  overflow-x: auto;
}

.tasks-list__tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex: 0 0 auto;
  border: 1px solid #D9D9D9;
  padding: 0 11px;
  background: #FFFFFF;
  color: #666666;
  font-family: Source Sans Pro;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  height: 28px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
}

.tab-btn.active {
  border-color: #A60A3A;
  background: #A60A3A;
  color: #FFFFFF;
  font-weight: 500;
}

.tasks-list__items {
  height: 392px;
  overflow-y: auto;
  border: 1px solid #E0E0E0;
  background: #FFFFFF;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tasks-list__items::-webkit-scrollbar {
  display: none;
}

.tasks-list__state {
  padding: 24px 0;
  color: #999999;
  font-size: 13px;
  text-align: center;
}

.task-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  align-items: center;
  min-height: 78px;
  padding: 12px 14px 11px;
  border-bottom: 1px solid #E0E0E0;
  cursor: pointer;
  gap: 16px;
}

.task-item:nth-child(odd) {
  background: #F8F8F8;
}

.task-item:nth-child(even) {
  background: #FFFFFF;
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
  gap: 3px;
  margin-bottom: 4px;
  min-width: 0;
}

.task-item__code {
  min-width: 0;
  overflow: hidden;
  color: #000000;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-item__status {
  flex: 0 0 auto;
  padding: 0;
  border-radius: 0;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.status-pending {
  color: #F57C00;
}

.status-approved {
  color: #2E7D32;
}

.status-rejected {
  color: #C62828;
}

.task-item__title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  line-height: 1.1;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-item__subtitle {
  color: #000000;
  font-size: 9px;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-item__subtitle span + span {
  margin-left: 3px;
}

.task-item__workflow {
  color: #A60A3A;
  font-weight: 700;
}

.task-item__right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.task-item__date {
  flex: 1;
  min-width: 0;
  color: #9AA1A8;
  font-size: 12px;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-item__arrow {
  flex: 0 0 auto;
  color: #A60A3A;
}
</style>
