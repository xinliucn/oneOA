import { getDepartmentIntranetUrl, getEShopUrl } from '~/utils/departmentIntranet'
import type { SidebarMenuConfigItem } from '~/types/sidebarMenu'

// 菜单层级与平台可见性统一在此配置，权限过滤将在后续需求中接入。

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
    children: [
      {
        key: 'company-information-overview',
        icon: 'info',
        labelKey: 'pages.intranets.navigation.overview',
        mobile: { type: 'route', path: '/mobile/intranets/overview' },
        desktop: { type: 'route', path: '/desktop/company-information/overview' },
      },
      {
        key: 'company-information-leadership',
        icon: 'info',
        labelKey: 'pages.intranets.navigation.leadership',
        mobile: { type: 'route', path: '/mobile/intranets/leadership' },
        desktop: { type: 'route', path: '/desktop/company-information/leadership' },
      },
      {
        key: 'company-information-vision-mission-values',
        icon: 'info',
        labelKey: 'pages.intranets.navigation.visionMissionValues',
        mobile: { type: 'route', path: '/mobile/intranets/vision-mission-values' },
        desktop: { type: 'route', path: '/desktop/company-information/vision-mission-values' },
      },
    ],
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
    visibleOn: ['desktop'],
    mobile: { type: 'route', path: '/mobile', tabIndex: 3 },
    desktop: { type: 'route', path: '/desktop/applications' },
  },
  {
    key: 'department-intranets',
    icon: 'building',
    labelKey: 'nav.departmentIntranets',
    mobile: { type: 'route', path: '/mobile/intranets' },
    desktop: { type: 'link', path: getDepartmentIntranetUrl },
  },
  {
    key: 'todo',
    icon: 'document',
    labelKey: 'nav.todo',
    visibleOn: ['desktop'],
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
