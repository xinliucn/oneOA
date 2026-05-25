<script setup lang="ts">
import type {
  ApplicationCatalogEntry,
  DesktopApplication,
  DesktopApplicationCategory,
} from '~/types/applicationCatalog'

definePageMeta({ layout: 'desktop', middleware: 'auth' })

const { locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const { addRecentItem } = useRecentItems('desktop')
const applicationsStore = useApplicationsStore()

const searchQuery = ref('')
const selectedGrouping = ref('By BU / Department')
const expandedCategoryIds = ref<string[]>([])
const groupings = ['By BU / Department']

const loading = computed(() => applicationsStore.activeLoading)
const categories = computed(() => applicationsStore.activeCatalogEntries.map(toDesktopCategory))

const normalizeString = (value?: unknown) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

const getEntryUrl = (entry: ApplicationCatalogEntry) => {
  return normalizeString(entry.homepageUrl)
    || normalizeString(entry.mobileUrl)
    || normalizeString(entry.mainTable?.homepage_url)
    || normalizeString(entry.mainTable?.mobileurl)
}

const splitMultiValue = (value?: string | null) => {
  return normalizeString(value)
    .split(/[/,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const getBusinessDetailPath = (entry: ApplicationCatalogEntry) => {
  const businessName = normalizeString(entry.mainTable?.business || entry.business || entry.mainTable?.name_en)
  const tags = splitMultiValue(entry.mainTable?.tag || entry.tag)
  const routeTags = tags.length ? tags : ['HK', 'CN', 'SEA']

  return `/desktop/applications/business/${encodeURIComponent(businessName)}/${encodeURIComponent(routeTags.join('/'))}/${encodeURIComponent('Group')}`
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

const getBusinessDescription = (business?: ApplicationCatalogEntry['mainTable']) => {
  if (locale.value === 'zh-CN') {
    return normalizeString(business?.description_sc)
      || normalizeString(business?.description_en)
      || normalizeString(business?.description_tc)
      || 'Business applications, workflows, and related entry points.'
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(business?.description_tc)
      || normalizeString(business?.description_en)
      || normalizeString(business?.description_sc)
      || 'Business applications, workflows, and related entry points.'
  }

  return normalizeString(business?.description_en)
    || normalizeString(business?.description_sc)
    || normalizeString(business?.description_tc)
    || 'Business applications, workflows, and related entry points.'
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

  if (normalized.includes('human resources') || normalized.includes('human resource') || normalized.includes('hr')) {
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

  return '#a60a3a'
}

const toDesktopCategory = (entry: ApplicationCatalogEntry): DesktopApplicationCategory => {
  const mainTable = entry.mainTable
  const name = getBusinessDisplayName(mainTable)
  const businessName = normalizeString(mainTable?.business) || normalizeString(mainTable?.name_en) || name
  const url = getEntryUrl(entry)
  const app: DesktopApplication = {
    id: normalizeString(mainTable?.id) || businessName || name,
    name,
    subtitle: normalizeString(mainTable?.type) || 'Business',
    url,
    icon: getBusinessFallbackIcon(businessName),
  }

  return {
    id: app.id,
    name,
    business: businessName,
    icon: app.icon,
    color: getBusinessAccentColor(businessName, normalizeString(entry.color) || normalizeString(mainTable?.color)),
    description: getBusinessDescription(mainTable),
    intranetLabel: `${name} Intranet >`,
    intranetUrl: url,
    detailPath: getBusinessDetailPath(entry),
    apps: [app],
  }
}

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

const handleViewAll = (category: DesktopApplicationCategory) => {
  applicationsStore.setSelectedBusiness({
    id: category.id,
    icon: category.icon,
    name_en: category.name,
    business: category.business || category.name,
    description_en: category.description,
    color: category.color,
    intranetLabel: category.intranetLabel,
    intranetUrl: category.intranetUrl,
  })

  return navigateTo(category.detailPath || '/desktop/applications')
}

applicationsStore.activePrimaryTab = 'business'
void applicationsStore.fetchTabCatalog()
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
              @click="handleViewAll(category)"
            >
              View All &gt;
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}

:deep(.applications__breadcrumb .el-breadcrumb__inner),
:deep(.applications__breadcrumb .el-breadcrumb__separator) {
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.applications__app-type {
  color: #666666;
  font-family: var(--font-source-sans-pro);
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
  font-family: var(--font-source-sans-pro);
  font-size: 13px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
}
</style>
