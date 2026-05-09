import type { H3Event } from 'h3'
import { normalizeNotificationList } from '../../utils/notification'

const getErrorStatusCode = (error: any) => {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }
  return 500
}

const getErrorMessage = (error: any, fallback: string) => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

const forwardSetCookieHeaders = (event: H3Event, response: { headers: Headers }) => {
  const rawHeaders = response.headers as Headers & { getSetCookie?: () => string[] }
  const setCookies = rawHeaders.getSetCookie?.() || []

  if (setCookies.length > 0) {
    setHeader(event, 'set-cookie', setCookies)
    return
  }

  const singleSetCookie = response.headers.get('set-cookie')
  if (singleSetCookie) {
    setHeader(event, 'set-cookie', singleSetCookie)
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = config.mockEnabled
  const page = 1
  const pageSize = 20

  if (raw) {
    const response = {
      page: 1,
      items: [
        {
          id: 31,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 1,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-16T17:26:18.664Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-16T17:26:35.906Z',
          msg_category: 'order',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 30,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-16T17:26:18.651Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-16T17:26:18.651Z',
          msg_category: 'order',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 18,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-10T10:53:15.930Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-10T10:53:15.930Z',
          msg_category: 'order',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 17,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-10T10:53:15.920Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-10T10:53:15.920Z',
          msg_category: 'order',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 12,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-09T18:32:51.870Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-09T18:32:51.870Z',
          msg_category: 'process',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 11,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-09T18:32:51.854Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-09T18:32:51.854Z',
          msg_category: 'process',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 10,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-09T18:25:43.342Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-09T18:25:43.342Z',
          msg_category: 'process',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 9,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-09T18:25:43.328Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-09T18:25:43.328Z',
          msg_category: 'process',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 4,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-09T18:14:52.706Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-09T18:14:52.706Z',
          msg_category: 'process',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 3,
          body: '这是一条用于验证 user_id → user_email 迁移的端到端测试消息',
          icon: '/icons/icon-192.png',
          title: '测试通知 - user_email 全链路验证',
          is_read: 0,
          user_id: null,
          subtitle: '预计 3-5 天送达',
          msg_group: 'order',
          action_url: 'https://superapp.dchbipoc.cc/orders/12345',
          created_at: '2026-04-09T18:14:52.691Z',
          request_id: 'req-20260409-001',
          updated_at: '2026-04-09T18:14:52.691Z',
          msg_category: 'process',
          msg_publish_at: '2026-04-09T15:00:00.000Z',
        },
        {
          id: 2,
          body: '通知正文',
          icon: '/icons/icon-192.png',
          title: '通知主标题',
          is_read: 0,
          user_id: null,
          subtitle: '通知子标题',
          msg_group: null,
          action_url: null,
          created_at: '2026-04-09T17:59:25.326Z',
          request_id: null,
          updated_at: '2026-04-09T17:59:25.326Z',
          msg_category: 'general',
          msg_publish_at: null,
        },
        {
          id: 1,
          body: '通知正文',
          icon: '/icons/icon-192.png',
          title: '通知主标题',
          is_read: 0,
          user_id: null,
          subtitle: '通知子标题',
          msg_group: null,
          action_url: null,
          created_at: '2026-04-09T17:59:25.313Z',
          request_id: null,
          updated_at: '2026-04-09T17:59:25.313Z',
          msg_category: 'general',
          msg_publish_at: null,
        },
      ],
      has_more: false,
      page_size: 20,
      total_unread: 11,
    }
    return normalizeNotificationList(response, page, pageSize)
  }

  try {
    const cookieHeader = getRequestHeader(event, 'cookie')
    const userAgent = getRequestHeader(event, 'user-agent')
    const referer = getRequestHeader(event, 'referer')
    const forwardedIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''

    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}/api/r/notification/list`, {
      method: 'GET',
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...(userAgent ? { 'user-agent': userAgent } : {}),
        ...(referer ? { referer } : {}),
        'X-Real-IP': forwardedIp,
        'X-Forwarded-For': forwardedIp,
      },
    })

    forwardSetCookieHeaders(event, response)
    return normalizeNotificationList(response._data, page, pageSize)
  }
  catch (error: any) {
    console.error('Get notifications API error:', error)

    throw createError({
      statusCode: getErrorStatusCode(error),
      message: getErrorMessage(error, '获取通知列表失败'),
    })
  }
})
