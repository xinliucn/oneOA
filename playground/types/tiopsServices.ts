export type ServiceItem = {
  id: string
  name: string
  badge: string
  icon: string
  type: string
  regions: string[]
  processGroups: string[]
  url?: string
  mobileUrl?: string
  desktopUrl?: string
}

export type ServiceGroup = {
  id: string
  title: string
  description: string
  business: string
  icon: string
  color: string
  items: ServiceItem[]
}

export type TioTopicItem = {
  name_en: string
  name_sc: string
  name_tc: string
  icon_x86: string
  desktop_url: string
  mobile_url: string
  region: string[]
  service_type: string
  process_group: string[]
}

export type TioTopic = {
  category_en: string
  category_sc: string
  category_tc: string
  icon_x86: string
  items: TioTopicItem[]
}
