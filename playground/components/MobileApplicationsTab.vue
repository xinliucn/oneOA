<template>
  <div class="mobile-services">
    <section class="mobile-services__hero">
      <h2 class="mobile-services__title">
        {{ t('mobile.applications.navigator.title') }}
      </h2>
      <div class="mobile-services__stats">
        <div class="mobile-services__stat">
          <strong>{{ topicCount }}</strong>
          <span>{{ t('mobile.applications.navigator.topicCount') }}</span>
        </div>
        <div class="mobile-services__stat">
          <strong>{{ serviceCount }}</strong>
          <span>{{ t('mobile.applications.navigator.serviceCount') }}</span>
        </div>
      </div>
    </section>

    <label class="mobile-services__search">
      <IconCustom
        name="search"
        :size="16"
        color="#667085"
      />
      <input
        v-model="searchKeyword"
        type="search"
        :placeholder="t('mobile.applications.navigator.searchPlaceholder')"
      >
    </label>

    <div class="mobile-services__topics">
      <button
        v-for="topic in topics"
        :key="topic.id"
        type="button"
        :class="['mobile-services__topic', { 'is-active': selectedTopicId === topic.id }]"
        @click="selectedTopicId = topic.id"
      >
        {{ topic.label }}
      </button>
    </div>

    <div class="mobile-services__content">
      <div
        v-if="loading"
        class="mobile-services__state"
      >
        {{ t('mobile.applications.navigator.loading') }}
      </div>
      <div
        v-else-if="visibleGroups.length === 0"
        class="mobile-services__state"
      >
        {{ t('mobile.applications.navigator.empty') }}
      </div>
      <section
        v-for="group in visibleGroups"
        v-else
        :key="group.id"
        :class="['service-group', { 'is-expanded': isGroupExpanded(group.id) }]"
      >
        <button
          type="button"
          class="service-group__header"
          @click="toggleGroup(group.id)"
        >
          <span
            class="service-group__icon"
            :style="{ color: group.color }"
          >
            <IconCustom
              :name="group.icon"
              :size="20"
            />
          </span>
          <span class="service-group__copy">
            <strong>{{ group.title }}</strong>
            <span>{{ group.description }}</span>
          </span>
          <span class="service-group__count">
            {{ t('mobile.applications.navigator.itemCount', { count: group.items.length }) }}
          </span>
          <IconCustom
            name="chevron-right"
            :size="16"
            color="#8a94a6"
            :rotate="isGroupExpanded(group.id) ? -90 : 90"
          />
        </button>

        <div
          v-if="isGroupExpanded(group.id)"
          class="service-group__items"
        >
          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            class="service-item"
            @click="handleServiceClick(item)"
          >
            <span
              class="service-item__icon"
              :style="{ color: group.color }"
            >
              <IconCustom
                :name="item.icon"
                :size="17"
              />
            </span>
            <span class="service-item__copy">
              <strong>{{ item.name }}</strong>
              <span>{{ item.badge }}</span>
            </span>
            <IconCustom
              name="chevron-right"
              :size="15"
              color="#98a2b3"
            />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ApplicationCatalogEntry } from '~/types/applicationCatalog'

type ServiceItem = {
  id: string
  name: string
  badge: string
  icon: string
  type: string
  url: string
  raw: ApplicationCatalogEntry
}

type ServiceGroup = {
  id: string
  title: string
  description: string
  business: string
  icon: string
  color: string
  items: ServiceItem[]
}

const { t, locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const { addRecentItem } = useRecentItems()
const applicationsStore = useApplicationsStore()
const serviceCatalog = ref<ApplicationCatalogEntry[]>([])
const serviceCatalogLoading = ref(false)
const searchKeyword = ref('')
const selectedTopicId = ref('all')
const expandedGroupIds = ref<Set<string>>(new Set())
const regionOrder = ['HK', 'CN', 'SEA']
const detailRouteTypes = ['Group']

const normalizeString = (value?: string | null) => {
  return typeof value === 'string' ? value.trim() : ''
}

const slugify = (value: string) => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const splitMultiValue = (value?: string | null) => {
  return normalizeString(value)
    .split(/[/,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const sortByKnownOrder = (items: string[], order: string[]) => {
  return [...items].sort((left, right) => {
    const leftIndex = order.indexOf(left)
    const rightIndex = order.indexOf(right)
    const safeLeft = leftIndex === -1 ? order.length : leftIndex
    const safeRight = rightIndex === -1 ? order.length : rightIndex

    if (safeLeft !== safeRight) {
      return safeLeft - safeRight
    }

    return left.localeCompare(right)
  })
}

const getEntryType = (entry: ApplicationCatalogEntry) => {
  return normalizeString(entry.mainTable?.type || entry.type)
}

const getEntryOrder = (entry: ApplicationCatalogEntry) => {
  const orderNumber = Number(normalizeString(String(entry.mainTable?.order_number || entry.order_number || entry.orderNumber || '')))
  return Number.isFinite(orderNumber) ? orderNumber : Number.POSITIVE_INFINITY
}

const getApplicationDisplayName = (app: ApplicationCatalogEntry) => {
  if (locale.value === 'zh-CN') {
    return normalizeString(app.mainTable?.name_sc)
      || normalizeString(app.mainTable?.name_en)
      || normalizeString(app.mainTable?.name_tc)
      || normalizeString(app.name)
      || t('mobile.applications.navigator.fallbackService')
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(app.mainTable?.name_tc)
      || normalizeString(app.mainTable?.name_en)
      || normalizeString(app.mainTable?.name_sc)
      || normalizeString(app.name)
      || t('mobile.applications.navigator.fallbackService')
  }

  return normalizeString(app.mainTable?.name_en)
    || normalizeString(app.mainTable?.name_sc)
    || normalizeString(app.mainTable?.name_tc)
    || normalizeString(app.name)
    || t('mobile.applications.navigator.fallbackService')
}

const getBusinessDisplayName = (business?: ApplicationCatalogEntry['mainTable']) => {
  if (locale.value === 'zh-CN') {
    return normalizeString(business?.name_sc)
      || normalizeString(business?.name_en)
      || normalizeString(business?.name_tc)
      || t('mobile.applications.navigator.fallbackGroup')
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(business?.name_tc)
      || normalizeString(business?.name_en)
      || normalizeString(business?.name_sc)
      || t('mobile.applications.navigator.fallbackGroup')
  }

  return normalizeString(business?.name_en)
    || normalizeString(business?.name_sc)
    || normalizeString(business?.name_tc)
    || t('mobile.applications.navigator.fallbackGroup')
}

const getBusinessDescription = (entry: ApplicationCatalogEntry) => {
  const business = entry.mainTable

  if (locale.value === 'zh-CN') {
    return normalizeString(business?.description_sc)
      || normalizeString(business?.description_en)
      || normalizeString(business?.description_tc)
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(business?.description_tc)
      || normalizeString(business?.description_en)
      || normalizeString(business?.description_sc)
  }

  return normalizeString(business?.description_en)
    || normalizeString(business?.description_sc)
    || normalizeString(business?.description_tc)
}

const getEntryBusiness = (entry: ApplicationCatalogEntry) => {
  return normalizeString(entry.mainTable?.business || entry.business || entry.mainTable?.name_en)
}

const getApplicationUrl = (app: ApplicationCatalogEntry) => {
  return app.mainTable?.mobileurl || app.mainTable?.homepage_url || app.mobileUrl || app.homepageUrl || ''
}

const getBusinessRouteParams = (biz: ApplicationCatalogEntry['mainTable']) => {
  const businessName = normalizeString(biz?.business || biz?.name_en)
  const tags = sortByKnownOrder(splitMultiValue(biz?.tag), regionOrder)

  return {
    business: businessName,
    tag: (tags.length ? tags : regionOrder).join('/'),
    type: detailRouteTypes.join('/'),
  }
}

const getBusinessFallbackIcon = (name?: string) => {
  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return 'digital-technology'
  }

  if (normalized.includes('finance')) {
    return 'finance-bars'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return 'legal-compliance'
  }

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return 'personnel'
  }

  if (normalized.includes('china')) {
    return 'building'
  }

  return 'apps'
}

const getBusinessAccentColor = (name?: string, color?: string) => {
  if (color) {
    return color
  }

  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return '#3c8aff'
  }

  if (normalized.includes('finance')) {
    return '#009a88'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return '#d7008f'
  }

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return '#a60a3a'
  }

  if (normalized.includes('china')) {
    return '#c77800'
  }

  return '#a60a3a'
}

const getServiceIcon = (entry: ApplicationCatalogEntry, business: string) => {
  const source = `${getApplicationDisplayName(entry)} ${getEntryType(entry)} ${business}`.toLowerCase()

  if (source.includes('finance') || source.includes('claim') || source.includes('pay') || source.includes('cost')) {
    return 'finance-bars'
  }

  if (source.includes('data') || source.includes('list') || source.includes('report')) {
    return 'analytics'
  }

  if (source.includes('hr') || source.includes('leave') || source.includes('employee') || source.includes('human resources')) {
    return 'personnel'
  }

  if (source.includes('it') || source.includes('technology') || source.includes('system')) {
    return 'digital-technology'
  }

  if (source.includes('legal') || source.includes('compliance') || source.includes('contract')) {
    return 'legal-compliance'
  }

  return 'document'
}

const getServiceBadge = (entry: ApplicationCatalogEntry) => {
  const type = getEntryType(entry).toLowerCase()

  if (type === 'business') {
    return t('mobile.applications.navigator.badges.portal')
  }

  if (type.includes('application')) {
    return t('mobile.applications.navigator.badges.application')
  }

  if (type.includes('data')) {
    return t('mobile.applications.navigator.badges.data')
  }

  return t('mobile.applications.navigator.badges.process')
}

const allCatalogEntries = computed(() => {
  return [
    ...serviceCatalog.value,
    ...applicationsStore.catalogByTab.application,
    ...applicationsStore.catalogByTab.business,
  ]
})

const serviceGroups = computed<ServiceGroup[]>(() => {
  const groups = new Map<string, ServiceGroup>()
  const seenItems = new Set<string>()

  for (const entry of allCatalogEntries.value) {
    const business = getEntryBusiness(entry)
    if (!business) {
      continue
    }

    const groupId = slugify(business) || 'services'
    const type = getEntryType(entry)
    const isBusiness = type === 'Business'
    const groupTitle = isBusiness ? getBusinessDisplayName(entry.mainTable) : business.replace(/^group\s+/i, '')
    const color = getBusinessAccentColor(entry.mainTable?.name_en || business, entry.mainTable?.color || entry.color)
    const group = groups.get(groupId) || {
      id: groupId,
      title: groupTitle || t('mobile.applications.navigator.fallbackGroup'),
      description: '',
      business,
      icon: getBusinessFallbackIcon(entry.mainTable?.name_en || business),
      color,
      items: [],
    }

    const itemId = entry.mainTable?.id || entry.mobileUrl || entry.homepageUrl || `${business}:${getApplicationDisplayName(entry)}`
    if (seenItems.has(itemId)) {
      groups.set(groupId, group)
      continue
    }

    const description = getBusinessDescription(entry)
    if (!group.description && description) {
      group.description = description
    }

    group.items.push({
      id: itemId,
      name: isBusiness ? group.title : getApplicationDisplayName(entry),
      badge: getServiceBadge(entry),
      icon: isBusiness ? group.icon : getServiceIcon(entry, business),
      type,
      url: getApplicationUrl(entry),
      raw: entry,
    })
    seenItems.add(itemId)
    groups.set(groupId, group)
  }

  return Array.from(groups.values())
    .map(group => ({
      ...group,
      description: group.description || t('mobile.applications.navigator.defaultGroupDescription'),
      items: [...group.items].sort((left, right) => getEntryOrder(left.raw) - getEntryOrder(right.raw)),
    }))
    .filter(group => group.items.length > 0)
    .sort((left, right) => left.title.localeCompare(right.title))
})

const topics = computed(() => [
  {
    id: 'all',
    label: t('mobile.applications.navigator.allTopics'),
  },
  ...serviceGroups.value.map(group => ({
    id: group.id,
    label: group.title,
  })),
])
const topicCount = computed(() => serviceGroups.value.length)
const serviceCount = computed(() => serviceGroups.value.reduce((total, group) => total + group.items.length, 0))

const visibleGroups = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return serviceGroups.value
    .filter(group => selectedTopicId.value === 'all' || group.id === selectedTopicId.value)
    .map((group) => {
      if (!keyword) {
        return group
      }

      const items = group.items.filter((item) => {
        return [
          item.name,
          item.badge,
          group.title,
          group.description,
        ].some(value => value.toLowerCase().includes(keyword))
      })

      return {
        ...group,
        items,
      }
    })
    .filter(group => group.items.length > 0)
})

const loading = computed(() => {
  return serviceCatalogLoading.value
    || applicationsStore.loadingByTab.application
    || applicationsStore.loadingByTab.business
})

const isGroupExpanded = (groupId: string) => {
  return expandedGroupIds.value.has(groupId)
}

const toggleGroup = (groupId: string) => {
  const nextGroups = new Set(expandedGroupIds.value)

  if (nextGroups.has(groupId)) {
    nextGroups.delete(groupId)
  }
  else {
    nextGroups.add(groupId)
  }

  expandedGroupIds.value = nextGroups
}

const handleBusinessClick = (entry: ApplicationCatalogEntry) => {
  const biz = entry.mainTable
  const businessName = normalizeString(biz?.business || biz?.name_en)
  const displayName = getBusinessDisplayName(biz)
  const routeParams = getBusinessRouteParams(biz)
  const targetPath = `/mobile/applications/business/${encodeURIComponent(routeParams.business)}/${encodeURIComponent(routeParams.tag)}/${encodeURIComponent(routeParams.type)}`

  applicationsStore.setSelectedBusiness({
    id: businessName,
    icon: getBusinessFallbackIcon(biz?.name_en),
    name_en: displayName,
    business: businessName,
    description_en: getBusinessDescription({ mainTable: biz } as ApplicationCatalogEntry),
    color: getBusinessAccentColor(biz?.name_en, biz?.color),
    intranetLabel: `${displayName} Intranet >`,
    intranetUrl: biz?.homepage_url || biz?.mobileurl || 'https://intranet.dch.com.hk/',
  })

  addRecentItem({
    id: `business:${businessName || biz?.id || displayName}`,
    type: 'business',
    label: displayName,
    subtitle: getBusinessDescription({ mainTable: biz } as ApplicationCatalogEntry),
    icon: getBusinessFallbackIcon(biz?.name_en),
    path: targetPath,
  })

  return navigateTo(targetPath)
}

const handleServiceClick = async (item: ServiceItem) => {
  if (item.type === 'Business') {
    return handleBusinessClick(item.raw)
  }

  if (!item.url) {
    return
  }

  addRecentItem({
    id: `application:${item.raw.mainTable?.id || item.url}`,
    type: 'application',
    label: item.name,
    subtitle: item.badge,
    icon: item.icon,
    url: item.url,
  })

  await openGuardedUrl(item.url, '_blank')
}

const fetchServiceCatalog = async () => {
  serviceCatalogLoading.value = true

  try {
    const nextCatalog = await applicationsStore.fetchCatalogByFilters({ type: detailRouteTypes })
    serviceCatalog.value = nextCatalog
  }
  catch (error) {
    console.error('Fetch service catalog failed:', error)
    serviceCatalog.value = []
  }
  finally {
    serviceCatalogLoading.value = false
  }
}

watch(
  visibleGroups,
  (groups) => {
    const availableGroupIds = new Set(groups.map(group => group.id))
    const nextExpanded = new Set([...expandedGroupIds.value].filter(groupId => availableGroupIds.has(groupId)))

    for (const group of groups.slice(0, 2)) {
      nextExpanded.add(group.id)
    }

    expandedGroupIds.value = nextExpanded
  },
  { immediate: true },
)

void applicationsStore.fetchTabCatalog('application')
void applicationsStore.fetchTabCatalog('business')
void fetchServiceCatalog()
</script>

<style scoped>
.mobile-services {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 16px 0;
  background: linear-gradient(180deg, #f6f8fb 0%, #f3f5f8 100%);
  font-family: var(--font-source-sans-pro);
}

.mobile-services button,
.mobile-services input {
  font-family: inherit;
}

.mobile-services__hero {
  flex: 0 0 auto;
  padding: 10px 8px 12px;
  border: 1px solid #e5e9f0;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(166, 10, 58, 0.04) 0%, rgba(255, 255, 255, 0) 52%),
    #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
}

.mobile-services__title {
  margin: 0 0 8px;
  color: #111827;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.08;
}

.mobile-services__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.mobile-services__stat {
  min-height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid rgba(214, 40, 99, 0.28);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.74);
}

.mobile-services__stat strong {
  color: #c70b49;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.mobile-services__stat span {
  color: #475467;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.mobile-services__search {
  flex: 0 0 auto;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 0 12px;
  border: 1px solid #dde3ec;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.mobile-services__search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font-size: 13px;
  line-height: 40px;
}

.mobile-services__search input::placeholder {
  color: #7a8495;
}

.mobile-services__topics {
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  margin: 10px -16px 12px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  touch-action: pan-x;
}

.mobile-services__topics::-webkit-scrollbar {
  display: none;
}

.mobile-services__topic {
  flex: 0 0 auto;
  min-height: 32px;
  padding: 0 13px;
  border: 1px solid #dce2eb;
  border-radius: 999px;
  background: #ffffff;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.mobile-services__topic.is-active {
  border-color: rgba(166, 10, 58, 0.46);
  background: #fff5f8;
  color: #a60a3a;
}

.mobile-services__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 -16px;
  padding: 0 16px calc(16px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.mobile-services__state {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667085;
  font-size: 14px;
}

.service-group {
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid #e2e7ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.service-group.is-expanded {
  border-color: #e2e7ef;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.07);
}

.service-group__header {
  width: 100%;
  min-height: 68px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto 16px;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 0;
  outline: 0;
  background: #ffffff;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.service-group.is-expanded .service-group__header {
  background: #ffffff;
}

.service-group__header:active,
.service-item:active {
  background: #fafbfd;
}

.service-group__icon,
.service-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(166, 10, 58, 0.16);
  background: #fff4f7;
}

.service-group__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

.service-group__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.service-group__copy strong {
  overflow: hidden;
  color: #101828;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-group__copy span {
  overflow: hidden;
  color: #667085;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-group__count {
  min-width: 32px;
  padding: 3px 8px;
  border: 1px solid rgba(166, 10, 58, 0.12);
  border-radius: 999px;
  background: #fde8f0;
  color: #a60a3a;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
}

.service-group__items {
  border-top: 1px solid #edf0f4;
  background: #ffffff;
}

.service-item {
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 15px;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 0;
  border-bottom: 1px solid #edf0f4;
  background: #ffffff;
  text-align: left;
}

.service-item:last-child {
  border-bottom: 0;
}

.service-item__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}

.service-item__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-item__copy strong {
  overflow: hidden;
  color: #101828;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.28;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-item__copy span {
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  padding: 2px 7px;
  border: 1px solid #dce2eb;
  border-radius: 999px;
  color: #667085;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
