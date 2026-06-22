import { proxyRequest } from '~/server/utils/requestProxy'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event).catch(() => ({}))
  const payload = isRecord(body) ? body : {}

  try {
    const response = await proxyRequest<Record<string, unknown>>(event, '/api/r/internal/ecology_oa/workflow_todo', {
      method: 'POST',
      body: {
        pageNo: payload.pageNo ?? payload.pageNum ?? 1,
        pageSize: payload.pageSize ?? 100,
        conditions: {
          ...(isRecord(payload.conditions) ? payload.conditions : {}),
          nodetype: '2',
        },
        otherParams: {
          ...(isRecord(payload.otherParams) ? payload.otherParams : {}),
          ismonitor: '1',
        },
      },
      errorMessage: 'Fetch my tasks failed',
    })

    return {
      success: true,
      data: response
    }
  }
  catch (error: any) {
    console.error('My tasks list API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Fetch my tasks failed',
      data: error?.data,
    })
  }
})
