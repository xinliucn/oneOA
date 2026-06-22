import type { H3Event } from 'h3'
import { normalizeNotificationCheck, normalizeNotificationList } from '../../utils/notification'

type RuntimeConfigWithNotifications = {
  fixedProxyCookie?: string
  mockEnabled?: boolean
  public: {
    apiBase?: string
  }
}

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
  const config = useRuntimeConfig() as unknown as RuntimeConfigWithNotifications
  const fixedProxyCookie = String(config.fixedProxyCookie || '').trim()
  const raw = config.mockEnabled && !fixedProxyCookie
  const query = getQuery(event)
  const mode = typeof query.mode === 'string' ? query.mode : ''
  const page = 1
  const pageSize = 20

  if (raw) {
    const response = {
      "page": 1,
      "items": [
        {
          "id": 451,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-0ATKuq6i-40e6fd4b",
          "request_id": "662485",
          "title": "CCA20260203| test contract | Sales Agreement \/ Service Agreement \/ Quotation| HKD1,000.00  (~`~`7 Pending Approval`~`8 Pending Approval`~`9 Pending Approval`~`~)",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-14 03:57:53.207",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-0ATKuq6i-40e6fd4b\", \"title\": \"CCA20260203| test contract | Sales Agreement \/ Service Agreement \/ Quotation| HKD1,000.00  (~`~`7 Pending Approval`~`8 Pending Approval`~`9 Pending Approval`~`~)\", \"userId\": \"25958\", \"creator\": \"Ngan Ka Lam Kaynis\", \"requestId\": \"662485\", \"requestNo\": \"CCA20260203\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"~`~`7 GLC - 合同管理`~`8 GLC - Contract Management`~`9 GLC - 合同管理`~`~\", \"msgPublishAt\": \"1778731073207\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:34dd5b19a205488bb7a85539ce38ef97",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 1,
          "read_at": "2026-05-14 12:01:08.210",
          "created_at": "2026-05-14 12:00:01.333",
          "updated_at": "2026-05-14 12:01:08.210"
        },
        {
          "id": 417,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-WOdlu0ed-dd4ee2fd",
          "request_id": "662402",
          "title": "bh-2026051-ys| 测试颜色",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-14 02:54:00.125",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-WOdlu0ed-dd4ee2fd\", \"title\": \"bh-2026051-ys| 测试颜色\", \"userId\": \"25958\", \"creator\": \"Peihong Admin\", \"requestId\": \"662402\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"专利管理\", \"msgPublishAt\": \"1778727240125\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:7f117e8dea02484ea052c4df50c0e810",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-14 10:54:00.461",
          "updated_at": "2026-05-14 10:54:00.461"
        },
        {
          "id": 394,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-XiO7vJIk-763925bd",
          "request_id": "662402",
          "title": "12333| 12333|",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-14 02:34:39.687",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-XiO7vJIk-763925bd\", \"title\": \"12333| 12333|\", \"userId\": \"25958\", \"creator\": \"Peihong Admin\", \"requestId\": \"662402\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"专利管理\", \"msgPublishAt\": \"1778726079687\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:957a9c45781544b2ac0a0ae7ba7a2b4c",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-14 10:35:00.554",
          "updated_at": "2026-05-14 10:35:00.554"
        },
        {
          "id": 347,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-2tlwOCGI-1fe85527",
          "request_id": "662243",
          "title": "CCA20260202| 2026 IT系统维护服务合同 | Sales Agreement \/ Service Agreement \/ Quotation| HKD170,000.00  (~`~`7 Pending Approval`~`8 Pending Approval`~`9 Pending Approval`~`~)",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-14 02:04:28.831",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-2tlwOCGI-1fe85527\", \"title\": \"CCA20260202| 2026 IT系统维护服务合同 | Sales Agreement \/ Service Agreement \/ Quotation| HKD170,000.00  (~`~`7 Pending Approval`~`8 Pending Approval`~`9 Pending Approval`~`~)\", \"userId\": \"25958\", \"creator\": \"To Wan Chi Vincy\", \"requestId\": \"662243\", \"requestNo\": \"CCA20260202\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"~`~`7 GLC - 合同管理`~`8 GLC - Contract Management`~`9 GLC - 合同管理`~`~\", \"msgPublishAt\": \"1778724268831\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:2f5896f0a16d4305938243ca994f2063",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 1,
          "read_at": "2026-05-14 11:46:55.016",
          "created_at": "2026-05-14 10:05:00.561",
          "updated_at": "2026-05-14 11:46:55.016"
        },
        {
          "id": 302,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-k4QK5sBP-72b3d01a",
          "request_id": "660718",
          "title": "SuperApp測試流程-宋高洁-2026-05-13",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-13 07:36:21.057",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-k4QK5sBP-72b3d01a\", \"title\": \"SuperApp測試流程-宋高洁-2026-05-13\", \"userId\": \"25958\", \"creator\": \"宋高洁\", \"requestId\": \"660718\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"SuperApp測試流程\", \"msgPublishAt\": \"1778657781057\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:0b9bed68edc44529be14105e3178157b",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-13 15:42:00.588",
          "updated_at": "2026-05-13 15:42:00.588"
        },
        {
          "id": 292,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-8Jjy1l3o-0996874e",
          "request_id": "660893",
          "title": "SuperApp測試流程-shu yaojin-2026-05-13",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-13 06:39:34.239",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-8Jjy1l3o-0996874e\", \"title\": \"SuperApp測試流程-shu yaojin-2026-05-13\", \"userId\": \"25958\", \"creator\": \"shu yaojin\", \"requestId\": \"660893\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"SuperApp測試流程\", \"msgPublishAt\": \"1778654374239\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:011120f1ebda45a180d634e30de1eb48",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-13 14:45:01.138",
          "updated_at": "2026-05-13 14:45:01.138"
        },
        {
          "id": 277,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-Kwq5JtJ2-12b8658b",
          "request_id": "660716",
          "title": "SuperApp測試流程-shu yaojin-2026-05-13",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-13 03:46:10.806",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-Kwq5JtJ2-12b8658b\", \"title\": \"SuperApp測試流程-shu yaojin-2026-05-13\", \"userId\": \"25958\", \"creator\": \"shu yaojin\", \"requestId\": \"660716\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"SuperApp測試流程\", \"msgPublishAt\": \"1778643970806\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:572a6a5ab20647bcb3ff203e85e85519",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-13 11:51:00.583",
          "updated_at": "2026-05-13 11:51:00.583"
        },
        {
          "id": 272,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-bPS4do95-0d4eea1c",
          "request_id": "660715",
          "title": "SuperApp測試流程-shu yaojin-2026-05-13",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-13 03:36:52.606",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-bPS4do95-0d4eea1c\", \"title\": \"SuperApp測試流程-shu yaojin-2026-05-13\", \"userId\": \"25958\", \"creator\": \"shu yaojin\", \"requestId\": \"660715\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"SuperApp測試流程\", \"msgPublishAt\": \"1778643412606\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:684788e2150d4c29aab19c9f4e66863b",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-13 11:39:00.740",
          "updated_at": "2026-05-13 11:39:00.740"
        },
        {
          "id": 267,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-36aqW3qj-27eb5902",
          "request_id": "660714",
          "title": "SuperApp測試流程-shu yaojin-2026-05-13",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-13 03:35:44.644",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-36aqW3qj-27eb5902\", \"title\": \"SuperApp測試流程-shu yaojin-2026-05-13\", \"userId\": \"25958\", \"creator\": \"shu yaojin\", \"requestId\": \"660714\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"SuperApp測試流程\", \"msgPublishAt\": \"1778643344644\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:1913a5817ad74113bcd9c8fcdb7695a7",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-13 11:39:00.687",
          "updated_at": "2026-05-13 11:39:00.687"
        },
        {
          "id": 262,
          "user_email": "victorhoyy@dchbi.com",
          "user_id": "25958",
          "msg_id": "e9-9K85qNqL-8be1d054",
          "request_id": "660713",
          "title": "SuperApp測試流程-Cheng Lam To Ian-2026-05-13",
          "body": "${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~",
          "subtitle": null,
          "icon": "\/icons\/icon-192.png",
          "action_url": null,
          "msg_group": null,
          "msg_category": "~`~`7 流程`~`8 Technological process`~`9 流程`~`~",
          "source_system": "OA",
          "msg_publish_at": "2026-05-13 03:31:01.039",
          "payload_json": "{\"body\": \"${}~`~`7 有流程到达`~`8 Flow arrival`~`9 有流程到達`~`~\", \"msgId\": \"e9-9K85qNqL-8be1d054\", \"title\": \"SuperApp測試流程-Cheng Lam To Ian-2026-05-13\", \"userId\": \"25958\", \"creator\": \"Cheng Lam To Ian\", \"requestId\": \"660713\", \"requestNo\": \"\", \"userEmail\": \"victorhoyy@dchbi.com\", \"msgCategory\": \"~`~`7 流程`~`8 Technological process`~`9 流程`~`~\", \"businessName\": \"SuperApp測試流程\", \"msgPublishAt\": \"1778643061039\", \"sourceSystem\": \"OA\"}",
          "source_message_id": null,
          "dedupe_key": "ingest:no_message_id:507a612f4a684b7a8262d0c5eb994c36",
          "dispatch_status": "pending",
          "dispatched_at": null,
          "is_read": 0,
          "read_at": null,
          "created_at": "2026-05-13 11:39:00.629",
          "updated_at": "2026-05-13 11:39:00.629"
        }
      ],
      "has_more": false,
      "page_size": 20,
      "total_unread": 12
    }

    if (mode === 'check') {
      const normalizedList = normalizeNotificationList(response, page, pageSize)
      return normalizeNotificationCheck({
        unread_count: normalizedList.unreadCount,
        latest_id: normalizedList.latestId,
      })
    }

    return normalizeNotificationList(response, page, pageSize)
  }

  try {
    const cookieHeader = fixedProxyCookie || getRequestHeader(event, 'cookie')
    const userAgent = getRequestHeader(event, 'user-agent')
    const referer = getRequestHeader(event, 'referer')
    const forwardedIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || ''

    const upstreamQuery = new URLSearchParams()
    if (mode) {
      upstreamQuery.set('mode', mode)
    }

    const queryString = upstreamQuery.toString()
    const response = await $fetch.raw<Record<string, any>>(`${config.public.apiBase}/api/r/notification/list${queryString ? `?${queryString}` : ''}`, {
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

    if (mode === 'check') {
      return normalizeNotificationCheck(response._data)
    }

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
