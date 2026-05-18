<template>
  <div
    v-if="selectedBusiness"
    class="mobile-app-detail"
  >
    <div class="mobile-app-detail__breadcrumb">
      <button
        type="button"
        class="mobile-app-detail__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="16"
          :rotate="180"
          color="#A60A3A"
        />
        <span>Applications</span>
      </button>
    </div>

    <section class="mobile-app-detail__hero">
      <div class="mobile-app-detail__icon">
        <div
          class="mobile-app-detail__icon-badge"
          :style="{ color: selectedBusiness.color || '#A60A3A' }"
        >
          <IconCustom
            :name="selectedBusiness.icon || 'apps'"
            :size="34"
          />
        </div>
      </div>
      <h1 class="mobile-app-detail__title">
        {{ selectedBusiness.name_en }}
      </h1>
      <p class="mobile-app-detail__description">
        {{ selectedBusiness.description_en }}
      </p>
      <button
        type="button"
        class="mobile-app-detail__intranet"
        :style="{ color: selectedBusiness.color || '#A60A3A' }"
        @click="handleIntranetClick"
      >
        {{ selectedBusiness.intranetLabel }}
      </button>
    </section>

    <section class="mobile-app-detail__regions">
      <button
        v-for="region in regions"
        :key="region"
        type="button"
        :class="['mobile-app-detail__region-btn', { active: selectedRegion === region }]"
        @click="selectedRegion = region"
      >
        {{ region }}
      </button>
    </section>

    <section class="mobile-app-detail__list">
      <button
        v-for="item in sortedCatalog"
        :key="getItemKey(item)"
        type="button"
        class="mobile-app-detail__item"
        @click="handleItemClick(item)"
      >
        <span class="mobile-app-detail__item-icon">
          <img
            v-if="getItemIcon(item)"
            :src="getItemIcon(item)"
            :alt="getItemName(item)"
            class="mobile-app-detail__item-icon-img"
          >
          <IconCustom
            v-else
            name="document"
            :size="22"
            color="#A60A3A"
          />
        </span>
        <span class="mobile-app-detail__item-name">
          {{ getItemName(item) }}
        </span>
        <IconCustom
          name="chevron-right"
          :size="16"
          color="#A60A3A"
        />
      </button>
    </section>
  </div>

  <div
    v-else
    class="mobile-app-detail__empty"
  >
    <p class="mobile-app-detail__empty-title">
      Application group not found
    </p>
    <button
      type="button"
      class="mobile-app-detail__empty-back"
      @click="handleBack"
    >
      Back to Applications
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ApplicationCatalogFilters } from '~/composables/useApplicationCatalog'

type BusinessSummary = {
  id?: string
  icon?: string
  name_en?: string
  business?: string
  description_en?: string
  color?: string
  intranetLabel?: string
  intranetUrl?: string
}

type ApplicationCatalogEntry = {
  tag?: string
  type?: string
  business?: string
  mainTable?: {
    id?: string
    tag?: string
    mobileurl?: string
    homepage_url?: string
    name_en?: string
    name_sc?: string
    name_tc?: string
    description_en?: string
    type?: string
    business?: string
    application?: string
    category?: string
    iconx64?: string
    order_number?: string
  }
  mobileUrl?: string
  homepageUrl?: string
}

const { requestApplicationCatalogData } = useApplicationCatalog()
const { openGuardedUrl } = useNetworkGuard()
const { locale } = useAppI18n()
const route = useRoute()
const selectedBusiness = useState<BusinessSummary | null>('mobile:selected-business', () => null)
const regionOrder = ['HK', 'CN', 'SEA']
const detailRequestType = 'Group'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const activeTab = useState<number>('mobile:activeTab', () => 3)
const activeApplicationsTab = useState<'business' | 'application'>('mobile:applications:active-tab', () => 'business')
const selectedRegion = ref<string>('')
const detailCatalog = ref<ApplicationCatalogEntry[]>([])

const normalizeString = (value?: string | null) => {
  return typeof value === 'string' ? value.trim() : ''
}

const decodeRouteParam = (value: any) => {
  const rawValue = Array.isArray(value) ? value[0] : value
  const normalized = normalizeString(typeof rawValue === 'string' ? rawValue : '')

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

const getBusinessDisplayName = (name?: string) => {
  const normalized = normalizeString(name)
  const lowerName = normalized.toLowerCase()

  if (lowerName.includes('digital') || lowerName.includes('technology') || lowerName.includes('it')) {
    return 'Digital & Technology'
  }

  if (lowerName.includes('finance')) {
    return 'Finance'
  }

  if (lowerName.includes('legal') || lowerName.includes('compliance')) {
    return 'Legal & Compliance'
  }

  if (lowerName.includes('human resources') || lowerName.includes('hr')) {
    return 'Human Resources'
  }

  return normalized.replace(/^group\s+/i, '') || 'Business'
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

const getBusinessColor = (name?: string) => {
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

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return '#A60A3A'
  }

  return '#A60A3A'
}

const getBusinessDescription = (name?: string, description?: string) => {
  const normalizedDescription = normalizeString(description)
  if (normalizedDescription) {
    return normalizedDescription
  }

  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return 'Core applications for infrastructure, collaboration, and operational support.'
  }

  if (normalized.includes('finance')) {
    return 'Finance operations, reporting tools, and workflow entry points.'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return 'Legal, compliance, and governance related applications.'
  }

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return 'People operations, leave, payroll, and related HR services.'
  }

  return 'Business applications, workflows, and related entry points.'
}

const routeBusiness = computed(() => decodeRouteParam(route.params.business))
const routeTags = computed(() => sortByKnownOrder(uniq(splitMultiValue(decodeRouteParam(route.params.tag))), regionOrder))
const regions = computed(() => routeTags.value.length ? routeTags.value : regionOrder)

const mapBusinessSummary = (entry: ApplicationCatalogEntry): BusinessSummary => {
  const businessName = normalizeString(entry.mainTable?.business || entry.business || entry.mainTable?.name_en)
  const displayName = getBusinessDisplayName(entry.mainTable?.name_en || businessName)

  return {
    id: entry.mainTable?.id,
    icon: getBusinessIcon(entry.mainTable?.name_en || businessName),
    name_en: displayName,
    business: businessName,
    description_en: getBusinessDescription(entry.mainTable?.name_en || businessName, entry.mainTable?.description_en),
    color: getBusinessColor(entry.mainTable?.name_en || businessName),
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
  const orderNumber = Number(normalizeString(item.mainTable?.order_number))
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

const getItemIcon = (item: ApplicationCatalogEntry) => {
  return normalizeString(item.mainTable?.iconx64)
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
  activeTab.value = 3
  activeApplicationsTab.value = 'business'
  return navigateTo('/mobile')
}

const getApplicationUrl = (item: ApplicationCatalogEntry) => {
  return item?.mainTable?.mobileurl || item?.mainTable?.homepage_url || item?.mobileUrl || item?.homepageUrl || ''
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

  const filters: ApplicationCatalogFilters = {
    business: routeBusiness.value,
    tag: selectedRegion.value,
    type: detailRequestType,
  }
  const mergedCatalog = await requestApplicationCatalogData(filters)

  detailCatalog.value = mergedCatalog.filter((item, index, items) => {
    const currentId = item.mainTable?.id || item.mobileUrl || item.homepageUrl || item.mainTable?.name_en
    return index === items.findIndex((candidate) => {
      const candidateId = candidate.mainTable?.id || candidate.mobileUrl || candidate.homepageUrl || candidate.mainTable?.name_en
      return candidateId === currentId
    })
  })
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

activeTab.value = 3
activeApplicationsTab.value = 'business'
</script>

<style scoped>
.mobile-app-detail {
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
}

.mobile-app-detail__breadcrumb {
  padding: 14px 16px 12px;
  background: #ffffff;
  border-bottom: 1px solid #ededed;
}

.mobile-app-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 16px;
  color: #a60a3a;
}

.mobile-app-detail__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 16px;
  background: #ffffff;
  text-align: center;
}

.mobile-app-detail__icon {
  margin-bottom: 10px;
}

.mobile-app-detail__icon-badge {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f3f7ff 0%, #edf4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-app-detail__title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
}

.mobile-app-detail__description {
  max-width: 320px;
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #666666;
}

.mobile-app-detail__intranet {
  border: 0;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
}

.mobile-app-detail__regions {
  display: flex;
  gap: 0;
  margin: 14px 22px 0;
  padding: 3px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(17, 17, 17, 0.08);
  position: relative;
  z-index: 1;
}

.mobile-app-detail__region-btn {
  flex: 1;
  min-height: 34px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #171717;
}

.mobile-app-detail__region-btn.active {
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: #ffffff;
}

.mobile-app-detail__list {
  padding: 10px 10px 0;
  background: #ffffff;
}

.mobile-app-detail__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 62px;
  padding: 0 0 0 2px;
  border: 0;
  border-bottom: 1px dashed #ececec;
  background: #ffffff;
  text-align: left;
}

.mobile-app-detail__item:last-child {
  border-bottom: 0;
}

.mobile-app-detail__item-icon {
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a60a3a;
}

.mobile-app-detail__item-icon-img {
  max-width: 24px;
  max-height: 24px;
  object-fit: contain;
}

.mobile-app-detail__item-name {
  min-width: 0;
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  color: #15172c;
  overflow-wrap: anywhere;
}

.mobile-app-detail__empty {
  height: 100%;
  padding: 48px 20px;
  overflow-y: auto;
  background: #ffffff;
  text-align: center;
}

.mobile-app-detail__empty-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #333333;
}

.mobile-app-detail__empty-back {
  border: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 14px;
  font-weight: 600;
}
</style>
