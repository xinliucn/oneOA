/**
 * Pinia store for todo list management only.
 * Handles: active list key, list data, loading/loaded/error per list, fetch/select.
 *
 * Separate from workflow form, attachment, weaver URL, and approval action stores.
 */
import { defineStore } from 'pinia'
import type {
  TodoListApiResponse,
  TodoListFetchOptions,
  TodoListKey,
  TodoListResponseField,
  WorkflowTodoList,
} from '~/types/todo'

const todoListEndpoints: Record<TodoListKey, string> = {
  myApproval: '/api/todos/myApproval',
  myRequests: '/api/todos/myRequests',
  myTasks: '/api/todos/myTasks',
  approved: '/api/todos/approved',
}

const todoListResponseFields: Record<TodoListKey, TodoListResponseField> = {
  myApproval: 'myApprovalList',
  myRequests: 'myRequestList',
  myTasks: 'myTaskList',
  approved: 'approvedList',
}

const createTodoListRecord = <T>(value: T): Record<TodoListKey, T> => ({
  myApproval: value,
  myRequests: value,
  myTasks: value,
  approved: value,
})

const getTodoListFromResponse = (
  response: TodoListApiResponse | WorkflowTodoList,
  field: TodoListResponseField,
): WorkflowTodoList => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response[field])) {
    return response[field]
  }

  if (Array.isArray(response.data)) {
    return response.data
  }

  if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
    return response.data.data
  }

  return []
}

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Fetch todo list failed'
}

export const useTodoListStore = defineStore('todoLists', () => {
  const activeListKey = ref<TodoListKey>('myApproval')
  const todoLists = reactive<Record<TodoListKey, WorkflowTodoList>>({
    myApproval: [],
    myRequests: [],
    myTasks: [],
    approved: [],
  })
  const loadingByList = reactive(createTodoListRecord(false))
  const loadedByList = reactive(createTodoListRecord(false))
  const errorByList = reactive<Record<TodoListKey, string | null>>(createTodoListRecord<string | null>(null))

  const activeTodoList = computed(() => todoLists[activeListKey.value])
  const activeLoading = computed(() => loadingByList[activeListKey.value])
  const activeError = computed(() => errorByList[activeListKey.value])

  const setActiveListKey = (listKey: TodoListKey) => {
    activeListKey.value = listKey
  }

  const fetchTodoList = async (listKey: TodoListKey = activeListKey.value, options: TodoListFetchOptions = {}) => {
    if (!options.force && loadedByList[listKey]) {
      return todoLists[listKey]
    }

    loadingByList[listKey] = true
    errorByList[listKey] = null

    try {
      const response = await $fetch<TodoListApiResponse | WorkflowTodoList>(todoListEndpoints[listKey], {
        method: 'POST',
        body: options.query ?? {},
      })
      const list = getTodoListFromResponse(response, todoListResponseFields[listKey])
      todoLists[listKey] = list
      loadedByList[listKey] = true

      return list
    }
    catch (error) {
      errorByList[listKey] = getErrorMessage(error)
      throw error
    }
    finally {
      loadingByList[listKey] = false
    }
  }

  const selectTodoList = async (listKey: TodoListKey, options: TodoListFetchOptions = {}) => {
    setActiveListKey(listKey)
    return await fetchTodoList(listKey, options)
  }

  const fetchAllTodoLists = async (options: TodoListFetchOptions = {}) => {
    return await Promise.all(
      (Object.keys(todoListEndpoints) as TodoListKey[]).map(listKey => fetchTodoList(listKey, options)),
    )
  }

  const clearTodoLists = () => {
    const listKeys = Object.keys(todoLists) as TodoListKey[]

    listKeys.forEach((listKey) => {
      todoLists[listKey] = []
      loadedByList[listKey] = false
      errorByList[listKey] = null
    })
  }

  return {
    activeError,
    activeListKey,
    activeLoading,
    activeTodoList,
    clearTodoLists,
    errorByList,
    fetchAllTodoLists,
    fetchTodoList,
    loadedByList,
    loadingByList,
    selectTodoList,
    setActiveListKey,
    todoLists,
  }
})
