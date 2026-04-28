export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
  if (config.mockEnabled) {
    const mockData = [
    {
        "mainTable": {
            "id": "11",
            "createdby": "tinako@dch-holdings.com",
            "readstatus": "已签署",
            "RequestName": "KB0011674",
            "createddate": "2020-12-02 07:53:00",
            "Number_Version": "KB0011674[1.00]",
            "footer_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">我已閱讀並願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\"><span style=\"color:#2e2e2e\">我已阅读并愿意遵守本政策内容</span></span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">I have read and agreed with the policy content.</span></span></span></span></p>",
            "content_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">請你在同意之前，仔細閱讀本政策。</span></span> <span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">點擊</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\"> &quot;</span></span><span style=\"color:#e74c3c\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\">同意</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">&quot; </span></span><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\">请你在同意之前，仔细阅读本政策。</span> <span style=\"font-family:DengXian\">点击</span> &quot;<span style=\"color:#e74c3c\"><span style=\"font-family:DengXian\">同意</span></span>&quot; <span style=\"font-family:DengXian\">按钮，代表你愿意遵守本政策内容</span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">Please read this policy carefully before clicking the &quot;</span><span style=\"color:#e74c3c\">Accept</span><span style=\"color:#2e2e2e\">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>",
            "chkchoice_display": "1",
            "RequestPublishDate": "2020-12-02 00:00:00",
            "acknowledgedate_display": "2025-12-05 15:29:00"
        }
    },
    {
        "mainTable": {
            "id": "62",
            "createdby": "temp.admin.mike",
            "readstatus": "已签署",
            "RequestName": "KB0010238",
            "createddate": "2019-09-30 09:53:00",
            "Number_Version": "KB0010238[3.00]",
            "footer_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">我已閱讀並願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\"><span style=\"color:#2e2e2e\">我已阅读并愿意遵守本政策内容</span></span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">I have read and agreed with the policy content.</span></span></span></span></p>",
            "content_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">請你在同意之前，仔細閱讀本政策。</span></span> <span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">點擊</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\"> &quot;</span></span><span style=\"color:#e74c3c\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\">同意</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">&quot; </span></span><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\">请你在同意之前，仔细阅读本政策。</span> <span style=\"font-family:DengXian\">点击</span> &quot;<span style=\"color:#e74c3c\"><span style=\"font-family:DengXian\">同意</span></span>&quot; <span style=\"font-family:DengXian\">按钮，代表你愿意遵守本政策内容</span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">Please read this policy carefully before clicking the &quot;</span><span style=\"color:#e74c3c\">Accept</span><span style=\"color:#2e2e2e\">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>",
            "chkchoice_display": "1",
            "RequestPublishDate": "2019-09-30 00:00:00",
            "acknowledgedate_display": "2025-12-05 15:29:00"
        }
    },
    {
        "mainTable": {
            "id": "67",
            "createdby": "temp.admin.mike",
            "readstatus": "已签署",
            "RequestName": "KB0010239",
            "createddate": "2019-09-24 04:00:00",
            "Number_Version": "KB0010239[1.00]",
            "footer_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">我已閱讀並願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\"><span style=\"color:#2e2e2e\">我已阅读并愿意遵守本政策内容</span></span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">I have read and agreed with the policy content.</span></span></span></span></p>",
            "content_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">請你在同意之前，仔細閱讀本政策。</span></span> <span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">點擊</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\"> &quot;</span></span><span style=\"color:#e74c3c\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\">同意</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">&quot; </span></span><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\">请你在同意之前，仔细阅读本政策。</span> <span style=\"font-family:DengXian\">点击</span> &quot;<span style=\"color:#e74c3c\"><span style=\"font-family:DengXian\">同意</span></span>&quot; <span style=\"font-family:DengXian\">按钮，代表你愿意遵守本政策内容</span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">Please read this policy carefully before clicking the &quot;</span><span style=\"color:#e74c3c\">Accept</span><span style=\"color:#2e2e2e\">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>",
            "chkchoice_display": "1",
            "RequestPublishDate": "2019-09-24 00:00:00",
            "acknowledgedate_display": "2025-12-05 15:29:00"
        }
    },
    {
        "mainTable": {
            "id": "71",
            "createdby": "temp.admin.mike",
            "readstatus": "已签署",
            "RequestName": "KB0010236",
            "createddate": "2019-09-30 09:53:00",
            "Number_Version": "KB0010236[3.00]",
            "footer_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">我已閱讀並願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\"><span style=\"color:#2e2e2e\">我已阅读并愿意遵守本政策内容</span></span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">I have read and agreed with the policy content.</span></span></span></span></p>",
            "content_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">請你在同意之前，仔細閱讀本政策。</span></span> <span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">點擊</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\"> &quot;</span></span><span style=\"color:#e74c3c\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\">同意</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">&quot; </span></span><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\">请你在同意之前，仔细阅读本政策。</span> <span style=\"font-family:DengXian\">点击</span> &quot;<span style=\"color:#e74c3c\"><span style=\"font-family:DengXian\">同意</span></span>&quot; <span style=\"font-family:DengXian\">按钮，代表你愿意遵守本政策内容</span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">Please read this policy carefully before clicking the &quot;</span><span style=\"color:#e74c3c\">Accept</span><span style=\"color:#2e2e2e\">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>",
            "chkchoice_display": "1",
            "RequestPublishDate": "2019-09-30 00:00:00",
            "acknowledgedate_display": "2024-07-30 18:03:00"
        }
    },
    {
        "mainTable": {
            "id": "109",
            "createdby": "temp.admin.mike",
            "readstatus": "已签署",
            "RequestName": "KB0010240",
            "createddate": "2019-09-24 04:00:00",
            "Number_Version": "KB0010240[1.00]",
            "footer_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">我已閱讀並願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\"><span style=\"color:#2e2e2e\">我已阅读并愿意遵守本政策内容</span></span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">I have read and agreed with the policy content.</span></span></span></span></p>",
            "content_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">請你在同意之前，仔細閱讀本政策。</span></span> <span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">點擊</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\"> &quot;</span></span><span style=\"color:#e74c3c\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\">同意</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">&quot; </span></span><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\">请你在同意之前，仔细阅读本政策。</span> <span style=\"font-family:DengXian\">点击</span> &quot;<span style=\"color:#e74c3c\"><span style=\"font-family:DengXian\">同意</span></span>&quot; <span style=\"font-family:DengXian\">按钮，代表你愿意遵守本政策内容</span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">Please read this policy carefully before clicking the &quot;</span><span style=\"color:#e74c3c\">Accept</span><span style=\"color:#2e2e2e\">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>",
            "chkchoice_display": "1",
            "RequestPublishDate": "2019-09-24 00:00:00",
            "acknowledgedate_display": "2021-09-10 12:00:00"
        }
    },
    {
        "mainTable": {
            "id": "132",
            "createdby": "temp.admin.mike",
            "readstatus": "已签署",
            "RequestName": "KB0010237",
            "createddate": "2019-09-30 09:09:00",
            "Number_Version": "KB0010237[2.00]",
            "footer_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">我已閱讀並願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\"><span style=\"color:#2e2e2e\">我已阅读并愿意遵守本政策内容</span></span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">I have read and agreed with the policy content.</span></span></span></span></p>",
            "content_display": "<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">請你在同意之前，仔細閱讀本政策。</span></span> <span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">點擊</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\"> &quot;</span></span><span style=\"color:#e74c3c\"><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\">同意</span></span><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">&quot; </span></span><span style=\"font-family:&quot;微軟正黑體&quot;,sans-serif\"><span style=\"color:#2e2e2e\">按鈕，代表你願意遵守本政策內容</span></span></span></span><span style=\"font-size:11pt\"><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Calibri&quot;,sans-serif\"><span style=\"font-family:DengXian\">请你在同意之前，仔细阅读本政策。</span> <span style=\"font-family:DengXian\">点击</span> &quot;<span style=\"color:#e74c3c\"><span style=\"font-family:DengXian\">同意</span></span>&quot; <span style=\"font-family:DengXian\">按钮，代表你愿意遵守本政策内容</span></span><span style=\"font-family:&quot;PMingLiU&quot;,serif\">。</span></span></p>\r\n\r\n<p><span style=\"font-size:16px\"><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"font-family:SourceSansPro\"><span style=\"color:#2e2e2e\">Please read this policy carefully before clicking the &quot;</span><span style=\"color:#e74c3c\">Accept</span><span style=\"color:#2e2e2e\">&quot; button. Your acceptance to this policy means you agree to comply with the policy content.</span></span></span></span></p>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>",
            "chkchoice_display": "1",
            "RequestPublishDate": "2019-09-30 00:00:00",
            "acknowledgedate_display": "2024-11-27 15:16:00"
        }
    }
]

    return mockData
  }
  try {
    const requestBody = {
      ...(body.folderbaseid ? { folderbaseid: body.folderbaseid } : {}),
      ...(body.pageNo ? { pageNo: body.pageNo } : {}),
      ...(body.pageSize ? { pageSize: body.pageSize } : {}),
    }
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/company_document/detail`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: requestBody,
    })

    forwardSetCookieHeaders(event, response)

    return {
      success: true,
      data: response._data,
    }
  } catch (error) {
    console.log(error)
    return []
  }
})
