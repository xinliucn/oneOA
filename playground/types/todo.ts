export interface WorkflowTodoItem {
  cid: string
  nodeid: string
  status: string
  userid: string
  sysName: string
  isremark: string
  userName: string
  usertype: string
  viewtype: string
  agenttype: string
  creatorId: string
  requestId: string
  createTime: string
  isbereject: string
  creatorName: string
  isprocessed: string
  operateTime: string
  preisremark: string
  receiveTime: string
  requestName: string
  requestmark: string
  takisremark: string
  requestLevel: string
  currentNodeId: string
  lastOperatorId: string
  currentNodeName: string
  currentnodetype: string
  lastOperateTime: string
  agentorbyagentid: string
  lastOperatorName: string
  userDepartmentId: string
  userSubcompanyId: string
  workflowBaseInfo: WorkflowBaseInfo
  userDepartmentName: string
  userSubcompanyName: string
  creatorDepartmentId: string
  creatorSubcompanyId: string
  creatorDepartmentName: string
  creatorSubcompanyName: string
}

export interface WorkflowBaseInfo {
  formId: string
  workflowId: string
  workflowName: string
  workflowTypeId: string
  workflowTypeName: string
}

export type WorkflowTodoList = WorkflowTodoItem[]

export type TodoListKey = 'myApproval' | 'myRequests' | 'myTasks' | 'approved'

export type TodoListResponseField = 'myApprovalList' | 'myRequestList' | 'myTaskList' | 'approvedList'

export interface TodoListQuery {
  pageNo?: number
  pageNum?: number
  pageSize?: number
  conditions?: Record<string, unknown>
  otherParams?: Record<string, unknown>
}

export interface TodoListFetchOptions {
  force?: boolean
  query?: TodoListQuery
}

export interface TodoListApiResponse {
  success?: boolean
  data?: WorkflowTodoList
  myApprovalList?: WorkflowTodoList
  myRequestList?: WorkflowTodoList
  myTaskList?: WorkflowTodoList
  approvedList?: WorkflowTodoList
}

export type WorkflowFormValue = string | number | boolean | null | WorkflowFormValue[] | { [key: string]: WorkflowFormValue }

export interface WorkflowFormUser {
  uID?: number
  email?: string
  loginid?: string
  lastname?: string
  username?: string
  userDepartment?: number
  userSubCompany1?: number
  [key: string]: unknown
}

export interface WorkflowFormParams {
  user?: WorkflowFormUser
  formid?: number
  nodeid?: number
  requestid?: number
  requestname?: string
  requestnamenew?: string
  workflowid?: number
  workflowname?: string
  currentUserid?: number
  currentnodeid?: number
  currentnodetype?: string
  nodename?: string
  nodetype?: string
  canSubmitToRejectNode?: boolean
  [key: string]: unknown
}

export interface WorkflowFormFileData {
  fileid?: string
  id?: string
  filename?: string
  name?: string
  fileName?: string
  filelink?: string
  loadlink?: string
  downloadUrl?: string
  url?: string
  fileUrl?: string
  [key: string]: unknown
}

export interface WorkflowFormSpecialObject {
  id?: string
  name?: string
  showname?: string
  value?: string | number
  filedatas?: WorkflowFormFileData[]
  showBatchLoad?: boolean
  [key: string]: unknown
}

export interface WorkflowFormMainDataField {
  value?: string | number | boolean | null
  specialobj?: WorkflowFormSpecialObject | WorkflowFormSpecialObject[]
  [key: string]: unknown
}

export interface WorkflowFormSelectItem {
  selectname?: string
  selectvalue?: string | number
  [key: string]: unknown
}

export interface WorkflowFormFieldInfo {
  fieldid?: string | number
  fieldname?: string
  fieldlabel?: string
  fielddbtype?: string
  htmltype?: number
  detailtype?: number
  viewattr?: number
  selectattr?: {
    selectitemlist?: WorkflowFormSelectItem[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface WorkflowFormInfo {
  params?: WorkflowFormParams
  maindata?: Record<string, WorkflowFormMainDataField>
  submitParams?: Record<string, WorkflowFormValue>
  tableInfo?: {
    main?: {
      fieldinfomap?: Record<string, WorkflowFormFieldInfo>
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface WorkflowFormRequestField {
  fieldId?: string
  fieldName?: string
  fieldShowName?: string
  fieldValue?: string
  fieldShowValue?: string
  filedHtmlShow?: string
  view?: boolean
  edit?: boolean
  mand?: boolean
  [key: string]: unknown
}

export interface WorkflowFormRequestRecord {
  workflowRequestTableFields?: WorkflowFormRequestField[]
  [key: string]: unknown
}

export interface WorkflowFormRequestLog {
  id?: string
  nodeId?: string
  nodeName?: string
  operatorId?: string
  operatorName?: string
  operateDate?: string
  operateTime?: string
  operateType?: string
  remark?: string
  [key: string]: unknown
}

export interface WorkflowFormProcessInfo {
  remark?: string
  status?: string
  canEdit?: boolean
  canView?: boolean
  creatorId?: string
  requestId?: string
  createTime?: string
  creatorName?: string
  requestName?: string
  requestLevel?: string
  currentNodeId?: string
  currentNodeName?: string
  lastOperateTime?: string
  lastOperatorName?: string
  rejectButtonName?: string
  submitButtonName?: string
  workflowBaseInfo?: WorkflowBaseInfo
  workflowRequestLogs?: WorkflowFormRequestLog[]
  workflowMainTableInfo?: {
    requestRecords?: WorkflowFormRequestRecord[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface WorkflowFormLogInfo {
  isEnd?: boolean
  loglist?: WorkflowFormRequestLog[]
  totalCount?: number
  maxrequestlogid?: string
  [key: string]: unknown
}

export interface WorkflowFormDetail {
  xml?: string
  logInfo?: WorkflowFormLogInfo
  formInfo?: WorkflowFormInfo
  isE9Save?: boolean
  userRight?: WorkflowFormValue
  processInfo?: WorkflowFormProcessInfo
  submitParams?: Record<string, WorkflowFormValue>
  [key: string]: unknown
}

export interface WorkflowFormApiResponse {
  success?: boolean
  data?: WorkflowFormDetail
}

export interface WorkflowFormFetchOptions {
  force?: boolean
}

export interface WorkflowFormWeaverUrl {
  webUrl: string
  mobileUrl: string
}

export interface WorkflowFormWeaverUrlApiResponse {
  success: boolean
  data: WorkflowFormWeaverUrl
}

export interface WorkflowFormAttachment {
  id: number | string
  name?: string
  filename?: string
  fileName?: string
  downloadUrl?: string
  url?: string
  fileUrl?: string
  createdate?: string
  createtime?: string
  createrName?: string
  [key: string]: unknown
}

export interface WorkflowFormAttachmentsProxyResponse {
  code: string
  data: WorkflowFormAttachment[]
  errMsg: Record<string, unknown>
}

export interface WorkflowFormAttachmentsApiResponse {
  success: boolean
  data: WorkflowFormAttachment[]
}

export interface CurrentWorkflowOperator {
  id: number
  nodeid: number
  userid: number
  groupid: number
  isremark: number
  nodeName?: string
  userName?: string
  userType?: number
  viewType?: number
  agenttype?: number
  operatedate?: string
  operatetime?: string
  preisremark?: number
  receivedate?: string
  receivetime?: string
  agentorbyagentid?: number
  [key: string]: unknown
}

export interface CurrentWorkflowOperatorsProxyResponse {
  code: string
  data: CurrentWorkflowOperator[]
  errMsg: Record<string, unknown>
}

export interface CurrentWorkflowOperatorsApiResponse {
  success: boolean
  data: CurrentWorkflowOperator[]
}
