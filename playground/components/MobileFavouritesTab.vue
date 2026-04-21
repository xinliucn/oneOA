<template>
  <div class="mobile-favourites" :class="{ 'is-editing': isEditMode }">
    <div class="mobile-favourites__header">
      <div class="mobile-favourites__title-row">
        <h2 class="mobile-favourites__title">{{ t('favourites.title') }}</h2>
        <div class="mobile-favourites__actions">
          <template v-if="isEditMode">
            <button
              type="button"
              class="mobile-favourites__icon-btn"
              :class="{ 'is-active': isSearchVisible }"
              @click="toggleSearch"
            >
              <IconCustom name="search" :size="20" />
            </button>
            <button type="button" class="mobile-favourites__action-text" @click="completeEditing">
              {{ copy.done }}
            </button>
          </template>
          <button v-else type="button" class="mobile-favourites__action-text" @click="openEditMode">
            {{ t('favourites.edit') }}
          </button>
        </div>
      </div>

      <div v-if="isEditMode && isSearchVisible" class="mobile-favourites__search">
        <IconCustom name="search" :size="18" class="mobile-favourites__search-icon" />
        <input
          ref="searchInputRef"
          v-model.trim="searchQuery"
          type="text"
          class="mobile-favourites__search-input"
          :placeholder="copy.searchPlaceholder"
        >
      </div>
    </div>

    <div v-if="!isEditMode" class="mobile-favourites__content mobile-favourites__content--grid">
      <div v-if="visibleFavourites.length" class="mobile-favourites__grid">
        <button
          v-for="app in visibleFavourites"
          :key="app.id"
          type="button"
          class="favourite-card"
          @click="handleFavouriteClick(app)"
        >
          <div class="favourite-card__icon">
            <IconCustom :name="app.icon" :size="34" />
          </div>
          <div class="favourite-card__label">{{ app.label }}</div>
        </button>
      </div>
      <div v-else class="mobile-favourites__empty">
        {{ copy.empty }}
      </div>
    </div>

    <div v-else class="mobile-favourites__content mobile-favourites__content--list">
      <button
        v-for="item in editableFavourites"
        :key="item.id"
        type="button"
        class="favourite-list-item"
        :class="{
          'is-selected': isDraftSelected(item.id),
          'is-manage-only': item.kind === 'custom',
        }"
        @click="handleEditItemClick(item)"
      >
        <span class="favourite-list-item__check" aria-hidden="true">
          <span v-if="isDraftSelected(item.id)" class="favourite-list-item__tick" />
        </span>
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

      <div v-if="!editableFavourites.length" class="mobile-favourites__empty mobile-favourites__empty--compact">
        {{ copy.searchEmpty }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

type FavouriteKind = 'application' | 'shortcut' | 'intranet' | 'custom'

type FavouriteItem = {
  id: string
  label: string
  subtitle: string
  icon: string
  kind: FavouriteKind
  url?: string
  path?: string
}

const { t, locale } = useAppI18n()

const favouritesCatalog: FavouriteItem[] = [
  { id: 'epolicy', label: 'ePolicy', subtitle: 'Application', icon: 'document', kind: 'application' },
  { id: 'eclaim', label: 'eClaim', subtitle: 'Application', icon: 'finance-bars', kind: 'application' },
  { id: 'etravel', label: 'eTravel', subtitle: 'Application', icon: 'globe', kind: 'application' },
  { id: 'hr-intranet', label: 'HR Intranet', subtitle: 'Intranet Site', icon: 'personnel', kind: 'intranet' },
  { id: 'elearning', label: 'eLearning', subtitle: 'eLearning Platform', icon: 'education', kind: 'application' },
  { id: 'admin-portal', label: 'Admin Portal', subtitle: 'Application', icon: 'building', kind: 'application' },
  { id: 'dashboards', label: 'Dashboards', subtitle: 'Shortcut', icon: 'dashboard', kind: 'shortcut' },
  { id: 'eshop', label: 'eShop', subtitle: 'eShop Site', icon: 'shop', kind: 'application' },
  {
    id: 'company-documents',
    label: 'Company Documents',
    subtitle: 'Shortcut',
    icon: 'download',
    kind: 'shortcut',
    path: '/mobile/companyDocuments',
  },
  {
    id: 'company-information',
    label: 'Company Information',
    subtitle: 'Shortcut',
    icon: 'info',
    kind: 'shortcut',
    path: '/mobile/companyInformation',
  },
  { id: 'custom-url', label: 'Custom URL', subtitle: 'Shortcut', icon: 'globe', kind: 'custom' },
]

const defaultSelectedIds = [
  'epolicy',
  'eclaim',
  'etravel',
  'hr-intranet',
  'elearning',
  'admin-portal',
  'dashboards',
  'eshop',
]

const copyMap = {
  en: {
    done: 'Done',
    empty: 'No favourites selected yet.',
    searchEmpty: 'No favourites match your search.',
    searchPlaceholder: 'Search favourites',
  },
  'zh-CN': {
    done: '完成',
    empty: '暂未选择收藏项目',
    searchEmpty: '没有符合搜索条件的收藏项目',
    searchPlaceholder: '搜索收藏',
  },
  'zh-TW': {
    done: '完成',
    empty: '暫未選擇收藏項目',
    searchEmpty: '沒有符合搜尋條件的收藏項目',
    searchPlaceholder: '搜尋收藏',
  },
} as const

const selectedIds = useState<string[]>('mobile:favourites:selected-ids', () => [...defaultSelectedIds])
const isEditMode = ref(false)
const isSearchVisible = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const draftSelectedIds = ref<string[]>([...selectedIds.value])

const copy = computed(() => {
  return copyMap[locale.value as keyof typeof copyMap] || copyMap.en
})

const favouritesMap = computed(() => {
  return new Map(favouritesCatalog.map(item => [item.id, item]))
})

const visibleFavourites = computed(() => {
  return selectedIds.value
    .map(id => favouritesMap.value.get(id))
    .filter((item): item is FavouriteItem => Boolean(item))
})

const editableFavourites = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const matchesKeyword = (item: FavouriteItem) => {
    if (!keyword) {
      return true
    }

    return [item.label, item.subtitle].some(value => value.toLowerCase().includes(keyword))
  }

  const filtered = favouritesCatalog.filter(matchesKeyword)
  const filteredMap = new Map(filtered.map(item => [item.id, item]))
  const selectedFirst = draftSelectedIds.value
    .map(id => filteredMap.get(id))
    .filter((item): item is FavouriteItem => Boolean(item))
  const selectedSet = new Set(selectedFirst.map(item => item.id))
  const unselected = filtered.filter(item => !selectedSet.has(item.id))

  return [...selectedFirst, ...unselected]
})

const isDraftSelected = (id: string) => {
  return draftSelectedIds.value.includes(id)
}

const openEditMode = () => {
  draftSelectedIds.value = [...selectedIds.value]
  searchQuery.value = ''
  isSearchVisible.value = false
  isEditMode.value = true
}

const completeEditing = () => {
  selectedIds.value = [...draftSelectedIds.value]
  searchQuery.value = ''
  isSearchVisible.value = false
  isEditMode.value = false
}

const toggleSearch = async () => {
  isSearchVisible.value = !isSearchVisible.value

  if (!isSearchVisible.value) {
    searchQuery.value = ''
    return
  }

  await nextTick()
  searchInputRef.value?.focus()
}

const toggleDraftSelection = (id: string) => {
  if (draftSelectedIds.value.includes(id)) {
    draftSelectedIds.value = draftSelectedIds.value.filter(itemId => itemId !== id)
    return
  }

  draftSelectedIds.value = [...draftSelectedIds.value, id]
}

const handleEditItemClick = (item: FavouriteItem) => {
  if (item.kind === 'custom') {
    return
  }

  toggleDraftSelection(item.id)
}

const handleFavouriteClick = (item: FavouriteItem) => {
  if (item.path) {
    return navigateTo(item.path)
  }

  if (item.url) {
    window.open(item.url, '_self')
  }
}
</script>

<style scoped>
.mobile-favourites {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.mobile-favourites__header {
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #ece6e8;
}

.mobile-favourites__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mobile-favourites__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111111;
}

.mobile-favourites__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-favourites__icon-btn {
  width: 36px;
  height: 36px;
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
  font-size: 16px;
  font-weight: 500;
}

.mobile-favourites__search {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  background: #f6f3f4;
}

.mobile-favourites__search-icon {
  color: #7b6d72;
}

.mobile-favourites__search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #1f1f1f;
  font-size: 15px;
}

.mobile-favourites__search-input::placeholder {
  color: #93858a;
}

.mobile-favourites__content {
  flex: 1;
  min-height: 0;
}

.mobile-favourites__content--grid {
  overflow-y: auto;
  padding: 12px;
}

.mobile-favourites__content--list {
  overflow-y: auto;
  background: #ffffff;
}

.mobile-favourites__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.favourite-card {
  min-height: 116px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(166, 10, 58, 0.13) 0%, rgba(166, 10, 58, 0.16) 100%);
  color: #a60a3a;
  box-shadow: 0 8px 24px rgba(88, 24, 45, 0.08);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.favourite-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.favourite-card__label {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
}

.favourite-list-item {
  width: 100%;
  border: 0;
  border-bottom: 1px solid #efe9eb;
  background: #ffffff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.favourite-list-item__check {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  border-radius: 999px;
  border: 1.5px solid #c20f49;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.favourite-list-item.is-selected .favourite-list-item__check {
  background: #b40f46;
  border-color: #b40f46;
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
  gap: 2px;
}

.favourite-list-item__title {
  color: #1d1d1d;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
}

.favourite-list-item__subtitle {
  color: #8b7f84;
  font-size: 12px;
  line-height: 1.2;
}

.favourite-list-item__arrow {
  flex: 0 0 auto;
  color: #c20f49;
}

.mobile-favourites__empty {
  margin: 20px 4px 0;
  border-radius: 16px;
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
