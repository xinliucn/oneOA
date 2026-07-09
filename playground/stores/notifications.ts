import { defineStore } from 'pinia'
import type {
  FetchNotificationListOptions,
  IncomingNotificationItem,
  NotificationItem,
  NotificationListApiResponse,
  NotificationMarkReadResponse,
} from '~/types/notification'
import { getLatestNotificationId, isNotificationUnread, resolveNotificationUnreadCount, sortNotificationsForDisplay } from '~/utils/notification'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Fetch notification list failed'
}

const mergeNotifications = (current: NotificationItem[], incoming: NotificationItem[]) => {
  const merged = new Map<string, NotificationItem>()

  for (const item of [...current, ...incoming]) {
    merged.set(String(item.id), item)
  }

  return sortNotificationsForDisplay(Array.from(merged.values()))
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notificationItems = ref<NotificationItem[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const isHydrated = ref(false)
  const page = ref(DEFAULT_PAGE)
  const pageSize = ref(DEFAULT_PAGE_SIZE)
  const hasMore = ref(false)
  const unreadCount = ref(0)
  const lastSyncedAt = ref(0)

  const db = useNotificationDB()

  const localUnreadCount = computed(() => notificationItems.value.filter(item => isNotificationUnread(item)).length)
  const latestNotificationId = computed(() => getLatestNotificationId(notificationItems.value))

  const hydrateFromCache = async () => {
    if (!import.meta.client || isHydrated.value) {
      return notificationItems.value
    }

    const [cachedNotifications, cachedLastSyncedAt] = await Promise.all([
      db.readNotifications(),
      db.getLastSyncAt(),
    ])

    notificationItems.value = cachedNotifications
    lastSyncedAt.value = cachedLastSyncedAt
    isHydrated.value = true

    return notificationItems.value
  }

  const saveNotificationsToCache = async (items: NotificationItem[]) => {
    if (!import.meta.client) {
      return
    }

    const syncedAt = Date.now()
    await Promise.all([
      db.writeNotifications(items),
      db.setLastSyncAt(syncedAt),
      db.setLatestCachedNotificationId(getLatestNotificationId(items)),
    ])
    lastSyncedAt.value = syncedAt
  }

  const fetchNotificationList = async (options: FetchNotificationListOptions = {}) => {
    if (loading.value) {
      return notificationItems.value
    }

    if (!options.force && loaded.value) {
      return notificationItems.value
    }

    const targetPage = options.page ?? DEFAULT_PAGE
    const targetPageSize = options.pageSize ?? pageSize.value

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<NotificationListApiResponse>('/api/notification/list', {
        method: 'GET',
        query: {
          page: targetPage,
          pageSize: targetPageSize,
        },
      })
      const nextItems = response.data.items
      const cachedItems = targetPage > DEFAULT_PAGE
        ? mergeNotifications(notificationItems.value, nextItems)
        : sortNotificationsForDisplay(nextItems)

      await saveNotificationsToCache(cachedItems)

      notificationItems.value = import.meta.client
        ? await db.readNotifications()
        : cachedItems
      page.value = response.data.page
      pageSize.value = response.data.page_size
      hasMore.value = response.data.has_more
      unreadCount.value = resolveNotificationUnreadCount(response.data.total_unread)
      loaded.value = true
      isHydrated.value = true

      return notificationItems.value
    }
    catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      throw fetchError
    }
    finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) {
      return notificationItems.value
    }

    return await fetchNotificationList({
      page: page.value + 1,
      pageSize: pageSize.value,
      force: true,
    })
  }

  const markAsReadLocal = async (id: string | number) => {
    const targetId = String(id).trim()

    if (!targetId) {
      return
    }

    const readAt = new Date().toISOString()
    const targetItem = notificationItems.value.find(item => String(item.id) === targetId)

    if (!targetItem || !isNotificationUnread(targetItem)) {
      return
    }

    notificationItems.value = notificationItems.value.map((item) => {
      if (String(item.id) !== targetId) {
        return item
      }

      return {
        ...item,
        readAt,
        is_read: '1',
      }
    })

    if (import.meta.client) {
      await db.markNotificationAsRead(String(targetItem.id), readAt)
    }

    try {
      await $fetch<NotificationMarkReadResponse>('/api/notification/mark-read', {
        method: 'POST',
        body: { id: targetId },
      })
    }
    catch (markReadError) {
      error.value = getErrorMessage(markReadError)
      console.error('Mark notification as read failed:', markReadError)
      return
    }

    try {
      await fetchNotificationList({ force: true })
    }
    catch (refreshError) {
      error.value = getErrorMessage(refreshError)
      console.error('Refresh notification list after mark read failed:', refreshError)
    }
  }

  const ingestNotification = async (item: IncomingNotificationItem) => {
    const nextItems = mergeNotifications(notificationItems.value, [item])

    notificationItems.value = nextItems
    loaded.value = true
    isHydrated.value = true
    await saveNotificationsToCache(nextItems)

    return nextItems
  }

  const reset = () => {
    notificationItems.value = []
    loading.value = false
    loaded.value = false
    error.value = null
    isHydrated.value = false
    page.value = DEFAULT_PAGE
    pageSize.value = DEFAULT_PAGE_SIZE
    hasMore.value = false
    unreadCount.value = 0
    lastSyncedAt.value = 0
  }

  return {
    notificationItems,
    loading,
    loaded,
    error,
    isHydrated,
    page,
    pageSize,
    hasMore,
    unreadCount,
    localUnreadCount,
    latestNotificationId,
    lastSyncedAt,
    hydrateFromCache,
    fetchNotificationList,
    loadMore,
    markAsReadLocal,
    ingestNotification,
    reset,
  }
})
