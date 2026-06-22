import { proxyRequest } from '~/server/utils/requestProxy'
import type { WorkflowFormApiResponse, WorkflowFormDetail } from '~/types/todo'

export default defineEventHandler(async (event): Promise<WorkflowFormApiResponse> => {
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const requestid = String(body.requestid ?? body.requestId ?? '').trim()

    if (!requestid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workflow form requestid is required',
      })
    }

    const response = await proxyRequest<WorkflowFormDetail>(event, '/api/r/internal/ecology_oa/workflow_form', {
      method: 'POST',
      body: {
        requestid,
      },
      errorMessage: 'Workflow form API failed',
    })

    return {
      success: true,
      data: response,
    }
  }
  catch (error: any) {
    console.error('Workflow form API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Workflow form API failed',
      data: error?.data,
    })
  }
},
)
