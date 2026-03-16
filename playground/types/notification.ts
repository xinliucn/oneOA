export interface NotificationItem {
  id: string
  title: string
  content: string
  summary?: string
  link?: string
  source?: string
  category?: string
  createdAt: string
  readAt?: string | null
  payload?: Record<string, any> | null
}

export interface NotificationListResponse {
  items: NotificationItem[]
  total: number
  page: number
  pageSize: number
  unreadCount: number
  hasMore: boolean
  syncedAt: number
}

export interface NotificationDetailResponse {
  item: NotificationItem | null
}

export interface NotificationSubscribeResponse {
  success: boolean
  vapidPublicKey?: string
  message?: string
  data?: Record<string, any>
}
