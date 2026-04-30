interface FavouriteRequestBody {
  itemidList?: number[]
}

const defaultItemIdList = [
  2,
  3,
]

const buildFavouriteMockData = (itemidList: number[] = defaultItemIdList) => [
  {
    mainTable: {
      id: '1',
      userid: '19831',
      itemidList,
    },
  },
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<FavouriteRequestBody>(event).catch(() => ({}))
  const requestBody = {
    itemidList: Array.isArray(body.itemidList) ? body.itemidList : defaultItemIdList,
  }

  if (config.mockEnabled) {
    return buildFavouriteMockData(requestBody.itemidList)
  }

  try {
    const response = await $fetch.raw<Record<string, unknown>[]>(
      `${config.public.apiBase}/api/r/ecology_oa/app_catalog/favourite`,
      {
        method: 'POST',
        headers: getForwardHeaders(event),
        body: requestBody,
      },
    )

    forwardSetCookieHeaders(event, response)

    return response._data
  }
  catch (error) {
    console.error('Post application favourite API error:', error)

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
