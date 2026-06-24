import type { NotificationCheckResponse, NotificationItem, NotificationListResponse } from '~/types/notification'
import { useCurrentUserId } from '~/composables/useCurrentUserId'
import { getLatestNotificationId, isNotificationUnread, sortNotificationsForDisplay } from '~/utils/notification'

const POLLING_INTERVAL = 15 * 1000

// 模块级状态：多个组件共享同一套轮询、可见性监听和启动流程
let pollingTimer: ReturnType<typeof setInterval> | null = null
let pollingSubscribers = 0
let visibilityListenerBound = false
let bootstrapPromise: Promise<void> | null = null
let silentRefreshHandler: (() => Promise<void>) | null = null

// 页面从后台回到前台时，静默刷新通知列表
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && silentRefreshHandler) {
    void silentRefreshHandler()
  }
}

// 合并缓存/推送数据，按 id 去重，并统一保持展示排序
const mergeNotifications = (current: NotificationItem[], incoming: NotificationItem[]) => {
  const merged = new Map<string, NotificationItem>()

  for (const item of [...current, ...incoming]) {
    merged.set(String(item.id), item)
  }

  return sortNotificationsForDisplay(Array.from(merged.values()))
}

export const useNotification = () => {
  // 全局通知状态：使用 useState 确保铃铛、面板、插件共享同一份数据
  const notifications = useState<NotificationItem[]>('notifications:list', () => [])
  const lastSyncedAt = useState<number>('notifications:last-synced-at', () => 0)
  const isHydrated = useState<boolean>('notifications:is-hydrated', () => false)
  const loading = useState<boolean>('notifications:loading', () => false)
  const syncing = useState<boolean>('notifications:syncing', () => false)
  const checking = useState<boolean>('notifications:checking', () => false)
  const serverUnreadCount = useState<number | null>('notifications:server-unread-count', () => null)

  const db = useNotificationDB()
  const { getCurrentUserId } = useCurrentUserId()

  const localUnreadCount = computed(() => notifications.value.filter(item => isNotificationUnread(item)).length)
  const unreadCount = computed(() => serverUnreadCount.value ?? localUnreadCount.value)

  // 将当前通知列表和同步时间写入 IndexedDB，供下次进入页面快速恢复
  const persist = async () => {
    if (!import.meta.client) {
      return
    }

    await Promise.all([
      db.writeNotifications(notifications.value),
      db.setLastSyncAt(lastSyncedAt.value),
      db.setLatestCachedNotificationId(getLatestNotificationId(notifications.value)),
    ])
  }

  // 首次进入时从 IndexedDB 读取缓存，先渲染本地数据再等待网络同步
  const hydrateFromCache = async () => {
    if (!import.meta.client || isHydrated.value) {
      return
    }

    const [cachedNotifications, cachedLastSyncedAt] = await Promise.all([
      db.readNotifications(),
      db.getLastSyncAt(),
    ])

    if (cachedNotifications.length > 0) {
      notifications.value = sortNotificationsForDisplay(cachedNotifications)
    }

    lastSyncedAt.value = cachedLastSyncedAt || lastSyncedAt.value
    isHydrated.value = true
  }

  const getLocalLatestNotificationId = async () => {
    return await db.getLatestCachedNotificationId() || getLatestNotificationId(notifications.value)
  }

  // 从服务端拉取最新通知列表；silent=true 时不触发页面加载态
  const syncNotifications = async ({
    silent = false,
  }: {
    silent?: boolean
  } = {}) => {
    if (syncing.value) {
      return
    }

    syncing.value = true
    loading.value = !silent

    try {
      const response = await $fetch<NotificationListResponse>('/api/notifications', {
        method: 'GET',
      })
      if (!Array.isArray(response?.items)) {
        return
      }

      notifications.value = sortNotificationsForDisplay(response.items)
      serverUnreadCount.value = response.unreadCount
      lastSyncedAt.value = response.syncedAt || Date.now()

      await persist()
    }
    catch (error) {
      console.error('Sync notification failed:', error)
    }
    finally {
      loading.value = false
      syncing.value = false
    }
  }

  // 对外刷新入口：默认显示加载态，轮询/可见性刷新使用 silent 模式
  const refreshFromServer = ({ silent = false }: { silent?: boolean } = {}) => {
    return syncNotifications({ silent })
  }

  const checkNotifications = async () => {
    if (checking.value || syncing.value) {
      return
    }

    checking.value = true

    try {
      const response = await $fetch<NotificationCheckResponse>('/api/notifications', {
        method: 'GET',
        query: {
          mode: 'check',
        },
      })

      serverUnreadCount.value = response.unreadCount

      const remoteLatestId = response.latestId ? String(response.latestId) : null
      const localLatestId = await getLocalLatestNotificationId()

      if (remoteLatestId && remoteLatestId !== localLatestId) {
        await syncNotifications({ silent: true })
        return
      }

      lastSyncedAt.value = response.checkedAt || Date.now()
      if (import.meta.client) {
        await db.setLastSyncAt(lastSyncedAt.value)
      }
    }
    catch (error) {
      console.error('Check notification failed:', error)
    }
    finally {
      checking.value = false
    }
  }

  silentRefreshHandler = checkNotifications

  // 接收 Web Push 消息，写入内存状态和 IndexedDB
  const ingestNotification = async (item: NotificationItem) => {
    notifications.value = mergeNotifications(notifications.value, [item])
    serverUnreadCount.value = localUnreadCount.value
    lastSyncedAt.value = Date.now()

    if (import.meta.client) {
      await Promise.all([
        db.upsertNotification(item),
        db.setLastSyncAt(lastSyncedAt.value),
        db.setLatestCachedNotificationId(getLatestNotificationId(notifications.value)),
      ])
    }
  }

  // 标记单条通知为已读：先更新本地和缓存，再后台同步服务端
  const markAsRead = async (id: NotificationItem['id']) => {
    const target = notifications.value.find(item => String(item.id) === String(id))

    if (!target || !isNotificationUnread(target)) {
      return
    }

    const readAt = new Date().toISOString()
    target.readAt = readAt
    target.is_read = '1'
    notifications.value = sortNotificationsForDisplay([...notifications.value])
    serverUnreadCount.value = localUnreadCount.value

    if (import.meta.client) {
      await db.markNotificationAsRead(String(target.id), readAt)
    }

    try {
      await $fetch(`/api/notifications/${encodeURIComponent(String(id))}`, {
        method: 'POST',
        body: {
          id,
          ...(getCurrentUserId() ? { user_id: getCurrentUserId() } : {}),
        },
      })
    }
    catch (error) {
      console.error('Mark notification as read failed:', error)
    }
  }

  // 处理 Service Worker 转发的新通知消息
  const handleServiceWorkerMessage = (payload: any) => {
    if (!payload || typeof payload !== 'object') {
      return
    }

    const message = payload as { type?: string, item?: NotificationItem }
    if (message.type === 'notification:push' && message.item) {
      return ingestNotification(message.item)
    }
  }

  // 初始化通知：先水合本地缓存，再静默同步服务端数据；并发调用只执行一次
  const bootstrap = async () => {
    if (!import.meta.client) {
      return
    }

    bootstrapPromise ||= (async () => {
      await hydrateFromCache()
      await refreshFromServer({ silent: true })
    })().finally(() => {
      bootstrapPromise = null
    })

    return bootstrapPromise
  }

  // 启动轮询和 visibilitychange 监听；支持多个组件重复订阅
  const startPolling = (interval = POLLING_INTERVAL) => {
    if (!import.meta.client) {
      return
    }

    pollingSubscribers += 1

    if (!visibilityListenerBound) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      visibilityListenerBound = true
    }

    pollingTimer ||= setInterval(handleVisibilityChange, interval)
  }

  // 停止当前订阅者；所有订阅者都退出后才真正清理全局轮询和监听
  const stopPolling = () => {
    if (pollingSubscribers > 0) {
      pollingSubscribers -= 1
    }

    if (pollingSubscribers > 0) {
      return
    }

    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }

    if (visibilityListenerBound) {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      visibilityListenerBound = false
    }

    silentRefreshHandler = null
  }

  return {
    notifications,
    unreadCount,
    localUnreadCount,
    loading,
    checking,
    isHydrated,
    lastSyncedAt,
    bootstrap,
    hydrateFromCache,
    refreshFromServer,
    checkNotifications,
    ingestNotification,
    markAsRead,
    handleServiceWorkerMessage,
    startPolling,
    stopPolling,
  }
}
