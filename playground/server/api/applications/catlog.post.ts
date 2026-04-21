
export default defineEventHandler(async (event) => {
  const businessData = [
    {
        "mainTable": {
            "name_tc": "集團法律與合規",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Legal & Compliance",
            "name_sc": "集团法律与合规",
            "order_number": "3000",
            "homepage_url": "",
            "description_en": "",
            "type": "Business",
            "iconx64": "user_attributes_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 2.png",
            "application": "",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "4",
            "tag": "HK",
            "name_en": "Group Legal & Compliance"
        }
    },
    {
        "mainTable": {
            "name_tc": "Group Digital & Technology",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Digital & Technology",
            "name_sc": "Group Digital & Technology",
            "order_number": "1000",
            "homepage_url": "",
            "description_en": "",
            "type": "Business",
            "iconx64": "desktop_windows_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1.png",
            "application": "",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "5",
            "tag": "HK",
            "name_en": "Group Digital & Technology"
        }
    },
    {
        "mainTable": {
            "name_tc": "集團人力資源",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Human Resource",
            "name_sc": "集团人力资源",
            "order_number": "4000",
            "homepage_url": "",
            "description_en": "",
            "type": "Business",
            "iconx64": "",
            "application": "",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "19",
            "tag": "HK",
            "name_en": "Group Human Resources"
        }
    },
    {
        "mainTable": {
            "name_tc": "Group Finance",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Finance",
            "name_sc": "Group Finance",
            "order_number": "10000",
            "homepage_url": "",
            "description_en": "",
            "type": "Business",
            "iconx64": "finance_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 1.png",
            "application": "",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "20",
            "tag": "HK",
            "name_en": "Group Finance"
        }
    }
]
  const applicationData = [
    {
        "mainTable": {
            "name_tc": "IT 服務門戶",
            "allowroles": "角色( 系统管理员角色)共享级别=部门  安全级别为0-100的角色成员，角色( CRM管理员)共享级别=部门  安全级别为0-100的角色成员",
            "business": "Group Digital & Technology",
            "name_sc": "IT 服务门户",
            "order_number": "1200",
            "homepage_url": "https://dch.service-now.com/sp",
            "description_en": "Group IT support platform",
            "type": "Application",
            "iconx64": "ITServiceDesk.png",
            "application": "IT Service Portal",
            "description_sc": "集團 IT 支持平台",
            "description_tc": "集團 IT 支援平台",
            "mobileurl": "https://dch.service-now.com/sp",
            "id": "1",
            "tag": "HK",
            "name_en": "IT Service Portal"
        }
    },
    {
        "mainTable": {
            "name_tc": "辦公自動化系統",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Service",
            "name_sc": "办公自动化系统",
            "order_number": "1",
            "homepage_url": "https://oa.dchbipoc.cc/",
            "description_en": "",
            "type": "Application",
            "iconx64": "",
            "application": "OA",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "3",
            "tag": "HK,CN,SEA",
            "name_en": "OA"
        }
    },
    {
        "mainTable": {
            "name_tc": "用友",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Finance",
            "name_sc": "用友",
            "order_number": "3",
            "homepage_url": "1",
            "description_en": "EN: Financial management system简: 财务管理系统繁: 財務管理系統",
            "type": "Application",
            "iconx64": "yonyou.png",
            "application": "Yonyou",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "6",
            "tag": "HK",
            "name_en": "Yonyou"
        }
    },
    {
        "mainTable": {
            "name_tc": "學習管理系統",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Service",
            "name_sc": "学习管理系统",
            "order_number": "5",
            "homepage_url": "",
            "description_en": "",
            "type": "Application",
            "iconx64": "italcant.png",
            "application": "Learning Management System",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "7",
            "tag": "HK",
            "name_en": "Learning Management System"
        }
    },
    {
        "mainTable": {
            "name_tc": "人力資源管理系統",
            "allowroles": "安全级别为0-100的所有人",
            "business": "Group Human Resources",
            "name_sc": "人力资源管理系统",
            "order_number": "4",
            "homepage_url": "https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/",
            "description_en": "",
            "type": "Application",
            "iconx64": "",
            "application": "HRMS",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "8",
            "tag": "HK",
            "name_en": "HRMS"
        }
    },
    {
        "mainTable": {
            "name_tc": "OA 中國大陸門戶",
            "allowroles": "安全级别为0-100的所有人",
            "business": "China Business",
            "name_sc": "OA 中國大陸門戶",
            "order_number": "2",
            "homepage_url": "",
            "description_en": "",
            "type": "Application",
            "iconx64": "",
            "application": "OA China",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "13",
            "tag": "CN",
            "name_en": "OA China"
        }
    },
    {
        "mainTable": {
            "name_tc": "DEV1 should not see this",
            "allowroles": "人员( Chan Chun Hong Felix)",
            "business": "TEST",
            "name_sc": "DEV1 should not see this",
            "order_number": "99999",
            "homepage_url": "",
            "description_en": "",
            "type": "Application",
            "iconx64": "",
            "application": "TEST",
            "description_sc": "",
            "description_tc": "",
            "mobileurl": "",
            "id": "14",
            "tag": "HK",
            "name_en": "DEV1 should not see this"
        }
    }
]
  const cnData = [
    {
      "mainTable": {
        "name_tc": "辦公自動化系統",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "办公自动化系统",
        "order_number": "1",
        "homepage_url": "https://oa.dchbipoc.cc/",
        "description_en": "",
        "type": "Application",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "3",
        "tag": "HK,CN,SEA",
        "name_en": "OA"
      }
    },
    {
      "mainTable": {
        "name_tc": "OA 中國大陸門戶",
        "allowroles": "安全级别为0-100的所有人",
        "business": "China Business",
        "name_sc": "OA 中國大陸門戶",
        "order_number": "2",
        "homepage_url": "",
        "description_en": "",
        "type": "Application",
        "iconx64": "",
        "application": "OA China",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "13",
        "tag": "CN",
        "name_en": "OA China"
      }
    },
    {
      "mainTable": {
        "name_tc": "政策文件",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "政策文件",
        "order_number": "",
        "homepage_url": "https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233",
        "description_en": "Previously called ePolicy",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "Previously called ePolicy",
        "description_tc": "Previously called ePolicy",
        "mobileurl": "https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233",
        "id": "21",
        "tag": "HK,CN,SEA",
        "name_en": "Policy Documents"
      }
    },
    {
      "mainTable": {
        "name_tc": "Submit an IT Demand",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Submit an IT Demand",
        "order_number": "1310",
        "homepage_url": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandSubmissionForm.aspx?DemandID=0&Page=1",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandSubmissionForm.aspx?DemandID=0&Page=1",
        "id": "32",
        "tag": "HK,CN,SEA",
        "name_en": "Submit an IT Demand"
      }
    },
    {
      "mainTable": {
        "name_tc": "All IT Demands",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "All IT Demands",
        "order_number": "1320",
        "homepage_url": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandMain.aspx",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandMain.aspx",
        "id": "33",
        "tag": "HK,CN,SEA",
        "name_en": "All IT Demands"
      }
    },
    {
      "mainTable": {
        "name_tc": "All IT Projects",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "All IT Projects",
        "order_number": "1330",
        "homepage_url": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/ProjectMain.aspx?IsDashboard=False",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/ProjectMain.aspx?IsDashboard=False",
        "id": "34",
        "tag": "HK,CN,SEA",
        "name_en": "All IT Projects"
      }
    },
    {
      "mainTable": {
        "name_tc": "Key Risk Indicator (IT)",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Key Risk Indicator (IT)",
        "order_number": "1400",
        "homepage_url": "https://oa.dchbipoc.cc/spa/edc/static4mobile/index.html#/edcreportengine/sheetView/862b1abefbbb4f24840c8bff343cfd46?id=862b1abefbbb4f24840c8bff343cfd46&",
        "description_en": "IT only",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "IT only",
        "description_tc": "IT only",
        "mobileurl": "https://oa.dchbipoc.cc/spa/edc/static4mobile/index.html#/edcreportengine/sheetView/862b1abefbbb4f24840c8bff343cfd46?id=862b1abefbbb4f24840c8bff343cfd46&",
        "id": "40",
        "tag": "HK,SEA,CN",
        "name_en": "Key Risk Indicator (IT)"
      }
    },
    {
      "mainTable": {
        "name_tc": "Learning Management System",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Learning Management System",
        "order_number": "",
        "homepage_url": "https://lms.dchbi.com/",
        "description_en": "",
        "type": "click",
        "iconx64": "",
        "application": "",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://lms.dchbi.com/",
        "id": "42",
        "tag": "HK,SEA,CN",
        "name_en": "Learning Management System"
      }
    },
    {
      "mainTable": {
        "name_tc": "公司列表报表",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "公司列表报表",
        "order_number": "",
        "homepage_url": "https://43.132.182.225/wui/index.html#/main/cube/search?customid=25&menuIds=-55,-41&menuPathIds=-55,-99,-22,-41&_key=x7aayv",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "43",
        "tag": "HK,SEA,CN",
        "name_en": "Lists of Companies"
      }
    }
  ]
  const hkData = [
    {
      "mainTable": {
        "name_tc": "IT 服務門戶",
        "allowroles": "角色( 系统管理员角色)共享级别=部门  安全级别为0-100的角色成员，角色( CRM管理员)共享级别=部门  安全级别为0-100的角色成员",
        "business": "Group Digital & Technology",
        "name_sc": "IT 服务门户",
        "order_number": "1200",
        "homepage_url": "https://dch.service-now.com/sp",
        "description_en": "Group IT support platform",
        "type": "Application",
        "iconx64": "",
        "application": "IT Service Portal",
        "description_sc": "集團 IT 支持平台",
        "description_tc": "集團 IT 支援平台",
        "mobileurl": "https://dch.service-now.com/sp",
        "id": "1",
        "tag": "HK",
        "name_en": "IT Service Portal"
      }
    },
    {
      "mainTable": {
        "name_tc": "一般 IT 服務和應用程式請求",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "一般 IT 服務和應用程式請求",
        "order_number": "1210",
        "homepage_url": "https://dch.service-now.com/sp?id=sc_cat_item&sys_id=ea6aef15db3d91908e9ddf0bd3961922&sysparm_category=22c62651db7991908e9ddf0bd39619d2",
        "description_en": "EN: Request IT services or support简: 申请信息技术服务繁: 申請資訊技術服務",
        "type": "Form",
        "iconx64": "",
        "application": "IT Service Portal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dch.service-now.com/sp?id=sc_cat_item&sys_id=ea6aef15db3d91908e9ddf0bd3961922&sysparm_category=22c62651db7991908e9ddf0bd39619d2",
        "id": "2",
        "tag": "HK",
        "name_en": "Open a Service Request"
      }
    },
    {
      "mainTable": {
        "name_tc": "辦公自動化系統",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "办公自动化系统",
        "order_number": "1",
        "homepage_url": "https://oa.dchbipoc.cc/",
        "description_en": "",
        "type": "Application",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "3",
        "tag": "HK,CN,SEA",
        "name_en": "OA"
      }
    },
    {
      "mainTable": {
        "name_tc": "集團法律與合規",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Legal & Compliance",
        "name_sc": "集团法律与合规",
        "order_number": "3000",
        "homepage_url": "",
        "description_en": "",
        "type": "Business",
        "iconx64": "",
        "application": "",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "4",
        "tag": "HK",
        "name_en": "Group Legal & Compliance"
      }
    },
    {
      "mainTable": {
        "name_tc": "Group Digital & Technology",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Group Digital & Technology",
        "order_number": "1000",
        "homepage_url": "",
        "description_en": "",
        "type": "Business",
        "iconx64": "",
        "application": "",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "5",
        "tag": "HK",
        "name_en": "Group Digital & Technology"
      }
    },
    {
      "mainTable": {
        "name_tc": "用友",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "用友",
        "order_number": "3",
        "homepage_url": "",
        "description_en": "EN: Financial management system简: 财务管理系统繁: 財務管理系統",
        "type": "Application",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "6",
        "tag": "HK",
        "name_en": "Yonyou"
      }
    },
    {
      "mainTable": {
        "name_tc": "學習管理系統",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "学习管理系统",
        "order_number": "5",
        "homepage_url": "",
        "description_en": "",
        "type": "Application",
        "iconx64": "",
        "application": "Learning Management System",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "7",
        "tag": "HK",
        "name_en": "Learning Management System"
      }
    },
    {
      "mainTable": {
        "name_tc": "人力資源管理系統",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Human Resources",
        "name_sc": "人力资源管理系统",
        "order_number": "4",
        "homepage_url": "https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/",
        "description_en": "",
        "type": "Application",
        "iconx64": "",
        "application": "HRMS",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "8",
        "tag": "HK",
        "name_en": "HRMS"
      }
    },
    {
      "mainTable": {
        "name_tc": "法律與合規門戶",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Legal & Compliance",
        "name_sc": "法律与合规门户",
        "order_number": "3200",
        "homepage_url": "https://oa.dchbipoc.cc/wui/index.html?#/main/portal/portal-42-305?menuIds=-70,-248&menuPathIds=-70,-248&_key=d3l93k",
        "description_en": "",
        "type": "Portal",
        "iconx64": "",
        "application": "GLC Portal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://oa.dchbipoc.cc/wui/index.html?#/main/portal/portal-42-305?menuIds=-70,-248&menuPathIds=-70,-248&_key=d3l93k",
        "id": "9",
        "tag": "HK",
        "name_en": "GLC Portal"
      }
    },
    {
      "mainTable": {
        "name_tc": "集團人力資源門戶",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Human Resources",
        "name_sc": "集团人力资源门户",
        "order_number": "2200",
        "homepage_url": "https://intranet.dch.com.hk/en/ghr",
        "description_en": "",
        "type": "Portal",
        "iconx64": "",
        "application": "GHR Portal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://intranet.dch.com.hk/en/ghr",
        "id": "10",
        "tag": "HK",
        "name_en": "GHR Portal"
      }
    },
    {
      "mainTable": {
        "name_tc": "企業內聯網",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "企业内网",
        "order_number": "0",
        "homepage_url": "http://intranet.dch.com.hk/",
        "description_en": "",
        "type": "Portal",
        "iconx64": "",
        "application": "Intranet",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "http://intranet.dch.com.hk/",
        "id": "11",
        "tag": "HK",
        "name_en": "Intranet"
      }
    }
  ]
  const seaData = [
    {
      "mainTable": {
        "name_tc": "辦公自動化系統",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "办公自动化系统",
        "order_number": "1",
        "homepage_url": "https://oa.dchbipoc.cc/",
        "description_en": "",
        "type": "Application",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "3",
        "tag": "HK,CN,SEA",
        "name_en": "OA"
      }
    },
    {
      "mainTable": {
        "name_tc": "政策文件",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Service",
        "name_sc": "政策文件",
        "order_number": "",
        "homepage_url": "https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233",
        "description_en": "Previously called ePolicy",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "Previously called ePolicy",
        "description_tc": "Previously called ePolicy",
        "mobileurl": "https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233",
        "id": "21",
        "tag": "HK,CN,SEA",
        "name_en": "Policy Documents"
      }
    },
    {
      "mainTable": {
        "name_tc": "D2 公司成立、併購及法律文件",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "D2 公司成立、并购及法律文件",
        "order_number": "4005",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=901&menuIds=-70,-301&menuPathIds=-70,-272,-295,-296,-301&_key=bh34pm",
        "description_en": "No longer used",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "No longer used",
        "description_tc": "No longer used",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=147#&page_147",
        "id": "22",
        "tag": "HK,SEA",
        "name_en": "D2 Incorporation, M&A and Legal Documents"
      }
    },
    {
      "mainTable": {
        "name_tc": "新增資金記錄（用友）",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Treasury Process",
        "name_sc": "新增资金记录（用友）",
        "order_number": "",
        "homepage_url": "",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "23",
        "tag": "HK,SEA",
        "name_en": "New Treasury Record (Yonyou)"
      }
    },
    {
      "mainTable": {
        "name_tc": "資金資料（用友）",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Treasury Process",
        "name_sc": "资金数据（用友）",
        "order_number": "",
        "homepage_url": "",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "24",
        "tag": "HK,SEA",
        "name_en": "Treasury Data (Yonyou)"
      }
    },
    {
      "mainTable": {
        "name_tc": "我的申報記錄",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "我的申报记录",
        "order_number": "4001",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=897&menuIds=-70,-298&menuPathIds=-70,-272,-295,-296,-298&_key=aenmf1",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=83#&page_83",
        "id": "25",
        "tag": "HK,SEA",
        "name_en": "My Filing Submissions"
      }
    },
    {
      "mainTable": {
        "name_tc": "全部申報記錄",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "全部申报记录",
        "order_number": "4002",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=896&menuIds=-70,-297&menuPathIds=-70,-272,-295,-296,-297&_key=mfgohx",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=84#&page_84",
        "id": "26",
        "tag": "HK,SEA",
        "name_en": "All Filing Submissions"
      }
    },
    {
      "mainTable": {
        "name_tc": "D1 審計帳戶",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "D1 审计账户",
        "order_number": "4004",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=900&menuIds=-70,-300&menuPathIds=-70,-272,-295,-296,-300&_key=kusyqt",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=91#&page_91",
        "id": "27",
        "tag": "HK,SEA",
        "name_en": "D1 Audit Accounts"
      }
    },
    {
      "mainTable": {
        "name_tc": "人事管理",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Human Resources",
        "name_sc": "人事管理",
        "order_number": "2310",
        "homepage_url": "https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/",
        "description_en": "HR Only",
        "type": "Portal",
        "iconx64": "",
        "application": "OA",
        "description_sc": "HR Only",
        "description_tc": "HR Only",
        "mobileurl": "",
        "id": "28",
        "tag": "HK,SEA",
        "name_en": "Personnel Management"
      }
    },
    {
      "mainTable": {
        "name_tc": "請假管理",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Human Resources",
        "name_sc": "请假管理",
        "order_number": "2320",
        "homepage_url": "https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/",
        "description_en": "",
        "type": "Portal",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "29",
        "tag": "HK,SEA",
        "name_en": "Leave Management"
      }
    },
    {
      "mainTable": {
        "name_tc": "薪酬管理",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Human Resources",
        "name_sc": "薪酬管理",
        "order_number": "2330",
        "homepage_url": "https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/",
        "description_en": "",
        "type": "Portal",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "30",
        "tag": "HK,SEA",
        "name_en": "Payroll Management"
      }
    },
    {
      "mainTable": {
        "name_tc": "績效評核管理",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Human Resources",
        "name_sc": "绩效考核管理",
        "order_number": "2340",
        "homepage_url": "https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/",
        "description_en": "",
        "type": "Portal",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "31",
        "tag": "HK,SEA",
        "name_en": "Appraisal Management"
      }
    },
    {
      "mainTable": {
        "name_tc": "Submit an IT Demand",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Submit an IT Demand",
        "order_number": "1310",
        "homepage_url": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandSubmissionForm.aspx?DemandID=0&Page=1",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandSubmissionForm.aspx?DemandID=0&Page=1",
        "id": "32",
        "tag": "HK,CN,SEA",
        "name_en": "Submit an IT Demand"
      }
    },
    {
      "mainTable": {
        "name_tc": "All IT Demands",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "All IT Demands",
        "order_number": "1320",
        "homepage_url": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandMain.aspx",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/DemandMain.aspx",
        "id": "33",
        "tag": "HK,CN,SEA",
        "name_en": "All IT Demands"
      }
    },
    {
      "mainTable": {
        "name_tc": "All IT Projects",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "All IT Projects",
        "order_number": "1330",
        "homepage_url": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/ProjectMain.aspx?IsDashboard=False",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://eportal.dch-holdings.com/DCH_ePortal/Login.aspx?OriginalURL=https://eportal.dch-holdings.com/DemandandProjectManagement/ProjectMain.aspx?IsDashboard=False",
        "id": "34",
        "tag": "HK,CN,SEA",
        "name_en": "All IT Projects"
      }
    },
    {
      "mainTable": {
        "name_tc": "D3 稅務結清手續",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "D3 税务结清手续",
        "order_number": "4005",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=902&menuIds=-70,-302&menuPathIds=-70,-272,-295,-296,-302&_key=c4vvic",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=93#&page_93",
        "id": "35",
        "tag": "HK,SEA",
        "name_en": "D3 Tax Clearances"
      }
    },
    {
      "mainTable": {
        "name_tc": "D4 BU 代表信函",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "D4 BU 代表信函",
        "order_number": "4006",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=903&menuIds=-70,-303&menuPathIds=-70,-272,-295,-296,-303&_key=e6m4qz",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=94#&page_94",
        "id": "36",
        "tag": "HK,SEA",
        "name_en": "D4 BU Representation Letter"
      }
    },
    {
      "mainTable": {
        "name_tc": "D5 BU 訴訟與欺詐確認",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "D5 BU 诉讼与欺诈确认",
        "order_number": "4007",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=904&menuIds=-70,-304&menuPathIds=-70,-272,-295,-296,-304&_key=zgkkgb",
        "description_en": "No longer used",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "No longer used",
        "description_tc": "No longer used",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=95#&page_95",
        "id": "37",
        "tag": "HK,SEA",
        "name_en": "D5 BU Litigation and fraud Confirmation"
      }
    },
    {
      "mainTable": {
        "name_tc": "D6 BU 審計清關包",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "D6 BU 审计清关包",
        "order_number": "4008",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=905&menuIds=-70,-305&menuPathIds=-70,-272,-295,-296,-305&_key=xs8fmw",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=96#&page_96",
        "id": "38",
        "tag": "HK,SEA",
        "name_en": "D6 BU Audit Clearance Package"
      }
    },
    {
      "mainTable": {
        "name_tc": "我的檔案審批",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Filing Process",
        "name_sc": "我的档案审批",
        "order_number": "4003",
        "homepage_url": "https://dchappsdev.dchbi.com/wui/index.html#/main/cube/search?customid=898&menuIds=-70,-299&menuPathIds=-70,-272,-295,-296,-299&_key=yfkfia",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://dchappsdev.dchbi.com/mobilemode/mobile/view.html?appHomepageId=116#&page_116",
        "id": "39",
        "tag": "HK,SEA",
        "name_en": "My Filing Approval"
      }
    },
    {
      "mainTable": {
        "name_tc": "Key Risk Indicator (IT)",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Key Risk Indicator (IT)",
        "order_number": "1400",
        "homepage_url": "https://oa.dchbipoc.cc/spa/edc/static4mobile/index.html#/edcreportengine/sheetView/862b1abefbbb4f24840c8bff343cfd46?id=862b1abefbbb4f24840c8bff343cfd46&",
        "description_en": "IT only",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "IT only",
        "description_tc": "IT only",
        "mobileurl": "https://oa.dchbipoc.cc/spa/edc/static4mobile/index.html#/edcreportengine/sheetView/862b1abefbbb4f24840c8bff343cfd46?id=862b1abefbbb4f24840c8bff343cfd46&",
        "id": "40",
        "tag": "HK,SEA,CN",
        "name_en": "Key Risk Indicator (IT)"
      }
    },
    {
      "mainTable": {
        "name_tc": "Bounced Cheque Records",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "Bounced Cheque Records",
        "order_number": "",
        "homepage_url": "",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "41",
        "tag": "HK,SEA",
        "name_en": "Bounced Cheque Records"
      }
    },
    {
      "mainTable": {
        "name_tc": "Learning Management System",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Digital & Technology",
        "name_sc": "Learning Management System",
        "order_number": "",
        "homepage_url": "https://lms.dchbi.com/",
        "description_en": "",
        "type": "click",
        "iconx64": "",
        "application": "",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "https://lms.dchbi.com/",
        "id": "42",
        "tag": "HK,SEA,CN",
        "name_en": "Learning Management System"
      }
    },
    {
      "mainTable": {
        "name_tc": "公司列表报表",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "公司列表报表",
        "order_number": "",
        "homepage_url": "https://43.132.182.225/wui/index.html#/main/cube/search?customid=25&menuIds=-55,-41&menuPathIds=-55,-99,-22,-41&_key=x7aayv",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "43",
        "tag": "HK,SEA,CN",
        "name_en": "Lists of Companies"
      }
    },
    {
      "mainTable": {
        "name_tc": "Company Project Control Report",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "Company Project Control Report",
        "order_number": "",
        "homepage_url": "https://43.132.182.225/wui/index.html#/main/cube/search?customid=168&menuIds=-55,-35&menuPathIds=-55,-99,-29,-35&_key=gqbi9l",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "44",
        "tag": "HK,SEA,HK",
        "name_en": "Company Project Control Report"
      }
    },
    {
      "mainTable": {
        "name_tc": "Company Summary",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "Company Summary",
        "order_number": "",
        "homepage_url": "https://43.132.182.225/spa/workflow/static4form/index.html?_rdm=1739778034873#/main/workflow/req?iscreate=1&workflowid=108&_key=g0rbti",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "45",
        "tag": "HK,SEA,HK",
        "name_en": "Company Summary"
      }
    },
    {
      "mainTable": {
        "name_tc": "Company Reports",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance",
        "name_sc": "Company Reports",
        "order_number": "",
        "homepage_url": "https://43.132.182.225/wui/index.html#/main/cube/search?customid=167&menuIds=-55,-114&menuPathIds=-55,-99,-20,-40,-114&_key=3ru1aj",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "OA",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "46",
        "tag": "HK,SEA,HK",
        "name_en": "Company Reports"
      }
    },
    {
      "mainTable": {
        "name_tc": "Travel Request",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Travel & Entertainment",
        "name_sc": "Travel Request",
        "order_number": "12020",
        "homepage_url": "",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "47",
        "tag": "Reimbursements,HK,SEA",
        "name_en": "Travel Request"
      }
    },
    {
      "mainTable": {
        "name_tc": "Claim Request",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Travel & Entertainment",
        "name_sc": "Claim Request",
        "order_number": "12030",
        "homepage_url": "",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "48",
        "tag": "Reimbursements,HK,SEA",
        "name_en": "Claim Request"
      }
    },
    {
      "mainTable": {
        "name_tc": "My Claims",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Travel & Entertainment",
        "name_sc": "My Claims",
        "order_number": "12050",
        "homepage_url": "",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "49",
        "tag": "Reimbursements,HK,SEA",
        "name_en": "My Claims"
      }
    },
    {
      "mainTable": {
        "name_tc": "Entertainment Request",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Travel & Entertainment",
        "name_sc": "Entertainment Request",
        "order_number": "12000",
        "homepage_url": "",
        "description_en": "",
        "type": "Form",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "50",
        "tag": "Reimbursements,HK,SEA",
        "name_en": "Entertainment Request"
      }
    },
    {
      "mainTable": {
        "name_tc": "My Requests",
        "allowroles": "安全级别为0-100的所有人",
        "business": "Group Finance - Travel & Entertainment",
        "name_sc": "My Requests",
        "order_number": "12040",
        "homepage_url": "",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "Yonyou",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "51",
        "tag": "Reimbursements,HK,SEA",
        "name_en": "My Requests"
      }
    },
    {
      "mainTable": {
        "name_tc": "Properties Report",
        "allowroles": "",
        "business": "Group Services Division",
        "name_sc": "Properties Report",
        "order_number": "31020",
        "homepage_url": "https://eportal.dch-holdings.com/DCHeFormPropertyLeasing/SearchApplications.aspx?Mode=5&ResetSession=True",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "52",
        "tag": "HK,SEA",
        "name_en": "Properties Report"
      }
    },
    {
      "mainTable": {
        "name_tc": "Construction Projects",
        "allowroles": "",
        "business": "Group Services Division",
        "name_sc": "Construction Projects",
        "order_number": "30000",
        "homepage_url": "https://eportal.dch-holdings.com/DCHeFormeGSD2/AllRecords.aspx",
        "description_en": "GSD",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "GSD",
        "description_tc": "GSD",
        "mobileurl": "",
        "id": "53",
        "tag": "HK,SEA",
        "name_en": "Construction Projects"
      }
    },
    {
      "mainTable": {
        "name_tc": "Expiry Report",
        "allowroles": "",
        "business": "Group Services Division",
        "name_sc": "Expiry Report",
        "order_number": "31040",
        "homepage_url": "https://eportal.dch-holdings.com/DCHeFormPropertyLeasing/SearchApplications.aspx?Mode=4&ResetSession=True",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "54",
        "tag": "HK,SEA",
        "name_en": "Expiry Report"
      }
    },
    {
      "mainTable": {
        "name_tc": "DCH Owned Properties Report",
        "allowroles": "",
        "business": "Group Services Division",
        "name_sc": "DCH Owned Properties Report",
        "order_number": "31030",
        "homepage_url": "https://eportal.dch-holdings.com/DCHeFormPropertyLeasing/SearchApplications.aspx?ResetSession=True&Mode=6",
        "description_en": "",
        "type": "Data",
        "iconx64": "",
        "application": "ePortal",
        "description_sc": "",
        "description_tc": "",
        "mobileurl": "",
        "id": "55",
        "tag": "HK,SEA",
        "name_en": "DCH Owned Properties Report"
      }
    }
  ]
  try {
    const query = await readBody(event)
    let response = hkData

    if (query.type === 'Application') {
      response = applicationData
    } else if (query.type === 'Business') {
      response = businessData
    } else if (query.tag === 'CN') {
      response = cnData
    } else if (query.tag === 'HK') {
      response = hkData
    } else if (query.tag === 'SEA') {
      response = seaData
    }

    return response
  } catch (error) {
    console.log(error)
    return []
  }
})
