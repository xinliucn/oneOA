<template>
  <div
    class="mobile-favourites"
    :class="{ 'is-editing': isEditMode, 'is-searching': isSearchVisible }"
  >
    <div class="mobile-favourites__header">
      <div
        v-if="isEditMode && isSearchVisible"
        class="mobile-favourites__search-row"
      >
        <label class="mobile-favourites__search">
          <IconCustom
            name="search"
            :size="16"
            class="mobile-favourites__search-icon"
          />
          <input
            ref="searchInputRef"
            v-model.trim="searchQuery"
            type="text"
            class="mobile-favourites__search-input"
            :placeholder="copy.searchPlaceholder"
          >
        </label>
        <button
          type="button"
          class="mobile-favourites__action-text"
          @click="closeSearch"
        >
          {{ copy.cancel }}
        </button>
      </div>

      <div
        v-else
        class="mobile-favourites__title-row"
      >
        <h2 class="mobile-favourites__title">
          {{ t('favourites.title') }}
        </h2>
        <div class="mobile-favourites__actions">
          <template v-if="isEditMode">
            <button
              type="button"
              class="mobile-favourites__icon-btn"
              :class="{ 'is-active': isSearchVisible }"
              @click="toggleSearch"
            >
              <IconCustom
                name="search"
                :size="20"
              />
            </button>
            <button
              type="button"
              class="mobile-favourites__action-text"
              :disabled="favouriteSaving"
              @click="completeEditing"
            >
              {{ favouriteSaving ? copy.saving : copy.done }}
            </button>
          </template>
          <button
            v-else
            type="button"
            class="mobile-favourites__action-text"
            @click="openEditMode"
          >
            {{ t('favourites.edit') }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="!isEditMode"
      class="mobile-favourites__content mobile-favourites__content--grid"
    >
      <div
        v-if="favouriteLoading"
        class="mobile-favourites__empty"
      >
        Loading...
      </div>
      <div
        v-if="visibleFavourites.length"
        class="mobile-favourites__grid"
      >
        <button
          v-for="app in visibleFavourites"
          :key="app.id"
          type="button"
          class="favourite-card"
          @click="handleFavouriteClick(app)"
        >
          <IconCustom
            :name="app.icon"
            :size="28"
            class="favourite-card__icon"
          />
          <div class="favourite-card__label">
            {{ app.label }}
          </div>
        </button>
      </div>
      <div
        v-else-if="!favouriteLoading"
        class="mobile-favourites__empty"
      >
        {{ copy.empty }}
      </div>
    </div>

    <div
      v-else
      class="mobile-favourites__content mobile-favourites__content--list"
    >
      <div
        v-if="selectedEditableFavourites.length"
        class="favourite-list-section"
      >
        <div class="favourite-list-section__title">
          {{ copy.myFavourites }}
        </div>
        <button
          v-for="item in selectedEditableFavourites"
          :key="item.itemId"
          type="button"
          class="favourite-list-item is-selected"
          @click="handleEditItemClick(item)"
        >
          <span
            class="favourite-list-item__check"
            aria-hidden="true"
          >
            <span class="favourite-list-item__tick" />
          </span>
          <span class="favourite-list-item__body">
            <span class="favourite-list-item__title">{{ item.label }}</span>
            <span class="favourite-list-item__subtitle">{{ item.subtitle }}</span>
          </span>
        </button>
      </div>

      <div class="favourite-list-section">
        <div class="favourite-list-section__title">
          {{ copy.allItems }}
        </div>
        <button
          v-for="item in unselectedEditableFavourites"
          :key="item.itemId"
          type="button"
          class="favourite-list-item"
          :class="{
            'is-manage-only': item.kind === 'custom',
            'is-disabled': isMaxSelected,
          }"
          @click="handleEditItemClick(item)"
        >
          <span
            class="favourite-list-item__check"
            aria-hidden="true"
          />
          <span class="favourite-list-item__body">
            <span class="favourite-list-item__title">{{ item.label }}</span>
            <span class="favourite-list-item__subtitle">{{ item.subtitle }}</span>
          </span>
          <IconCustom
            v-if="item.kind === 'custom'"
            name="chevron-right"
            :size="18"
            class="favourite-list-item__arrow"
          />
        </button>
      </div>

      <div
        v-if="catalogLoading"
        class="mobile-favourites__empty mobile-favourites__empty--compact"
      >
        Loading...
      </div>
      <div
        v-else-if="!selectedEditableFavourites.length && !unselectedEditableFavourites.length"
        class="mobile-favourites__empty mobile-favourites__empty--compact"
      >
        {{ copy.searchEmpty }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { ApplicationCatalogItem } from '~/composables/useApplicationCatalog'

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

const { t, locale } = useAppI18n()
const { requestApplicationCatalogData } = useApplicationCatalog()
const {
  bootstrapFavourite,
  saveFavourite,
  items: favouriteItems,
  itemidList: favouriteItemIds,
  loading: favouriteLoading,
  saving: favouriteSaving,
} = useFavourite()

const copyMap = {
  'en': {
    allItems: 'All Items',
    cancel: 'Cancel',
    done: 'Done',
    saving: 'Saving...',
    empty: 'No favourites selected yet.',
    myFavourites: 'My Favourites',
    searchEmpty: 'No favourites match your search.',
    searchPlaceholder: 'Search All Items',
  },
  'zh-CN': {
    allItems: '全部项目',
    cancel: '取消',
    done: '完成',
    saving: '保存中...',
    empty: '暂未选择收藏项目',
    myFavourites: '我的收藏',
    searchEmpty: '没有符合搜索条件的收藏项目',
    searchPlaceholder: '搜索全部项目',
  },
  'zh-TW': {
    allItems: '全部項目',
    cancel: '取消',
    done: '完成',
    saving: '儲存中...',
    empty: '暫未選擇收藏項目',
    myFavourites: '我的收藏',
    searchEmpty: '沒有符合搜尋條件的收藏項目',
    searchPlaceholder: '搜尋全部項目',
  },
} as const

type CatalogRecord = ApplicationCatalogItem & Record<string, any>

const maxSelected = 8
const isEditMode = ref(false)
const isSearchVisible = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const draftSelectedItemIds = ref<number[]>([])
const catalogItems = ref<ApplicationCatalogItem[]>([])
const catalogLoading = ref(false)
const catalogLoaded = ref(false)

const copy = computed(() => {
  return copyMap[locale.value as keyof typeof copyMap] || copyMap.en
})

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

const apiFavouriteItems = computed<FavouriteItem[]>(() => {
  return favouriteItems.value.map(item => ({
    id: `api-${item.itemId}`,
    itemId: item.itemId,
    label: item.name,
    subtitle: item.description || 'Application',
    icon: 'apps',
    kind: 'application',
    url: item.mobileUrl || item.homepageUrl,
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

const selectedItemIds = computed(() => favouriteItemIds.value)

const visibleFavourites = computed(() => {
  return selectedItemIds.value
    .map(itemId => favouriteMapByItemId.value.get(itemId))
    .filter((item): item is FavouriteItem => Boolean(item))
})

const isMaxSelected = computed(() => draftSelectedItemIds.value.length >= maxSelected)

const filteredEditableFavourites = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) {
    return editableSource.value
  }

  return editableSource.value.filter(item => [item.label, item.subtitle].some(value => value.toLowerCase().includes(keyword)))
})

const filteredEditableMap = computed(() => {
  return new Map(filteredEditableFavourites.value.map(item => [item.itemId, item]))
})

const selectedEditableFavourites = computed(() => {
  return draftSelectedItemIds.value
    .map(itemId => filteredEditableMap.value.get(itemId))
    .filter((item): item is FavouriteItem => Boolean(item))
})

const unselectedEditableFavourites = computed(() => {
  const selectedSet = new Set(draftSelectedItemIds.value)

  return filteredEditableFavourites.value.filter(item => !selectedSet.has(item.itemId))
})

const openEditMode = () => {
  draftSelectedItemIds.value = [...selectedItemIds.value].slice(0, maxSelected)
  searchQuery.value = ''
  isSearchVisible.value = false
  isEditMode.value = true
  fetchCatalogItems()
}

const completeEditing = async () => {
  try {
    await saveFavourite(draftSelectedItemIds.value)
    searchQuery.value = ''
    isSearchVisible.value = false
    isEditMode.value = false
  }
  catch (error) {
    console.error('Save favourites failed:', error)
  }
}

const toggleSearch = async () => {
  isSearchVisible.value = true

  await nextTick()
  searchInputRef.value?.focus()
}

const closeSearch = () => {
  isSearchVisible.value = false
  searchQuery.value = ''
}

const toggleDraftSelection = (itemId: number) => {
  if (draftSelectedItemIds.value.includes(itemId)) {
    draftSelectedItemIds.value = draftSelectedItemIds.value.filter(currentItemId => currentItemId !== itemId)
    return
  }

  if (draftSelectedItemIds.value.length >= maxSelected) {
    return
  }

  draftSelectedItemIds.value = [...draftSelectedItemIds.value, itemId]
}

const handleEditItemClick = (item: FavouriteItem) => {
  if (item.kind === 'custom') {
    return
  }

  toggleDraftSelection(item.itemId)
}

const handleFavouriteClick = (item: FavouriteItem) => {
  if (item.path) {
    return navigateTo(item.path)
  }

  if (item.url) {
    window.open(item.url, '_self')
  }
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
    await Promise.all([
      bootstrapFavourite(),
      fetchCatalogItems(),
    ])
  }
  catch (error) {
    console.error('Get mobile favourites failed:', error)
  }
})
</script>

<style scoped>
.mobile-favourites {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f3f3f3;
  color: #111111;
}

.mobile-favourites__header {
  flex: 0 0 auto;
  padding: 14px 16px 10px;
  background: #ffffff;
}

.mobile-favourites__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mobile-favourites__title {
  margin: 0;
  font-size: 22px;
  line-height: 1;
  font-weight: 700;
  color: #111111;
}

.mobile-favourites__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-favourites__icon-btn {
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

.mobile-favourites__icon-btn.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.mobile-favourites__action-text {
  border: 0;
  padding: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 12px;
  line-height: 1;
  font-weight: 400;
}

.mobile-favourites__action-text:disabled {
  opacity: 0.65;
}

.mobile-favourites__search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.mobile-favourites__search {
  min-width: 0;
  height: 34px;
  border-radius: 4px;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.mobile-favourites__search-icon {
  flex: 0 0 auto;
  color: #707070;
}

.mobile-favourites__search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #1f1f1f;
  font-size: 12px;
  line-height: 1;
}

.mobile-favourites__search-input::placeholder {
  color: #777777;
}

.mobile-favourites__content {
  flex: 1;
  min-height: 0;
}

.mobile-favourites__content--grid {
  overflow-y: auto;
  padding: 18px 28px 0;
  background: linear-gradient(#ffffff 0 115px, #f3f3f3 115px);
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mobile-favourites__content--grid::-webkit-scrollbar {
  display: none;
}

.mobile-favourites__content--list {
  overflow-y: auto;
  background: #f3f3f3;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mobile-favourites__content--list::-webkit-scrollbar {
  display: none;
}

.mobile-favourites__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 18px;
  row-gap: 22px;
}

.favourite-card {
  min-width: 0;
  min-height: 48px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #a60a3a;
  box-shadow: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.favourite-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.favourite-card__label {
  max-width: 64px;
  overflow: hidden;
  color: #111111;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favourite-list-section__title {
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

.favourite-list-item {
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

.favourite-list-item__check {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border-radius: 999px;
  border: 1px solid #c20f49;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.favourite-list-item.is-selected .favourite-list-item__check {
  background: #a60a3a;
  border-color: #a60a3a;
}

.favourite-list-item.is-disabled {
  opacity: 0.52;
}

.favourite-list-item__tick {
  width: 9px;
  height: 5px;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(-45deg) translateY(-1px);
}

.favourite-list-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.favourite-list-item__title {
  color: #1d1d1d;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
}

.favourite-list-item__subtitle {
  color: #6f6f6f;
  font-size: 12px;
  line-height: 1;
}

.favourite-list-item__arrow {
  flex: 0 0 auto;
  color: #c20f49;
}

.mobile-favourites__empty {
  margin: 20px 0 0;
  border-radius: 0;
  background: #ffffff;
  color: #7f7075;
  padding: 24px 16px;
  text-align: center;
  font-size: 14px;
}

.mobile-favourites__empty--compact {
  margin: 20px 16px;
}
</style>
