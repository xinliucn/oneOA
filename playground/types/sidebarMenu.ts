export type SidebarMenuPathResolver = string | ((locale: string) => string)
export type SidebarMenuPlatform = 'mobile' | 'desktop'

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
  visibleOn?: SidebarMenuPlatform[]
  children?: SidebarMenuConfigItem[]
}

export interface SidebarMenuResolvedItem extends Omit<SidebarMenuConfigItem, 'children'> {
  label: string
  platform: SidebarMenuPlatform
  target: SidebarMenuPathConfig
  resolvedPath: string
  children?: SidebarMenuResolvedItem[]
}
