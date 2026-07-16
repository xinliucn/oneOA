import type { AuthRolePriority } from './auth'

export type SidebarMenuPathResolver = string | ((locale: string) => string)
export type SidebarMenuPlatform = 'mobile' | 'desktop'

export interface SidebarMenuPathConfig {
  type: 'route' | 'link'
  path: SidebarMenuPathResolver
  tabIndex?: number
}

export interface SidebarMenuPermissionConfig {
  permissionKey?: string
  allowedRoles?: string[]
  minimumRolePriority?: AuthRolePriority
}

export interface SidebarMenuConfigItem extends SidebarMenuPermissionConfig {
  key: string
  icon: string
  labelKey: string
  mobile: SidebarMenuPathConfig
  desktop: SidebarMenuPathConfig
}

export interface SidebarMenuResolvedItem extends SidebarMenuConfigItem {
  label: string
  platform: SidebarMenuPlatform
  target: SidebarMenuPathConfig
  resolvedPath: string
}
