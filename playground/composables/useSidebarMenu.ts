import { sidebarMenuConfig } from '~/constants/sidebarMenu'
import type {
  SidebarMenuPlatform,
  SidebarMenuResolvedItem,
} from '~/types/sidebarMenu'
import { resolveSidebarMenuItems } from '~/utils/sidebarMenu'

export const useSidebarMenu = (platform: SidebarMenuPlatform = 'mobile') => {
  const { locale, t } = useAppI18n()
  const { openGuardedUrl } = useNetworkGuard()
  const activeTab = useState('mobile:activeTab', () => 1)

  const menuItems = computed<SidebarMenuResolvedItem[]>(() => {
    return resolveSidebarMenuItems(sidebarMenuConfig, platform, locale.value, t)
  })

  const menuItemMap = computed(() => {
    const flattenMenuItems = (items: SidebarMenuResolvedItem[]): SidebarMenuResolvedItem[] => {
      return items.flatMap(item => [item, ...flattenMenuItems(item.children || [])])
    }

    return new Map(flattenMenuItems(menuItems.value).map(item => [item.key, item]))
  })

  const getMenuItem = (key: string) => {
    return menuItemMap.value.get(key)
  }

  const hasMenuAccess = (key: string) => {
    return !!getMenuItem(key)
  }

  const navigateByMenuItem = async (itemOrKey: SidebarMenuResolvedItem | string) => {
    const item = typeof itemOrKey === 'string'
      ? getMenuItem(itemOrKey)
      : itemOrKey

    if (!item) {
      return
    }

    if (platform === 'mobile' && typeof item.target.tabIndex === 'number') {
      activeTab.value = item.target.tabIndex
    }

    if (item.target.type === 'link') {
      await openGuardedUrl(item.resolvedPath, '_blank')
      return
    }

    return navigateTo(item.resolvedPath)
  }

  return {
    menuItems,
    getMenuItem,
    hasMenuAccess,
    navigateByMenuItem,
  }
}
