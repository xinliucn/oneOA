<template>
  <div class="mobile-company-documents">
    <header class="mobile-company-documents__header">
      <h1 class="mobile-company-documents__title">
        {{ pageTitle }}
      </h1>
      <button
        type="button"
        class="mobile-company-documents__search"
        aria-label="Search documents"
      >
        <IconCustom
          name="search"
          :size="17"
          color="#A60A3A"
        />
      </button>
    </header>

    <div class="mobile-company-documents__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :class="['mobile-company-documents__tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.showCount">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <main
      ref="listRef"
      class="mobile-company-documents__list"
      @scroll="handleListScroll"
    >
      <button
        v-for="group in filteredGroups"
        :key="group.slug"
        type="button"
        class="mobile-company-documents__item"
        @click="handleGroupClick(group)"
      >
        <span class="mobile-company-documents__item-content">
          <span class="mobile-company-documents__item-title">{{ group.title }} ({{ group.count }})</span>
          <span class="mobile-company-documents__item-category">{{ group.category }}</span>
        </span>
        <IconCustom
          name="chevron-right"
          :size="15"
          color="#A60A3A"
        />
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { CompanyDocumentGroup, CompanyDocumentGroupResponseItem, CompanyDocumentStatus, DocumentCategoryTabKey } from '~/types/documentManagement'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()
const documentStore = useDocumentManagementStore()
const pageTitle = computed(() => t('pages.companyDocuments.title'))

const tabs = computed(() => [
  {
    key: 'all' as const,
    label: 'All',
    count: documentStore.categoryCounts.all,
    showCount: true,
  },
  {
    key: 'acknowledged' as const,
    label: 'Acknowledged',
    count: documentStore.categoryCounts.acknowledged,
    showCount: true,
  },
  {
    key: 'notAcknowledged' as const,
    label: 'Not Acknowledged',
    count: documentStore.categoryCounts.notAcknowledged,
    showCount: true,
  },
])
const activeTab = ref<DocumentCategoryTabKey>('all')
const listRef = ref<HTMLElement | null>(null)

await useAsyncData('document-categories', () => {
  return documentStore.fetchCategoryTabs({
    page: 1,
    pageSize: 20,
    matchingKeyword: '',
  })
})

const getNumber = (value: any) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

const getStatus = (item: CompanyDocumentGroupResponseItem): CompanyDocumentStatus | undefined => {
  const rawStatus = item.status || item.readstatus || item.readstatus_display || ''

  if (rawStatus === 'Acknowledged' || rawStatus === '已签署') {
    return 'Acknowledged'
  }

  if (rawStatus === 'Not Acknowledged' || rawStatus === '未签署') {
    return 'Not Acknowledged'
  }

  if (item.acknowledgedate || item.acknowledgedate_display) {
    return 'Acknowledged'
  }
}

const companyDocumentGroups = computed<CompanyDocumentGroup[]>(() => {
  return documentStore.categoriesByTab[activeTab.value].map((item) => {
    const count = getNumber(item.count)
    const acknowledgedCount = getNumber(item.acknowledgedCount)
    const notAcknowledgedCount = getNumber(item.notAcknowledgedCount)
    const title = item.FolderTitle || ''
    const slug = String(item.id || item.osid || title)

    return {
      slug,
      folderbaseid: String(item.osid || item.id || title),
      title,
      category: item.FolderDescription || title,
      count,
      acknowledgedCount,
      notAcknowledgedCount,
      status: getStatus(item),
    }
  })
})

const filteredGroups = computed(() => {
  return companyDocumentGroups.value
})

const isListNearBottom = () => {
  const listElement = listRef.value

  if (!listElement) {
    return false
  }

  return listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight - 80
}

const loadNextPageIfNeeded = async () => {
  if (!isListNearBottom()) {
    return
  }

  await documentStore.fetchNextCategoryPage(activeTab.value)
}

const handleListScroll = () => {
  void loadNextPageIfNeeded()
}

watch(activeTab, async () => {
  await nextTick()
  await loadNextPageIfNeeded()
})

onMounted(() => {
  void loadNextPageIfNeeded()
})

const handleGroupClick = (group: CompanyDocumentGroup) => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(group.folderbaseid)}`,
    query: {
      title: group.title,
      count: group.count,
    },
  })
}
</script>

<style scoped>
.mobile-company-documents {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
}

.mobile-company-documents__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 8px;
  background: #ffffff;
}

.mobile-company-documents__title {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
  font-weight: 700;
  color: #171717;
}

.mobile-company-documents__search {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: #fce4ec;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-company-documents__tabs {
  display: flex;
  gap: 6px;
  padding: 0 16px 8px;
  overflow-x: auto;
  scrollbar-width: none;
  background: #ffffff;
}

.mobile-company-documents__tabs::-webkit-scrollbar {
  display: none;
}

.mobile-company-documents__tab {
  flex-shrink: 0;
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid #d8d8d8;
  border-radius: 999px;
  background: #ffffff;
  color: #777777;
  white-space: nowrap;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

}

.mobile-company-documents__tab.active {
  border-color: #a60a3a;
  background: #a60a3a;
  color: #ffffff;
  font-weight: 700;
  border: none;
}

.mobile-company-documents__list {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}

.mobile-company-documents__item {
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 16px;
  border: 0;
  border-top: 1px solid #eeeeee;
  background: #ffffff;
  text-align: left;
}

.mobile-company-documents__item-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-company-documents__item-title {
  color: #000000;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;

}

.mobile-company-documents__item-category {
  color: #8f8f8f;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;

}
</style>
