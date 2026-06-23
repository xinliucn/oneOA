export default defineEventHandler((event) => {
  const query = getQuery(event)
  const mode = typeof query.mode === 'string' ? query.mode : ''

  if (mode === 'check') {
    return {
      unreadCount: 0,
      latestId: null,
      checkedAt: Date.now(),
    }
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    unreadCount: 0,
    latestId: null,
    hasMore: false,
    syncedAt: Date.now(),
  }
})
