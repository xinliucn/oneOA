const favouriteMockData = [
    {
        "id": "1",
        "iconx64": "62170",
        "name_en": "IT Service Portal",
        "name_sc": "IT 服务门户",
        "name_tc": "IT 服務門戶",
        "mobileurl": "https://dch.service-now.com/sp",
        "homepage_url": "https://dch.service-now.com/sp",
        "description_en": "Group IT support platform",
        "description_sc": "集團 IT 支持平台",
        "description_tc": "集團 IT 支援平台"
    },
    {
        "id": "5",
        "iconx64": "62175",
        "name_en": "Group Digital & Technology",
        "name_sc": "集团数字与科技",
        "name_tc": "集團數位與科技",
        "mobileurl": "",
        "homepage_url": "",
        "description_en": "",
        "description_sc": "",
        "description_tc": ""
    },
    {
        "id": "7",
        "iconx64": "62172",
        "name_en": "Learning Management System",
        "name_sc": "学习管理系统",
        "name_tc": "學習管理系統",
        "mobileurl": "",
        "homepage_url": "",
        "description_en": "",
        "description_sc": "",
        "description_tc": ""
    }
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
