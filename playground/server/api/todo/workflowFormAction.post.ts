export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
  if (config.mockEnabled) {
    const mockData = {
      code: 'SYSTEM_INNER_ERROR',
      errMsg: {},
      reqFailMsg: {
        msgInfo: {
          title: '',
          bottom: '',
          detail: '',
          errMessage: '节点字段校验失败',
          prompttype: 'errormsg',
        },
        msgType: 'AFTER_NODE_OPERATE_EX_FAIL',
        otherParams: {},
        keyParameters: {},
      },
    }

    return mockData
  }
  try {
    const requestBody = {
      ...body,
      ...(body.business ? { business: body.business } : {}),
      ...(body.type ? { type: body.type } : {}),
      ...(body.tag ? { tag: body.tag } : {}),
    }
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/workflow_form_action`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: requestBody,
    })

    forwardSetCookieHeaders(event, response)

    return {
      success: true,
      data: response._data,
    }
  }
  catch (error) {
    console.log(error)
    return []
  }
})
