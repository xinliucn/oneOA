<script setup lang="ts">
import type {
  ApplicationCatalogEntry,
  ApplicationCatalogFilters,
  SelectedBusinessSummary,
} from '~/types/applicationCatalog'

definePageMeta({ layout: 'desktop', middleware: 'auth' })

const { requestApplicationCatalogData } = useApplicationCatalog()
const { openGuardedUrl } = useNetworkGuard()
const { locale } = useAppI18n()
const route = useRoute()
const applicationsStore = useApplicationsStore()
const selectedBusiness = computed({
  get: () => applicationsStore.selectedBusiness,
  set: (value: SelectedBusinessSummary | null) => applicationsStore.setSelectedBusiness(value),
})
const regionOrder = ['HK', 'CN', 'SEA']
const detailRequestType = 'Group'
const selectedRegion = ref('')
const detailCatalog = ref<ApplicationCatalogEntry[]>([])
const loading = ref(false)

const normalizeString = (value?: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

const decodeRouteParam = (value: unknown) => {
  const rawValue = Array.isArray(value) ? value[0] : value
  const normalized = normalizeString(rawValue)

  if (!normalized) {
    return ''
  }

  try {
    return decodeURIComponent(normalized)
  }
  catch {
    return normalized
  }
}

const routeParamParts = computed(() => {
  const rawParams = route.params.params
  const parts = Array.isArray(rawParams) ? rawParams : [rawParams]

  return parts
    .map(part => decodeRouteParam(part))
    .filter(Boolean)
})

const splitMultiValue = (value?: string | null) => {
  return normalizeString(value)
    .split(/[/,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function uniq<T>(items: T[]) {
  return Array.from(new Set(items))
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

const matchesBusinessFamily = (candidate?: string | null, target?: string | null) => {
  const normalizedTarget = normalizeString(target).toLowerCase()
  if (!normalizedTarget) {
    return false
  }

  const normalizedCandidate = normalizeString(candidate).toLowerCase()
  return normalizedCandidate === normalizedTarget || normalizedCandidate.startsWith(`${normalizedTarget} -`)
}

const getBusinessDisplayName = (business?: ApplicationCatalogEntry['mainTable']) => {
  if (locale.value === 'zh-CN') {
    return normalizeString(business?.name_sc)
      || normalizeString(business?.name_en)
      || normalizeString(business?.name_tc)
      || 'Business'
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(business?.name_tc)
      || normalizeString(business?.name_en)
      || normalizeString(business?.name_sc)
      || 'Business'
  }

  return normalizeString(business?.name_en)
    || normalizeString(business?.name_sc)
    || normalizeString(business?.name_tc)
    || 'Business'
}

const getBusinessIcon = (name?: string) => {
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

const getBusinessColor = (name?: string, color?: string) => {
  if (color) {
    return color
  }

  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return '#3C8AFF'
  }

  if (normalized.includes('finance')) {
    return '#009A88'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return '#D7008F'
  }

  return '#A60A3A'
}

const getBusinessDescription = (business?: ApplicationCatalogEntry['mainTable']) => {
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

const routeBusiness = computed(() => routeParamParts.value[0] || '')
const routeTags = computed(() => {
  const tagParts = routeParamParts.value.slice(1, -1)
  const tags = tagParts.flatMap(part => splitMultiValue(part))

  return sortByKnownOrder(uniq(tags), regionOrder)
})
const regions = computed(() => routeTags.value.length ? routeTags.value : regionOrder)

const mapBusinessSummary = (entry: ApplicationCatalogEntry): SelectedBusinessSummary => {
  const businessName = normalizeString(entry.mainTable?.business || entry.business || entry.mainTable?.name_en)
  const displayName = getBusinessDisplayName(entry.mainTable)

  return {
    id: entry.mainTable?.id,
    icon: getBusinessIcon(entry.mainTable?.name_en || businessName),
    name_en: displayName,
    business: businessName,
    description_en: getBusinessDescription(entry.mainTable),
    color: getBusinessColor(entry.mainTable?.name_en || businessName, entry.mainTable?.color || entry.color),
    intranetLabel: `${displayName} Intranet >`,
    intranetUrl: entry.mainTable?.homepage_url || entry.mainTable?.mobileurl || 'https://intranet.dch.com.hk/',
  }
}

const filteredCatalog = computed(() => {
  const targetBusiness = routeBusiness.value.toLowerCase()
  const targetRegion = normalizeString(selectedRegion.value).toLowerCase()

  return detailCatalog.value.filter((item) => {
    const itemBusiness = normalizeString(item.mainTable?.business || item.business)
    const itemType = normalizeString(item.mainTable?.type || item.type)
    const itemTags = splitMultiValue(item.mainTable?.tag || item.tag).map(tag => tag.toLowerCase())

    if (!matchesBusinessFamily(itemBusiness, targetBusiness)) {
      return false
    }

    if (!itemType || itemType === 'Business') {
      return false
    }

    if (targetRegion && itemTags.length > 0 && !itemTags.includes(targetRegion)) {
      return false
    }

    return true
  })
})

const getItemOrder = (item: ApplicationCatalogEntry) => {
  const orderNumber = Number(normalizeString(item.mainTable?.order_number || item.order_number || item.orderNumber))
  return Number.isFinite(orderNumber) ? orderNumber : Number.POSITIVE_INFINITY
}

const sortedCatalog = computed(() => {
  return [...filteredCatalog.value].sort((left, right) => getItemOrder(left) - getItemOrder(right))
})

const getItemKey = (item: ApplicationCatalogEntry) => {
  return item.mainTable?.id || item.mobileUrl || item.homepageUrl || getItemName(item)
}

const getItemName = (item: ApplicationCatalogEntry) => {
  if (locale.value === 'zh-CN') {
    return normalizeString(item.mainTable?.name_sc)
      || normalizeString(item.mainTable?.name_en)
      || normalizeString(item.mainTable?.name_tc)
      || 'Untitled Application'
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(item.mainTable?.name_tc)
      || normalizeString(item.mainTable?.name_en)
      || normalizeString(item.mainTable?.name_sc)
      || 'Untitled Application'
  }

  return normalizeString(item.mainTable?.name_en)
    || normalizeString(item.mainTable?.name_tc)
    || normalizeString(item.mainTable?.name_sc)
    || 'Untitled Application'
}

const getApplicationUrl = (item: ApplicationCatalogEntry) => {
  return item.mainTable?.homepage_url || item.mainTable?.mobileurl || item.homepageUrl || item.mobileUrl || ''
}

const syncSelectedBusiness = () => {
  const businessName = routeBusiness.value
  if (!businessName) {
    selectedBusiness.value = null
    return
  }

  const currentBusiness = normalizeString(selectedBusiness.value?.business)
  if (matchesBusinessFamily(currentBusiness, businessName)) {
    selectedBusiness.value = {
      ...selectedBusiness.value,
      id: businessName,
      business: businessName,
    }
    return
  }

  selectedBusiness.value = mapBusinessSummary({
    mainTable: {
      id: businessName,
      business: businessName,
      name_en: businessName,
    },
  })
}

const handleBack = () => {
  applicationsStore.activePrimaryTab = 'business'
  return navigateTo('/desktop/applications')
}

const handleIntranetClick = async () => {
  await openGuardedUrl(selectedBusiness.value?.intranetUrl || 'https://intranet.dch.com.hk/', '_blank')
}

const handleItemClick = async (item: ApplicationCatalogEntry) => {
  const url = getApplicationUrl(item)
  if (!url) {
    return
  }

  await openGuardedUrl(url, '_blank')
}

const fetchCatalog = async () => {
  if (!routeBusiness.value || !selectedRegion.value) {
    detailCatalog.value = []
    return
  }

  loading.value = true

  try {
    const filters: ApplicationCatalogFilters = {
      business: routeBusiness.value,
      tag: selectedRegion.value,
      type: detailRequestType,
    }
    const nextCatalog = await requestApplicationCatalogData(filters)

    detailCatalog.value = nextCatalog.filter((item, index, items) => {
      const currentId = item.mainTable?.id || item.mobileUrl || item.homepageUrl || item.mainTable?.name_en
      return index === items.findIndex((candidate) => {
        const candidateId = candidate.mainTable?.id || candidate.mobileUrl || candidate.homepageUrl || candidate.mainTable?.name_en
        return candidateId === currentId
      })
    })
  }
  finally {
    loading.value = false
  }
}

watch(
  regions,
  (nextRegions) => {
    if (!nextRegions.includes(selectedRegion.value)) {
      selectedRegion.value = nextRegions[0] || ''
    }
  },
  { immediate: true },
)

watch(routeBusiness, syncSelectedBusiness, { immediate: true })

watch(
  [selectedRegion, routeBusiness],
  async () => {
    await fetchCatalog()
  },
  { immediate: true },
)

applicationsStore.activePrimaryTab = 'business'
</script>

<template>
  <div class="desktop-app-detail">
    <section class="desktop-app-detail__hero">
      <div class="desktop-app-detail__breadcrumb">
        <button
          type="button"
          class="desktop-app-detail__breadcrumb-link"
          @click="handleBack"
        >
          Home
        </button>
        <span>&gt;</span>
        <button
          type="button"
          class="desktop-app-detail__breadcrumb-link"
          @click="handleBack"
        >
          Applications
        </button>
        <span>&gt;</span>
        <strong>{{ selectedBusiness?.name_en || routeBusiness }}</strong>
      </div>

      <h1 class="desktop-app-detail__title">
        {{ selectedBusiness?.name_en || routeBusiness }}
      </h1>
      <p class="desktop-app-detail__description">
        {{ selectedBusiness?.description_en }}
      </p>
      <button
        type="button"
        class="desktop-app-detail__intranet"
        :style="{ color: selectedBusiness?.color || '#A60A3A' }"
        @click="handleIntranetClick"
      >
        {{ selectedBusiness?.intranetLabel }}
      </button>
    </section>

    <section class="desktop-app-detail__content">
      <div class="desktop-app-detail__toolbar">
        <label
          for="desktop-app-detail-region"
          class="desktop-app-detail__region-label"
        >
          Region
        </label>
        <select
          id="desktop-app-detail-region"
          v-model="selectedRegion"
          class="desktop-app-detail__region-select"
        >
          <option
            v-for="region in regions"
            :key="region"
            :value="region"
          >
            {{ region }}
          </option>
        </select>
      </div>

      <div
        v-if="loading"
        class="desktop-app-detail__state"
      >
        Loading...
      </div>
      <div
        v-else-if="sortedCatalog.length === 0"
        class="desktop-app-detail__state"
      >
        No applications found
      </div>
      <div
        v-else
        class="desktop-app-detail__items"
      >
        <button
          v-for="item in sortedCatalog"
          :key="getItemKey(item)"
          type="button"
          class="desktop-app-detail__item"
          @click="handleItemClick(item)"
        >
          <span class="desktop-app-detail__item-name">
            {{ getItemName(item) }}
          </span>
          <span class="desktop-app-detail__item-type">
            {{ item.mainTable?.type || item.type }}
          </span>
        </button>
      </div>
    </section>

    <footer class="desktop-app-detail__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.desktop-app-detail {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #ffffff;
}

.desktop-app-detail__hero {
  padding: 28px 118px 24px;
  background: #f5f5f5;
  border-bottom: 1px solid #d9d9d9;
}

.desktop-app-detail__breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 22px;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
}

.desktop-app-detail__breadcrumb-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #a60a3a;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.desktop-app-detail__title {
  margin: 0 0 18px;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 28px;
  font-weight: 700;
  line-height: 110%;
}

.desktop-app-detail__description {
  max-width: 680px;
  margin: 0 0 4px;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 16px;
}

.desktop-app-detail__intranet {
  padding: 0;
  border: 0;
  background: transparent;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.desktop-app-detail__content {
  flex: 1;
  padding: 36px 118px 80px;
  background: #ffffff;
}

.desktop-app-detail__toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 184px;
  margin-left: auto;
  margin-bottom: 34px;
}

.desktop-app-detail__region-label {
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
}

.desktop-app-detail__region-select {
  width: 184px;
  height: 36px;
  border: 1px solid #a3aab2;
  border-radius: 8px;
  padding: 0 12px;
  background: #ffffff;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
}

.desktop-app-detail__state {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
}

.desktop-app-detail__items {
  max-width: 760px;
  margin: 0 auto;
  border-top: 1px solid #eeeeee;
}

.desktop-app-detail__item {
  width: 100%;
  min-height: 36px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: center;
  border: 0;
  padding: 0 16px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.desktop-app-detail__item:nth-child(odd) {
  background: #f5f5f5;
}

.desktop-app-detail__item-name {
  min-width: 0;
  overflow: hidden;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
  text-decoration: underline;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-app-detail__item-type {
  color: #666666;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  line-height: 100%;
}

.desktop-app-detail__footer {
  flex-shrink: 0;
  padding: 14px 24px;
  background: #8b1a2e;
  color: #ffffff;
  text-align: center;
  font-family: var(--font-source-sans-pro);
  font-size: 13px;
  line-height: 100%;
}
</style>
