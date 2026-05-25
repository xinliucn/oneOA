import { proxyRequest } from '~/server/utils/requestProxy'
import type {
  ApplicationCatalogEntry,
  ApplicationCatalogRequestBody,
} from '~/types/applicationCatalog'

const applicationMockItems: ApplicationCatalogEntry[] = [
  {
    mainTable: {
      id: '1',
      tag: 'HK',
      type: 'Application',
      iconx64: 'ITServiceDesk.png',
      name_en: 'IT Service Portal',
      name_sc: 'IT 服务门户',
      name_tc: 'IT 服務門戶',
      business: 'Group Digital & Technology',
      category: '',
      isactive: '是',
      mobileurl: 'https://dch.service-now.com/sp',
      allowroles: '角色( 系统管理员角色)共享级别=部门  安全级别为0-100的角色成员，角色( CRM管理员)共享级别=部门  安全级别为0-100的角色成员',
      application: 'IT Service Portal',
      homepage_url: 'https://dch.service-now.com/sp',
      order_number: '1200',
      description_en: 'Group IT support platform',
      description_sc: '集團 IT 支持平台',
      description_tc: '集團 IT 支援平台',
    },
  },
  {
    mainTable: {
      id: '3',
      tag: 'HK,CN,SEA',
      type: 'Application',
      iconx64: 'Group 285.png',
      name_en: 'OA',
      name_sc: '办公自动化系统',
      name_tc: '辦公自動化系統',
      business: 'Group Service',
      category: '',
      isactive: '是',
      mobileurl: 'https://oa.dchbipoc.cc/spa/coms/static4mobile/index.html#/menu-preview?id=appDefaultPage&checkAccess=1',
      allowroles: '安全级别为0-100的所有人',
      application: 'OA',
      homepage_url: '/',
      order_number: '1',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: '6',
      tag: 'HK',
      type: 'Application',
      iconx64: 'yonyou.png',
      name_en: 'Yonyou',
      name_sc: '用友',
      name_tc: '用友',
      business: 'Group Finance',
      category: '',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'Yonyou',
      homepage_url: '1',
      order_number: '3',
      description_en: 'EN: Financial management system简: 财务管理系统繁: 財務管理系統',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: '7',
      tag: 'HK',
      type: 'Application',
      iconx64: 'italcant.png',
      name_en: 'Learning Management System',
      name_sc: '学习管理系统',
      name_tc: '學習管理系統',
      business: 'Group Service',
      category: '',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'Learning Management System',
      homepage_url: '',
      order_number: '5',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: '8',
      tag: 'HK',
      type: 'Application',
      iconx64: 'eLeave.png',
      name_en: 'HRMS',
      name_sc: '人力资源管理系统',
      name_tc: '人力資源管理系統',
      business: 'Group Human Resources',
      category: '',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'HRMS',
      homepage_url: 'https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/',
      order_number: '4',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: '14',
      tag: 'HK',
      type: 'Application',
      iconx64: 'Test PowerBI Report.png',
      name_en: 'PowerBI Report',
      name_sc: 'PowerBI报告',
      name_tc: 'PowerBI報告',
      business: 'TEST',
      category: '',
      isactive: '是',
      mobileurl: 'https://aka.ms/AA10pdw6',
      allowroles: '人员( Jasen Chan Chun Hong Felix)，安全级别为0-100的所有人',
      application: 'TEST',
      homepage_url: 'https://aka.ms/AA10pdw6',
      order_number: '99999',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
]

const businessMockItems: ApplicationCatalogEntry[] = [
  {
    mainTable: {
      id: '4',
      tag: 'HK',
      type: 'Business',
      iconx64: 'user_attributes_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24 2.png',
      name_en: 'Group Legal & Compliance',
      name_sc: '集团法律与合规',
      name_tc: '集團法律與合規',
      business: 'Group Legal & Compliance',
      category: '',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: '',
      homepage_url: '',
      order_number: '3000',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
]

const groupMockItems: ApplicationCatalogEntry[] = [
  {
    mainTable: {
      id: 'legal-form-1',
      tag: 'HK',
      type: 'Weaver Process',
      iconx64: '',
      name_en: 'Order Engagement Approval',
      name_sc: '订单委聘审批',
      name_tc: '訂單委聘審批',
      business: 'Group Legal & Compliance',
      category: 'New Forms',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'Order Engagement Approval',
      homepage_url: '/',
      order_number: '1',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: 'legal-form-2',
      tag: 'HK',
      type: 'Weaver Process Form',
      iconx64: '',
      name_en: 'IT Demand Creation',
      name_sc: 'IT需求创建',
      name_tc: 'IT需求建立',
      business: 'Group Legal & Compliance',
      category: 'New Forms',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'IT Demand Creation',
      homepage_url: '/',
      order_number: '2',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: 'legal-form-3',
      tag: 'HK',
      type: 'Weaver Process Form',
      iconx64: '',
      name_en: 'IT Project Change Submission',
      name_sc: 'IT项目变更提交',
      name_tc: 'IT項目變更提交',
      business: 'Group Legal & Compliance',
      category: 'New Forms',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'IT Project Change Submission',
      homepage_url: '/',
      order_number: '3',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: 'legal-form-4',
      tag: 'HK',
      type: 'Weaver Process Form',
      iconx64: '',
      name_en: 'IT Project Creation',
      name_sc: 'IT项目创建',
      name_tc: 'IT項目建立',
      business: 'Group Legal & Compliance',
      category: 'New Forms',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'IT Project Creation',
      homepage_url: '/',
      order_number: '4',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: 'legal-data-1',
      tag: 'HK',
      type: 'Weaver Data',
      iconx64: '',
      name_en: 'Order List',
      name_sc: '订单列表',
      name_tc: '訂單列表',
      business: 'Group Legal & Compliance',
      category: 'Data',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'Order List',
      homepage_url: '/',
      order_number: '5',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: 'legal-data-2',
      tag: 'HK',
      type: 'Weaver Data',
      iconx64: '',
      name_en: 'IT Demand List',
      name_sc: 'IT需求列表',
      name_tc: 'IT需求列表',
      business: 'Group Legal & Compliance',
      category: 'Data',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'IT Demand List',
      homepage_url: '/',
      order_number: '6',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
  {
    mainTable: {
      id: 'legal-data-3',
      tag: 'HK',
      type: 'Weaver Data',
      iconx64: '',
      name_en: 'IT Project List',
      name_sc: 'IT项目列表',
      name_tc: 'IT項目列表',
      business: 'Group Legal & Compliance',
      category: 'Data',
      isactive: '是',
      mobileurl: '',
      allowroles: '安全级别为0-100的所有人',
      application: 'IT Project List',
      homepage_url: '/',
      order_number: '7',
      description_en: '',
      description_sc: '',
      description_tc: '',
    },
  },
]

const normalizeRequestValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim()
  }

  return ''
}

const matchesMockValue = (candidate: unknown, target: unknown) => {
  const normalizedTarget = normalizeRequestValue(target)
  if (!normalizedTarget) {
    return true
  }

  const normalizedCandidate = String(candidate || '').trim().toLowerCase()
  if (!normalizedCandidate) {
    return false
  }

  if (Array.isArray(normalizedTarget)) {
    return normalizedTarget.some(item => normalizedCandidate === item.toLowerCase())
  }

  return normalizedCandidate === normalizedTarget.toLowerCase()
}

const matchesMockTag = (candidate: unknown, target: unknown) => {
  const normalizedTarget = normalizeRequestValue(target)
  if (!normalizedTarget) {
    return true
  }

  const candidateTags = String(candidate || '')
    .split(/[/,]/)
    .map(item => item.trim().toLowerCase())
    .filter(Boolean)

  if (Array.isArray(normalizedTarget)) {
    return normalizedTarget.some(item => candidateTags.includes(item.toLowerCase()))
  }

  return candidateTags.includes(normalizedTarget.toLowerCase())
}

const getMockItems = (body: ApplicationCatalogRequestBody) => {
  const type = body.type
  const normalizedType = normalizeRequestValue(type)
  const typeValues = Array.isArray(normalizedType) ? normalizedType : [normalizedType]
  const normalizedTypes = typeValues.map(item => item.toLowerCase())
  const baseItems = (() => {
    if (normalizedTypes.includes('application')) {
      return applicationMockItems
    }

    if (normalizedTypes.includes('business')) {
      return businessMockItems
    }

    if (normalizedTypes.includes('group')) {
      return groupMockItems
    }

    if (normalizedTypes.some(Boolean)) {
      return []
    }

    return [...applicationMockItems, ...businessMockItems, ...groupMockItems]
  })()

  return baseItems.filter((item) => {
    return matchesMockValue(item.mainTable?.business || item.business, body.business)
      && matchesMockTag(item.mainTable?.tag || item.tag, body.tag)
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<ApplicationCatalogRequestBody>(event).catch<ApplicationCatalogRequestBody>(() => ({}))

  if (config.mockEnabled) {
    return getMockItems(body)
  }

  try {
    return await proxyRequest(event, '/api/r/internal/ecology_oa/app_catalog', {
      method: 'POST',
      body: {
        ...(body.business ? { business: body.business } : {}),
        ...(body.type ? { type: body.type } : {}),
        ...(body.tag ? { tag: body.tag } : {}),
      },
      errorMessage: 'Fetch application catalog failed',
    })
  }
  catch (error) {
    console.log(error)
    return []
  }
})
