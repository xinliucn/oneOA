export interface SidebarMenuConfigItem {
  key: string
  icon: string
  labelKey: string
  path?: string
  tabIndex?: number
}

export const sidebarMenuConfig = [
  { key: 'news', icon: 'document', labelKey: 'nav.news', path: '/mobile/news' },
  { key: 'company-information', icon: 'info', labelKey: 'nav.companyInformation', path: '/mobile/companyInformation' },
  { key: 'company-documents', icon: 'download', labelKey: 'nav.companyDocuments', path: '/mobile/companyDocuments' },
  { key: 'applications', icon: 'apps', labelKey: 'nav.applications', path: '/mobile', tabIndex: 3 },
  { key: 'department-intranets', icon: 'building', labelKey: 'nav.departmentIntranets', path: '/mobile/departmentIntranets' },
  { key: 'dashboards', icon: 'dashboard', labelKey: 'nav.dashboards' },
  { key: 'todo', icon: 'todo', labelKey: 'nav.todo', path: '/mobile', tabIndex: 2 },
  { key: 'e-learning', icon: 'education', labelKey: 'nav.eLearning' },
  { key: 'e-shop', icon: 'shop', labelKey: 'nav.eShop' },
] satisfies SidebarMenuConfigItem[]
