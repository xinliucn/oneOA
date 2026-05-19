<template>
  <div class="mobile-applications">
    <div class="mobile-applications__header">
      <h2 class="mobile-applications__title">
        {{ t('desktopApps.title') }}
      </h2>
      <el-button
        circle
        class="search-btn"
        @click="navigateTo('/mobile/search')"
      >
        <IconCustom
          name="search"
          :size="20"
        />
      </el-button>
    </div>

    <div class="mobile-applications__tabs">
      <div class="applications__tabs__box">
        <button
          v-for="tab in primaryTabs"
          :key="tab.key"
          :class="['tab-btn', { active: activePrimaryTab === tab.key }]"
          @click="selectPrimaryTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div
      v-if="!isBusinessTab"
      class="app-grid"
    >
      <div
        v-for="app in catalogEntries"
        :key="getCatalogEntryKey(app)"
        class="app-card"
        @click="handleAppClick(app)"
      >
        <div class="app-card__logo">
          <img
            v-if="app.mainTable?.iconx64"
            :src="app.mainTable.iconx64"
            :alt="getApplicationDisplayName(app)"
            class="app-card__img"
          >
          <div
            v-else
            class="app-card__fallback"
            :aria-label="getApplicationDisplayName(app)"
          >
            <IconCustom
              name="apps"
              :size="26"
            />
          </div>
        </div>
        <div class="app-card__name">
          {{ getApplicationDisplayName(app) }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="business-grid"
    >
      <div
        v-for="biz in catalogEntries"
        :key="getCatalogEntryKey(biz)"
        class="biz-card"
        @click="handleBizClick(biz.mainTable)"
      >
        <div
          class="biz-card__icon"
          :style="{ color: getBusinessAccentColor(biz.mainTable?.name_en, biz.color) }"
        >
          <div class="app-card__logo">
            <img
              v-if="biz.mainTable?.iconx64"
              :src="biz.mainTable.iconx64"
              :alt="getBusinessDisplayName(biz.mainTable)"
              class="app-card__img"
            >
            <div
              v-else
              class="app-card__fallback app-card__fallback--business"
              :style="{ color: getBusinessAccentColor(biz.mainTable?.name_en, biz.color) }"
              :aria-label="getBusinessDisplayName(biz.mainTable)"
            >
              <IconCustom
                :name="getBusinessFallbackIcon(biz.mainTable?.name_en)"
                :size="24"
              />
            </div>
          </div>
        </div>
        <div class="biz-card__name">
          {{ getBusinessDisplayName(biz.mainTable) }}
        </div>
        <div class="biz-card__desc">
          {{ getBusinessDescription(biz) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  ApplicationCatalogEntry as CatalogEntry,
  ApplicationPrimaryTab,
  ApplicationPrimaryTabKey,
} from '~/types/applicationCatalog'

const { t, locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const { addRecentItem } = useRecentItems()
const applicationsStore = useApplicationsStore()
const primaryTabs: ApplicationPrimaryTab[] = [
  { key: 'application', label: t('mobile.applications.tabs.byApplication') },
  { key: 'business', label: t('mobile.applications.tabs.byBusiness') },
]
const activePrimaryTab = computed(() => applicationsStore.activePrimaryTab)
const isBusinessTab = computed(() => activePrimaryTab.value === 'business')
const catalogEntries = computed(() => applicationsStore.activeCatalogEntries)
const regionOrder = ['HK', 'CN', 'SEA']
const detailRouteTypes = ['Group']

const normalizeString = (value?: string | null) => {
  return typeof value === 'string' ? value.trim() : ''
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

const selectPrimaryTab = (tabKey: ApplicationPrimaryTabKey) => {
  void applicationsStore.selectPrimaryTab(tabKey)
}

const getCatalogEntryKey = (entry: CatalogEntry) => {
  return entry.mainTable?.id || entry.mobileUrl || entry.homepageUrl || getApplicationDisplayName(entry)
}

const getApplicationUrl = (app: CatalogEntry) => {
  return app?.mainTable?.mobileurl || app?.mainTable?.homepage_url || app?.mobileUrl || app?.homepageUrl || ''
}

const handleAppClick = async (app: CatalogEntry) => {
  const url = getApplicationUrl(app)
  if (!url) {
    return
  }

  const displayName = getApplicationDisplayName(app)

  addRecentItem({
    id: `application:${app.mainTable?.id || url}`,
    type: 'application',
    label: displayName,
    subtitle: app.mainTable?.type || app.type || 'Application',
    icon: 'apps',
    url,
  })

  await openGuardedUrl(url, '_blank')
}

const getApplicationDisplayName = (app: CatalogEntry) => {
  if (locale.value === 'zh-CN') {
    return normalizeString(app.mainTable?.name_sc)
      || normalizeString(app.mainTable?.name_en)
      || normalizeString(app.mainTable?.name_tc)
      || normalizeString(app.name)
      || 'Application'
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(app.mainTable?.name_tc)
      || normalizeString(app.mainTable?.name_en)
      || normalizeString(app.mainTable?.name_sc)
      || normalizeString(app.name)
      || 'Application'
  }

  return normalizeString(app.mainTable?.name_en)
    || normalizeString(app.mainTable?.name_sc)
    || normalizeString(app.mainTable?.name_tc)
    || normalizeString(app.name)
    || 'Application'
}

const getBusinessDisplayName = (business?: CatalogEntry['mainTable']) => {
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

const getBusinessDescription = (entry: CatalogEntry) => {
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

const getBusinessRouteParams = (biz: CatalogEntry['mainTable']) => {
  const businessName = normalizeString(biz?.business || biz?.name_en)
  const tags = sortByKnownOrder(splitMultiValue(biz?.tag), regionOrder)

  return {
    business: businessName,
    tag: (tags.length ? tags : regionOrder).join('/'),
    type: detailRouteTypes.join('/'),
  }
}

const handleBizClick = async (biz: CatalogEntry['mainTable']) => {
  const businessName = normalizeString(biz?.business || biz?.name_en)
  const displayName = getBusinessDisplayName(biz)
  const routeParams = getBusinessRouteParams(biz)
  const targetPath = `/mobile/applications/business/${encodeURIComponent(routeParams.business)}/${encodeURIComponent(routeParams.tag)}/${encodeURIComponent(routeParams.type)}`

  applicationsStore.setSelectedBusiness({
    id: businessName,
    icon: getBusinessFallbackIcon(biz?.name_en),
    name_en: displayName,
    business: businessName,
    description_en: getBusinessDescription({ mainTable: biz } as CatalogEntry),
    color: getBusinessAccentColor(biz?.name_en, biz?.color),
    intranetLabel: `${displayName} Intranet >`,
    intranetUrl: biz?.homepage_url || biz?.mobileurl || 'https://intranet.dch.com.hk/',
  })

  addRecentItem({
    id: `business:${businessName || biz?.id || displayName}`,
    type: 'business',
    label: displayName,
    subtitle: getBusinessDescription({ mainTable: biz } as CatalogEntry),
    icon: getBusinessFallbackIcon(biz?.name_en),
    path: targetPath,
  })

  return navigateTo(targetPath)
}

const getBusinessFallbackIcon = (name?: string) => {
  const normalized = String(name || '').trim().toLowerCase()

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

  const normalized = String(name || '').trim().toLowerCase()

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

  return '#a60a3a'
}

void applicationsStore.fetchTabCatalog()
</script>

<style scoped>
.mobile-applications {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F5F5F5;
}

.mobile-applications__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;

  .search-btn {
    height: 40px;
    width: 40px;
    background-color: #fce4ec;
    border: none;
    color: #c2185b;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

.mobile-applications__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.mobile-applications__tabs {
  padding: 10px 16px 14px;
  background: white;
  border-bottom: 1px solid #f2f2f2;
}

.applications__tabs__box {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 3px;
  background: linear-gradient(180deg, #ffffff 0%, #faf8f9 100%);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(23, 23, 23, 0.08);
}

.tab-btn {
  flex: 1;
  min-height: 44px;
  padding: 0 20px;
  border: 0;
  background: transparent;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: #171717;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(166, 10, 58, 0.28);
}

/* By Application Grid */
.app-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.app-card {
  background: white;
  border-radius: 14px;
  padding: 22px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 14px 24px rgba(17, 17, 17, 0.07);
}

.app-card:active {
  transform: scale(0.97);
}

.app-card__logo {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
}

.app-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-card__fallback {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f8eff2 0%, #f2e5ea 100%);
  color: #a60a3a;
  box-shadow: inset 0 0 0 1px rgba(166, 10, 58, 0.06);
}

.app-card__fallback--business {
  border-radius: 999px;
  background: #f7f7f7;
  box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.04);
}

.app-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  text-align: center;
  line-height: 1.35;
}

/* By Business Grid */
.business-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.biz-card {
  background: white;
  border-radius: 14px;
  padding: 16px 12px 14px;
  min-height: 132px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 14px 24px rgba(17, 17, 17, 0.07);
}

.biz-card:active {
  transform: scale(0.97);
}

.biz-card__icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.biz-card__icon .app-card__logo {
  width: 46px;
  height: 46px;
}

.biz-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  line-height: 1.35;
  text-align: center;
  max-width: 128px;
  margin: 0 auto;
}

.biz-card__desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.4;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
