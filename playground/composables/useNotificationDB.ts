import type { NotificationItem } from '~/types/notification'
import { getLatestNotificationId, sortNotificationsForDisplay } from '~/utils/notification'

const DB_NAME = 'superapp_notifications'
const DB_VERSION = 1
const STORE_NOTIFICATIONS = 'notifications'
const STORE_META = 'meta'
const META_LAST_SYNC_AT = 'last_sync_at'
const META_LATEST_NOTIFICATION_ID = 'latest_notification_id'

interface MetaRecord {
  key: string
  value: any
  updatedAt: number
}

let dbPromise: Promise<IDBDatabase | null> | null = null

const isClientDBAvailable = () => import.meta.client && typeof indexedDB !== 'undefined'

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed'))
  })
}

const waitForTransaction = (tx: IDBTransaction): Promise<void> => {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed'))
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'))
  })
}

const openDatabase = async (): Promise<IDBDatabase | null> => {
  if (!isClientDBAvailable()) {
    return null
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result

        if (!db.objectStoreNames.contains(STORE_NOTIFICATIONS)) {
          const notificationStore = db.createObjectStore(STORE_NOTIFICATIONS, {
            keyPath: 'id',
          })

          notificationStore.createIndex('createdAt', 'createdAt', { unique: false })
          notificationStore.createIndex('readAt', 'readAt', { unique: false })
        }

        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Open IndexedDB failed'))
    })
  }

  return dbPromise
}

export const useNotificationDB = () => {
  const readNotifications = async (): Promise<NotificationItem[]> => {
    const db = await openDatabase()
    if (!db) {
      return []
    }

    const tx = db.transaction(STORE_NOTIFICATIONS, 'readonly')
    const store = tx.objectStore(STORE_NOTIFICATIONS)
    const records = await requestToPromise(store.getAll())

    return sortNotificationsForDisplay(records as NotificationItem[])
  }

  const writeNotifications = async (notifications: NotificationItem[]) => {
    const db = await openDatabase()
    if (!db) {
      return
    }

    const tx = db.transaction(STORE_NOTIFICATIONS, 'readwrite')
    const store = tx.objectStore(STORE_NOTIFICATIONS)

    store.clear()
    for (const notification of notifications) {
      store.put(toRaw(notification))
    }

    await waitForTransaction(tx)
  }

  const upsertNotification = async (notification: NotificationItem) => {
    const db = await openDatabase()
    if (!db) {
      return
    }

    const tx = db.transaction(STORE_NOTIFICATIONS, 'readwrite')
    tx.objectStore(STORE_NOTIFICATIONS).put(toRaw(notification))
    await waitForTransaction(tx)
  }

  const markNotificationAsRead = async (id: string, readAt: string) => {
    const db = await openDatabase()
    if (!db) {
      return
    }

    const tx = db.transaction(STORE_NOTIFICATIONS, 'readwrite')
    const store = tx.objectStore(STORE_NOTIFICATIONS)
    const record = (await requestToPromise(store.get(id))) as NotificationItem | undefined

    if (record) {
      store.put({
        ...record,
        readAt,
        is_read: '1',
      })
    }

    await waitForTransaction(tx)
  }

  const clearAll = async () => {
    const db = await openDatabase()
    if (!db) {
      return
    }

    const tx = db.transaction([STORE_NOTIFICATIONS, STORE_META], 'readwrite')
    tx.objectStore(STORE_NOTIFICATIONS).clear()
    tx.objectStore(STORE_META).clear()
    await waitForTransaction(tx)
  }

  const setMeta = async (key: string, value: any) => {
    const db = await openDatabase()
    if (!db) {
      return
    }

    const tx = db.transaction(STORE_META, 'readwrite')
    const store = tx.objectStore(STORE_META)

    const record: MetaRecord = {
      key,
      value,
      updatedAt: Date.now(),
    }

    store.put(record)
    await waitForTransaction(tx)
  }

  const getMeta = async <T = any>(key: string): Promise<T | null> => {
    const db = await openDatabase()
    if (!db) {
      return null
    }

    const tx = db.transaction(STORE_META, 'readonly')
    const store = tx.objectStore(STORE_META)
    const record = (await requestToPromise(store.get(key))) as MetaRecord | undefined

    if (!record) {
      return null
    }

    return (record.value as T) ?? null
  }

  const getLastSyncAt = async () => {
    const value = await getMeta<number>(META_LAST_SYNC_AT)
    return typeof value === 'number' ? value : 0
  }

  const setLastSyncAt = async (timestamp: number) => {
    await setMeta(META_LAST_SYNC_AT, timestamp)
  }

  const getLatestCachedNotificationId = async () => {
    const metaValue = await getMeta<string>(META_LATEST_NOTIFICATION_ID)
    if (metaValue) {
      return String(metaValue)
    }

    return getLatestNotificationId(await readNotifications())
  }

  const setLatestCachedNotificationId = async (id: string | number | null | undefined) => {
    await setMeta(META_LATEST_NOTIFICATION_ID, id === null || id === undefined ? null : String(id))
  }

  return {
    open: openDatabase,
    readNotifications,
    writeNotifications,
    upsertNotification,
    markNotificationAsRead,
    clearAll,
    getMeta,
    setMeta,
    getLastSyncAt,
    setLastSyncAt,
    getLatestCachedNotificationId,
    setLatestCachedNotificationId,
  }
}
