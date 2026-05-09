<template>
  <div
    class="mobile-home"
    :class="{ 'is-favourites-editing': isFavouritesEditOpen }"
  >
    <template v-if="!isFavouritesEditOpen">
      <section
        class="home-hero"
        :style="{ backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.12)), url(${heroImage})` }"
      >
        <div class="home-hero__greeting">
          <span>{{ greetingLabel }}</span>
          <strong>{{ displayName }}</strong>
        </div>
        <div class="home-hero__time">
          <span>{{ currentDateLabel }}</span>
          <strong>{{ currentTimeLabel }}</strong>
        </div>
      </section>
      <section class="home-section">
        <div class="home-shortcuts">
          <button
            type="button"
            class="home-shortcut-card"
            @click="openSearch"
          >
            <IconCustom
              name="search"
              :size="24"
              color="#b20f4b"
            />
            <span>Search</span>
          </button>

          <button
            type="button"
            class="home-shortcut-card"
            @click="openNotifications"
          >
            <IconCustom
              name="bell"
              :size="24"
              color="#b20f4b"
            />
            <span>Notifications</span>
          </button>
        </div>
      </section>
      <section class="home-section">
        <div class="home-section__header">
          <div
            class="home-section__tabs"
            role="tablist"
            aria-label="Favourite views"
          >
            <button
              type="button"
              class="home-section__tab"
              :class="{ 'is-active': favouriteView === 'favourites' }"
              role="tab"
              :aria-selected="favouriteView === 'favourites'"
              @click="favouriteView = 'favourites'"
            >
              Favourites
            </button>
            <button
              type="button"
              class="home-section__tab"
              :class="{ 'is-active': favouriteView === 'recents' }"
              role="tab"
              :aria-selected="favouriteView === 'recents'"
              @click="favouriteView = 'recents'"
            >
              Recents
            </button>
          </div>
          <button
            type="button"
            :disabled="favouriteLoading"
            @click="openFavouritesEdit"
          >
            {{ t('favourites.edit') }}
          </button>
        </div>
        <div class="favourites-grid">
          <div
            v-if="favouriteView === 'favourites' && favouriteLoading"
            class="home-empty-state"
          >
            Loading...
          </div>
          <template v-else-if="visibleFavouriteItems.length">
            <button
              v-for="item in visibleFavouriteItems"
              :key="item.id"
              type="button"
              class="favourite-item"
              @click="handleShortcutClick(item)"
            >
              <IconCustom
                :name="item.icon"
                :size="39"
                color="#A60A3A"
              />
              <span>{{ item.label }}</span>
            </button>
          </template>
          <div
            v-else
            class="home-empty-state"
          >
            {{ visibleShortcutEmptyCopy }}
          </div>
        </div>
      </section>

      <section class="home-section">
        <div class="home-section__header">
          <h2>Applications</h2>
          <button
            type="button"
            @click="openApplicationsPage"
          >
            View all
          </button>
        </div>
        <div class="applications-grid">
          <button
            v-for="item in applicationItems"
            :key="item.title"
            type="button"
            class="application-card"
            @click="openBusinessDetail(item.entry)"
          >
            <IconCustom
              :name="item.icon"
              :size="39"
              :color="item.color"
            />
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
          </button>
        </div>
      </section>

      <section class="home-section home-section--news">
        <div class="home-section__header">
          <h2>Group News</h2>
          <button
            type="button"
            @click="navigateTo('/mobile/news')"
          >
            View all
          </button>
        </div>
        <div class="news-strip">
          <article
            v-for="item in newsItems"
            :key="item.title"
            class="news-card"
            @click="openNewsItem(item)"
          >
            <img
              :src="item.image"
              :alt="item.title"
            >
            <div class="news-card__body">
              <h3>{{ item.title }}</h3>
              <time>{{ item.date }}</time>
            </div>
          </article>
        </div>
      </section>
    </template>

    <section
      v-else
      class="home-favourites-page"
    >
      <div class="home-favourites-page__header">
        <div
          v-if="isFavouritesSearchOpen"
          class="home-favourites-page__search-row"
        >
          <label class="home-favourites-page__search">
            <IconCustom
              name="search"
              :size="16"
              class="home-favourites-page__search-icon"
            />
            <input
              v-model.trim="favouritesSearchQuery"
              type="text"
              :placeholder="copy.searchPlaceholder"
            >
          </label>
          <button
            type="button"
            class="home-favourites-page__action-text"
            @click="closeFavouritesSearch"
          >
            {{ copy.cancel }}
          </button>
        </div>

        <div
          v-else
          class="home-favourites-page__title-row"
        >
          <h1>{{ t('favourites.title') }}</h1>
          <div class="home-favourites-page__actions">
            <button
              type="button"
              class="home-favourites-page__icon-btn"
              @click="openFavouritesSearch"
            >
              <IconCustom
                name="search"
                :size="18"
              />
            </button>
            <button
              type="button"
              class="home-favourites-page__action-text"
              :disabled="favouriteSaving"
              @click="completeFavouritesEdit"
            >
              {{ favouriteSaving ? copy.saving : copy.done }}
            </button>
          </div>
        </div>
      </div>

      <div class="home-favourites-page__list">
        <div class="home-favourites-section">
          <div class="home-favourites-section__title">
            {{ copy.myFavourites }}
          </div>
          <button
            v-for="item in selectedEditableFavourites"
            :key="item.itemId"
            type="button"
            class="home-favourites-row is-selected"
            @click="toggleDraftFavourite(item.itemId)"
          >
            <span
              class="home-favourites-row__check"
              aria-hidden="true"
            >
              <span />
            </span>
            <span class="home-favourites-row__body">
              <span class="home-favourites-row__title">{{ item.label }}</span>
              <span class="home-favourites-row__subtitle">{{ item.subtitle }}</span>
            </span>
          </button>
          <div
            v-if="!selectedEditableFavourites.length"
            class="home-favourites-empty-row"
          >
            {{ copy.selectAtLeastOne }}
          </div>
        </div>

        <div class="home-favourites-section">
          <div class="home-favourites-section__title">
            {{ copy.allItems }}
          </div>
          <button
            v-for="item in unselectedEditableFavourites"
            :key="item.itemId"
            type="button"
            class="home-favourites-row"
            :class="{ 'is-disabled': isMaxSelected }"
            @click="toggleDraftFavourite(item.itemId)"
          >
            <span
              class="home-favourites-row__check"
              aria-hidden="true"
            />
            <span class="home-favourites-row__body">
              <span class="home-favourites-row__title">{{ item.label }}</span>
              <span class="home-favourites-row__subtitle">{{ item.subtitle }}</span>
            </span>
            <IconCustom
              v-if="item.kind === 'custom'"
              name="chevron-right"
              :size="16"
              class="home-favourites-row__arrow"
            />
          </button>
        </div>

        <div
          v-if="catalogLoading"
          class="home-favourites-page__empty"
        >
          Loading...
        </div>
        <div
          v-else-if="!selectedEditableFavourites.length && !unselectedEditableFavourites.length"
          class="home-favourites-page__empty"
        >
          {{ copy.searchEmpty }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { ApplicationCatalogItem } from '~/composables/useApplicationCatalog'
import type { RecentItem } from '~/composables/useRecentItems'
import heroImage from '~/assets/images/Group 120.png'
import newsImage1 from '~/assets/images/news/news1.png'
import newsImage2 from '~/assets/images/news/news2.png'
import { APPLICATION_BUSINESS_FILTER } from '~/composables/useApplicationCatalog'

type FavouriteKind = 'application' | 'intranet' | 'custom'

type FavouriteItem = {
  id: string
  itemId: number
  label: string
  subtitle: string
  icon: string
  kind: FavouriteKind
  url?: string
}

type ShortcutItem = Pick<RecentItem, 'id' | 'label' | 'subtitle' | 'icon' | 'url' | 'path'>

type CatalogRecord = ApplicationCatalogItem & Record<string, any>

const { user } = useAuth()
const { t, locale } = useAppI18n()
const { requestApplicationCatalogData } = useApplicationCatalog()
const { items: recentItems, hydrate: hydrateRecentItems, addRecentItem } = useRecentItems()
const {
  getFavourite,
  saveFavourite,
  items: apiFavouriteItems,
  itemidList: favouriteItemIds,
  loading: favouriteLoading,
  saving: favouriteSaving,
} = useFavourite()

const activeTab = useState<number>('mobile:activeTab', () => 1)
const mobileReturnPath = useState<string>('mobile:notification:return-path', () => '/mobile')
const selectedBusiness = useState<{
  id?: string
  icon?: string
  name_en?: string
  business?: string
  description_en?: string
  color?: string
  intranetLabel?: string
  intranetUrl?: string
} | null>('mobile:selected-business', () => null)
const currentTime = ref(new Date())
const favouriteView = ref<'favourites' | 'recents'>('favourites')
const isFavouritesEditOpen = ref(false)
const isFavouritesSearchOpen = ref(false)
const favouritesSearchQuery = ref('')
const draftFavouriteItemIds = ref<number[]>([])
const catalogItems = ref<ApplicationCatalogItem[]>([])
const catalogLoading = ref(false)
const catalogLoaded = ref(false)
const businessEntries = ref<Array<{
  mainTable?: {
    id?: string
    name_en?: string
    description_en?: string
    business?: string
    tag?: string
    color?: string
    homepage_url?: string
    mobileurl?: string
  }
}>>([])
let timer: ReturnType<typeof setInterval> | null = null

const maxSelected = 8

const copyMap = {
  'en': {
    allItems: 'All Items',
    cancel: 'Cancel',
    done: 'Done',
    empty: 'No favourites selected yet.',
    myFavourites: 'My Favourites',
    recentsEmpty: 'No recent items yet.',
    saving: 'Saving...',
    searchEmpty: 'No favourites match your search.',
    selectAtLeastOne: 'No favourites selected.',
    searchPlaceholder: 'Search All Items',
  },
  'zh-CN': {
    allItems: '全部项目',
    cancel: '取消',
    done: '完成',
    empty: '暂未选择收藏项目',
    myFavourites: '我的收藏',
    recentsEmpty: '暂无最近访问',
    saving: '保存中...',
    searchEmpty: '没有符合搜索条件的收藏项目',
    selectAtLeastOne: '暂未选择收藏项目',
    searchPlaceholder: '搜索全部项目',
  },
  'zh-TW': {
    allItems: '全部項目',
    cancel: '取消',
    done: '完成',
    empty: '暫未選擇收藏項目',
    myFavourites: '我的收藏',
    recentsEmpty: '暫無最近訪問',
    saving: '儲存中...',
    searchEmpty: '沒有符合搜尋條件的收藏項目',
    selectAtLeastOne: '暫未選擇收藏項目',
    searchPlaceholder: '搜尋全部項目',
  },
} as const

const copy = computed(() => {
  return copyMap[locale.value as keyof typeof copyMap] || copyMap.en
})

const displayName = computed(() => {
  return user.value?.name || user.value?.username || user.value?.displayName || 'John'
})

const currentDateLabel = computed(() => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(currentTime.value)
})

const currentTimeLabel = computed(() => {
  const hours = String(currentTime.value.getHours()).padStart(2, '0')
  const minutes = String(currentTime.value.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
})

const greetingLabel = computed(() => {
  const hour = currentTime.value.getHours()

  if (hour < 12) {
    return t('home.greetings.morning')
  }

  if (hour < 18) {
    return t('home.greetings.afternoon')
  }

  return t('home.greetings.evening')
})

const regionOrder = ['HK', 'CN', 'SEA']
const detailRouteTypes = ['Data', 'Form']

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

const getCatalogRecord = (item?: ApplicationCatalogItem) => (item || {}) as CatalogRecord

const getCatalogMainTable = (item?: ApplicationCatalogItem) => {
  const record = getCatalogRecord(item)

  return record.mainTable || record.main_table || record.raw?.mainTable || {}
}

const getCatalogItemId = (item?: ApplicationCatalogItem) => {
  const record = getCatalogRecord(item)
  const mainTable = getCatalogMainTable(item)
  const itemId = Number(getFirstString(record.id, mainTable.id))

  return Number.isFinite(itemId) ? itemId : null
}

const getCatalogItemName = (item?: ApplicationCatalogItem) => {
  const record = getCatalogRecord(item)
  const mainTable = getCatalogMainTable(item)

  return getFirstString(record.name, record.name_en, mainTable.name_en, mainTable.name, mainTable.application) || 'Application'
}

const getCatalogItemType = (item?: ApplicationCatalogItem) => {
  const record = getCatalogRecord(item)
  const mainTable = getCatalogMainTable(item)

  return getFirstString(record.type, mainTable.type, 'Application')
}

const getCatalogItemBusiness = (item?: ApplicationCatalogItem) => {
  const record = getCatalogRecord(item)
  const mainTable = getCatalogMainTable(item)

  return getFirstString(record.business, mainTable.business)
}

const getCatalogItemUrl = (item?: ApplicationCatalogItem) => {
  const record = getCatalogRecord(item)
  const mainTable = getCatalogMainTable(item)

  return getFirstString(
    record.mobileUrl,
    record.mobileurl,
    record.homepageUrl,
    record.homepage_url,
    mainTable.mobileUrl,
    mainTable.mobileurl,
    mainTable.homepageUrl,
    mainTable.homepage_url,
  )
}

const getCatalogIcon = (item?: ApplicationCatalogItem) => {
  const type = getCatalogItemType(item).toLowerCase()
  const business = getCatalogItemBusiness(item).toLowerCase()
  const name = getCatalogItemName(item).toLowerCase()

  if (business.includes('digital') || name.includes('digital') || name.includes('technology') || name.includes('it service')) {
    return 'digital-technology'
  }

  if (business.includes('finance') || name.includes('claim') || name.includes('travel') || name.includes('yonyou')) {
    return 'finance-bars'
  }

  if (business.includes('legal') || business.includes('compliance') || name.includes('contract')) {
    return 'legal-compliance'
  }

  if (business.includes('human resources') || business.includes('hr') || name.includes('hr')) {
    return 'personnel'
  }

  if (name.includes('learning')) {
    return 'education'
  }

  if (type === 'data') {
    return 'dashboard'
  }

  if (type === 'business' || type === 'portal') {
    return 'building'
  }

  return 'apps'
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

const apiFavouriteSource = computed<FavouriteItem[]>(() => {
  return apiFavouriteItems.value.map(item => ({
    id: `api-${item.itemId}`,
    itemId: item.itemId,
    label: item.name,
    subtitle: item.description || 'Application',
    icon: 'apps',
    kind: 'application',
    url: item.mobileUrl || item.homepageUrl,
  }))
})

const catalogFavouriteSource = computed<FavouriteItem[]>(() => {
  const items: FavouriteItem[] = []

  for (const item of catalogItems.value) {
    const itemId = getCatalogItemId(item)
    if (itemId === null) {
      continue
    }

    const type = getCatalogItemType(item)

    items.push({
      id: `catalog-${itemId}`,
      itemId,
      label: getCatalogItemName(item),
      subtitle: type,
      icon: getCatalogIcon(item),
      kind: type.toLowerCase() === 'business' ? 'intranet' : 'application',
      url: getCatalogItemUrl(item),
    })
  }

  return items
})

const editableSource = computed(() => {
  const sourceMap = new Map<number, FavouriteItem>()

  for (const item of catalogFavouriteSource.value) {
    sourceMap.set(item.itemId, item)
  }

  for (const item of apiFavouriteSource.value) {
    if (!sourceMap.has(item.itemId)) {
      sourceMap.set(item.itemId, item)
    }
  }

  return Array.from(sourceMap.values())
})

const favouriteMapByItemId = computed(() => {
  return new Map(editableSource.value.map(item => [item.itemId, item]))
})

const selectedFavouriteItems = computed(() => {
  return favouriteItemIds.value
    .map(itemId => favouriteMapByItemId.value.get(itemId))
    .filter((item): item is FavouriteItem => Boolean(item))
})

const recentShortcutItems = computed<ShortcutItem[]>(() => {
  return recentItems.value.slice(0, maxSelected)
})

const visibleFavouriteItems = computed<ShortcutItem[]>(() => {
  if (favouriteView.value === 'recents') {
    return recentShortcutItems.value
  }

  return selectedFavouriteItems.value
})

const visibleShortcutEmptyCopy = computed(() => {
  return favouriteView.value === 'recents' ? copy.value.recentsEmpty : copy.value.empty
})

const isMaxSelected = computed(() => draftFavouriteItemIds.value.length >= maxSelected)

const filteredEditableFavourites = computed(() => {
  const keyword = favouritesSearchQuery.value.trim().toLowerCase()

  if (!keyword) {
    return editableSource.value
  }

  return editableSource.value.filter(item => [item.label, item.subtitle].some(value => value.toLowerCase().includes(keyword)))
})

const filteredEditableMap = computed(() => {
  return new Map(filteredEditableFavourites.value.map(item => [item.itemId, item]))
})

const selectedEditableFavourites = computed(() => {
  return draftFavouriteItemIds.value
    .map(itemId => filteredEditableMap.value.get(itemId))
    .filter((item): item is FavouriteItem => Boolean(item))
})

const unselectedEditableFavourites = computed(() => {
  const selectedSet = new Set(draftFavouriteItemIds.value)

  return filteredEditableFavourites.value.filter(item => !selectedSet.has(item.itemId))
})

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

const applicationItems = computed(() => {
  return businessEntries.value.slice(0, 4).map((item) => {
    const businessName = item.mainTable?.name_en || item.mainTable?.business

    return {
      entry: item,
      icon: getBusinessFallbackIcon(businessName),
      color: getBusinessAccentColor(businessName, item.mainTable?.color),
      title: getBusinessDisplayName(businessName),
      description: getBusinessDescription(businessName, item.mainTable?.description_en),
    }
  })
})

const newsItems = [
  {
    image: newsImage1,
    title: 'DCH Foods Hosts Trade Event to Promote New Bran...',
    date: '24 October, 2024',
  },
  {
    image: newsImage2,
    title: 'DCH Foods Hosts Trade Event to Promote New Bran...',
    date: '24 October, 2024',
  },
]

const openApplicationsPage = async () => {
  activeTab.value = 3
  await navigateTo('/mobile')
}

const recordRecentItem = (item: Omit<RecentItem, 'visitedAt'>) => {
  addRecentItem(item)
}

const openBusinessDetail = async (item: {
  mainTable?: {
    id?: string
    name_en?: string
    description_en?: string
    business?: string
    tag?: string
    color?: string
    homepage_url?: string
    mobileurl?: string
  }
}) => {
  const businessName = normalizeString(item.mainTable?.business || item.mainTable?.name_en)
  const businessTags = sortByKnownOrder(splitMultiValue(item.mainTable?.tag), regionOrder)
  const displayName = getBusinessDisplayName(item.mainTable?.name_en || businessName)
  const targetPath = `/mobile/applications/business/${encodeURIComponent(businessName)}/${encodeURIComponent((businessTags.length ? businessTags : regionOrder).join('/'))}/${encodeURIComponent(detailRouteTypes.join('/'))}`

  selectedBusiness.value = {
    id: businessName,
    icon: getBusinessFallbackIcon(item.mainTable?.name_en || businessName),
    name_en: displayName,
    business: businessName,
    description_en: getBusinessDescription(item.mainTable?.name_en || businessName, item.mainTable?.description_en),
    color: getBusinessAccentColor(item.mainTable?.name_en || businessName, item.mainTable?.color),
    intranetLabel: `${displayName} Intranet >`,
    intranetUrl: item.mainTable?.homepage_url || item.mainTable?.mobileurl || 'https://intranet.dch.com.hk/',
  }

  recordRecentItem({
    id: `business:${businessName || item.mainTable?.id || displayName}`,
    type: 'business',
    label: displayName,
    subtitle: getBusinessDescription(item.mainTable?.name_en || businessName, item.mainTable?.description_en),
    icon: getBusinessFallbackIcon(item.mainTable?.name_en || businessName),
    path: targetPath,
  })

  activeTab.value = 3
  await navigateTo(targetPath)
}

const openSearch = async () => {
  await navigateTo('/mobile/search')
}

const openNotifications = async () => {
  mobileReturnPath.value = '/mobile'
  await navigateTo('/mobile/notifications')
}

const fetchCatalogItems = async () => {
  if (catalogLoaded.value || catalogLoading.value) {
    return
  }

  catalogLoading.value = true

  try {
    catalogItems.value = await requestApplicationCatalogData()
    catalogLoaded.value = true
  }
  catch (error) {
    console.error('Fetch application catalog failed:', error)
    catalogItems.value = []
  }
  finally {
    catalogLoading.value = false
  }
}

const openFavouritesEdit = () => {
  draftFavouriteItemIds.value = [...favouriteItemIds.value].slice(0, maxSelected)
  favouritesSearchQuery.value = ''
  isFavouritesSearchOpen.value = false
  isFavouritesEditOpen.value = true
  fetchCatalogItems()
}

const closeFavouritesEdit = () => {
  favouritesSearchQuery.value = ''
  isFavouritesSearchOpen.value = false
  isFavouritesEditOpen.value = false
}

const openFavouritesSearch = () => {
  isFavouritesSearchOpen.value = true
}

const closeFavouritesSearch = () => {
  favouritesSearchQuery.value = ''
  isFavouritesSearchOpen.value = false
}

const toggleDraftFavourite = (itemId: number) => {
  if (draftFavouriteItemIds.value.includes(itemId)) {
    draftFavouriteItemIds.value = draftFavouriteItemIds.value.filter(currentItemId => currentItemId !== itemId)
    return
  }

  if (draftFavouriteItemIds.value.length >= maxSelected) {
    return
  }

  draftFavouriteItemIds.value = [...draftFavouriteItemIds.value, itemId]
}

const completeFavouritesEdit = async () => {
  try {
    await saveFavourite(draftFavouriteItemIds.value)
    await getFavourite()
    closeFavouritesEdit()
  }
  catch (error) {
    console.error('Save favourites failed:', error)
  }
}

const handleShortcutClick = async (item: ShortcutItem) => {
  recordRecentItem({
    id: item.id,
    type: 'application',
    label: item.label,
    subtitle: item.subtitle,
    icon: item.icon,
    url: item.url,
    path: item.path,
  })

  if (item.path) {
    return navigateTo(item.path)
  }

  if (item.url) {
    window.open(item.url, '_self')
  }
}

const openNewsItem = async (item: { title: string, date: string }) => {
  recordRecentItem({
    id: `news:${item.title}`,
    type: 'news',
    label: item.title,
    subtitle: item.date,
    icon: 'document',
    path: '/mobile/news',
  })

  await navigateTo('/mobile/news')
}

onMounted(async () => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)

  hydrateRecentItems()

  requestApplicationCatalogData(APPLICATION_BUSINESS_FILTER)
    .then((businessData) => {
      businessEntries.value = businessData
    })
    .catch((error) => {
      console.error('Get mobile home applications failed:', error)
    })

  getFavourite().catch((error) => {
    console.error('Get mobile home favourites failed:', error)
  })

  fetchCatalogItems()
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.mobile-home {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;
}

.mobile-home.is-favourites-editing {
  padding: 0;
  overflow: hidden;
  background: #f3f3f3;
}

.home-hero {
  min-height: 134px;
  margin: 0 -16px;
  padding: 28px 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-size: cover;
  background-position: center;
  color: #ffffff;
}

.home-hero__greeting,
.home-hero__time {
  display: flex;
  flex-direction: column;
}

.home-hero__greeting {
  gap: 4px;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 700;
}

.home-hero__greeting span,
.home-hero__greeting strong {
  font-size: inherit;
}

.home-hero__time {
  align-items: flex-end;
  gap: 2px;
  transform: translateY(4px);
}

.home-hero__time span {
  font-size: 16px;
  font-weight: 500;
}

.home-hero__time strong {
  font-size: 32px;
  line-height: 1;
}

.home-section {
  padding: 16px 0 18px;
  border-bottom: 1px solid #eeeeee;
}

.home-section--news {
  border-bottom: 0;
}

.home-shortcuts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.home-shortcut-card {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #f7dce4 0%, #f2d8de 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #b20f4b;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.home-shortcut-card span {
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
}

.home-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.home-section__tabs {
  display: inline-flex;
  align-items: center;
  width: 250px;
  height: 48px;
  padding: 4px;
  border: 0;
  border-radius: 24.5px;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 6px rgba(0, 0, 0, 0.05);
}

.home-section__tab {
  flex: 1;
  height: 40px;
  border: 0;
  border-radius: 20px;
  background: transparent;
  color: #111111;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
}

.home-section__tab.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.home-section__header h2 {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

}

.home-section__header>button {
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  border: none;
  color: #A60A3A;
  background: none;
}

.favourites-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  row-gap: 18px;
  margin-bottom: 16px;
}

.home-empty-state {
  grid-column: 1 / -1;
  min-height: 74px;
  border-radius: 12px;
  background: #f7f7f7;
  color: #7a6d72;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  font-size: 14px;
  text-align: center;
}

.favourite-item {
  border: 0;
  background: transparent;
  padding: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #111111;
}

.favourite-item span {
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.2;
  font-weight: 600;
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.application-card {
  min-width: 179px;
  min-height: 124px;
  border: 0.5px solid #D9D9D9;
  border-radius: 8px;
  padding: 14px 10px 10px;
  background: #ffffff;
  box-shadow: 0px 2px 50px 6px #0000000D;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.application-card strong {
  width: 141;
  height: 20;
  top: 703px;
  left: 36px;
  angle: 0 deg;
  opacity: 1;
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: #000000;

}

.application-card span {
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
}

.news-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.news-card {
  width: 179px;
  height: 251px;
  top: 995px;
  left: 16px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0px 2px 50px 6px #0000001A;
}

.news-card img {
  width: 179px;
  height: 130px;
  angle: 0 deg;
  opacity: 1;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;

}

.news-card__body {
  padding: 10px 10px 12px;
}

.news-card__body h3 {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  border-bottom: 1px solid #D9D9D9;
  margin-bottom: 8px;
  height: 60px;
}

.news-card__body time {
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-top: 16px;
}

.home-favourites-page {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  color: #111111;
}

.home-favourites-page__header {
  flex: 0 0 auto;
  padding: 14px 16px 10px;
  background: #ffffff;
}

.home-favourites-page__title-row,
.home-favourites-page__search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.home-favourites-page__title-row h1 {
  margin: 0;
  color: #111111;
  font-size: 22px;
  line-height: 1;
  font-weight: 700;
}

.home-favourites-page__actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.home-favourites-page__icon-btn {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: #f9dfe7;
  color: #a60a3a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-favourites-page__action-text {
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 12px;
  line-height: 1;
  font-weight: 400;
}

.home-favourites-page__action-text:disabled {
  opacity: 0.62;
}

.home-favourites-page__search {
  min-width: 0;
  height: 34px;
  flex: 1;
  border-radius: 4px;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.home-favourites-page__search-icon {
  flex: 0 0 auto;
  color: #707070;
}

.home-favourites-page__search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  color: #111111;
  font-size: 12px;
  line-height: 1;
}

.home-favourites-page__search input::placeholder {
  color: #777777;
}

.home-favourites-page__list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.home-favourites-page__list::-webkit-scrollbar {
  display: none;
}

.home-favourites-section__title {
  height: 38px;
  padding: 0 16px;
  background: #f3f3f3;
  color: #111111;
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
}

.home-favourites-row {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-bottom: 1px solid #e7e7e7;
  background: #ffffff;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}

.home-favourites-row.is-disabled {
  opacity: 0.52;
}

.home-favourites-empty-row {
  min-height: 52px;
  padding: 0 16px;
  background: #ffffff;
  color: #8a8a8a;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
  font-size: 13px;
  line-height: 1;
}

.home-favourites-row__check {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 50%;
  border: 1px solid #c20f49;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.home-favourites-row.is-selected .home-favourites-row__check {
  background: #a60a3a;
  border-color: #a60a3a;
}

.home-favourites-row__check span {
  width: 9px;
  height: 5px;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(-45deg) translateY(-1px);
}

.home-favourites-row__body {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.home-favourites-row__title {
  color: #111111;
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
}

.home-favourites-row__subtitle {
  color: #6f6f6f;
  font-size: 12px;
  line-height: 1;
}

.home-favourites-row__arrow {
  flex: 0 0 auto;
  color: #a60a3a;
}

.home-favourites-page__empty {
  margin: 20px 0;
  background: #ffffff;
  color: #7a6d72;
  padding: 22px 14px;
  text-align: center;
  font-size: 14px;
}
</style>
