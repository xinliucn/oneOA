import { proxyRequest } from '~/server/utils/requestProxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
  const requestId = body.requestId ?? body.requestid

  if (config.mockEnabled) {
    return {
      code: 'SUCCESS',
      data: {
        requestId: requestId || '506898',
        status: 'Rejected',
      },
      errMsg: {},
    }
  }

  try {
    return await proxyRequest<Record<string, any>>(event, '/api/r/internal/ecology_oa/workflow_action/rejectRequest', {
      method: 'POST',
      body: {
        requestId,
      },
      errorMessage: 'Reject request API failed',
    })
  }
  catch (error: any) {
    const errorRecord = error && typeof error === 'object' ? error as Record<string, any> : {}
    const statusCode = Number(errorRecord.statusCode || errorRecord.status) || 500
    const statusMessage = typeof errorRecord.statusMessage === 'string'
      ? errorRecord.statusMessage
      : typeof errorRecord.message === 'string'
        ? errorRecord.message
        : 'Reject request API failed'

    console.error('Reject request API error:', {
      statusCode,
      statusMessage,
      data: errorRecord.data,
    })

    throw createError({
      statusCode,
      statusMessage,
      data: errorRecord.data,
    })
  }
})
