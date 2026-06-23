import { defineStore } from 'pinia'
import type {
  ApproveWorkflowRequestApiResponse,
  ApproveWorkflowRequestPayload,
  CurrentWorkflowOperator,
  CurrentWorkflowOperatorsApiResponse,
  RejectWorkflowRequestApiResponse,
  TodoListApiResponse,
  TodoListFetchOptions,
  TodoListKey,
  TodoListResponseField,
  WorkflowFormApiResponse,
  WorkflowFormAttachment,
  WorkflowFormAttachmentsApiResponse,
  WorkflowFormDetail,
  WorkflowFormFetchOptions,
  WorkflowFormWeaverUrl,
  WorkflowFormWeaverUrlApiResponse,
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

export const useTodosStore = defineStore('todos', () => {
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
  const workflowForms = reactive<Record<string, WorkflowFormDetail>>({})
  const workflowFormLoadingById = reactive<Record<string, boolean>>({})
  const workflowFormErrorById = reactive<Record<string, string | null>>({})
  const workflowFormAttachments = reactive<Record<string, WorkflowFormAttachment[]>>({})
  const workflowFormAttachmentsLoadingById = reactive<Record<string, boolean>>({})
  const workflowFormAttachmentsErrorById = reactive<Record<string, string | null>>({})
  const workflowFormWeaverUrls = reactive<Record<string, WorkflowFormWeaverUrl>>({})
  const workflowFormWeaverUrlLoadingById = reactive<Record<string, boolean>>({})
  const workflowFormWeaverUrlErrorById = reactive<Record<string, string | null>>({})
  const currentWorkflowOperators = reactive<Record<string, CurrentWorkflowOperator[]>>({})
  const currentWorkflowOperatorsLoadingById = reactive<Record<string, boolean>>({})
  const currentWorkflowOperatorsErrorById = reactive<Record<string, string | null>>({})
  const workflowActionLoadingById = reactive<Record<string, boolean>>({})
  const workflowActionErrorById = reactive<Record<string, string | null>>({})

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

  const fetchWorkflowForm = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = String(requestId || '').trim()
    if (!normalizedRequestId) {
      return null
    }

    if (!options.force && workflowForms[normalizedRequestId]) {
      return workflowForms[normalizedRequestId]
    }

    workflowFormLoadingById[normalizedRequestId] = true
    workflowFormErrorById[normalizedRequestId] = null

    try {
      const response = await $fetch<WorkflowFormApiResponse>('/api/todos/workflowForm', {
        method: 'POST',
        body: {
          requestid: normalizedRequestId,
        },
      })
      const form = response.data

      if (form) {
        workflowForms[normalizedRequestId] = form
      }

      return form
    }
    catch (error) {
      workflowFormErrorById[normalizedRequestId] = getErrorMessage(error)
      throw error
    }
    finally {
      workflowFormLoadingById[normalizedRequestId] = false
    }
  }

  const fetchCurrentWorkflowOperators = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = String(requestId || '').trim()
    if (!normalizedRequestId) {
      return []
    }

    if (!options.force && currentWorkflowOperators[normalizedRequestId]) {
      return currentWorkflowOperators[normalizedRequestId]
    }

    currentWorkflowOperatorsLoadingById[normalizedRequestId] = true
    currentWorkflowOperatorsErrorById[normalizedRequestId] = null

    try {
      const response = await $fetch<CurrentWorkflowOperatorsApiResponse>('/api/todos/currentWorkflowOperators', {
        method: 'GET',
        query: {
          requestId: normalizedRequestId,
        },
      })
      currentWorkflowOperators[normalizedRequestId] = response.data

      return response.data
    }
    catch (error) {
      currentWorkflowOperatorsErrorById[normalizedRequestId] = getErrorMessage(error)
      throw error
    }
    finally {
      currentWorkflowOperatorsLoadingById[normalizedRequestId] = false
    }
  }

  const fetchWorkflowFormAttachments = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = String(requestId || '').trim()
    if (!normalizedRequestId) {
      return []
    }

    if (!options.force && workflowFormAttachments[normalizedRequestId]) {
      return workflowFormAttachments[normalizedRequestId]
    }

    workflowFormAttachmentsLoadingById[normalizedRequestId] = true
    workflowFormAttachmentsErrorById[normalizedRequestId] = null

    try {
      const response = await $fetch<WorkflowFormAttachmentsApiResponse>('/api/todos/workflowFormAttachments', {
        method: 'POST',
        body: {
          requestid: normalizedRequestId,
        },
      })
      workflowFormAttachments[normalizedRequestId] = response.data

      return response.data
    }
    catch (error) {
      workflowFormAttachmentsErrorById[normalizedRequestId] = getErrorMessage(error)
      throw error
    }
    finally {
      workflowFormAttachmentsLoadingById[normalizedRequestId] = false
    }
  }

  const fetchWorkflowFormWeaverUrl = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = String(requestId || '').trim()
    if (!normalizedRequestId) {
      return null
    }

    if (!options.force && workflowFormWeaverUrls[normalizedRequestId]) {
      return workflowFormWeaverUrls[normalizedRequestId]
    }

    workflowFormWeaverUrlLoadingById[normalizedRequestId] = true
    workflowFormWeaverUrlErrorById[normalizedRequestId] = null

    try {
      const response = await $fetch<WorkflowFormWeaverUrlApiResponse>('/api/todos/workflowFormWeaverUrl', {
        method: 'GET',
        query: {
          requestId: normalizedRequestId,
        },
      })
      workflowFormWeaverUrls[normalizedRequestId] = response.data

      return response.data
    }
    catch (error) {
      workflowFormWeaverUrlErrorById[normalizedRequestId] = getErrorMessage(error)
      throw error
    }
    finally {
      workflowFormWeaverUrlLoadingById[normalizedRequestId] = false
    }
  }

  const approveWorkflowRequest = async (payload: ApproveWorkflowRequestPayload) => {
    const normalizedRequestId = String(payload.requestId || '').trim()
    if (!normalizedRequestId) {
      return null
    }

    workflowActionLoadingById[normalizedRequestId] = true
    workflowActionErrorById[normalizedRequestId] = null

    try {
      const response = await $fetch<ApproveWorkflowRequestApiResponse>('/api/todos/approveRequest', {
        method: 'POST',
        body: {
          requestId: normalizedRequestId,
          nodeId: payload.nodeId,
          workflowId: payload.workflowId,
          remark: payload.remark || '',
        },
      })

      return response.data
    }
    catch (error) {
      workflowActionErrorById[normalizedRequestId] = getErrorMessage(error)
      throw error
    }
    finally {
      workflowActionLoadingById[normalizedRequestId] = false
    }
  }

  const rejectWorkflowRequest = async (requestId: string | number) => {
    const normalizedRequestId = String(requestId || '').trim()
    if (!normalizedRequestId) {
      return null
    }

    workflowActionLoadingById[normalizedRequestId] = true
    workflowActionErrorById[normalizedRequestId] = null

    try {
      const response = await $fetch<RejectWorkflowRequestApiResponse>('/api/todos/rejectRequest', {
        method: 'POST',
        body: {
          requestId: normalizedRequestId,
        },
      })

      return response.data
    }
    catch (error) {
      workflowActionErrorById[normalizedRequestId] = getErrorMessage(error)
      throw error
    }
    finally {
      workflowActionLoadingById[normalizedRequestId] = false
    }
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
    approveWorkflowRequest,
    clearTodoLists,
    currentWorkflowOperators,
    currentWorkflowOperatorsErrorById,
    currentWorkflowOperatorsLoadingById,
    errorByList,
    fetchAllTodoLists,
    fetchCurrentWorkflowOperators,
    fetchTodoList,
    fetchWorkflowForm,
    fetchWorkflowFormAttachments,
    fetchWorkflowFormWeaverUrl,
    loadedByList,
    loadingByList,
    rejectWorkflowRequest,
    selectTodoList,
    setActiveListKey,
    todoLists,
    workflowFormAttachments,
    workflowFormAttachmentsErrorById,
    workflowFormAttachmentsLoadingById,
    workflowFormErrorById,
    workflowFormLoadingById,
    workflowFormWeaverUrlErrorById,
    workflowFormWeaverUrlLoadingById,
    workflowFormWeaverUrls,
    workflowForms,
    workflowActionErrorById,
    workflowActionLoadingById,
  }
})
