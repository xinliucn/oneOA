export type ApplicationPrimaryTabKey = 'business' | 'application'

export interface ApplicationCatalogFilters {
  business?: string
  type?: string | string[]
  tag?: string
}

export interface ApplicationCatalogRequestBody {
  business?: unknown
  type?: unknown
  tag?: unknown
}

export interface ApplicationCatalogMainTable extends Record<string, unknown> {
  id?: string
  name_en?: string
  name_sc?: string
  name_tc?: string
  description_en?: string
  description_sc?: string
  description_tc?: string
  iconx64?: string
  color?: string
  isactive?: string
  allowroles?: string
  mobileurl?: string
  homepage_url?: string
  business?: string
  tag?: string
  type?: string
  application?: string
  category?: string
  order_number?: string
}

export interface ApplicationCatalogItem {
  id: string
  name: string
  type: string
  regions: string[]
  business: string
  homepageUrl: string
  mobileUrl: string
  description: string
  icon: string
  raw: Record<string, unknown>
  mainTable: ApplicationCatalogMainTable
}

export type ApplicationCatalogEntry = Partial<Omit<ApplicationCatalogItem, 'mainTable'>> & {
  color?: string
  business?: string
  tag?: string
  type?: string
  mobileUrl?: string
  homepageUrl?: string
  mainTable?: ApplicationCatalogMainTable
}

export interface ApplicationCatalogGroup {
  id: string
  title: string
  items: ApplicationCatalogItem[]
}

export interface ApplicationBusiness {
  id: string
  slug: string
  name: string
  icon: string
  color: string
  description: string
  intranetLabel: string
  regions: string[]
  groups: ApplicationCatalogGroup[]
  items: ApplicationCatalogItem[]
}

export interface ApplicationPrimaryTab {
  key: ApplicationPrimaryTabKey
  label: string
}

export interface SelectedBusinessSummary {
  id?: string
  icon?: string
  name_en?: string
  business?: string
  description_en?: string
  color?: string
  intranetLabel?: string
  intranetUrl?: string
}
