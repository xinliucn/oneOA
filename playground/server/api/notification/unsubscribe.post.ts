import { proxyRequest } from '../../utils/requestProxy'
import { normalizeNotificationSubscriptionPayload } from '../../utils/notificationSubscriptionAdapter'

export default defineEventHandler(async (event) => {
  const body = normalizeNotificationSubscriptionPayload(await readBody<unknown>(event))

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'invalid notification subscription payload',
    })
  }

  const response = await proxyRequest<Record<string, unknown>>(
    event,
    '/api/r/notification/unsubscribe',
    {
      method: 'POST',
      body,
      errorMessage: 'Unsubscribe notification failed',
    },
  )

  return {
    success: true,
    data: response,
    message: '订阅已取消',
  }
})
