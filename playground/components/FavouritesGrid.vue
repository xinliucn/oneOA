<template>
  <div class="favourites-grid">
    <!-- <div class="favourites-grid__header">
      <div
        class="favourites-grid__tabs"
        role="tablist"
        aria-label="Favourite views"
      >
        <button
          type="button"
          class="favourites-grid__tab"
          :class="{ 'is-active': activeView === 'favourites' }"
          @click="activeView = 'favourites'"
        >
          Favourites
        </button>
        <button
          type="button"
          class="favourites-grid__tab"
          :class="{ 'is-active': activeView === 'recents' }"
          @click="activeView = 'recents'"
        >
          Recents
        </button>
      </div>
      <button
        type="button"
        class="favourites-grid__edit"
        @click="openEditModal"
      >
        {{ t('favourites.edit') }}
      </button>
    </div>
    <div
      v-if="activeView === 'favourites' && favouriteLoading"
      class="favourites-grid__empty"
    >
      Loading...
    </div>
    <div
      v-else-if="visibleApps.length"
      class="favourites-grid__items"
    >
      <div
        v-for="app in visibleApps"
        :key="app.id"
        class="favourite-card"
        @click="handleClick(app)"
      >
        <div class="favourite-card__icon">
          <IconCustom
            :name="app.icon"
            :size="32"
          />
        </div>
        <div class="favourite-card__label">
          {{ app.label }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="favourites-grid__empty"
    >
      {{ activeView === 'recents' ? 'No recent items yet.' : 'No favourites selected yet.' }}
    </div>

    <Teleport to="body">
      <div
        v-if="isEditModalOpen"
        class="favourites-modal"
        role="dialog"
        aria-modal="true"
      >
        <div class="favourites-modal__panel">
          <button
            type="button"
            class="favourites-modal__close"
            aria-label="Close"
            @click="closeEditModal"
          >
            <span />
            <span />
          </button>

          <h2 class="favourites-modal__title">
            Edit My Favourites
          </h2>
          <div class="favourites-modal__divider" />

          <div class="favourites-modal__toolbar">
            <label class="favourites-modal__search">
              <IconCustom
                name="search"
                :size="18"
                class="favourites-modal__search-icon"
              />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search All Items"
              >
            </label>

            <label class="favourites-modal__sort">
              <span>Sort By</span>
              <select v-model="sortBy">
                <option value="recent">Most recent</option>
                <option value="name">Name A-Z</option>
              </select>
            </label>
          </div>

          <div
            v-if="catalogLoading"
            class="favourites-modal__list favourites-modal__list--state"
          >
            Loading...
          </div>
          <div
            v-else-if="editableFavourites.length === 0"
            class="favourites-modal__list favourites-modal__list--state"
          >
            No items found.
          </div>
          <div
            v-else
            class="favourites-modal__list"
          >
            <label
              v-for="item in editableFavourites"
              :key="item.itemId"
              class="favourites-modal__item"
              :class="{ 'is-disabled': !isDraftSelected(item.itemId) && isMaxSelected }"
            >
              <input
                type="checkbox"
                :checked="isDraftSelected(item.itemId)"
                :disabled="!isDraftSelected(item.itemId) && isMaxSelected"
                @change="toggleDraftSelection(item.itemId)"
              >
              <span class="favourites-modal__item-copy">
                <span class="favourites-modal__item-title">{{ item.label }}</span>
                <span class="favourites-modal__item-subtitle">{{ item.subtitle }}</span>
              </span>
            </label>
          </div>

          <div class="favourites-modal__footer">
            <div class="favourites-modal__count">
              {{ draftSelectedItemIds.length }}/{{ maxSelected }}
            </div>
            <button
              type="button"
              class="favourites-modal__save"
              :disabled="favouriteSaving"
              @click="saveFavourites"
            >
              {{ favouriteSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
import type { ApplicationCatalogItem } from '~/types/applicationCatalog'
import type { RecentItem } from '~/composables/useRecentItems'

type FavouriteKind = 'application' | 'shortcut' | 'intranet' | 'custom'

type FavouriteItem = {
  id: string
  itemId: number
  label: string
  subtitle: string
  icon: string
  kind: FavouriteKind
  url?: string
  path?: string
}

type ShortcutItem = Pick<RecentItem, 'id' | 'label' | 'subtitle' | 'icon' | 'url' | 'path'>

const { t: _t } = useAppI18n()
const { requestApplicationCatalogData } = useApplicationCatalog()
const { items: recentItems, hydrate: hydrateRecentItems, addRecentItem } = useRecentItems('desktop')
const { openGuardedUrl } = useNetworkGuard()
const {
  bootstrapFavourite,
  saveFavourite,
  items: favouriteItems,
  itemidList: favouriteItemIds,
  loading: _favouriteLoading,
  saving: _favouriteSaving,
} = useFavourite()

const maxSelected = 8
const defaultSelectedIds: number[] = []

const isEditModalOpen = ref(false)
const activeView = ref<'favourites' | 'recents'>('favourites')
const searchQuery = ref('')
const sortBy = ref<'recent' | 'name'>('recent')
const draftSelectedItemIds = ref<number[]>([])
const catalogItems = ref<ApplicationCatalogItem[]>([])
const catalogLoading = ref(false)
const catalogLoaded = ref(false)

type CatalogRecord = ApplicationCatalogItem & Record<string, any>

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
  const id = Number(getFirstString(record.id, mainTable.id))

  return Number.isFinite(id) ? id : null
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

const getCatalogIcon = (item?: ApplicationCatalogItem) => {
  const type = getCatalogItemType(item).toLowerCase()
  const business = getCatalogItemBusiness(item).toLowerCase()
  const name = getCatalogItemName(item).toLowerCase()

  if (type === 'business') {
    if (business.includes('digital') || name.includes('digital') || name.includes('technology')) {
      return 'digital-technology'
    }

    if (business.includes('finance') || name.includes('finance')) {
      return 'finance-bars'
    }

    if (business.includes('legal') || name.includes('legal') || name.includes('compliance')) {
      return 'legal-compliance'
    }

    return 'building'
  }

  if (business.includes('finance') || name.includes('claim') || name.includes('travel')) {
    return 'finance-bars'
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

  if (type === 'portal') {
    return 'building'
  }

  return 'apps'
}

const apiFavouriteItems = computed<FavouriteItem[]>(() => {
  return favouriteItems.value.map(item => ({
    id: `api-${item.itemId}`,
    itemId: item.itemId,
    label: item.name,
    subtitle: item.description || 'Application',
    icon: 'apps',
    kind: 'application',
    url: item.homepageUrl || item.mobileUrl,
  }))
})

const catalogFavouriteItems = computed<FavouriteItem[]>(() => {
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

  for (const item of catalogFavouriteItems.value) {
    sourceMap.set(item.itemId, item)
  }

  for (const item of apiFavouriteItems.value) {
    if (!sourceMap.has(item.itemId)) {
      sourceMap.set(item.itemId, item)
    }
  }

  return Array.from(sourceMap.values())
})

const favouriteMapByItemId = computed(() => {
  return new Map(editableSource.value.map(item => [item.itemId, item]))
})

const selectedItemIds = computed(() => {
  return favouriteItemIds.value.length > 0 ? favouriteItemIds.value : defaultSelectedIds
})

const apps = computed(() => {
  return selectedItemIds.value
    .map(itemId => favouriteMapByItemId.value.get(itemId))
    .filter((item): item is FavouriteItem => Boolean(item))
})

const _visibleApps = computed<ShortcutItem[]>(() => {
  return activeView.value === 'recents'
    ? recentItems.value.slice(0, maxSelected)
    : apps.value
})

const _isMaxSelected = computed(() => draftSelectedItemIds.value.length >= maxSelected)

const _editableFavourites = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const matchesKeyword = (item: FavouriteItem) => {
    if (!keyword) {
      return true
    }

    return [item.label, item.subtitle].some(value => value.toLowerCase().includes(keyword))
  }

  const filtered = editableSource.value.filter(matchesKeyword)

  if (sortBy.value === 'name') {
    return [...filtered].sort((left, right) => left.label.localeCompare(right.label))
  }

  const filteredMap = new Map(filtered.map(item => [item.itemId, item]))
  const selectedFirst = draftSelectedItemIds.value
    .map(itemId => filteredMap.get(itemId))
    .filter((item): item is FavouriteItem => Boolean(item))
  const selectedSet = new Set(selectedFirst.map(item => item.itemId))
  const unselected = filtered.filter(item => !selectedSet.has(item.itemId))

  return [...selectedFirst, ...unselected]
})

const isDraftSelected = (itemId: number) => {
  return draftSelectedItemIds.value.includes(itemId)
}

const _openEditModal = () => {
  draftSelectedItemIds.value = [...selectedItemIds.value].slice(0, maxSelected)
  searchQuery.value = ''
  sortBy.value = 'recent'
  isEditModalOpen.value = true
  fetchCatalogItems()
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const _toggleDraftSelection = (itemId: number) => {
  if (isDraftSelected(itemId)) {
    draftSelectedItemIds.value = draftSelectedItemIds.value.filter(currentItemId => currentItemId !== itemId)
    return
  }

  if (draftSelectedItemIds.value.length >= maxSelected) {
    return
  }

  draftSelectedItemIds.value = [...draftSelectedItemIds.value, itemId]
}

const _saveFavourites = async () => {
  try {
    await saveFavourite(draftSelectedItemIds.value)
    closeEditModal()
  }
  catch (error) {
    console.error('Save favourites failed:', error)
  }
}

const _handleClick = async (app: ShortcutItem) => {
  addRecentItem({
    id: app.id,
    type: 'application',
    label: app.label,
    subtitle: app.subtitle,
    icon: app.icon,
    url: app.url,
    path: app.path,
  })

  if (app.path) {
    return navigateTo(app.path)
  }

  if (app.url) {
    await openGuardedUrl(app.url, '_blank')
  }

  return undefined
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

onMounted(async () => {
  try {
    hydrateRecentItems()

    await Promise.all([
      bootstrapFavourite(),
      fetchCatalogItems(),
    ])
  }
  catch (error) {
    console.error('Get favourites failed:', error)
  }
})
</script>

<style scoped>
.favourites-grid {
  width: 100%;
  background: #FFFFFF;
  padding: 32px 0 34px;
}

.favourites-grid__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
  margin-bottom: 23px;
  border-bottom: 1px solid #E0E0E0;
}

.favourites-grid__tabs {
  display: inline-flex;
  align-items: center;
  width: 250px;
  height: 44px;
  padding: 4px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 2px 12px 6px rgba(0, 0, 0, 0.05);
}

.favourites-grid__tab {
  flex: 1;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #111111;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  cursor: pointer;
}

.favourites-grid__tab.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.favourites-grid__edit {
  padding: 0;
  border: 0;
  background: transparent;
  color: #A60A3A;
  text-underline-offset: 2px;
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
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.favourites-grid__items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 8px;
}

.favourites-grid__empty {
  min-height: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f6f6f;
  font-family: var(--font-source-sans-pro);
  font-size: 14px;
  font-weight: 400;
  line-height: 100%;
}

.favourite-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 104px;
  height: clamp(104px, 6.8vw, 128px);
  padding: 16px 12px;
  border-radius: 6px;
  background: #A60A3A26;
  cursor: pointer;
  transition: all 0.3s;
}

.favourite-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #A60A3A;
}

.favourite-card__label {
  font-size: 11px;
  font-weight: 500;
  color: #000000;
  text-align: center;
}

.favourites-modal {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(111, 124, 135, 0.64);
}

.favourites-modal__panel {
  position: relative;
  width: min(688px, calc(100vw - 88px));
  min-height: 499px;
  padding: 47px 43px 44px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
}

.favourites-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.favourites-modal__close span {
  position: absolute;
  top: 10px;
  left: 2px;
  width: 18px;
  height: 1px;
  background: #a60a3a;
  transform: rotate(45deg);
}

.favourites-modal__close span:last-child {
  transform: rotate(-45deg);
}

.favourites-modal__title {
  margin: 0;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 18px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
}

.favourites-modal__divider {
  width: 100%;
  height: 1px;
  margin: 20px 0 21px;
  background: #d9d9d9;
}

.favourites-modal__toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.favourites-modal__search {
  width: 253px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-radius: 6px;
  background: #f5f5f5;
  color: #6f6f6f;
}

.favourites-modal__search-icon {
  flex-shrink: 0;
}

.favourites-modal__search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
}

.favourites-modal__search input::placeholder {
  color: #6f6f6f;
}

.favourites-modal__sort {
  width: 145px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.favourites-modal__sort span {
  color: #4d4d4d;
  font-family: var(--font-source-sans-pro);
  font-size: 9px;
  font-weight: 400;
  line-height: 100%;
}

.favourites-modal__sort select {
  width: 145px;
  height: 32px;
  padding: 0 34px 0 12px;
  border: 1px solid #b7c0c8;
  border-radius: 6px;
  outline: 0;
  appearance: none;
  background:
    linear-gradient(45deg, transparent 50%, #6f6f6f 50%) calc(100% - 18px) 13px / 8px 8px no-repeat,
    linear-gradient(135deg, #6f6f6f 50%, transparent 50%) calc(100% - 13px) 13px / 8px 8px no-repeat,
    #ffffff;
  color: #6f6f6f;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  cursor: pointer;
}

.favourites-modal__list {
  height: 231px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 39px;
  column-gap: 34px;
  row-gap: 0;
  padding: 13px 14px;
  overflow-y: auto;
  border: 1px solid #b7c0c8;
  border-radius: 6px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.favourites-modal__list--state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6f6f6f;
  font-family: var(--font-source-sans-pro);
  font-size: 14px;
  line-height: 100%;
}

.favourites-modal__list::-webkit-scrollbar {
  display: none;
}

.favourites-modal__item {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.favourites-modal__item.is-disabled {
  cursor: default;
  opacity: 0.56;
}

.favourites-modal__item input {
  width: 16px;
  height: 16px;
  margin: 1px 0 0;
  flex-shrink: 0;
  accent-color: #a60a3a;
  cursor: pointer;
}

.favourites-modal__item.is-disabled input {
  cursor: default;
}

.favourites-modal__item-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.favourites-modal__item-title {
  overflow: hidden;
  color: #000000;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favourites-modal__item-subtitle {
  overflow: hidden;
  color: #4d4d4d;
  font-family: var(--font-source-sans-pro);
  font-size: 8px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favourites-modal__footer {
  position: relative;
  height: 31px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favourites-modal__count {
  min-width: 44px;
  height: 31px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f5f5f5;
  color: #4d4d4d;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
}

.favourites-modal__save {
  position: absolute;
  right: 0;
  top: 0;
  width: 116px;
  height: 31px;
  border: 0;
  border-radius: 6px;
  background: #efd0db;
  color: #a60a3a;
  font-family: var(--font-source-sans-pro);
  font-size: 12px;
  font-weight: 600;
  line-height: 100%;
  cursor: pointer;
}

.favourites-modal__save:disabled {
  cursor: default;
  opacity: 0.7;
}
</style>
