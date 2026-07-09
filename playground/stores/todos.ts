/**
 * Backward-compatible facade over the three split stores.
 *
 * Previously a monolithic 387-line, 33-return-value store.
 * Now delegates to:
 *   - useTodoListStore     → lists, active key, fetch, loading
 *   - useWorkflowFormStore → workflow forms, attachments, weaver URLs, operators
 *   - useWorkflowActionStore → approve / reject
 *
 * All call sites continue to use `useTodosStore()` without changes.
 */
import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', () => {
  const todoListStore = useTodoListStore()
  const workflowFormStore = useWorkflowFormStore()
  const workflowActionStore = useWorkflowActionStore()

  return {
    // --- todo list ---
    activeError: todoListStore.activeError,
    activeListKey: todoListStore.activeListKey,
    activeLoading: todoListStore.activeLoading,
    activeTodoList: todoListStore.activeTodoList,
    clearTodoLists: todoListStore.clearTodoLists,
    errorByList: todoListStore.errorByList,
    fetchAllTodoLists: todoListStore.fetchAllTodoLists,
    fetchTodoList: todoListStore.fetchTodoList,
    loadedByList: todoListStore.loadedByList,
    loadingByList: todoListStore.loadingByList,
    selectTodoList: todoListStore.selectTodoList,
    setActiveListKey: todoListStore.setActiveListKey,
    todoLists: todoListStore.todoLists,

    // --- workflow form / attachments / weaver url / operators ---
    currentWorkflowOperators: workflowFormStore.currentWorkflowOperators,
    currentWorkflowOperatorsErrorById: workflowFormStore.currentWorkflowOperatorsErrorById,
    currentWorkflowOperatorsLoadingById: workflowFormStore.currentWorkflowOperatorsLoadingById,
    fetchCurrentWorkflowOperators: workflowFormStore.fetchCurrentWorkflowOperators,
    fetchWorkflowForm: workflowFormStore.fetchWorkflowForm,
    fetchWorkflowFormAttachments: workflowFormStore.fetchWorkflowFormAttachments,
    fetchWorkflowFormWeaverUrl: workflowFormStore.fetchWorkflowFormWeaverUrl,
    workflowFormAttachments: workflowFormStore.workflowFormAttachments,
    workflowFormAttachmentsErrorById: workflowFormStore.workflowFormAttachmentsErrorById,
    workflowFormAttachmentsLoadingById: workflowFormStore.workflowFormAttachmentsLoadingById,
    workflowFormErrorById: workflowFormStore.workflowFormErrorById,
    workflowFormLoadingById: workflowFormStore.workflowFormLoadingById,
    workflowFormWeaverUrlErrorById: workflowFormStore.workflowFormWeaverUrlErrorById,
    workflowFormWeaverUrlLoadingById: workflowFormStore.workflowFormWeaverUrlLoadingById,
    workflowFormWeaverUrls: workflowFormStore.workflowFormWeaverUrls,
    workflowForms: workflowFormStore.workflowForms,

    // --- workflow actions (approve / reject) ---
    approveWorkflowRequest: workflowActionStore.approveWorkflowRequest,
    rejectWorkflowRequest: workflowActionStore.rejectWorkflowRequest,
    workflowActionErrorById: workflowActionStore.workflowActionErrorById,
    workflowActionLoadingById: workflowActionStore.workflowActionLoadingById,
  }
})
