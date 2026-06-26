import { getDepartmentIntranetUrl, getEShopUrl } from '~/utils/departmentIntranet'
import type { SidebarMenuConfigItem, SidebarMenuPathConfig } from '~/types/sidebarMenu'

export const resolveSidebarMenuPath = (config: SidebarMenuPathConfig, locale: string) => {
  return typeof config.path === 'function' ? config.path(locale) : config.path
}

export const sidebarMenuConfig = [
  {
    key: 'news',
    icon: 'document',
    labelKey: 'nav.news',
    mobile: { type: 'route', path: '/mobile/news' },
    desktop: { type: 'route', path: '/desktop/news' },
  },
  {
    key: 'company-information',
    icon: 'info',
    labelKey: 'nav.companyInformation',
    mobile: { type: 'route', path: '/mobile/companyInformation' },
    desktop: { type: 'route', path: '/desktop/company-information' },
  },
  {
    key: 'company-documents',
    icon: 'download',
    labelKey: 'nav.companyDocuments',
    mobile: { type: 'route', path: '/mobile/companyDocuments' },
    desktop: { type: 'route', path: '/desktop/company-documents' },
  },
  {
    key: 'applications',
    icon: 'apps',
    labelKey: 'nav.applications',
    mobile: { type: 'route', path: '/mobile', tabIndex: 3 },
    desktop: { type: 'route', path: '/desktop/applications' },
  },
  {
    key: 'department-intranets',
    icon: 'building',
    labelKey: 'nav.departmentIntranets',
    mobile: { type: 'link', path: getDepartmentIntranetUrl },
    desktop: { type: 'link', path: getDepartmentIntranetUrl },
  },
  {
    key: 'todo',
    icon: 'document',
    labelKey: 'nav.todo',
    mobile: { type: 'route', path: '/mobile', tabIndex: 2 },
    desktop: { type: 'route', path: '/desktop/todo' },
  },
  {
    key: 'e-shop',
    icon: 'shop',
    labelKey: 'nav.eShop',
    mobile: { type: 'link', path: getEShopUrl },
    desktop: { type: 'link', path: getEShopUrl },
  },
] satisfies SidebarMenuConfigItem[]
