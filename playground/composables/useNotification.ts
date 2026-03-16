import type {
  NotificationDetailResponse,
  NotificationItem,
  NotificationListResponse,
} from '~/types/notification'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_POLLING_INTERVAL = 60 * 1000

let pollingTimer: ReturnType<typeof setInterval> | null = null
let visibilityListenerBound = false
let visibilityRefreshHandler: (() => Promise<void>) | null = null
let bootstrapPromise: Promise<void> | null = null

const mergeById = (base: NotificationItem[], incoming: NotificationItem[]) => {
  const merged = new Map<string, NotificationItem>()

  for (const item of [...base, ...incoming]) {
    merged.set(item.id, item)
  }

  return Array.from(merged.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && visibilityRefreshHandler) {
    void visibilityRefreshHandler()
  }
}

export const useNotification = () => {
  const notifications = useState<NotificationItem[]>('notifications:list', () => [])
  const total = useState<number>('notifications:total', () => 0)
  const page = useState<number>('notifications:page', () => 1)
  const pageSize = useState<number>('notifications:page-size', () => DEFAULT_PAGE_SIZE)
  const lastSyncedAt = useState<number>('notifications:last-synced-at', () => 0)
  const isHydrated = useState<boolean>('notifications:is-hydrated', () => false)
  const loading = useState<boolean>('notifications:loading', () => false)
  const syncing = useState<boolean>('notifications:syncing', () => false)

  const db = useNotificationDB()

  const unreadCount = computed(() => notifications.value.filter((item) => !item.readAt).length)
  const hasMore = computed(() => notifications.value.length < total.value)
  const unreadNotifications = computed(() => notifications.value.filter((item) => !item.readAt))
  const readNotifications = computed(() => notifications.value.filter((item) => Boolean(item.readAt)))

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

  const syncPage = async (targetPage: number, append = false) => {
    if (syncing.value) {
      return
    }

    syncing.value = true
    if (!append) {
      loading.value = true
    }

    try {
      const response = await $fetch<NotificationListResponse>('/api/notifications', {
        method: 'GET',
        query: {
          page: targetPage,
          pageSize: pageSize.value,
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

  const refreshFromServer = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) {
      loading.value = true
    }

    await syncPage(1, false)
  }

  const loadMore = async () => {
    if (!hasMore.value || syncing.value) {
      return
    }

    await syncPage(page.value + 1, true)
  }

  const markAsRead = async (id: string, skipRemote = false) => {
    const target = notifications.value.find((item) => item.id === id)
    const readAt = new Date().toISOString()

    if (target && !target.readAt) {
      target.readAt = readAt
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

  const handleServiceWorkerMessage = async (payload: any) => {
    if (!payload || payload.type !== 'notification:push' || !payload.item) {
      return
    }

    await ingestNotification(payload.item as NotificationItem)
  }

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
