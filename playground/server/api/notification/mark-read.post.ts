import { proxyRequest } from '../../utils/requestProxy'
import type { NotificationMarkReadApiResponse, NotificationMarkReadRequest } from '~/types/notification'

const getNotificationId = (body: unknown) => {
  if (!body || typeof body !== 'object' || !('id' in body)) {
    return ''
  }

  const id = (body as { id?: unknown }).id

  if (typeof id !== 'string' && typeof id !== 'number') {
    return ''
  }

  return String(id).trim()
}

export default defineEventHandler(async (event) => {
  const body = await readBody<NotificationMarkReadRequest>(event)
  const id = getNotificationId(body)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'notification id is required',
    })
  }

  const response = await proxyRequest<NotificationMarkReadApiResponse>(
    event,
    '/api/r/notification/mark-read',
    {
      method: 'POST',
      body: {
        id: Number.isNaN(Number(id)) ? id : Number(id),
      },
      errorMessage: 'Mark notification as read failed',
    },
  )

  return {
    success: true,
    data: response,
  }
})
