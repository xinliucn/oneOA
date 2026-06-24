import type {
  NotificationSubscriptionPayload,
  NotificationWebPushSubscription,
} from '~/types/notificationSubscription'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const getRequiredString = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

const normalizeWebPushSubscription = (value: unknown): NotificationWebPushSubscription | null => {
  if (!isRecord(value) || !isRecord(value.keys)) {
    return null
  }

  const endpoint = getRequiredString(value.endpoint)
  const auth = getRequiredString(value.keys.auth)
  const p256dh = getRequiredString(value.keys.p256dh)

  if (!endpoint || !auth || !p256dh) {
    return null
  }

  return {
    endpoint,
    keys: {
      auth,
      p256dh,
    },
  }
}

export const normalizeNotificationSubscriptionPayload = (value: unknown): NotificationSubscriptionPayload | null => {
  if (!isRecord(value)) {
    return null
  }

  const userAgent = getRequiredString(value.userAgent)
  const timeZone = getRequiredString(value.timeZone)

  if (!userAgent || !timeZone) {
    return null
  }

  if (value.kind === 'webpush' && (value.platform === 'apple' || value.platform === 'webpush')) {
    const subscription = normalizeWebPushSubscription(value.subscription)
    const userId = getRequiredString(value.user_id)

    if (!subscription || !userId) {
      return null
    }

    return {
      kind: 'webpush',
      platform: value.platform,
      subscription,
      user_id: userId,
      userAgent,
      timeZone,
    }
  }

  return null
}
