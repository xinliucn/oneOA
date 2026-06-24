export type PushSubscriptionStatus = 'idle' | 'unsupported' | 'subscribing' | 'subscribed' | 'denied' | 'error'
export type PushToggleResult = 'enabled' | 'disabled' | 'failed'

export type NotificationWebPushSubscription = {
  endpoint: string
  keys: {
    auth: string
    p256dh: string
  }
}

export type NotificationBaseSubscriptionPayload = {
  userAgent: string
  timeZone: string
}

export type NotificationWebPushSubscriptionPayload = NotificationBaseSubscriptionPayload & {
  kind: 'webpush'
  platform: 'apple' | 'webpush'
  subscription: NotificationWebPushSubscription
  user_id: string
}

export type NotificationSubscriptionPayload = NotificationWebPushSubscriptionPayload
