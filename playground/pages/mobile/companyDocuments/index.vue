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
        :key="tab"
        type="button"
        :class="['mobile-company-documents__tab', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <main class="mobile-company-documents__list">
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
type CompanyDocumentStatus = 'Acknowledged' | 'Not Acknowledged'

interface CompanyDocumentGroupResponseItem {
  id?: string | number
  osid?: string | number
  count?: string | number
  FolderTitle?: string
  FolderDescription?: string
  status?: string
  readstatus?: string
  readstatus_display?: string
  acknowledgedate?: string
  acknowledgedate_display?: string
  acknowledgedCount?: string | number
  notAcknowledgedCount?: string | number
}

interface CompanyDocumentGroup {
  slug: string
  folderbaseid: string
  title: string
  category: string
  count: number
  acknowledgedCount: number
  notAcknowledgedCount: number
  status?: CompanyDocumentStatus
}

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()

const pageTitle = computed(() => t('pages.companyDocuments.title'))
const tabs = ['All', 'Acknowledged', 'Not Acknowledged']
const activeTab = ref(tabs[0])

const normalizeCompanyDocumentResponse = (response: any): CompanyDocumentGroupResponseItem[] => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data
  }

  return []
}

const getNumber = (value: unknown) => {
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

const { data: companyDocumentResponse } = await useAsyncData('company-document-groups', () => {
  return $fetch('/api/ecologyOa/companyDocument', {
    method: 'POST',
    body: {
      page: 1,
      pageSize: 100,
    },
  })
})

const companyDocumentGroups = computed<CompanyDocumentGroup[]>(() => {
  return normalizeCompanyDocumentResponse(companyDocumentResponse.value).map((item) => {
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
  if (activeTab.value === 'Acknowledged') {
    return companyDocumentGroups.value.filter(group =>
      group.status === 'Acknowledged' || group.acknowledgedCount > 0)
  }

  if (activeTab.value === 'Not Acknowledged') {
    return companyDocumentGroups.value.filter(group =>
      group.status === 'Not Acknowledged' || group.notAcknowledgedCount > 0)
  }

  return companyDocumentGroups.value
})

const handleGroupClick = (group: CompanyDocumentGroup) => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(group.slug)}`,
    query: {
      title: group.title,
      count: group.count,
      folderbaseid: group.folderbaseid,
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
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.mobile-company-documents__tab.active {
  border-color: #a60a3a;
  background: #a60a3a;
  color: #ffffff;
  font-weight: 700;
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
  color: #171717;
  font-size: 13px;
  line-height: 1.25;
  font-weight: 600;
}

.mobile-company-documents__item-category {
  color: #8f8f8f;
  font-size: 10px;
  line-height: 1.2;
}
</style>
