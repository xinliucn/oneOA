import { resolveSidebarMenuPath, sidebarMenuConfig } from '~/constants/sidebarMenu'
import type {
  SidebarMenuConfigItem,
  SidebarMenuPlatform,
  SidebarMenuResolvedItem,
} from '~/types/sidebarMenu'
import type { AuthUser } from '~/types/auth'

const normalizeRoles = (roles?: string[]) => {
  return (roles || [])
    .map(role => role.trim().toLowerCase())
    .filter(Boolean)
}

const normalizePermissions = (permissions?: string[]) => {
  return new Set(
    (permissions || [])
      .map(permission => permission.trim())
      .filter(Boolean),
  )
}

export const canAccessSidebarMenuItem = (item: SidebarMenuConfigItem, user?: AuthUser | null) => {
  if (user?.is_admin === true) {
    return true
  }

  if (item.permissionKey && !normalizePermissions(user?.permissions).has(item.permissionKey)) {
    return false
  }

  if (item.minimumRolePriority && (user?.role_priority || 0) < item.minimumRolePriority) {
    return false
  }

  if (!item.allowedRoles?.length) {
    return true
  }

  const normalizedRoles = new Set(normalizeRoles([
    ...(user?.roles || []),
    ...(user?.role_level ? [user.role_level] : []),
  ]))
  return item.allowedRoles.some(role => normalizedRoles.has(role.trim().toLowerCase()))
}

export const useSidebarMenu = (platform: SidebarMenuPlatform = 'mobile') => {
  const { user } = useAuth()
  const { locale, t } = useAppI18n()
  const { openGuardedUrl } = useNetworkGuard()
  const activeTab = useState('mobile:activeTab', () => 1)

  const userRoles = computed(() => normalizeRoles(user.value?.roles))
  const userPermissions = computed(() => normalizePermissions(user.value?.permissions))

  const menuItems = computed<SidebarMenuResolvedItem[]>(() => {
    return sidebarMenuConfig
      .filter(item => canAccessSidebarMenuItem(item, user.value))
      .map((item) => {
        const target = item[platform]

        return {
          ...item,
          label: t(item.labelKey),
          platform,
          target,
          resolvedPath: resolveSidebarMenuPath(target, locale.value),
        }
      })
  })

  const menuItemMap = computed(() => {
    return new Map(menuItems.value.map(item => [item.key, item]))
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
    userRoles,
    userPermissions,
    menuItems,
    getMenuItem,
    hasMenuAccess,
    navigateByMenuItem,
  }
}
