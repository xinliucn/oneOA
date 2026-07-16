import { getDepartmentIntranetUrl, getEShopUrl } from '~/utils/departmentIntranet'
import type { SidebarMenuConfigItem, SidebarMenuPathConfig } from '~/types/sidebarMenu'

// 权限点必须与 Weaver 返回的 user.permissions 保持一致；新增或调整菜单时同步更新权限中心。

export const resolveSidebarMenuPath = (config: SidebarMenuPathConfig, locale: string) => {
  return typeof config.path === 'function' ? config.path(locale) : config.path
}

export const sidebarMenuConfig = [
  {
    key: 'news',
    icon: 'document',
    labelKey: 'nav.news',
    permissionKey: 'sidebar:news',
    mobile: { type: 'route', path: '/mobile/news' },
    desktop: { type: 'route', path: '/desktop/news' },
  },
  {
    key: 'company-information',
    icon: 'info',
    labelKey: 'nav.companyInformation',
    permissionKey: 'sidebar:companyInformation',
    mobile: { type: 'route', path: '/mobile/companyInformation' },
    desktop: { type: 'route', path: '/desktop/company-information' },
  },
  {
    key: 'company-documents',
    icon: 'download',
    labelKey: 'nav.companyDocuments',
    permissionKey: 'sidebar:companyDocuments',
    mobile: { type: 'route', path: '/mobile/companyDocuments' },
    desktop: { type: 'route', path: '/desktop/company-documents' },
  },
  {
    key: 'applications',
    icon: 'apps',
    labelKey: 'nav.applications',
    permissionKey: 'sidebar:applications',
    mobile: { type: 'route', path: '/mobile', tabIndex: 3 },
    desktop: { type: 'route', path: '/desktop/applications' },
  },
  {
    key: 'department-intranets',
    icon: 'building',
    labelKey: 'nav.departmentIntranets',
    permissionKey: 'sidebar:departmentIntranets',
    mobile: { type: 'route', path: '/mobile/intranets' },
    desktop: { type: 'link', path: getDepartmentIntranetUrl },
  },
  {
    key: 'todo',
    icon: 'document',
    labelKey: 'nav.todo',
    permissionKey: 'sidebar:todo',
    mobile: { type: 'route', path: '/mobile', tabIndex: 2 },
    desktop: { type: 'route', path: '/desktop/todo' },
  },
  {
    key: 'e-shop',
    icon: 'shop',
    labelKey: 'nav.eShop',
    permissionKey: 'sidebar:eShop',
    mobile: { type: 'link', path: getEShopUrl },
    desktop: { type: 'link', path: getEShopUrl },
  },
] satisfies SidebarMenuConfigItem[]
