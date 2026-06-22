import { proxyRequest } from '~/server/utils/requestProxy'
import type { WorkflowFormWeaverUrl, WorkflowFormWeaverUrlApiResponse } from '~/types/todo'

export default defineEventHandler(async (event): Promise<WorkflowFormWeaverUrlApiResponse> => {
  try {
    const query = getQuery(event)
    const requestId = String(query.requestId ?? query.requestid ?? '').trim()

    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workflow form weaver url requestId is required',
      })
    }

    const data = await proxyRequest<WorkflowFormWeaverUrl>(event, `/api/r/internal/ecology_oa/workflow_form/weaver_url?requestid=${encodeURIComponent(requestId)}`, {
      method: 'GET',
      errorMessage: 'Workflow form weaver url API failed',
    })

    return {
      success: true,
      data,
    }
  }
  catch (error: any) {
    console.error('Workflow form weaver url API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Workflow form weaver url API failed',
      data: error?.data,
    })
  }
})
