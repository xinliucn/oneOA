export interface NewsItem {
  id: number
  title: string
  date: string
  image: string
  url?: string
  tags?: string[]
  category?: string
}

export interface NewsListResponse {
  code: number
  data?: {
    list?: NewsItem[]
  }
}

export interface FetchNewsListOptions {
  locale?: string
}

export interface NewsListCmsRequestBody extends Record<string, unknown> {
  tags: string[]
  limit: number
  locale: string
}

export interface NewsListCmsResponse {
  code?: number
  data?: unknown
  list?: unknown[]
  items?: unknown[]
  results?: unknown[]
  docs?: unknown[]
  message?: string
}

export interface CmsCategory {
  name?: unknown
  title?: unknown
  slug?: unknown
}

export interface CmsNewsSettings {
  general?: {
    date?: unknown
    tags?: unknown
    image?: unknown
  }
}

export interface CmsNewsItem {
  id?: unknown
  _id?: unknown
  uuid?: unknown
  slug?: unknown
  path?: unknown
  url?: unknown
  href?: unknown
  link?: unknown
  pageUrl?: unknown
  page_url?: unknown
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
  tags?: unknown
  settings?: CmsNewsSettings
}

export interface MockCmsNewsSeed {
  id: string
  url: string
  path: string
  title: string
  imageSrc?: string
  date: string
  tags: string[]
  publishedOn: string
}
