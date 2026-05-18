import { proxyRequest } from '~/server/utils/requestProxy'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<unknown>(event).catch(() => ({}))
  const payload = isRecord(body) ? body : {}

  if (config.mockEnabled) {
    return [
      {
        cid: '345235',
        nodeid: '812',
        status: 'Approved',
        userid: '25957',
        sysName: 'OA',
        isremark: '2',
        userName: 'Ng Mei Po Bien',
        usertype: '0',
        viewtype: '0',
        agenttype: '0',
        creatorId: '26065',
        requestId: '334450',
        createTime: '2025-04-25 10:54:49',
        isbereject: '',
        creatorName: 'Sophia Johnson',
        isprocessed: '1',
        operateTime: '2025-05-22 19:22:37',
        preisremark: '0',
        receiveTime: '2025-04-25 12:37:18',
        requestName: 'CCA20250003| Testing Based On Guide Slide34 | Sales Agreement / Service Agreement / Quotation | HKD6,000,000.00 (Approved)',
        requestmark: 'CCA20250003',
        takisremark: '',
        requestLevel: '0',
        currentNodeId: '812',
        lastOperatorId: '25955',
        currentNodeName: 'Approved',
        currentnodetype: '1',
        lastOperateTime: '2025-05-22 19:22:37',
        agentorbyagentid: '-1',
        lastOperatorName: 'Elijah Brown',
        userDepartmentId: '9813',
        userSubcompanyId: '297',
        workflowBaseInfo: {
          formId: '-332',
          workflowId: '130',
          workflowName: '集团合同许可与审核',
          workflowTypeId: '37',
          workflowTypeName: 'GLC - 合同管理',
        },
        userDepartmentName: 'Finance',
        userSubcompanyName: 'CCA Test',
        creatorDepartmentId: '9812',
        creatorSubcompanyId: '297',
        creatorDepartmentName: 'Business Development',
        creatorSubcompanyName: 'CCA Test',
      },
    ]
  }

  const response = await proxyRequest<Record<string, unknown>>(
    event,
    '/api/r/internal/ecology_oa/workflow_list/getAllWorkflowRequestList',
    {
      method: 'POST',
      body: {
        ...payload,
        pageNo: payload.pageNo ?? payload.pageNum ?? 1,
        pageSize: payload.pageSize ?? 10,
      },
      errorMessage: 'Fetch completed approval list failed',
    },
  )

  return {
    success: true,
    data: response,
  }
})
