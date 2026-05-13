import type { NewsItem } from '../../../composables/useNewsList'

type CmsCategory = {
  name?: unknown
  title?: unknown
  slug?: unknown
}

type CmsNewsSettings = {
  general?: {
    date?: unknown
    tags?: unknown
    image?: unknown
  }
}

type CmsNewsItem = {
  id?: unknown
  _id?: unknown
  uuid?: unknown
  slug?: unknown
  path?: unknown
  url?: unknown
  title?: unknown
  name?: unknown
  headline?: unknown
  displayTitle?: unknown
  date?: unknown
  publishDate?: unknown
  publishedDate?: unknown
  publishedAt?: unknown
  published_at?: unknown
  publishedOn?: unknown
  createdAt?: unknown
  created_at?: unknown
  updatedAt?: unknown
  updated_at?: unknown
  category?: unknown
  images?: unknown
  image?: unknown
  coverImage?: unknown
  cover?: unknown
  thumbnail?: unknown
  settings?: CmsNewsSettings
}

type NewsListResponse = {
  code: 1
  data: {
    list: NewsItem[]
  }
}

const fallbackNewsImage = '/mock/news/news1.png'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const asString = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

const asCmsNewsItem = (value: unknown): CmsNewsItem | null => {
  return isRecord(value) ? value : null
}

const collectCmsNewsItems = (response: unknown): unknown[] => {
  if (isRecord(response)
    && isRecord(response.data)
    && isRecord(response.data.pageBuilder)
    && isRecord(response.data.pageBuilder.listPublishedPages)
    && Array.isArray(response.data.pageBuilder.listPublishedPages.data)) {
    return response.data.pageBuilder.listPublishedPages.data
  }

  if (Array.isArray(response)) {
    return response
  }

  if (!isRecord(response)) {
    return []
  }

  const data = response.data
  if (Array.isArray(data)) {
    return data
  }

  if (isRecord(data)) {
    if (Array.isArray(data.list)) return data.list
    if (Array.isArray(data.items)) return data.items
    if (Array.isArray(data.results)) return data.results
    if (Array.isArray(data.docs)) return data.docs
  }

  if (Array.isArray(response.list)) return response.list
  if (Array.isArray(response.items)) return response.items
  if (Array.isArray(response.results)) return response.results
  if (Array.isArray(response.docs)) return response.docs

  return []
}

const hashId = (value: string) => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash || 1
}

const resolveNewsId = (item: CmsNewsItem, index: number) => {
  const id = item.id ?? item._id ?? item.uuid

  if (typeof id === 'number' && Number.isFinite(id)) {
    return id
  }

  const idText = asString(id) || asString(item.slug) || asString(item.path) || asString(item.url) || asString(item.title)
  return idText ? hashId(idText) : index + 1
}

const resolveNewsDate = (item: CmsNewsItem) => {
  return asString(item.settings?.general?.date)
    || asString(item.date)
    || asString(item.publishDate)
    || asString(item.publishedDate)
    || asString(item.publishedAt)
    || asString(item.published_at)
    || asString(item.publishedOn)
    || asString(item.createdAt)
    || asString(item.created_at)
    || asString(item.updatedAt)
    || asString(item.updated_at)
}

const resolveNewsImageFromRecord = (record: Record<string, unknown>): string => {
  const directImage = asString(record.src) || asString(record.url)
  if (directImage) {
    return directImage
  }

  for (const value of Object.values(record)) {
    const image = resolveNewsImage(value)
    if (image) {
      return image
    }
  }

  return ''
}

const resolveNewsImage = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const image = resolveNewsImage(item)
      if (image) {
        return image
      }
    }
  }

  if (isRecord(value)) {
    return resolveNewsImageFromRecord(value)
  }

  return ''
}

const resolveNewsCategory = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (isRecord(value)) {
    const category = value as CmsCategory
    return asString(category.name) || asString(category.title)
  }

  return ''
}

const resolveNewsCategoryFromTags = (tags: unknown) => {
  if (!Array.isArray(tags)) {
    return ''
  }

  const normalizedTags = tags.map(tag => asString(tag)).filter(Boolean)

  if (normalizedTags.some(tag => tag === '推廣活動' || tag.toLowerCase() === 'promotion')) {
    return 'Promotion'
  }

  if (normalizedTags.some(tag => tag === '内部公佈' || tag === '內部公佈' || tag.toLowerCase() === 'internal publish')) {
    return 'Internal Publish'
  }

  if (normalizedTags.some(tag => tag === '集團動向' || tag.toLowerCase() === 'group news')) {
    return 'Group News'
  }

  return ''
}

const normalizeNewsItem = (rawItem: unknown, index: number): NewsItem | null => {
  const item = asCmsNewsItem(rawItem)

  if (!item) {
    return null
  }

  const title = asString(item.title)
    || asString(item.name)
    || asString(item.headline)
    || asString(item.displayTitle)
  if (!title) {
    return null
  }

  return {
    id: resolveNewsId(item, index),
    title,
    date: resolveNewsDate(item),
    category: resolveNewsCategoryFromTags(item.settings?.general?.tags)
      || resolveNewsCategory(item.category)
      || undefined,
    image: resolveNewsImage(item.images)
      || resolveNewsImage(item.settings?.general?.image)
      || resolveNewsImage(item.image)
      || resolveNewsImage(item.coverImage)
      || resolveNewsImage(item.cover)
      || resolveNewsImage(item.thumbnail)
      || fallbackNewsImage,
  }
}

type MockCmsNewsSeed = {
  id: string
  url: string
  path: string
  title: string
  imageSrc?: string
  date: string
  tags: string[]
  publishedOn: string
}

const createMockCmsNewsItem = (seed: MockCmsNewsSeed) => {
  const generalImage = seed.imageSrc
    ? {
        id: seed.id.split('#')[0],
        src: seed.imageSrc,
      }
    : undefined

  return {
    id: seed.id,
    url: seed.url,
    path: seed.path,
    title: seed.title,
    images: {
      general: seed.imageSrc ? { src: seed.imageSrc } : null,
    },
    locked: true,
    status: 'published',
    snippet: null,
    category: {
      name: 'CorpCom',
      slug: 'CorpCom',
    },
    settings: {
      seo: {
        meta: [],
        title: null,
        description: null,
      },
      social: {
        meta: [],
        image: null,
        title: null,
        description: null,
      },
      general: {
        date: seed.date,
        tags: seed.tags,
        ...(generalImage ? { image: generalImage } : {}),
        layout: 'GhrOverview',
        pageTag: {
          color: '#1677ff',
          title: 'NEW PRODUCT',
          value: 'newsProduct',
        },
        pageSort: null,
        pageType: null,
        pageIntroduction: null,
        headerBackgroundTransparent: true,
      },
    },
    createdBy: {
      id: '1962ef12-46bd-4e1f-9f48-3a74ce36be0a',
      displayName: 'Jasmine Chua',
    },
    publishedOn: seed.publishedOn,
  }
}

const mockCmsNewsItems = [
  createMockCmsNewsItem({
    id: '692d39c89650c90002ef692d#0008',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/2025',
    path: '/zh-hk/latest-news/2025',
    title: '大昌行員工餐飲優惠2025',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c89650c90002ef692a/Restaurant_2025_1-image.jpg',
    date: '2025-01-06',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '推廣活動'],
    publishedOn: '2025-12-10T02:54:48.226Z',
  }),
  createMockCmsNewsItem({
    id: '692d39c9c818870002a6281c#0005',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/internal-recruitment-2022-to-swot-team',
    path: '/zh-hk/latest-news/internal-recruitment-2022-to-swot-team',
    title: '大昌行集團內部招聘',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c9c818870002a6281a/TO-Lead-n-SWOT-Internal-Recruitment_-BPO-Chi-A3-version-image.jpg',
    date: '2022-06-14',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '集團動向'],
    publishedOn: '2025-12-10T02:54:53.449Z',
  }),
  createMockCmsNewsItem({
    id: '692d39c6fdbd73000228876e#0005',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/triangle-cv-news-aug',
    path: '/zh-hk/latest-news/triangle-cv-news-aug',
    title: '合眾汽車月報',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c6fdbd73000228876c/Screenshot-2023-08-30-at-2.22.29-PM-image.jpg',
    date: '2023-08-30',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '集團動向'],
    publishedOn: '2025-12-10T02:54:58.385Z',
  }),
  createMockCmsNewsItem({
    id: '692d39cac4da580002236e9d#0005',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/triangle-cv-news-mar-25',
    path: '/zh-hk/latest-news/triangle-cv-news-mar-25',
    title: '合眾汽車月報',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c9c4da580002236e98/202503-Triangle-CV-News-EN-image.jpg',
    date: '2025-03-31',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '内部公佈'],
    publishedOn: '2025-12-10T02:55:03.550Z',
  }),
  createMockCmsNewsItem({
    id: '692d39c9de0528000220ed99#0005',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/dah-chong-hong-blood-donation-day',
    path: '/zh-hk/latest-news/dah-chong-hong-blood-donation-day',
    title: '大昌行捐血日',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c8de0528000220ed97/20230503_024931552_iOS-image.jpg',
    date: '2023-05-09',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '集團動向'],
    publishedOn: '2025-12-10T02:55:35.624Z',
  }),
  createMockCmsNewsItem({
    id: '692d39c8c4da580002236e8b#0005',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/dch-2025-long-service-award-presentation-ceremony',
    path: '/zh-hk/latest-news/dch-2025-long-service-award-presentation-ceremony',
    title: '大昌行集團2025年度長期服務獎頒獎典禮',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c8c4da580002236e89/123e6ce9-5c84-4e15-aaea-cfa78287a484.jpg',
    date: '2025-04-01',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '内部公佈'],
    publishedOn: '2025-12-10T02:55:20.791Z',
  }),
  createMockCmsNewsItem({
    id: '692d39c908dcb200027d52df#0006',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/esg-report-2024',
    path: '/zh-hk/latest-news/esg-report-2024',
    title: 'ESG Report 2024',
    imageSrc: 'https://cmsapi-uat.dchbi.app/files/692d39c908dcb200027d52dd/DCH-ESG-Report-2024_ENG_cover-image.jpg',
    date: '2025-10-16',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '内部公佈'],
    publishedOn: '2025-12-10T02:55:36.671Z',
  }),
  createMockCmsNewsItem({
    id: '692d39c8c818870002a62818#0006',
    url: 'https://ghr-uat.dchbi.app/zh-hk/latest-news/dch-esg-report-2021',
    path: '/zh-hk/latest-news/dch-esg-report-2021',
    title: 'DCH ESG Report 2021',
    date: '2022-07-20',
    tags: ['最新消息', 'NewsDetails', '集團簡介', '内部公佈'],
    publishedOn: '2025-12-10T02:55:15.161Z',
  }),
] as const

const mockCmsNewsResponse = {
  code: 1,
  data: {
    pageBuilder: {
      listPublishedPages: {
        data: mockCmsNewsItems,
        meta: {
          cursor: null,
          totalCount: mockCmsNewsItems.length,
          hasMoreItems: false,
        },
        error: null,
      },
    },
  },
  message: 'Success',
  extensions: {
    console: [],
  },
}

export default defineEventHandler((): NewsListResponse => {
  const list = collectCmsNewsItems(mockCmsNewsResponse)
    .map((item, index) => normalizeNewsItem(item, index))
    .filter((item): item is NewsItem => !!item)

  return {
    code: 1,
    data: {
      list,
    },
  }
})
