const favouriteMockData = [
  {
    mainTable: {
      id: '1',
      userid: '19831',
      itemidList: [
        2,
        3,
      ],
    },
  },
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (config.mockEnabled) {
    return favouriteMockData
  }

  try {
    const response = await $fetch.raw<Record<string, unknown>[]>(
      `${config.public.apiBase}/api/r/ecology_oa/app_catalog/favourite`,
      {
        method: 'GET',
        headers: getForwardHeaders(event),
      },
    )

    forwardSetCookieHeaders(event, response)

    return response._data
  }
  catch (error) {
    console.error('Get application favourite API error:', error)

    const statusCode = typeof error === 'object'
      && error !== null
      && 'statusCode' in error
      && typeof error.statusCode === 'number'
      ? error.statusCode
      : 500
    const message = typeof error === 'object'
      && error !== null
      && 'message' in error
      && typeof error.message === 'string'
      ? error.message
      : '获取应用收藏失败'

    throw createError({
      statusCode,
      message,
    })
  }
})
