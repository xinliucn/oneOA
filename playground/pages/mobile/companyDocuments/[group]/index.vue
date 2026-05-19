<template>
  <div class="mobile-company-document-group">
    <div class="mobile-company-document-group__toolbar">
      <button
        type="button"
        class="mobile-company-document-group__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="16"
          :rotate="180"
          color="#B10F49"
        />
        <span>Company Documents</span>
      </button>

      <button
        type="button"
        class="mobile-company-document-group__search"
      >
        <IconCustom
          name="search"
          :size="17"
          color="#A60A3A"
        />
      </button>
    </div>

    <div class="mobile-company-document-group__banner">
      {{ groupTitle }} ({{ documentCount }})
    </div>

    <main class="mobile-company-document-group__list">
      <button
        v-for="document in documents"
        :key="document.slug"
        type="button"
        class="mobile-company-document-group__item"
        @click="handleDocumentClick(document)"
      >
        <span class="mobile-company-document-group__item-content">
          <span class="mobile-company-document-group__item-title">{{ document.title }}</span>
          <span class="mobile-company-document-group__item-meta">
            {{ document.code }}{{ document.version }} · {{ document.summaryDate }}
            <span
              :class="['mobile-company-document-group__item-status', { 'is-pending': document.status === 'Not Acknowledged' }]"
            >
              {{ document.status }}
            </span>
          </span>
        </span>
        <IconCustom
          name="chevron-right"
          :size="15"
          color="#A60A3A"
        />
      </button>

      <div
        v-if="!pending && !documents.length"
        class="mobile-company-document-group__empty"
      >
        No documents found
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { CompanyDocumentDetailResponseItem, CompanyDocumentItem, CompanyDocumentStatus } from '~/types/documentManagement'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const route = useRoute()
const documentStore = useDocumentManagementStore()
const groupSlug = computed(() => String(route.params.group || ''))
const folderbaseid = computed(() => groupSlug.value)
const groupTitle = computed(() => groupSlug.value)
const pending = ref(false)

const getStatus = (item: CompanyDocumentDetailResponseItem): CompanyDocumentStatus => {
  const readstatus = item.mainTable?.readstatus || ''

  if (readstatus === '已签署' || readstatus === 'Acknowledged' || item.mainTable?.acknowledgedate_display) {
    return 'Acknowledged'
  }

  return 'Not Acknowledged'
}

const getDocumentCodeAndVersion = (numberVersion?: string) => {
  const value = numberVersion || ''
  const bracketStart = value.lastIndexOf('[')
  const hasVersionSuffix = bracketStart > -1 && value.endsWith(']')

  return {
    code: hasVersionSuffix ? value.slice(0, bracketStart) : value,
    version: hasVersionSuffix ? value.slice(bracketStart) : '',
  }
}

const formatSummaryDate = (date?: string) => {
  return date?.split(' ')[0] || ''
}

const documents = computed<CompanyDocumentItem[]>(() => {
  return documentStore.documentsList.map((item) => {
    const mainTable = item.mainTable || {}
    const { code, version } = getDocumentCodeAndVersion(mainTable.Number_Version)
    const title = mainTable.RequestName || code || String(mainTable.id || '')

    return {
      slug: String(mainTable.id || title),
      title,
      code,
      version,
      summaryDate: formatSummaryDate(mainTable.RequestPublishDate || mainTable.createddate),
      status: getStatus(item),
      raw: item,
    }
  })
})

const documentCount = computed(() => {
  return documents.value.length
})

const loadDocumentsList = async () => {
  pending.value = true

  try {
    await documentStore.fetchDocumentList({
      folderbaseid: folderbaseid.value,
      pageNo: 1,
      pageSize: 10,
    })
  }
  finally {
    pending.value = false
  }
}

onMounted(() => {
  void loadDocumentsList()
})

const handleBack = () => navigateTo('/mobile/companyDocuments')

const handleDocumentClick = (document: CompanyDocumentItem) => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(folderbaseid.value)}/${encodeURIComponent(document.slug)}`,
  })
}
</script>

<style scoped>
.mobile-company-document-group {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.mobile-company-document-group__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1e8eb;
  background: #ffffff;
}

.mobile-company-document-group__back {
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #b10f49;

  span {
    font-family: Source Sans Pro;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;

  }
}

.mobile-company-document-group__search {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: #fce4ec;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-company-document-group__banner {
  padding: 10px 16px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.mobile-company-document-group__list {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}

.mobile-company-document-group__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  border: 0;
  border-top: 1px solid #ededed;
  background: #ffffff;
  text-align: left;
}

.mobile-company-document-group__item-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-company-document-group__item-title {
  color: #171717;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;

}

.mobile-company-document-group__item-meta {
  color: #616161;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;

}

.mobile-company-document-group__item-status {
  color: #616161;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;

}

.mobile-company-document-group__item-status.is-pending {
  color: #FF0000;
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;

}

.mobile-company-document-group__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f8f8f;
  background: #ffffff;
}
</style>
