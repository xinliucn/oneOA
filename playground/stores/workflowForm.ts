/**
 * Pinia store for workflow form detail, attachments, Weaver URL, and operators.
 * Each entity has its own data cache + loading/error per requestId.
 *
 * Split from the monolithic useTodosStore for single-responsibility.
 */
import { defineStore } from 'pinia'
import type {
  CurrentWorkflowOperator,
  CurrentWorkflowOperatorsApiResponse,
  WorkflowFormApiResponse,
  WorkflowFormAttachment,
  WorkflowFormAttachmentsApiResponse,
  WorkflowFormDetail,
  WorkflowFormFetchOptions,
  WorkflowFormWeaverUrl,
  WorkflowFormWeaverUrlApiResponse,
} from '~/types/todo'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Fetch todo list failed'
}

const normalizeRequestId = (requestId: string | number) => String(requestId || '').trim()

export const useWorkflowFormStore = defineStore('workflowForm', () => {
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

  // ---- Workflow Form ----

  const fetchWorkflowForm = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = normalizeRequestId(requestId)
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

  // ---- Current Workflow Operators ----

  const fetchCurrentWorkflowOperators = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = normalizeRequestId(requestId)
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

  // ---- Workflow Form Attachments ----

  const fetchWorkflowFormAttachments = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = normalizeRequestId(requestId)
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

  // ---- Workflow Form Weaver URL ----

  const fetchWorkflowFormWeaverUrl = async (requestId: string | number, options: WorkflowFormFetchOptions = {}) => {
    const normalizedRequestId = normalizeRequestId(requestId)
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

  return {
    currentWorkflowOperators,
    currentWorkflowOperatorsErrorById,
    currentWorkflowOperatorsLoadingById,
    fetchCurrentWorkflowOperators,
    fetchWorkflowForm,
    fetchWorkflowFormAttachments,
    fetchWorkflowFormWeaverUrl,
    workflowFormAttachments,
    workflowFormAttachmentsErrorById,
    workflowFormAttachmentsLoadingById,
    workflowFormErrorById,
    workflowFormLoadingById,
    workflowFormWeaverUrlErrorById,
    workflowFormWeaverUrlLoadingById,
    workflowFormWeaverUrls,
    workflowForms,
  }
})
