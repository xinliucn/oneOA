import { proxyRequest } from '~/server/utils/requestProxy'
import type {
  ApproveWorkflowRequestApiResponse,
  ApproveWorkflowRequestPayload,
  ApproveWorkflowRequestProxyResponse,
} from '~/types/todo'

export default defineEventHandler(async (event): Promise<ApproveWorkflowRequestApiResponse> => {
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const payload: ApproveWorkflowRequestPayload = {
      requestId: String(body.requestId ?? body.requestid ?? '').trim(),
      nodeId: String(body.nodeId ?? body.nodeid ?? '').trim(),
      workflowId: String(body.workflowId ?? body.workflowid ?? '').trim(),
      remark: String(body.remark ?? '').trim(),
    }

    if (!payload.requestId || !payload.nodeId || !payload.workflowId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Approve requestId, nodeId and workflowId are required',
      })
    }

    const response = await proxyRequest<ApproveWorkflowRequestProxyResponse>(event, '/api/r/internal/ecology_oa/workflow_form_action', {
      method: 'POST',
      body: {
        requestId: payload.requestId,
        nodeId: payload.nodeId,
        workflowId: payload.workflowId,
        remark: payload.remark,
      },
      errorMessage: 'Approve workflow request API failed',
    })

    return {
      success: response.code === 'SUCCESS',
      data: response,
    }
  }
  catch (error: any) {
    console.error('Approve workflow request API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Approve workflow request API failed',
      data: error?.data,
    })
  }
})
