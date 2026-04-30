const getErrorRecord = (error: unknown) => {
  return error && typeof error === 'object'
    ? error as Record<string, unknown>
    : {}
}

const getStatusCode = (error: Record<string, unknown>) => {
  const value = error.statusCode || error.status
  const statusCode = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(statusCode) ? statusCode : 500
}

const getStatusMessage = (error: Record<string, unknown>) => {
  if (typeof error.statusMessage === 'string') {
    return error.statusMessage
  }

  if (typeof error.message === 'string') {
    return error.message
  }

  return 'Workflow form attachments API failed'
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body: Record<string, unknown> = await readBody<Record<string, unknown>>(event).catch(() => ({}))

  if (config.mockEnabled) {
    return {
      code: 'SUCCESS',
      data: [
        {
          id: 47497,
          name: 'BETTER FRONT1 8.5KG DCH.jpg',
          type: 3,
          createrid: 19831,
          createdate: '2026-04-27',
          createtime: '17:55:02',
          createrName: 'shu yaojin',
          downloadUrl: 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/images-in-html/dinosaur_small.jpg',
        },
        {
          id: 47498,
          name: 'BETTER FRONT2 8.5KG DCH.jpg',
          type: 3,
          createrid: 19831,
          createdate: '2026-04-27',
          createtime: '17:55:02',
          createrName: 'shu yaojin',
          downloadUrl: 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/images-in-html/dinosaur.jpg',
        },
        {
          id: 47499,
          name: 'BETTER FRONT3 8.5KG DCH.jpg',
          type: 3,
          createrid: 19831,
          createdate: '2026-04-27',
          createtime: '17:55:02',
          createrName: 'shu yaojin',
          downloadUrl: 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/images-in-html/favicon144.png',
        },
      ],
      errMsg: {},
    }
  }

  try {
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/workflow_form_attachments`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: {
        requestid: body.requestid ?? body.requestId,
      },
    })

    forwardSetCookieHeaders(event, response)

    return {
      success: true,
      data: response._data,
    }
  }
  catch (error: unknown) {
    const errorRecord = getErrorRecord(error)
    const statusCode = getStatusCode(errorRecord)
    const statusMessage = getStatusMessage(errorRecord)

    console.error('Workflow form attachments API error:', {
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
