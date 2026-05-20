export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (config.mockEnabled) {
    return [
    {
        "cid": "873905",
        "nodeid": "1230",
        "status": "提交至法务初审",
        "userid": "24703",
        "sysName": "",
        "isremark": "2",
        "userName": "liu xin",
        "usertype": "0",
        "viewtype": "-2",
        "agenttype": "0",
        "creatorId": "24703",
        "requestId": "662736",
        "createTime": "2026-05-14 15:06:39",
        "isbereject": "",
        "creatorName": "liu xin",
        "isprocessed": "",
        "operateTime": "2026-05-14 15:06:43",
        "preisremark": "8",
        "receiveTime": "2026-05-14 15:06:39",
        "requestName": "CCA20260207| 11 | MOU / LOI| HKD0.00  (Pending Preliminary Review)",
        "requestmark": "CCA20260207",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "1230",
        "lastOperatorId": "24703",
        "currentNodeName": "法务初审",
        "currentnodetype": "1",
        "lastOperateTime": "2026-05-14 15:06:39",
        "agentorbyagentid": "-1",
        "lastOperatorName": "liu xin",
        "userDepartmentId": "33861",
        "userSubcompanyId": "280",
        "workflowBaseInfo": {
            "formId": "-332",
            "workflowId": "183",
            "workflowName": "集团合同许可与审核",
            "workflowTypeId": "37",
            "workflowTypeName": "GLC - 合同管理"
        },
        "userDepartmentName": "DCHBI",
        "userSubcompanyName": "Operation",
        "creatorDepartmentId": "33861",
        "creatorSubcompanyId": "280",
        "creatorDepartmentName": "DCHBI",
        "creatorSubcompanyName": "Operation"
    },
    {
        "cid": "866974",
        "nodeid": "1230",
        "status": "提交至法务初审",
        "userid": "24703",
        "sysName": "",
        "isremark": "2",
        "userName": "liu xin",
        "usertype": "0",
        "viewtype": "-2",
        "agenttype": "0",
        "creatorId": "24703",
        "requestId": "661103",
        "createTime": "2026-05-13 17:42:34",
        "isbereject": "",
        "creatorName": "liu xin",
        "isprocessed": "",
        "operateTime": "2026-05-13 17:42:37",
        "preisremark": "8",
        "receiveTime": "2026-05-13 17:42:34",
        "requestName": "CCA20260197| aa | NDA / Confidentiality Agreement| HKD0.00  (Pending Preliminary Review)",
        "requestmark": "CCA20260197",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "1230",
        "lastOperatorId": "24703",
        "currentNodeName": "法务初审",
        "currentnodetype": "1",
        "lastOperateTime": "2026-05-13 17:42:34",
        "agentorbyagentid": "-1",
        "lastOperatorName": "liu xin",
        "userDepartmentId": "33861",
        "userSubcompanyId": "280",
        "workflowBaseInfo": {
            "formId": "-332",
            "workflowId": "183",
            "workflowName": "集团合同许可与审核",
            "workflowTypeId": "37",
            "workflowTypeName": "GLC - 合同管理"
        },
        "userDepartmentName": "DCHBI",
        "userSubcompanyName": "Operation",
        "creatorDepartmentId": "33861",
        "creatorSubcompanyId": "280",
        "creatorDepartmentName": "DCHBI",
        "creatorSubcompanyName": "Operation"
    },
    {
        "cid": "857039",
        "nodeid": "1230",
        "status": "提交至法务初审",
        "userid": "24703",
        "sysName": "",
        "isremark": "2",
        "userName": "liu xin",
        "usertype": "0",
        "viewtype": "-2",
        "agenttype": "0",
        "creatorId": "24703",
        "requestId": "657709",
        "createTime": "2026-05-12 18:31:31",
        "isbereject": "",
        "creatorName": "liu xin",
        "isprocessed": "",
        "operateTime": "2026-05-12 18:31:34",
        "preisremark": "8",
        "receiveTime": "2026-05-12 18:31:31",
        "requestName": "CCA20260190| aa | NDA / Confidentiality Agreement| HKD0.00  (Pending Preliminary Review)",
        "requestmark": "CCA20260190",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "1230",
        "lastOperatorId": "24703",
        "currentNodeName": "法务初审",
        "currentnodetype": "1",
        "lastOperateTime": "2026-05-12 18:31:31",
        "agentorbyagentid": "-1",
        "lastOperatorName": "liu xin",
        "userDepartmentId": "33861",
        "userSubcompanyId": "280",
        "workflowBaseInfo": {
            "formId": "-332",
            "workflowId": "183",
            "workflowName": "集团合同许可与审核",
            "workflowTypeId": "37",
            "workflowTypeName": "GLC - 合同管理"
        },
        "userDepartmentName": "DCHBI",
        "userSubcompanyName": "Operation",
        "creatorDepartmentId": "33861",
        "creatorSubcompanyId": "280",
        "creatorDepartmentName": "DCHBI",
        "creatorSubcompanyName": "Operation"
    }
]
  }
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/workflow_my_request`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: {
        pageNo: body.pageNo ?? body.pageNum ?? 1,
        pageSize: 10,
        otherParams: { countOnly: false },
      },
    })

    forwardSetCookieHeaders(event, response)

    return {
      success: true,
      data: response._data,
    }
  }
  catch (error: any) {
    console.error('Mark notification as read API error:', error)
  }
})
