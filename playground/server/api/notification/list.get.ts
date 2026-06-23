import { proxyRequest } from '../../utils/requestProxy'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

const getPositiveInteger = (value: unknown, fallback: number) => {
  const numberValue = Number(value)
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : fallback
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const mode = typeof query.mode === 'string' ? query.mode.trim() : ''
  const page = getPositiveInteger(query.page, DEFAULT_PAGE)
  const pageSize = getPositiveInteger(query.pageSize ?? query.page_size, DEFAULT_PAGE_SIZE)

  const upstreamQuery = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })

  if (mode) {
    upstreamQuery.set('mode', mode)
  }

  const response = await proxyRequest<Record<string, unknown>>(
    event,
    `/api/r/notification/list?${upstreamQuery.toString()}`,
    {
      method: 'GET',
      errorMessage: 'Fetch notification list failed',
    },
  )

  return {
    success: true,
    data: response,
  }
})
