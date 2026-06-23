import { proxyRequest } from '~/server/utils/requestProxy'
import type { RejectWorkflowRequestApiResponse, RejectWorkflowRequestProxyResponse } from '~/types/todo'

export default defineEventHandler(async (event): Promise<RejectWorkflowRequestApiResponse> => {
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const requestId = String(body.requestId ?? body.requestid ?? '').trim()

    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Reject requestId is required',
      })
    }

    const response = await proxyRequest<RejectWorkflowRequestProxyResponse>(event, '/api/r/internal/ecology_oa/workflow_action/rejectRequest', {
      method: 'POST',
      body: {
        requestId,
      },
      errorMessage: 'Reject workflow request API failed',
    })

    return {
      success: response.code === 'SUCCESS',
      data: response,
    }
  }
  catch (error: any) {
    console.error('Reject workflow request API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Reject workflow request API failed',
      data: error?.data,
    })
  }
})
