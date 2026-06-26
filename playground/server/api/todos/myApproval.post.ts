import { proxyRequest } from '~/server/utils/requestProxy'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event).catch(() => ({}))
  const payload = isRecord(body) ? body : {}

  try {
    const response = await proxyRequest<Record<string, unknown>>(event, '/api/r/internal/ecology_oa/workflow_approval', {
      method: 'POST',
      body: {
        pageNo: payload.pageNo ?? payload.pageNum ?? 1,
        pageSize: payload.pageSize ?? 10,
        otherParams: {
          ...(isRecord(payload.otherParams) ? payload.otherParams : {}),
          is_handled: false,
        },
      },
      errorMessage: 'Fetch my approval list failed',
    })

    return {
      success: true,
      data: response,
    }
  }
  catch (error: any) {
    console.error('My approval list API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Fetch my approval list failed',
      data: error?.data,
    })
  }
})
