import { proxyRequest } from '~/server/utils/requestProxy'
import type { CurrentWorkflowOperatorsApiResponse, CurrentWorkflowOperatorsProxyResponse } from '~/types/todo'

export default defineEventHandler(async (event): Promise<CurrentWorkflowOperatorsApiResponse> => {
  try {
    const query = getQuery(event)
    const requestId = String(query.requestId ?? query.requestid ?? '').trim()

    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current workflow requestId is required',
      })
    }

    const response = await proxyRequest<CurrentWorkflowOperatorsProxyResponse>(event, `/api/r/internal/ecology_oa/workflow_detail/getRequestOperatorInfo?requestId=${encodeURIComponent(requestId)}`, {
      method: 'GET',
      errorMessage: 'Current workflow operator API failed',
    })

    return {
      success: true,
      data: response.data,
    }
  }
  catch (error: any) {
    console.error('Current workflow operator API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Current workflow operator API failed',
      data: error?.data,
    })
  }
})
