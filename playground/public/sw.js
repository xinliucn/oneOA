const DB_NAME = 'superapp_notifications'
const DB_VERSION = 1
const STORE_NOTIFICATIONS = 'notifications'

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(STORE_NOTIFICATIONS)) {
        db.createObjectStore(STORE_NOTIFICATIONS, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Open IndexedDB failed in SW'))
  })
}

const normalizePushPayload = (payload) => {
  const now = new Date().toISOString()

  return {
    id: String(payload.id || payload.notification_id || Date.now()),
    title: String(payload.title || payload.subject || '消息通知'),
    content: String(payload.content || payload.body || ''),
    summary: String(payload.summary || ''),
    link: String(payload.link || payload.url || '/desktop'),
    category: String(payload.category || payload.type || ''),
    createdAt: String(payload.createdAt || payload.created_at || now),
    readAt: payload.readAt || payload.read_at || null,
    payload: payload.payload && typeof payload.payload === 'object' ? payload.payload : null,
  }
}

const saveNotification = async (item) => {
  const db = await openDatabase()

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTIFICATIONS, 'readwrite')
    tx.objectStore(STORE_NOTIFICATIONS).put(item)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('Save notification failed in SW'))
    tx.onabort = () => reject(tx.error || new Error('Save notification aborted in SW'))
  })
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      let payload = {}

      if (event.data) {
        try {
          payload = event.data.json()
        } catch (_error) {
          payload = { title: '消息通知', content: event.data.text() }
        }
      }

      const item = normalizePushPayload(payload)
      await saveNotification(item)

      await self.registration.showNotification(item.title, {
        body: item.content,
        icon: '/favicon.png',
        badge: '/favicon.png',
        data: {
          link: item.link,
          id: item.id,
        },
      })

      const clientList = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })

      for (const client of clientList) {
        client.postMessage({
          type: 'notification:push',
          item,
        })
      }
    })(),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    (async () => {
      const target = event.notification.data?.link || '/desktop'
      const targetUrl = new URL(target, self.location.origin).toString()
      const clientList = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })

      for (const client of clientList) {
        if ('focus' in client) {
          await client.navigate(targetUrl)
          await client.focus()
          return
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl)
      }
    })(),
  )
})
