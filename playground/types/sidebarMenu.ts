export type SidebarMenuPathResolver = string | ((locale: string) => string)

export interface SidebarMenuPathConfig {
  type: 'route' | 'link'
  path: SidebarMenuPathResolver
  tabIndex?: number
}

export interface SidebarMenuConfigItem {
  key: string
  icon: string
  labelKey: string
  mobile: SidebarMenuPathConfig
  desktop: SidebarMenuPathConfig
}
