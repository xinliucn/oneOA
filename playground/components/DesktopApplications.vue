<template>
  <div class="desktop-apps">
    <div class="desktop-apps__header">
      <h3 class="desktop-apps__title">
        {{ t('desktopApps.title') }}
      </h3>
      <button
        type="button"
        class="desktop-apps__link"
        @click="navigateTo('/desktop/applications')"
      >
        {{ t('desktopApps.viewAll') }}
      </button>
    </div>
    <div
      v-if="loading"
      class="desktop-apps__state"
    >
      Loading...
    </div>
    <div
      v-else-if="visibleCategories.length === 0"
      class="desktop-apps__state"
    >
      No applications found.
    </div>
    <div
      v-else
      class="desktop-apps__columns"
    >
      <div
        v-for="category in visibleCategories"
        :key="category.id"
        class="app-column"
      >
        <div
          class="app-column__top"
          :style="{ borderTopColor: category.color }"
        >
          <div
            class="app-column__icon"
            :style="{ color: category.color }"
          >
            <IconCustom
              :name="category.icon"
              :size="34"
            />
          </div>
          <div class="app-column__name">
            {{ category.name }}
          </div>
          <div class="app-column__desc">
            {{ category.description }}
          </div>
          <button
            type="button"
            class="app-column__intranet"
            @click="handleIntranetClick(category)"
          >
            {{ category.intranetLabel }}
          </button>
        </div>
        <div class="app-column__list">
          <div
            v-for="app in category.apps"
            :key="app.id"
            class="app-row"
            @click="handleClick(app)"
          >
            <div class="app-row__info">
              <div class="app-row__name">
                {{ app.name }}
              </div>
              <div class="app-row__sub">
                {{ app.subtitle }}
              </div>
            </div>
            <IconCustom
              name="chevron-right"
              :size="14"
              class="app-row__arrow"
            />
          </div>
          <button
            type="button"
            class="app-column__view-all"
            @click="navigateTo('/desktop/applications')"
          >
            {{ t('desktopApps.viewAll') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ApplicationCatalogItem } from '~/composables/useApplicationCatalog'

const { t } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const { requestApplicationCatalogData } = useApplicationCatalog()
const { addRecentItem } = useRecentItems('desktop')

type DesktopApplication = {
  id: string
  name: string
  subtitle: string
  url: string
  icon: string
}

type DesktopApplicationCategory = {
  id: string
  name: string
  icon: string
  color: string
  description: string
  intranetLabel: string
  intranetUrl: string
  apps: DesktopApplication[]
}

type CatalogRecord = ApplicationCatalogItem & Record<string, any>

const preferredBusinessOrder = ['digital-technology', 'finance', 'legal-compliance']
const businessCategoryNames = [
  'group digital & technology',
  'digital & technology',
  'group finance',
  'finance',
  'group legal & compliance',
  'legal & compliance',
  'group human resources',
  'human resources',
]
const desktopCatalog = ref<ApplicationCatalogItem[]>([])
const loading = ref(true)

const normalizeString = (value?: any) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

const getFirstString = (...values: any[]) => {
  for (const value of values) {
    const normalizedValue = normalizeString(value)
    if (normalizedValue) {
      return normalizedValue
    }
  }

  return ''
}

const slugify = (value: string) => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const getItemRecord = (app?: ApplicationCatalogItem) => (app || {}) as CatalogRecord

const getItemMainTable = (app?: ApplicationCatalogItem) => {
  const record = getItemRecord(app)

  return record.mainTable || record.main_table || record.main_table_value || record.raw?.mainTable || record.raw?.main_table || {}
}

const getItemId = (app?: ApplicationCatalogItem, fallback = '') => {
  const record = getItemRecord(app)
  const mainTable = getItemMainTable(app)

  return getFirstString(record.id, mainTable.id, mainTable.requestid, fallback)
}

const getItemName = (app?: ApplicationCatalogItem) => {
  const record = getItemRecord(app)
  const mainTable = getItemMainTable(app)

  return getFirstString(record.name, record.name_en, mainTable.name_en, mainTable.name, mainTable.application) || '-'
}

const getItemType = (app?: ApplicationCatalogItem) => {
  const record = getItemRecord(app)
  const mainTable = getItemMainTable(app)

  return getFirstString(record.type, record.catalogType, mainTable.type)
}

const getItemBusiness = (app?: ApplicationCatalogItem) => {
  const record = getItemRecord(app)
  const mainTable = getItemMainTable(app)

  return getFirstString(
    record.business,
    record.business_name,
    record.businessName,
    record.applicationBusiness,
    record.application_business,
    mainTable.business,
    mainTable.business_name,
    mainTable.businessName,
    mainTable.applicationBusiness,
    mainTable.application_business,
    record.application,
    mainTable.application,
    getItemName(app),
  ) || 'Others'
}

const getItemDescription = (app?: ApplicationCatalogItem) => {
  const record = getItemRecord(app)
  const mainTable = getItemMainTable(app)

  return getFirstString(record.description, record.description_en, mainTable.description_en, mainTable.description, mainTable.description_sc)
}

const getBusinessMeta = (business: string) => {
  const normalizedBusiness = normalizeString(business)
  const lowerBusiness = normalizedBusiness.toLowerCase()

  if (
    lowerBusiness.includes('digital')
    || lowerBusiness.includes('technology')
    || lowerBusiness.includes('it')
    || lowerBusiness.includes('service portal')
    || lowerBusiness.includes('service request')
    || lowerBusiness.includes('servicenow')
  ) {
    return {
      slug: 'digital-technology',
      name: 'Digital & Technology',
      icon: 'digital-technology',
      color: '#3C8AFF',
    }
  }

  if (
    lowerBusiness.includes('finance')
    || lowerBusiness.includes('yonyou')
    || lowerBusiness.includes('treasury')
    || lowerBusiness.includes('filing')
    || lowerBusiness.includes('bounced cheque')
    || lowerBusiness.includes('claim')
    || lowerBusiness.includes('travel')
  ) {
    return {
      slug: 'finance',
      name: 'Finance',
      icon: 'finance-bars',
      color: '#009A88',
    }
  }

  if (
    lowerBusiness.includes('legal')
    || lowerBusiness.includes('compliance')
    || lowerBusiness.includes('contract')
    || lowerBusiness.includes('dispute')
    || lowerBusiness.includes('trademark')
  ) {
    return {
      slug: 'legal-compliance',
      name: 'Legal & Compliance',
      icon: 'legal-compliance',
      color: '#D7008F',
    }
  }

  if (lowerBusiness.includes('human resources') || lowerBusiness.includes('hr')) {
    return {
      slug: 'human-resources',
      name: 'Human Resources',
      icon: 'personnel',
      color: '#A60A3A',
    }
  }

  if (lowerBusiness.includes('china')) {
    return {
      slug: 'china-business',
      name: 'China Business',
      icon: 'building',
      color: '#C77800',
    }
  }

  if (normalizedBusiness) {
    return {
      slug: slugify(normalizedBusiness) || 'others',
      name: normalizedBusiness.replace(/^group\s+/i, ''),
      icon: 'apps',
      color: '#A60A3A',
    }
  }

  return {
    slug: 'others',
    name: 'Others',
    icon: 'apps',
    color: '#A60A3A',
  }
}

const sortByOrderNumber = (left: ApplicationCatalogItem, right: ApplicationCatalogItem) => {
  const leftRecord = getItemRecord(left)
  const rightRecord = getItemRecord(right)
  const leftMainTable = getItemMainTable(left)
  const rightMainTable = getItemMainTable(right)
  const leftOrder = Number(getFirstString(leftRecord.orderNumber, leftRecord.order_number, leftMainTable.orderNumber, leftMainTable.order_number))
  const rightOrder = Number(getFirstString(rightRecord.orderNumber, rightRecord.order_number, rightMainTable.orderNumber, rightMainTable.order_number))
  const safeLeft = Number.isFinite(leftOrder) ? leftOrder : Number.MAX_SAFE_INTEGER
  const safeRight = Number.isFinite(rightOrder) ? rightOrder : Number.MAX_SAFE_INTEGER

  if (safeLeft !== safeRight) {
    return safeLeft - safeRight
  }

  return getItemName(left).localeCompare(getItemName(right))
}

const normalizeUrl = (app: ApplicationCatalogItem) => {
  const record = getItemRecord(app)
  const mainTable = getItemMainTable(app)

  return getFirstString(
    record.homepageUrl,
    record.homepage_url,
    record.mobileUrl,
    record.mobileurl,
    mainTable.homepageUrl,
    mainTable.homepage_url,
    mainTable.mobileUrl,
    mainTable.mobileurl,
  )
}

const getApplicationSubtitle = (app: ApplicationCatalogItem) => {
  return getItemType(app) || t('desktopApps.processName')
}

const toDesktopApplication = (app: ApplicationCatalogItem): DesktopApplication => ({
  id: getItemId(app),
  name: getItemName(app),
  subtitle: getApplicationSubtitle(app),
  url: normalizeUrl(app),
  icon: getBusinessMeta(getItemBusiness(app)).icon,
})

const toDesktopCategory = (
  meta: ReturnType<typeof getBusinessMeta>,
  items: ApplicationCatalogItem[],
): DesktopApplicationCategory => {
  const orderedItems = [...items].sort(sortByOrderNumber)
  const businessItems = orderedItems.filter(isBusinessCategoryItem)
  const applicationItems = orderedItems.filter(item => !isBusinessCategoryItem(item))
  const intranetItem = businessItems.find(item => normalizeUrl(item)) || orderedItems.find(item => normalizeUrl(item))

  return {
    id: meta.slug,
    name: meta.name,
    icon: meta.icon,
    color: meta.color,
    description: getItemDescription(businessItems[0]) || getItemDescription(orderedItems[0]),
    intranetLabel: `${meta.name} Intranet >`,
    intranetUrl: intranetItem ? normalizeUrl(intranetItem) : '',
    apps: applicationItems.slice(0, 4).map((item, index) => ({
      ...toDesktopApplication(item),
      id: getItemId(item, `${meta.slug}-${index}`),
    })),
  }
}

const isBusinessCategoryItem = (item: ApplicationCatalogItem) => {
  const normalizedType = getItemType(item).toLowerCase()
  const normalizedName = getItemName(item).toLowerCase()

  return normalizedType === 'business' || businessCategoryNames.includes(normalizedName)
}

const visibleCategories = computed(() => {
  const categoryMap = new Map<string, { meta: ReturnType<typeof getBusinessMeta>, items: ApplicationCatalogItem[] }>()

  for (const item of desktopCatalog.value) {
    const meta = getBusinessMeta(getItemBusiness(item))
    const currentCategory = categoryMap.get(meta.slug)

    if (currentCategory) {
      currentCategory.items.push(item)
    }
    else {
      categoryMap.set(meta.slug, {
        meta,
        items: [item],
      })
    }
  }

  const orderedCategories = Array.from(categoryMap.values()).sort((left, right) => {
    const leftIndex = preferredBusinessOrder.indexOf(left.meta.slug)
    const rightIndex = preferredBusinessOrder.indexOf(right.meta.slug)
    const safeLeft = leftIndex === -1 ? preferredBusinessOrder.length : leftIndex
    const safeRight = rightIndex === -1 ? preferredBusinessOrder.length : rightIndex

    if (safeLeft !== safeRight) {
      return safeLeft - safeRight
    }

    return left.meta.name.localeCompare(right.meta.name)
  })

  return orderedCategories
    .map(category => toDesktopCategory(category.meta, category.items))
    .filter(category => category.apps.length > 0)
    .slice(0, 3)
})

const handleClick = async (app: DesktopApplication) => {
  if (!app.url) {
    return
  }

  addRecentItem({
    id: `application:${app.id || app.url}`,
    type: 'application',
    label: app.name,
    subtitle: app.subtitle,
    icon: app.icon,
    url: app.url,
  })

  await openGuardedUrl(app.url, '_blank')
}

const handleIntranetClick = async (category: DesktopApplicationCategory) => {
  if (!category.intranetUrl) {
    return
  }

  addRecentItem({
    id: `business:${category.id}`,
    type: 'business',
    label: category.name,
    subtitle: category.description,
    icon: category.icon,
    url: category.intranetUrl,
  })

  await openGuardedUrl(category.intranetUrl, '_blank')
}

const fetchDesktopApplications = async () => {
  loading.value = true

  try {
    desktopCatalog.value = await requestApplicationCatalogData()
  }
  catch (error) {
    console.error('Fetch desktop applications failed:', error)
    desktopCatalog.value = []
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDesktopApplications()
})
</script>

<style scoped>
.desktop-apps {
  width: 100%;
  background: #ffffff;
  padding: 0 0 28px;
  border-top: 0;
}

.desktop-apps__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #d9d9d9;
}

.desktop-apps__title {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

}

.desktop-apps__link {
  color: #a60a3a;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-offset: 0%;
  text-decoration-thickness: 0%;
  text-decoration-skip-ink: auto;
  border: none;
  background: transparent;
  cursor: pointer;

}

.desktop-apps__state {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-size: 14px;
}

.desktop-apps__columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.app-column {
  min-width: 0;
  border: 1px solid #d9d9d9;
  border-radius: 0;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.app-column__top {
  min-height: 190px;
  padding: 36px 22px 24px;
  border-top: 3px solid;
  background: #ffffff;
  text-align: center;
}

.app-column__icon {
  margin-bottom: 12px;
}

.app-column__name {
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  color: #000000;
  margin-bottom: 14px;
}

.app-column__desc {
  max-width: 260px;
  margin: 0 auto 14px;
  font-size: 10px;
  color: #666666;
  line-height: 1.35;
}

.app-column__intranet {
  border: 0;
  padding: 0;
  background: transparent;
  font-size: 10px;
  line-height: 1.2;
  color: #a60a3a;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
  cursor: pointer;
}

.app-column__list {
  padding: 0;
  border-top: 1px solid #e3e3e3;
}

.app-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 9px 16px;
  cursor: pointer;
  border-bottom: 1px solid #d9d9d9;
  transition: background 0.2s;
}

.app-row:hover {
  background: #f5f5f5;
}

.app-row__info {
  flex: 1;
  min-width: 0;
}

.app-row__name {
  font-size: 13px;
  line-height: 1.2;
  font-weight: 500;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-row__sub {
  margin-top: 2px;
  font-size: 9px;
  line-height: 1.2;
  color: #666666;
}

.app-row__arrow {
  color: #5f5f5f;
  flex-shrink: 0;
}

.app-column__view-all {
  display: block;
  width: 100%;
  border: 0;
  padding: 18px 16px 20px;
  background: transparent;
  font-size: 12px;
  line-height: 1.2;
  color: #a60a3a;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 700;
  cursor: pointer;
}
</style>
