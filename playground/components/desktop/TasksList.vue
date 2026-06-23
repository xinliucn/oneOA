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
        :class="['tab-btn', { active: todosStore.activeListKey === tab.value }]"
        @click="selectTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tasks-list__items">
      <div
        v-if="loading && todosStore.activeTodoList.length === 0"
        class="tasks-list__state"
      >
        {{ t('mobile.todo.states.loadingScreen', { view: activeTabLabel }) }}
      </div>
      <div
        v-else-if="!loading && todosStore.activeTodoList.length === 0"
        class="tasks-list__state"
      >
        {{ t('mobile.todo.states.empty') }}
      </div>
      <template v-else>
        <div
          v-for="task in todosStore.activeTodoList"
          :key="task.cid || task.requestId"
          class="task-item"
          @click="handleClick(task)"
        >
          <div class="task-item__content">
            <div class="task-item__meta">
              <span class="task-item__code">{{ getTaskReference(task) }}</span>
              <span
                class="task-item__status"
                :class="getTaskStatusClass(getTaskStatus(task))"
              >
                {{ getTaskStatus(task) }}
              </span>
            </div>
            <div class="task-item__title">
              {{ formatRequestName(task.requestName) || '-' }}
            </div>
            <div class="task-item__subtitle">
              <span>{{ task.creatorName }}</span>
              <span v-if="task.workflowBaseInfo?.workflowName">
                via
              </span>
              <span
                v-if="task.workflowBaseInfo?.workflowName"
                class="task-item__workflow"
              >
                {{ task.workflowBaseInfo.workflowName }}
              </span>
            </div>
          </div>
          <div class="task-item__right">
            <div class="task-item__date">
              {{ formatTaskDate(task.createTime) }}
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
import { computed, onMounted } from 'vue'
import type { TodoListKey, WorkflowTodoItem } from '~/types/todo'
import { formatRequestName } from '~/utils/todo'

const { t } = useAppI18n()
const todosStore = useTodosStore()
const activeTodo = useState<WorkflowTodoItem | null>('desktop:todo:active', () => null)
const legacyTodoForm = useState<WorkflowTodoItem | null>('mobile:todo-form', () => null)
const { addRecentItem } = useRecentItems('desktop')

const tabs = computed(() => [
  { label: t('tasks.tabs.approval'), value: 'myApproval' as const },
  { label: t('tasks.tabs.requests'), value: 'myRequests' as const },
  { label: t('tasks.tabs.tasks'), value: 'myTasks' as const },
  { label: t('tasks.tabs.approved'), value: 'approved' as const },
])

const activeTabLabel = computed(() => {
  return tabs.value.find(tab => tab.value === todosStore.activeListKey)?.label || ''
})

const loading = computed(() => todosStore.activeLoading)

const getTaskReference = (task: WorkflowTodoItem) => {
  return task.requestmark || task.requestId || task.cid
}

const getTaskStatus = (task: WorkflowTodoItem) => {
  return task.status
    || task.currentNodeName
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

const formatTaskDate = (date: string) => {
  return date.length > 10 ? date.slice(0, 10) : date
}

const handleClick = (task: WorkflowTodoItem) => {
  activeTodo.value = task
  legacyTodoForm.value = task

  if (!task.requestId) {
    return
  }

  addRecentItem({
    id: `todo:${task.requestId}`,
    type: 'todo',
    label: formatRequestName(task.requestName) || '-',
    subtitle: activeTabLabel.value,
    icon: 'todo',
    path: `/desktop/todo/${encodeURIComponent(task.requestId)}`,
  })

  return navigateTo({
    path: `/desktop/todo/${encodeURIComponent(task.requestId)}`,
    query: {
      requestId: task.requestId,
    },
  })
}

const selectTab = (listKey: TodoListKey) => {
  void todosStore.selectTodoList(listKey, { query: { pageSize: 100 } })
}

onMounted(() => {
  void todosStore.selectTodoList('myApproval', { query: { pageSize: 100 } })
})
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
