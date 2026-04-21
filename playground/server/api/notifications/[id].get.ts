import { getMockNotificationById } from '../../utils/notificationMock'

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '')
  return {
    item: getMockNotificationById(id),
  }
})
