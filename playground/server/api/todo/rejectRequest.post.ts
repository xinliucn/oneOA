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
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/workflow_action/rejectRequest`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: {
        requestId,
      },
    })

    forwardSetCookieHeaders(event, response)

    return response._data
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
