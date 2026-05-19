<script setup lang="ts">
import type { ApplicationCatalogItem } from '~/types/applicationCatalog'

definePageMeta({ layout: 'desktop', middleware: 'auth' })

type CatalogRecord = ApplicationCatalogItem & Record<string, any>

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

const { requestApplicationCatalogData } = useApplicationCatalog()
const { openGuardedUrl } = useNetworkGuard()
const { addRecentItem } = useRecentItems('desktop')

const searchQuery = ref('')
const selectedGrouping = ref('By BU / Department')
const desktopCatalog = ref<ApplicationCatalogItem[]>([])
const loading = ref(true)
const expandedCategoryIds = ref<string[]>([])

const groupings = ['By BU / Department']
const preferredBusinessOrder = [
  'digital-technology',
  'finance',
  'legal-compliance',
  'human-resources',
  'china-business',
]
const businessCategoryNames = [
  'group digital & technology',
  'digital & technology',
  'group finance',
  'finance',
  'group legal & compliance',
  'legal & compliance',
  'group human resources',
  'group human resource',
  'human resources',
]

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

  return getFirstString(
    record.description,
    record.description_en,
    mainTable.description_en,
    mainTable.description,
    mainTable.description_sc,
  )
}

const getBusinessMeta = (business: string) => {
  const normalizedBusiness = normalizeString(business)
  const lowerBusiness = normalizedBusiness.toLowerCase()

  if (
    lowerBusiness.includes('digital')
    || lowerBusiness.includes('technology')
    || lowerBusiness.includes('it')
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
    || lowerBusiness.includes('claim')
    || lowerBusiness.includes('travel')
    || lowerBusiness.includes('bounced cheque')
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

  if (lowerBusiness.includes('human resources') || lowerBusiness.includes('human resource') || lowerBusiness.includes('hr')) {
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

  if (lowerBusiness.includes('service')) {
    return {
      slug: 'group-service',
      name: 'Group Service',
      icon: 'apps',
      color: '#6F6F6F',
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

const normalizeUrl = (app?: ApplicationCatalogItem) => {
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

const isBusinessCategoryItem = (item: ApplicationCatalogItem) => {
  const normalizedType = getItemType(item).toLowerCase()
  const normalizedName = getItemName(item).toLowerCase()

  return normalizedType === 'business' || businessCategoryNames.includes(normalizedName)
}

const toDesktopApplication = (app: ApplicationCatalogItem, fallback: string): DesktopApplication => ({
  id: getItemId(app, fallback),
  name: getItemName(app),
  subtitle: getItemType(app) || 'Application',
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
    description: getItemDescription(businessItems[0]) || getItemDescription(orderedItems[0]) || 'Business applications, workflows, and related entry points.',
    intranetLabel: `${meta.name} Intranet >`,
    intranetUrl: normalizeUrl(intranetItem),
    apps: applicationItems.map((item, index) => toDesktopApplication(item, `${meta.slug}-${index}`)),
  }
}

const categories = computed(() => {
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

  return Array.from(categoryMap.values())
    .sort((left, right) => {
      const leftIndex = preferredBusinessOrder.indexOf(left.meta.slug)
      const rightIndex = preferredBusinessOrder.indexOf(right.meta.slug)
      const safeLeft = leftIndex === -1 ? preferredBusinessOrder.length : leftIndex
      const safeRight = rightIndex === -1 ? preferredBusinessOrder.length : rightIndex

      if (safeLeft !== safeRight) {
        return safeLeft - safeRight
      }

      return left.meta.name.localeCompare(right.meta.name)
    })
    .map(category => toDesktopCategory(category.meta, category.items))
    .filter(category => category.apps.length > 0)
})

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return categories.value
  }

  return categories.value
    .map(category => ({
      ...category,
      apps: category.apps.filter((app) => {
        return app.name.toLowerCase().includes(query)
          || app.subtitle.toLowerCase().includes(query)
          || category.name.toLowerCase().includes(query)
      }),
    }))
    .filter(category => category.apps.length > 0 || category.name.toLowerCase().includes(query))
})

const isCategoryExpanded = (categoryId: string) => expandedCategoryIds.value.includes(categoryId)

const getVisibleApps = (category: DesktopApplicationCategory) => {
  if (isCategoryExpanded(category.id)) {
    return category.apps
  }

  return category.apps.slice(0, 6)
}

const toggleCategory = (categoryId: string) => {
  if (isCategoryExpanded(categoryId)) {
    expandedCategoryIds.value = expandedCategoryIds.value.filter(id => id !== categoryId)
  }
  else {
    expandedCategoryIds.value = [...expandedCategoryIds.value, categoryId]
  }
}

const handleAppClick = async (app: DesktopApplication) => {
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

try {
  desktopCatalog.value = await requestApplicationCatalogData()
}
catch (error) {
  console.error('Fetch application catalog failed:', error)
  desktopCatalog.value = []
}
finally {
  loading.value = false
}
</script>

<template>
  <div class="applications">
    <section class="applications__banner">
      <h1 class="applications__banner-title">
        Applications
      </h1>
    </section>

    <div class="applications__breadcrumb">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/desktop' }">
          Home
        </el-breadcrumb-item>
        <el-breadcrumb-item>Applications</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <section class="applications__content">
      <div class="applications__toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="Search Applications"
          prefix-icon="Search"
          class="applications__search"
          clearable
          size="default"
        />
        <div class="applications__filter-group">
          <span class="applications__filter-label">Grouping</span>
          <el-select
            v-model="selectedGrouping"
            class="applications__grouping"
            :teleported="false"
          >
            <el-option
              v-for="grouping in groupings"
              :key="grouping"
              :label="grouping"
              :value="grouping"
            />
          </el-select>
        </div>
      </div>

      <div
        v-if="loading"
        class="applications__state"
      >
        Loading...
      </div>
      <div
        v-else-if="filteredCategories.length === 0"
        class="applications__state"
      >
        No applications found
      </div>
      <div
        v-else
        class="applications__grid"
      >
        <article
          v-for="category in filteredCategories"
          :key="category.id"
          class="applications__card"
          :style="{ borderTopColor: category.color }"
        >
          <header class="applications__card-header">
            <div
              class="applications__card-icon"
              :style="{ color: category.color }"
            >
              <IconCustom
                :name="category.icon"
                :size="38"
              />
            </div>
            <h2 class="applications__card-name">
              {{ category.name }}
            </h2>
            <p class="applications__card-desc">
              {{ category.description }}
            </p>
            <button
              type="button"
              class="applications__card-link"
              :style="{ color: category.color }"
              @click="handleIntranetClick(category)"
            >
              {{ category.intranetLabel }}
            </button>
          </header>

          <div class="applications__app-list">
            <button
              v-for="app in getVisibleApps(category)"
              :key="app.id"
              type="button"
              class="applications__app-item"
              @click="handleAppClick(app)"
            >
              <span class="applications__app-info">
                <span class="applications__app-name">{{ app.name }}</span>
                <span class="applications__app-type">{{ app.subtitle }}</span>
              </span>
              <IconCustom
                name="chevron-right"
                :size="14"
                class="applications__app-arrow"
              />
            </button>
          </div>

          <footer class="applications__card-footer">
            <button
              type="button"
              class="applications__view-all"
              :style="{ color: category.color }"
              @click="toggleCategory(category.id)"
            >
              {{ isCategoryExpanded(category.id) ? 'Show Less' : 'View All' }} &gt;
            </button>
          </footer>
        </article>
      </div>
    </section>

    <footer class="applications__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.applications {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #ffffff;
}

.applications__banner {
  position: relative;
  height: 128px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 72px;
  overflow: hidden;
  background: url("../../assets/images/Rectangle\ 2.png") center/cover no-repeat;
}

.applications__banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.36) 0%, rgba(0, 0, 0, 0.08) 62%, rgba(0, 0, 0, 0) 100%);
}

.applications__banner-title {
  position: relative;
  margin: 0;
  color: #ffffff;
  font-family: Source Sans Pro;
  font-size: 32px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
}

.applications__breadcrumb {
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 72px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
}

:deep(.applications__breadcrumb .el-breadcrumb) {
  display: flex;
  align-items: center;
  font-family: Source Sans Pro;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

:deep(.applications__breadcrumb .el-breadcrumb__inner),
:deep(.applications__breadcrumb .el-breadcrumb__separator) {
  color: #a60a3a;
  font-family: Source Sans Pro;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

:deep(.applications__breadcrumb .el-breadcrumb__inner.is-link) {
  color: #a60a3a;
  font-weight: 400;
  text-decoration: underline;
  text-underline-offset: 0;
}

:deep(.applications__breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  font-weight: 700;
}

:deep(.applications__breadcrumb .el-breadcrumb__separator) {
  margin: 0 6px;
}

.applications__content {
  width: 100%;
  flex: 1;
  padding: 22px 72px 44px;
  background: #ffffff;
}

.applications__toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.applications__search {
  width: 244px;
}

.applications__filter-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.applications__filter-label {
  color: #666666;
  font-family: Source Sans Pro;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.applications__grouping {
  width: 184px;
}

:deep(.applications__search .el-input__wrapper),
:deep(.applications__grouping .el-select__wrapper) {
  min-height: 36px;
  border-radius: 0;
  background: #f5f5f5;
  box-shadow: 0 0 0 1px #d9d9d9 inset;
}

:deep(.applications__search .el-input__inner),
:deep(.applications__grouping .el-select__selected-item),
:deep(.applications__grouping .el-select__placeholder) {
  font-family: Source Sans Pro;
  font-size: 16px !important;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

:deep(.applications__filter-group .el-select-dropdown) {
  left: 0 !important;
  right: auto !important;
  min-width: 184px !important;
  border-radius: 0;
}

.applications__state {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-family: Source Sans Pro;
  font-size: 16px;
  line-height: 1;
}

.applications__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
}

.applications__card {
  min-width: 0;
  height: 454px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #d9d9d9;
  border-top: 4px solid;
  border-radius: 0;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.applications__card-header {
  min-height: 184px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 24px 18px;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
}

.applications__card-icon {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.applications__card-name {
  margin: 0;
  color: #000000;
  font-family: Source Sans Pro;
  font-size: 18px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
}

.applications__card-desc {
  max-width: 286px;
  min-height: 38px;
  margin: 0;
  overflow: hidden;
  color: #6f6f6f;
  display: -webkit-box;
  font-family: Source Sans Pro;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.applications__card-link,
.applications__view-all {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: Source Sans Pro;
  font-size: 14px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.applications__app-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.applications__app-list::-webkit-scrollbar {
  display: none;
}

.applications__app-item {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 18px;
  border: 0;
  border-bottom: 1px solid #eeeeee;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.applications__app-item:nth-child(even) {
  background: #f5f5f5;
}

.applications__app-item:hover {
  background: #f9edf1;
}

.applications__app-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.applications__app-name {
  overflow: hidden;
  color: #000000;
  font-family: Source Sans Pro;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.applications__app-type {
  color: #666666;
  font-family: Source Sans Pro;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

.applications__app-arrow {
  flex-shrink: 0;
  color: #a60a3a;
}

.applications__card-footer {
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #eeeeee;
  background: #ffffff;
}

.applications__footer {
  flex-shrink: 0;
  padding: 14px 24px;
  background: #8b1a2e;
  color: #ffffff;
  text-align: center;
  font-family: Source Sans Pro;
  font-size: 13px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}
</style>
