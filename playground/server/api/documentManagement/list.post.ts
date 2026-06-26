import { proxyRequest } from '~/server/utils/requestProxy'
import type { CompanyDocumentListRequest, CompanyDocumentListResponse } from '~/types/documentManagement'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<Partial<CompanyDocumentListRequest>>(event).catch((): Partial<CompanyDocumentListRequest> => ({}))
  if (config.mockEnabled) {
    return [
      {
        detail2: [
          {
            id: '512',
            osid: '629',
            filename: 'CNCBI_Digital_Workflow_Phase_1B_Solution_v[CNCBI_DWF_P1B_UAT_FelixChan_20240302] (1).osp',
            externalrequestid: '359',
          },
          {
            id: '513',
            osid: '630',
            filename: 'ApplicationPermissionList_ProductApplication.xlsx',
            externalrequestid: '359',
          },
          {
            id: '514',
            osid: '631',
            filename: 'ApplicationPermissionList_AM.xlsx',
            externalrequestid: '359',
          },
          {
            id: '515',
            osid: '632',
            filename: 'drive-download-20240302T041406Z-001.zip',
            externalrequestid: '359',
          },
          {
            id: '516',
            osid: '633',
            filename: 'RandomPasswordGenerator_v2 (1).xif',
            externalrequestid: '359',
          },
        ],
        mainTable: {
          id: '3',
          createdby: 'dch001',
          readstatus: '已签署',
          RequestName: 'test1231323',
          createddate: '2024-04-18 16:54:00',
          Number_Version: 'PO24030001[0.01]',
          footer_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">我已閱讀並願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian"><span style="color:#2e2e2e">我已阅读并愿意遵守本政策内容</span></span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">I have read and agreed with the policy content.</span></span></span></span></p>',
          content_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">請你在同意之前，仔細閱讀本政策。</span></span> <span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">點擊</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e"> &quot;</span></span><span style="color:#e74c3c"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif">同意</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">&quot; </span></span><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian">请你在同意之前，仔细阅读本政策。</span> <span style="font-family:DengXian">点击</span> &quot;<span style="color:#e74c3c"><span style="font-family:DengXian">同意</span></span>&quot; <span style="font-family:DengXian">按钮，代表你愿意遵守本政策内容</span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">Please read this policy carefully before clicking the &quot;</span><span style="color:#e74c3c">Accept</span><span style="color:#2e2e2e">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style="text-align:center">&nbsp;</p>',
          chkchoice_display: '1',
          RequestPublishDate: '2024-04-18 16:59:00',
          acknowledgedate_display: '2024-04-18 17:04:00',
        },
      },
      {
        detail2: [
          {
            id: '612',
            osid: '300',
            filename: 'DCH DOA (October 2020).pdf',
            externalrequestid: '61',
          },
        ],
        mainTable: {
          id: '65',
          createdby: 'tinako@dch-holdings.com',
          readstatus: '',
          RequestName: 'KB0010235',
          createddate: '2020-10-14 04:03:00',
          Number_Version: 'KB0010235[2.00]',
          footer_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">我已閱讀並願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian"><span style="color:#2e2e2e">我已阅读并愿意遵守本政策内容</span></span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">I have read and agreed with the policy content.</span></span></span></span></p>',
          content_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">請你在同意之前，仔細閱讀本政策。</span></span> <span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">點擊</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e"> &quot;</span></span><span style="color:#e74c3c"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif">同意</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">&quot; </span></span><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian">请你在同意之前，仔细阅读本政策。</span> <span style="font-family:DengXian">点击</span> &quot;<span style="color:#e74c3c"><span style="font-family:DengXian">同意</span></span>&quot; <span style="font-family:DengXian">按钮，代表你愿意遵守本政策内容</span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">Please read this policy carefully before clicking the &quot;</span><span style="color:#e74c3c">Accept</span><span style="color:#2e2e2e">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style="text-align:center">&nbsp;</p>',
          chkchoice_display: '0',
          RequestPublishDate: '2020-10-14 00:00:00',
          acknowledgedate_display: '',
        },
      },
      {
        detail2: [
          {
            id: '614',
            osid: '298',
            filename: 'Citic\'s Exchange rate Sep 20.docx',
            externalrequestid: '63',
          },
          {
            id: '615',
            osid: '299',
            filename: 'DCH DOA (October 2020).pdf',
            externalrequestid: '63',
          },
        ],
        mainTable: {
          id: '67',
          createdby: 'tinako@dch-holdings.com',
          readstatus: '已签署',
          RequestName: 'KB0010235',
          createddate: '2020-10-19 10:23:00',
          Number_Version: 'KB0010235[3.00]',
          footer_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">我已閱讀並願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian"><span style="color:#2e2e2e">我已阅读并愿意遵守本政策内容</span></span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">I have read and agreed with the policy content.</span></span></span></span></p>',
          content_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">請你在同意之前，仔細閱讀本政策。</span></span> <span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">點擊</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e"> &quot;</span></span><span style="color:#e74c3c"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif">同意</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">&quot; </span></span><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian">请你在同意之前，仔细阅读本政策。</span> <span style="font-family:DengXian">点击</span> &quot;<span style="color:#e74c3c"><span style="font-family:DengXian">同意</span></span>&quot; <span style="font-family:DengXian">按钮，代表你愿意遵守本政策内容</span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">Please read this policy carefully before clicking the &quot;</span><span style="color:#e74c3c">Accept</span><span style="color:#2e2e2e">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style="text-align:center">&nbsp;</p>',
          chkchoice_display: '1',
          RequestPublishDate: '2020-10-20 00:00:00',
          acknowledgedate_display: '2020-10-22 01:42:00',
        },
      },
      {
        detail2: [
          {
            id: '693',
            osid: '411',
            filename: 'Delegation of Authority.pdf',
            externalrequestid: '141',
          },
        ],
        mainTable: {
          id: '145',
          createdby: 'temp.admin.mike',
          readstatus: '已签署',
          RequestName: 'KB0010235',
          createddate: '2019-09-24 03:26:00',
          Number_Version: 'KB0010235[1.00]',
          footer_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">我已閱讀並願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian"><span style="color:#2e2e2e">我已阅读并愿意遵守本政策内容</span></span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">I have read and agreed with the policy content.</span></span></span></span></p>',
          content_display: '<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">請你在同意之前，仔細閱讀本政策。</span></span> <span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">點擊</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e"> &quot;</span></span><span style="color:#e74c3c"><span style="font-family:&quot;微軟正黑體&quot;,sans-serif">同意</span></span><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">&quot; </span></span><span style="font-family:&quot;微軟正黑體&quot;,sans-serif"><span style="color:#2e2e2e">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style="font-size:11pt"><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Calibri&quot;,sans-serif"><span style="font-family:DengXian">请你在同意之前，仔细阅读本政策。</span> <span style="font-family:DengXian">点击</span> &quot;<span style="color:#e74c3c"><span style="font-family:DengXian">同意</span></span>&quot; <span style="font-family:DengXian">按钮，代表你愿意遵守本政策内容</span></span><span style="font-family:&quot;PMingLiU&quot;,serif">。</span></span></p>\r\n\r\n<p><span style="font-size:16px"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="font-family:SourceSansPro"><span style="color:#2e2e2e">Please read this policy carefully before clicking the &quot;</span><span style="color:#e74c3c">Accept</span><span style="color:#2e2e2e">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style="text-align:center">&nbsp;</p>',
          chkchoice_display: '1',
          RequestPublishDate: '2019-09-24 00:00:00',
          acknowledgedate_display: '2020-01-15 05:59:00',
        },
      },
    ]
  }
  try {
    const response = await proxyRequest<CompanyDocumentListResponse>(event, '/api/r/internal/ecology_oa/company_document/detail', {
      method: 'POST',
      body: {
        folderbaseid: body.folderbaseid ?? '',
        pageNo: body.pageNo ?? 1,
        pageSize: body.pageSize ?? 10,
      },
      errorMessage: 'Fetch document list failed',
    })

    return response
  }
  catch (error) {
    console.log(error)
    return { data: [] }
  }
})
