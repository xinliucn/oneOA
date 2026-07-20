import type {
  SidebarMenuConfigItem,
  SidebarMenuPlatform,
  SidebarMenuResolvedItem,
} from '../types/sidebarMenu'

export const resolveSidebarMenuItems = (
  items: SidebarMenuConfigItem[],
  platform: SidebarMenuPlatform,
  locale: string,
  translate: (key: string) => string,
): SidebarMenuResolvedItem[] => {
  return items.flatMap((item) => {
    if (item.visibleOn && !item.visibleOn.includes(platform)) {
      return []
    }

    const target = item[platform]
    const resolvedPath = typeof target.path === 'function'
      ? target.path(locale)
      : target.path

    return [{
      ...item,
      children: resolveSidebarMenuItems(item.children || [], platform, locale, translate),
      label: translate(item.labelKey),
      platform,
      target,
      resolvedPath,
    }]
  })
}
