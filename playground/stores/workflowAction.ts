/**
 * Pinia store for workflow approval/rejection actions.
 *
 * Split from the monolithic useTodosStore — single responsibility:
 * approve and reject workflow requests.
 */
import { defineStore } from 'pinia'
import type {
  ApproveWorkflowRequestApiResponse,
  ApproveWorkflowRequestPayload,
  RejectWorkflowRequestApiResponse,
} from '~/types/todo'

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Workflow action failed'
}

export const useWorkflowActionStore = defineStore('workflowActions', () => {
  const workflowActionLoadingById = reactive<Record<string, boolean>>({})
  const workflowActionErrorById = reactive<Record<string, string | null>>({})

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

  return {
    approveWorkflowRequest,
    rejectWorkflowRequest,
    workflowActionErrorById,
    workflowActionLoadingById,
  }
})
