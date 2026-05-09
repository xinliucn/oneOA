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

    <section
      v-for="group in groupedCatalog"
      :key="group.id"
      class="mobile-app-detail__group"
    >
      <button
        type="button"
        class="mobile-app-detail__group-header"
        @click="toggleGroup(group.id)"
      >
        <span>{{ group.title }} ({{ group.items.length }})</span>
        <IconCustom
          name="chevron-right"
          :size="16"
          color="#171717"
          :rotate="isGroupOpen(group.id) ? -90 : 90"
        />
      </button>

      <div
        v-show="isGroupOpen(group.id)"
        class="mobile-app-detail__group-list"
      >
        <button
          v-for="item in group.items"
          :key="getItemKey(item)"
          type="button"
          class="mobile-app-detail__item"
          @click="handleItemClick(item)"
        >
          <div class="mobile-app-detail__item-info">
            <div class="mobile-app-detail__item-name">
              {{ getItemName(item) }}
            </div>
            <div class="mobile-app-detail__item-type">
              {{ getItemSubtitle(item) }}
            </div>
          </div>
          <IconCustom
            name="chevron-right"
            :size="18"
            color="#A60A3A"
          />
        </button>
      </div>
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
    description_en?: string
    type?: string
    business?: string
    application?: string
  }
  mobileUrl?: string
  homepageUrl?: string
}

const { requestApplicationCatalogData } = useApplicationCatalog()
const { openGuardedUrl } = useNetworkGuard()
const route = useRoute()
const selectedBusiness = useState<BusinessSummary | null>('mobile:selected-business', () => null)
const regionOrder = ['HK', 'CN', 'SEA']
const typeOrder = ['Data', 'Form', 'Portal', 'Application']

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const activeTab = useState<number>('mobile:activeTab', () => 3)
const selectedRegion = ref<string>('')
const expandedGroups = ref<string[]>([])
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

const slugify = (value?: string | null) => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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
const routeTypes = computed(() => sortByKnownOrder(uniq(splitMultiValue(decodeRouteParam(route.params.type))), typeOrder))
const regions = computed(() => routeTags.value.length ? routeTags.value : regionOrder)
const allowedTypes = computed(() => routeTypes.value.length ? routeTypes.value : typeOrder)
const allowedTypesKey = computed(() => allowedTypes.value.join('/'))

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
  const targetTypes = allowedTypes.value.map(item => item.toLowerCase())

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

    if (targetTypes.length > 0 && !targetTypes.includes(itemType.toLowerCase())) {
      return false
    }

    if (targetRegion && itemTags.length > 0 && !itemTags.includes(targetRegion)) {
      return false
    }

    return true
  })
})

const groupLabelMap: Record<string, string> = {
  form: 'New Forms',
  data: 'Data',
  portal: 'Portals',
  application: 'Applications',
}

const groupOrder = ['Form', 'Data', 'Portal', 'Application']

const groupedCatalog = computed(() => {
  const groups = new Map<string, ApplicationCatalogEntry[]>()

  for (const item of filteredCatalog.value) {
    const type = normalizeString(item.mainTable?.type || item.type || 'Application')
    const currentItems = groups.get(type) || []
    groups.set(type, [...currentItems, item])
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => {
      const leftIndex = groupOrder.indexOf(left)
      const rightIndex = groupOrder.indexOf(right)
      const safeLeft = leftIndex === -1 ? groupOrder.length : leftIndex
      const safeRight = rightIndex === -1 ? groupOrder.length : rightIndex
      return safeLeft - safeRight
    })
    .map(([type, items]) => ({
      id: slugify(type) || 'applications',
      title: groupLabelMap[type.toLowerCase()] || type,
      items,
    }))
})

const isGroupOpen = (groupId: string) => expandedGroups.value.includes(groupId)

const toggleGroup = (groupId: string) => {
  expandedGroups.value = isGroupOpen(groupId)
    ? expandedGroups.value.filter(id => id !== groupId)
    : [...expandedGroups.value, groupId]
}

const getItemSubtitle = (item: ApplicationCatalogEntry) => {
  return normalizeString(item.mainTable?.application)
    || normalizeString(item.mainTable?.type)
    || normalizeString(item.mainTable?.description_en)
    || 'Application Entry'
}

const getItemKey = (item: ApplicationCatalogEntry) => {
  return item.mainTable?.id || item.mobileUrl || item.homepageUrl || getItemName(item)
}

const getItemName = (item: ApplicationCatalogEntry) => {
  return normalizeString(item.mainTable?.name_en) || 'Untitled Application'
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

  const requestedTypes = allowedTypes.value.length ? allowedTypes.value : ['Data', 'Form']
  const responses = await Promise.all(requestedTypes.map(async (type) => {
    const filters: ApplicationCatalogFilters = {
      business: routeBusiness.value,
      tag: selectedRegion.value,
      type,
    }

    return requestApplicationCatalogData(filters)
  }))

  const mergedCatalog = responses.flat()
  detailCatalog.value = mergedCatalog.filter((item, index, items) => {
    const currentId = item.mainTable?.id || item.mobileUrl || item.homepageUrl || item.mainTable?.name_en
    return index === items.findIndex((candidate) => {
      const candidateId = candidate.mainTable?.id || candidate.mobileUrl || candidate.homepageUrl || candidate.mainTable?.name_en
      return candidateId === currentId
    })
  })
}

watch(
  groupedCatalog,
  (groups) => {
    expandedGroups.value = groups.map(group => group.id)
  },
  { immediate: true },
)

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
  [selectedRegion, routeBusiness, allowedTypesKey],
  async () => {
    await fetchCatalog()
  },
  { immediate: true },
)

activeTab.value = 3
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
  margin: 14px 16px 16px;
  padding: 3px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(17, 17, 17, 0.08);
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

.mobile-app-detail__group {
  margin-bottom: 12px;
  background: #ffffff;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}

.mobile-app-detail__group-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border: 0;
  background: #fafafa;
  font-size: 15px;
  font-weight: 700;
  color: #161616;
}

.mobile-app-detail__group-list {
  background: #ffffff;
}

.mobile-app-detail__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  border: 0;
  border-top: 1px solid #ececec;
  background: #ffffff;
  text-align: left;
}

.mobile-app-detail__item-info {
  min-width: 0;
  flex: 1;
}

.mobile-app-detail__item-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
  color: #171717;
}

.mobile-app-detail__item-type {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.4;
  color: #8b8b8b;
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
