import { proxyRequest } from '~/server/utils/requestProxy'

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
    const response = await proxyRequest<Record<string, any>>(event, '/api/r/internal/ecology_oa/workflow_form_action', {
      method: 'POST',
      body: requestBody,
      errorMessage: 'Workflow form action API failed',
    })

    return {
      success: true,
      data: response,
    }
  }
  catch (error: any) {
    console.error('Workflow form action API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Workflow form action API failed',
      data: error?.data,
    })
  }
})
