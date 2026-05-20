export type CompanyDocumentStatus = 'Acknowledged' | 'Not Acknowledged'
export type DocumentCategoryStatusFilter = '' | 'Acknowledged' | 'NotYetAcknowledged'
export type DocumentCategoryTabKey = 'all' | 'acknowledged' | 'notAcknowledged'

export interface FetchDocumentCategoriesOptions {
  page?: number
  pageSize?: number
  matchingKeyword?: string
  status?: DocumentCategoryStatusFilter
  append?: boolean
}

export interface CompanyDocumentGroupResponseItem {
  id?: string | number
  osid?: string | number
  count?: string | number
  matching?: string
  FolderTitle?: string
  FolderDescription?: string
  status?: string
  readstatus?: string
  readstatus_display?: string
  acknowledgedate?: string
  acknowledgedate_display?: string
  acknowledgedCount?: string | number
  notAcknowledgedCount?: string | number
}

export interface CompanyDocumentCategoriesResponse {
  data: CompanyDocumentGroupResponseItem[]
  page: number
  total: number
  errMsg?: string
  status?: string
  pageSize: number
  totalPages: number
}

export interface DocumentCategoryPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface CompanyDocumentGroup {
  slug: string
  folderbaseid: string
  title: string
  category: string
  count: number
  acknowledgedCount: number
  notAcknowledgedCount: number
  status?: CompanyDocumentStatus
}

export interface CompanyDocumentFolder {
  slug: string
  folderbaseid: string
  title: string
  description: string
  articles: number
  acknowledgedCount: number
  notAcknowledgedCount: number
  status?: CompanyDocumentStatus
}

export interface CompanyDocumentListRequest {
  folderbaseid: string | number
  pageNo: number
  pageSize: number
}

export interface FetchCompanyDocumentListOptions extends Partial<CompanyDocumentListRequest> {
  folderbaseid: string | number
}

export interface CompanyDocumentPreviewFile {
  id?: string | number
  osid?: string | number
  filename?: string
  externalrequestid?: string | number
}

export interface CompanyDocumentDetailResponseItem {
  detail2?: CompanyDocumentPreviewFile[]
  mainTable?: {
    id?: string | number
    requestid?: string | number
    requestId?: string | number
    workflowid?: string | number
    workflowId?: string | number
    createdby?: string
    RequestName?: string
    createddate?: string
    Number_Version?: string
    RequestPublishDate?: string
    readstatus?: string
    readstatus_display?: string
    acknowledgedate_display?: string
    content_display?: string
    footer_display?: string
    fileName?: string
    filename?: string
    file_name?: string
    serverRelativeUrl?: string
    ServerRelativeUrl?: string
    server_relative_url?: string
    fileUrl?: string
    file_url?: string
  }
}

export interface CompanyDocumentGroupDetail {
  selectedDocumentDetail: CompanyDocumentDetailResponseItem['mainTable'] | null
}

export interface CompanyDocumentListResponse {
  data?: CompanyDocumentDetailResponseItem[]
  page?: string | number
  pageNo?: string | number
  total?: string | number
  errMsg?: string
  status?: string
  pageSize?: string | number
  totalPages?: string | number
}

export interface CompanyDocumentItem {
  slug: string
  title: string
  code: string
  version: string
  status: CompanyDocumentStatus
  raw: CompanyDocumentDetailResponseItem
  summaryDate?: string
  numberVersion?: string
  publishedDate?: string
}

export interface CompanyDocumentPreviewResponse {
  data?: string
  fileName?: string
  contentType?: string
  documentId?: string
}

export interface CompanyDocumentDetail {
  title: string
  code: string
  version: string
  fileName: string
  serverRelativeUrl: string
  createdBy: string
  createdDate: string
  contentHtml: string
  footerHtml: string
  createdTime?: string
  publishedDate?: string
  publishedDateTime?: string
  status?: CompanyDocumentStatus
}
