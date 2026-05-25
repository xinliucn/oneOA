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
      {{ t('desktopApps.states.loading') }}
    </div>
    <div
      v-else-if="visibleCategories.length === 0"
      class="desktop-apps__state"
    >
      {{ t('desktopApps.states.empty') }}
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
            @click="handleViewAll(category)"
          >
            {{ t('desktopApps.viewAll') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type {
  ApplicationCatalogEntry,
  DesktopApplication,
  DesktopApplicationCategory,
} from '~/types/applicationCatalog'

const { t, locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const { addRecentItem } = useRecentItems('desktop')
const applicationsStore = useApplicationsStore()
const loading = computed(() => applicationsStore.activeLoading)
const visibleCategories = computed(() => applicationsStore.activeCatalogEntries.slice(0, 3).map(toDesktopCategory))

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
      || t('desktopApps.fallback.business')
  }

  if (locale.value === 'zh-TW') {
    return normalizeString(business?.name_tc)
      || normalizeString(business?.name_en)
      || normalizeString(business?.name_sc)
      || t('desktopApps.fallback.business')
  }

  return normalizeString(business?.name_en)
    || normalizeString(business?.name_sc)
    || normalizeString(business?.name_tc)
    || t('desktopApps.fallback.business')
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

  return '#a60a3a'
}

const toDesktopCategory = (entry: ApplicationCatalogEntry): DesktopApplicationCategory => {
  const mainTable = entry.mainTable
  const name = getBusinessDisplayName(mainTable)
  const businessName = normalizeString(mainTable?.business) || normalizeString(mainTable?.name_en) || name
  const url = getEntryUrl(entry)

  return {
    id: normalizeString(mainTable?.id) || businessName || name,
    name,
    business: businessName,
    icon: getBusinessFallbackIcon(businessName),
    color: getBusinessAccentColor(businessName, normalizeString(entry.color) || normalizeString(mainTable?.color)),
    description: getBusinessDescription(mainTable),
    intranetLabel: t('desktopApps.intranetLabel', { name }),
    intranetUrl: url,
    detailPath: getBusinessDetailPath(entry),
    apps: [
      {
        id: normalizeString(mainTable?.id) || businessName || name,
        name,
        subtitle: normalizeString(mainTable?.type) || t('desktopApps.processName'),
        url,
        icon: getBusinessFallbackIcon(businessName),
      },
    ],
  }
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

onMounted(() => {
  applicationsStore.activePrimaryTab = 'business'
  void applicationsStore.fetchTabCatalog()
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
  font-family: var(--font-source-sans-pro);
  font-weight: 600;
  font-style: normal;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;

}

.desktop-apps__link {
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0;
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
