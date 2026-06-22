import { proxyRequest } from '~/server/utils/requestProxy'
import type { WorkflowFormAttachmentsApiResponse, WorkflowFormAttachmentsProxyResponse } from '~/types/todo'

export default defineEventHandler(async (event): Promise<WorkflowFormAttachmentsApiResponse> => {
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const requestid = String(body.requestid ?? body.requestId ?? '').trim()

    if (!requestid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workflow form attachments requestid is required',
      })
    }

    const response = await proxyRequest<WorkflowFormAttachmentsProxyResponse>(event, '/api/r/internal/ecology_oa/workflow_form_attachments', {
      method: 'POST',
      body: {
        requestid,
      },
      errorMessage: 'Workflow form attachments API failed',
    })

    return {
      success: true,
      data: response.data,
    }
  }
  catch (error: any) {
    console.error('Workflow form attachments API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Workflow form attachments API failed',
      data: error?.data,
    })
  }
})
