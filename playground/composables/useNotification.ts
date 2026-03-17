import type {
  NotificationDetailResponse,
  NotificationItem,
  NotificationListResponse,
} from '~/types/notification'

// 默认每页加载条数
const DEFAULT_PAGE_SIZE = 20
// 默认轮询间隔：60 秒
const DEFAULT_POLLING_INTERVAL = 60 * 1000

// 模块级单例变量，跨组件共享，避免重复注册
let pollingTimer: ReturnType<typeof setInterval> | null = null
let visibilityListenerBound = false
let visibilityRefreshHandler: (() => Promise<void>) | null = null
// 防止 bootstrap 被并发调用多次
let bootstrapPromise: Promise<void> | null = null

/**
 * 合并两个通知列表，以 id 去重，incoming 覆盖 base 中同 id 的项，
 * 最终按 createdAt 降序排列（最新的在前）
 */
const mergeById = (base: NotificationItem[], incoming: NotificationItem[]) => {
  const merged = new Map<string, NotificationItem>()

  for (const item of [...base, ...incoming]) {
    merged.set(item.id, item)
  }

  return Array.from(merged.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * 页面从后台切回前台时触发静默刷新
 * 注册在 document visibilitychange 事件上
 */
const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && visibilityRefreshHandler) {
    void visibilityRefreshHandler()
  }
}

export const useNotification = () => {
  // ─── 状态（所有组件共享同一份 useState key） ───────────────────────────
  const notifications = useState<NotificationItem[]>('notifications:list', () => [])
  const total = useState<number>('notifications:total', () => 0)
  const page = useState<number>('notifications:page', () => 1)
  const pageSize = useState<number>('notifications:page-size', () => DEFAULT_PAGE_SIZE)
  // 上次从服务端同步的时间戳（毫秒）
  const lastSyncedAt = useState<number>('notifications:last-synced-at', () => 0)
  // 是否已从 IndexedDB 完成首次水合
  const isHydrated = useState<boolean>('notifications:is-hydrated', () => false)
  // 首次加载时的 loading 状态（用于显示骨架屏/加载中）
  const loading = useState<boolean>('notifications:loading', () => false)
  // 正在与服务端同步（防止并发请求）
  const syncing = useState<boolean>('notifications:syncing', () => false)

  const db = useNotificationDB()

  // ─── 派生状态 ──────────────────────────────────────────────────────────
  // 未读通知数量（用于铃铛角标）
  const unreadCount = computed(() => notifications.value.filter((item) => !item.readAt).length)
  // 服务端是否还有更多数据可加载
  const hasMore = computed(() => notifications.value.length < total.value)
  const unreadNotifications = computed(() => notifications.value.filter((item) => !item.readAt))
  const readNotifications = computed(() => notifications.value.filter((item) => Boolean(item.readAt)))

  // ─── 方法 ──────────────────────────────────────────────────────────────

  /**
   * 从 IndexedDB 读取本地缓存，立即渲染已有数据（离线优先）
   * 在 bootstrap 中优先调用，避免等待网络请求时页面空白
   */
  const hydrateFromCache = async () => {
    if (!import.meta.client) {
      return
    }

    const [cachedNotifications, cachedLastSyncAt] = await Promise.all([
      db.readNotifications(),
      db.getLastSyncAt(),
    ])

    if (cachedNotifications.length > 0) {
      notifications.value = cachedNotifications
      total.value = Math.max(total.value, cachedNotifications.length)
    }

    if (cachedLastSyncAt > 0) {
      lastSyncedAt.value = cachedLastSyncAt
    }

    isHydrated.value = true
  }

  /**
   * 请求服务端指定页的通知列表并更新本地状态
   * @param targetPage 目标页码
   * @param append 是否追加到现有列表（加载更多），false 则替换
   */
  const syncPage = async (targetPage: number, append = false) => {
    if (syncing.value) {
      return
    }

    syncing.value = true
    if (!append) {
      loading.value = true
    }

    try {
      const { user } = useAuth()
      const response = await $fetch<NotificationListResponse>('/api/notifications', {
        method: 'GET',
        query: {
          page: targetPage,
          pageSize: pageSize.value,
          user_id: 'anonymous',
          is_read: 0,
          category: 'order',
        },
      })

      if (!response || !Array.isArray(response.items)) {
        return
      }

      notifications.value = append
        ? mergeById(notifications.value, response.items)
        : response.items

      total.value = Math.max(response.total || 0, notifications.value.length)
      page.value = response.page || targetPage
      lastSyncedAt.value = response.syncedAt || Date.now()

      // 同步完成后写入 IndexedDB，更新离线缓存
      if (import.meta.client) {
        await Promise.all([
          db.writeNotifications(notifications.value),
          db.setLastSyncAt(lastSyncedAt.value),
        ])
      }
    } catch (error) {
      console.error('Sync notification failed:', error)
    } finally {
      loading.value = false
      syncing.value = false
    }
  }

  /**
   * 从第 1 页重新拉取服务端数据
   * @param silent true 时不显示 loading（用于后台静默刷新）
   */
  const refreshFromServer = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) {
      loading.value = true
    }

    await syncPage(1, false)
  }

  /**
   * 加载下一页（追加到列表末尾）
   * 仅在 hasMore 为 true 且当前没有同步进行时触发
   */
  const loadMore = async () => {
    if (!hasMore.value || syncing.value) {
      return
    }

    await syncPage(page.value + 1, true)
  }

  /**
   * 标记指定通知为已读
   * 先更新本地状态和 IndexedDB，再异步通知服务端
   * @param id 通知 ID
   * @param skipRemote true 时只更新本地，不调用服务端接口
   */
  const markAsRead = async (id: string, skipRemote = false) => {
    const target = notifications.value.find((item) => item.id === id)
    const readAt = new Date().toISOString()

    if (target && !target.readAt) {
      target.readAt = readAt
      // 触发响应式更新
      notifications.value = [...notifications.value]

      if (import.meta.client) {
        await db.markNotificationAsRead(id, readAt)
      }
    }

    if (!skipRemote) {
      try {
        await $fetch(`/api/notifications/${encodeURIComponent(id)}`, {
          method: 'POST',
          body: {
            read: true,
            readAt,
          },
        })
      } catch (error) {
        console.error('Mark notification as read failed:', error)
      }
    }
  }

  /**
   * 点击通知时调用：标记已读 → 获取跳转链接 → 导航
   * 如果 item.link 为空，则请求详情接口获取链接
   */
  const openNotification = async (item: NotificationItem) => {
    await markAsRead(item.id)

    let targetLink = item.link

    if (!targetLink) {
      try {
        const detail = await $fetch<NotificationDetailResponse>(`/api/notifications/${encodeURIComponent(item.id)}`)
        targetLink = detail?.item?.link || ''
      } catch (error) {
        console.error('Fetch notification detail failed:', error)
      }
    }

    const fallback = `/desktop?notificationId=${encodeURIComponent(item.id)}`
    await navigateTo(targetLink || fallback)
  }

  /**
   * 将单条通知写入本地状态和 IndexedDB
   * 由 Service Worker 通过 postMessage 推送新通知时调用
   */
  const ingestNotification = async (item: NotificationItem) => {
    notifications.value = mergeById(notifications.value, [item])
    total.value = Math.max(total.value, notifications.value.length)

    if (import.meta.client) {
      await Promise.all([
        db.upsertNotification(item),
        db.setLastSyncAt(Date.now()),
      ])
    }
  }

  /**
   * 处理来自 Service Worker 的 postMessage 消息
   * 仅处理 type === 'notification:push' 的消息
   */
  const handleServiceWorkerMessage = async (payload: any) => {
    if (!payload || payload.type !== 'notification:push' || !payload.item) {
      return
    }

    await ingestNotification(payload.item as NotificationItem)
  }

  /**
   * 应用启动时的初始化入口（仅客户端执行）
   * 流程：读 IndexedDB 缓存 → 静默拉取服务端最新数据
   * 通过 bootstrapPromise 确保并发调用只执行一次
   */
  const bootstrap = async () => {
    if (!import.meta.client) {
      return
    }

    if (bootstrapPromise) {
      return bootstrapPromise
    }

    bootstrapPromise = (async () => {
      if (!isHydrated.value) {
        await hydrateFromCache()
      }

      void refreshFromServer({ silent: true })
    })()

    await bootstrapPromise
    bootstrapPromise = null
  }

  /**
   * 启动轮询和页面可见性监听
   * - 每隔 interval 毫秒在页面可见时静默刷新
   * - 页面从后台切回前台时立即刷新
   * 用于兜底 Web Push 未送达的情况
   */
  const startPolling = (interval = DEFAULT_POLLING_INTERVAL) => {
    if (!import.meta.client) {
      return
    }

    visibilityRefreshHandler = () => refreshFromServer({ silent: true })

    if (!visibilityListenerBound) {
      document.addEventListener('visibilitychange', onVisibilityChange)
      visibilityListenerBound = true
    }

    if (!pollingTimer) {
      pollingTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          void refreshFromServer({ silent: true })
        }
      }, interval)
    }
  }

  /**
   * 停止轮询并移除页面可见性监听
   * 在 logout 或 cookie 过期时调用，防止未登录状态下继续发请求
   */
  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }

    if (visibilityListenerBound) {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      visibilityListenerBound = false
      visibilityRefreshHandler = null
    }
  }

  return {
    notifications,
    unreadNotifications,
    readNotifications,
    unreadCount,
    total,
    page,
    pageSize,
    hasMore,
    loading,
    syncing,
    isHydrated,
    lastSyncedAt,
    bootstrap,
    hydrateFromCache,
    refreshFromServer,
    loadMore,
    markAsRead,
    openNotification,
    ingestNotification,
    handleServiceWorkerMessage,
    startPolling,
    stopPolling,
  }
}
