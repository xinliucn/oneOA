import { proxyRequest } from '~/server/utils/requestProxy'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (config.mockEnabled) {
    return [
      {
        "cid": "865303",
        "nodeid": "1374",
        "status": "發起 至 部門經理",
        "userid": "24703",
        "sysName": "",
        "isremark": "0",
        "userName": "liu xin",
        "usertype": "0",
        "viewtype": "-2",
        "agenttype": "0",
        "creatorId": "19831",
        "requestId": "660717",
        "createTime": "2026-05-13 11:48:03",
        "isbereject": "",
        "creatorName": "shu yaojin",
        "isprocessed": "",
        "operateTime": "2026-05-18 11:25:22",
        "preisremark": "0",
        "receiveTime": "2026-05-13 11:48:03",
        "requestName": "SuperApp測試流程-shu yaojin-2026-05-13",
        "requestmark": "",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "1374",
        "lastOperatorId": "19831",
        "currentNodeName": "部門經理",
        "currentnodetype": "1",
        "lastOperateTime": "2026-05-13 11:48:03",
        "agentorbyagentid": "-1",
        "lastOperatorName": "shu yaojin",
        "userDepartmentId": "33861",
        "userSubcompanyId": "280",
        "workflowBaseInfo": {
          "formId": "-664",
          "workflowId": "222",
          "workflowName": "SuperApp測試流程",
          "workflowTypeId": "64",
          "workflowTypeName": "SuperApp測試流程"
        },
        "userDepartmentName": "DCHBI",
        "userSubcompanyName": "Operation",
        "creatorDepartmentId": "33861",
        "creatorSubcompanyId": "280",
        "creatorDepartmentName": "DCHBI",
        "creatorSubcompanyName": "Operation"
      },
      {
        "cid": "847743",
        "nodeid": "1374",
        "status": "發起 至 部門經理",
        "userid": "24703",
        "sysName": "",
        "isremark": "0",
        "userName": "liu xin",
        "usertype": "0",
        "viewtype": "0",
        "agenttype": "0",
        "creatorId": "12436",
        "requestId": "651758",
        "createTime": "2026-05-11 17:06:32",
        "isbereject": "",
        "creatorName": "Cheng Lam To Ian",
        "isprocessed": "",
        "operateTime": " ",
        "preisremark": "0",
        "receiveTime": "2026-05-11 17:06:32",
        "requestName": "SuperApp測試流程-Cheng Lam To Ian-2026-05-11",
        "requestmark": "",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "1374",
        "lastOperatorId": "12436",
        "currentNodeName": "部門經理",
        "currentnodetype": "1",
        "lastOperateTime": "2026-05-11 17:06:32",
        "agentorbyagentid": "-1",
        "lastOperatorName": "Cheng Lam To Ian",
        "userDepartmentId": "33861",
        "userSubcompanyId": "280",
        "workflowBaseInfo": {
          "formId": "-664",
          "workflowId": "222",
          "workflowName": "SuperApp測試流程",
          "workflowTypeId": "64",
          "workflowTypeName": "SuperApp測試流程"
        },
        "userDepartmentName": "DCHBI",
        "userSubcompanyName": "Operation",
        "creatorDepartmentId": "3255",
        "creatorSubcompanyId": "262",
        "creatorDepartmentName": "Prof Svc-Low Code Platform",
        "creatorSubcompanyName": "Others Business"
      }
    ]
  }
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const response = await proxyRequest<Record<string, any>>(event, '/api/r/internal/ecology_oa/workflow_approval', {
      method: 'POST',
      body: {
        pageNo: body.pageNo ?? body.pageNum ?? 1,
        pageSize: 10,
        otherParams: { is_handled: false },
      },
      errorMessage: 'Workflow approval API failed',
    })

    return {
      success: true,
      data: response,
    }
  }
  catch (error: any) {
    console.error('Workflow approval API error:', {
      statusCode: error?.statusCode || error?.status,
      statusMessage: error?.statusMessage || error?.message,
      data: error?.data,
    })

    throw createError({
      statusCode: error?.statusCode || error?.status || 500,
      statusMessage: error?.statusMessage || error?.message || 'Workflow approval API failed',
      data: error?.data,
    })
  }
})
