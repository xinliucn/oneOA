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
        @click="handleGroupClick(group.slug)"
      >
        <span class="mobile-company-documents__item-content">
          <span class="mobile-company-documents__item-title">{{ group.title }} ({{ group.documents.length }})</span>
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
import { companyDocumentGroups } from './data'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const { t } = useAppI18n()

const pageTitle = computed(() => t('pages.companyDocuments.title'))
const tabs = ['All', 'Acknowledged', 'Not Acknowledged']
const activeTab = ref(tabs[0])

const filteredGroups = computed(() => {
  if (activeTab.value === 'Acknowledged') {
    return companyDocumentGroups.filter(group =>
      group.documents.every(document => document.status === 'Acknowledged'))
  }

  if (activeTab.value === 'Not Acknowledged') {
    return companyDocumentGroups.filter(group =>
      group.documents.some(document => document.status === 'Not Acknowledged'))
  }

  return companyDocumentGroups
})

const handleGroupClick = (groupSlug: string) => {
  return navigateTo(`/mobile/companyDocuments/${encodeURIComponent(groupSlug)}`)
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
