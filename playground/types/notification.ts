export interface NotificationItem {
  id: string | number
  title: string
  body?: string
  content?: string
  summary?: string
  referenceId?: string
  requestId?: string
  request_id?: string | null
  creator?: string
  sourceSystem?: string
  businessName?: string
  link?: string
  action_url?: string | null
  source?: string
  category?: string
  msg_category?: string | null
  msg_publish_at?: string | null
  subtitle?: string | null
  createdAt?: string
  readAt?: string | null
  payload?: Record<string, any> | null
  payload_json?: Record<string, any> | null
  created_at?: string
  updated_at?: string
  is_read?: string | number
}

export type IncomingNotificationItem = Partial<NotificationItem> & {
  id: string | number
  title: string
  content?: string
}

export interface NotificationListResponse {
  items: NotificationItem[]
  total: number
  page: number
  pageSize: number
  unreadCount: number
  latestId: string | null
  hasMore: boolean
  syncedAt: number
}

export interface NotificationCheckResponse {
  unreadCount: number
  latestId: string | null
  checkedAt: number
}

export interface NotificationDetailResponse {
  item: NotificationItem | null
}

export interface NotificationSubscribeResponse {
  success: boolean
  vapidPublicKey?: string
  webpushVapidPublicKey?: string
  message?: string
  data?: Record<string, any>
}

export interface NotificationListApiItem {
  id: number
  body: string
  icon: string | null
  title: string
  is_read: number
  user_id: string | null
  subtitle: string | null
  msg_group: string | null
  action_url: string | null
  created_at: string
  request_id: string | null
  updated_at: string
  msg_category: string | null
  msg_publish_at: string | null
}

export interface NotificationListApiData {
  page: number
  items: NotificationListApiItem[]
  has_more: boolean
  page_size: number
  total_unread: number
}

export interface NotificationListApiResponse {
  success: boolean
  data: NotificationListApiData
}

export interface NotificationMarkReadRequest {
  id: string | number
}

export interface NotificationMarkReadApiResponse {
  success: boolean
  affected_rows: number
}

export interface NotificationMarkReadResponse {
  success: boolean
  data: NotificationMarkReadApiResponse
}

export interface FetchNotificationListOptions {
  page?: number
  pageSize?: number
  force?: boolean
}
