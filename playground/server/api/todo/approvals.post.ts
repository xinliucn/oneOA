export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (config.mockEnabled) {
    return [
    {
        "cid": "345235",
        "nodeid": "812",
        "status": "财务一级审核",
        "userid": "25957",
        "sysName": "",
        "isremark": "0",
        "userName": "Ng Mei Po Bien",
        "usertype": "0",
        "viewtype": "-2",
        "agenttype": "0",
        "creatorId": "26065",
        "requestId": "334450",
        "createTime": "2025-04-25 10:54:49",
        "isbereject": "",
        "creatorName": "Sophia Johnson",
        "isprocessed": "",
        "operateTime": "2025-05-22 19:22:37",
        "preisremark": "0",
        "receiveTime": "2025-04-25 12:37:18",
        "requestName": "CCA20250003| Testing Based On Guide Slide34 | Sales Agreement / Service Agreement / Quotation | HKD6,000,000.00 (Pending Approval)",
        "requestmark": "CCA20250003",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "812",
        "lastOperatorId": "25955",
        "currentNodeName": "一级财务审核",
        "currentnodetype": "1",
        "lastOperateTime": "2025-04-25 12:37:18",
        "agentorbyagentid": "-1",
        "lastOperatorName": "Elijah Brown",
        "userDepartmentId": "9813",
        "userSubcompanyId": "297",
        "workflowBaseInfo": {
            "formId": "-332",
            "workflowId": "130",
            "workflowName": "集团合同许可与审核",
            "workflowTypeId": "37",
            "workflowTypeName": "GLC - 合同管理"
        },
        "userDepartmentName": "Finance",
        "userSubcompanyName": "CCA Test",
        "creatorDepartmentId": "9812",
        "creatorSubcompanyId": "297",
        "creatorDepartmentName": "Business Development",
        "creatorSubcompanyName": "CCA Test"
    },
    {
        "cid": "344537",
        "nodeid": "812",
        "status": "财务一级审核",
        "userid": "25957",
        "sysName": "",
        "isremark": "0",
        "userName": "Ng Mei Po Bien",
        "usertype": "0",
        "viewtype": "0",
        "agenttype": "0",
        "creatorId": "26065",
        "requestId": "334371",
        "createTime": "2025-04-24 18:51:01",
        "isbereject": "",
        "creatorName": "Sophia Johnson",
        "isprocessed": "",
        "operateTime": " ",
        "preisremark": "0",
        "receiveTime": "2025-04-24 19:22:25",
        "requestName": "CCA20250001| Testing Based On Guide | Sales Agreement / Service Agreement / Quotation | HKD6,000,000.00 (Pending Approval)",
        "requestmark": "CCA20250001",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "812",
        "lastOperatorId": "25955",
        "currentNodeName": "一级财务审核",
        "currentnodetype": "1",
        "lastOperateTime": "2025-04-24 19:22:25",
        "agentorbyagentid": "-1",
        "lastOperatorName": "Elijah Brown",
        "userDepartmentId": "9813",
        "userSubcompanyId": "297",
        "workflowBaseInfo": {
            "formId": "-332",
            "workflowId": "130",
            "workflowName": "集团合同许可与审核",
            "workflowTypeId": "37",
            "workflowTypeName": "GLC - 合同管理"
        },
        "userDepartmentName": "Finance",
        "userSubcompanyName": "CCA Test",
        "creatorDepartmentId": "9812",
        "creatorSubcompanyId": "297",
        "creatorDepartmentName": "Business Development",
        "creatorSubcompanyName": "CCA Test"
    },
    {
        "cid": "322619",
        "nodeid": "652",
        "status": "Review by Entity Finance",
        "userid": "25957",
        "sysName": "",
        "isremark": "0",
        "userName": "Ng Mei Po Bien",
        "usertype": "0",
        "viewtype": "0",
        "agenttype": "0",
        "creatorId": "26085",
        "requestId": "301349",
        "createTime": "2025-03-07 14:40:40",
        "isbereject": "",
        "creatorName": "Developer 1",
        "isprocessed": "",
        "operateTime": " ",
        "preisremark": "0",
        "receiveTime": "2025-03-07 15:33:10",
        "requestName": "ICSA Entity Submission Flow-Developer 1-2025-03-07",
        "requestmark": "ICSA_Assessment20250004",
        "takisremark": "",
        "requestLevel": "0",
        "currentNodeId": "652",
        "lastOperatorId": "26085",
        "currentNodeName": "Entity Finance Approval",
        "currentnodetype": "1",
        "lastOperateTime": "2025-03-07 15:33:10",
        "agentorbyagentid": "-1",
        "lastOperatorName": "Developer 1",
        "userDepartmentId": "9813",
        "userSubcompanyId": "297",
        "workflowBaseInfo": {
            "formId": "-323",
            "workflowId": "107",
            "workflowName": "ICSA 实体评估与质量检查流程",
            "workflowTypeId": "47",
            "workflowTypeName": "GICRM - 内部控制自我评估"
        },
        "userDepartmentName": "Finance",
        "userSubcompanyName": "CCA Test",
        "creatorDepartmentId": "3255",
        "creatorSubcompanyId": "262",
        "creatorDepartmentName": "Prof Svc-Low Code Platform",
        "creatorSubcompanyName": "Others Business"
    }
]
  }
  try {
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/workflow_approval`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: {
        pageNo: body.pageNo ?? body.pageNum ?? 1,
        pageSize: 10,
        otherParams: { is_handled: false },
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
