<template>
  <div
    v-if="catalog && selectedBusiness"
    class="mobile-app-detail"
  >
    <div class="mobile-app-detail__breadcrumb">
      <button
        type="button"
        class="mobile-app-detail__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="16"
          :rotate="180"
          color="#A60A3A"
        />
        <span>Applications</span>
      </button>
    </div>

    <section class="mobile-app-detail__hero">
      <div class="mobile-app-detail__icon">
        <IconCustom
          :name="selectedBusiness.icon || 'apps'"
          :size="48"
        />
      </div>
      <h1 class="mobile-app-detail__title">
        {{ selectedBusiness.name_en }}
      </h1>
      <p class="mobile-app-detail__description">
        {{ selectedBusiness.description_en }}
      </p>
      <button
        type="button"
        class="mobile-app-detail__intranet"
        :style="{ color: selectedBusiness.color }"
        @click="handleIntranetClick"
      >
        {{ selectedBusiness.intranetLabel }}
      </button>
    </section>

    <section class="mobile-app-detail__regions">
      <button
        v-for="region in ['CN', 'HK', 'SEA']"
        :key="region"
        type="button"
        :class="['mobile-app-detail__region-btn', { active: selectedRegion === region }]"
        @click="selectedRegion = region"
      >
        {{ region }}
      </button>
    </section>

    <section
      class="mobile-app-detail__group"
    >
      <!-- <button
        type="button"
        class="mobile-app-detail__group-header"
      >
        <span>{{ group.name_en }} ({{ group.description_en }})</span>
        <IconCustom
          name="chevron-right"
          :size="16"
          color="#171717"
          :rotate="isGroupOpen(group.id) ? -90 : 90"
        />
      </button> -->

      <div
        v-for="item in catalog"
        :key="item.mainTable.id"
        class="mobile-app-detail__group-list"
      >
        <button
          type="button"
          class="mobile-app-detail__item"
          @click="handleItemClick(item)"
        >
          <div class="mobile-app-detail__item-info">
            <div class="mobile-app-detail__item-name">
              {{ item.mainTable.name_en }}
            </div>
            <div class="mobile-app-detail__item-type">
              {{ item.mainTable.description_en }}
            </div>
          </div>
          <IconCustom
            name="chevron-right"
            :size="18"
            color="#A60A3A"
          />
        </button>
      </div>
    </section>
  </div>

  <div
    v-else
    class="mobile-app-detail__empty"
  >
    <p class="mobile-app-detail__empty-title">
      Application group not found
    </p>
    <button
      type="button"
      class="mobile-app-detail__empty-back"
      @click="handleBack"
    >
      Back to Applications
    </button>
  </div>
</template>

<script setup lang="ts">
type BusinessSummary = {
  icon?: string
  name_en?: string
  description_en?: string
  color?: string
  intranetLabel?: string
}

type ApplicationCatalogEntry = {
  mainTable?: {
    id?: string
    mobileurl?: string
    homepage_url?: string
    name_en?: string
    description_en?: string
  }
  mobileUrl?: string
  homepageUrl?: string
}

const { catalog, getApplicationCatalogData } = useApplicationCatalog()
const { openGuardedUrl } = useNetworkGuard()
const selectedBusiness = useState<BusinessSummary | null>('mobile:selected-business', () => null)

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const activeTab = useState<number>('mobile:activeTab', () => 3)
const selectedRegion = ref<string>('CN')

const handleBack = () => {
  activeTab.value = 3
  return navigateTo('/mobile')
}

const getApplicationUrl = (item: ApplicationCatalogEntry) => {
  return item?.mainTable?.mobileurl || item?.mainTable?.homepage_url || item?.mobileUrl || item?.homepageUrl || ''
}

const handleIntranetClick = async () => {
  await openGuardedUrl('https://intranet.dch.com.hk/', '_blank')
}

const handleItemClick = async (item: ApplicationCatalogEntry) => {
  const url = getApplicationUrl(item)
  if (!url) {
    return
  }

  await openGuardedUrl(url, '_blank')
}

watch(
  selectedRegion,
  async () => {
    await getApplicationCatalogData({ tag: selectedRegion.value })
  },
  { immediate: true },
)

onMounted(() => {
  activeTab.value = 3
})
</script>

<style scoped>
.mobile-app-detail {
  height: 100%;
  overflow-y: auto;
  background: #f7f7f7;
}

.mobile-app-detail__breadcrumb {
  padding: 14px 16px 10px;
  background: #ffffff;
  border-bottom: 1px solid #ededed;
}

.mobile-app-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 16px;
  color: #a60a3a;
}

.mobile-app-detail__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26px 20px 22px;
  background: #ffffff;
  text-align: center;
}

.mobile-app-detail__icon {
  margin-bottom: 12px;
}

.mobile-app-detail__title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
}

.mobile-app-detail__description {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #666666;
}

.mobile-app-detail__intranet {
  border: 0;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
}

.mobile-app-detail__regions {
  display: flex;
  gap: 4px;
  margin: 14px 16px 12px;
  padding: 4px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(217, 217, 217, 0.65);
}

.mobile-app-detail__region-btn {
  flex: 1;
  min-height: 40px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #171717;
}

.mobile-app-detail__region-btn.active {
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: #ffffff;
}

.mobile-app-detail__group {
  margin-bottom: 10px;
  background: #ffffff;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}

.mobile-app-detail__group-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  border: 0;
  background: #ffffff;
  font-size: 16px;
  font-weight: 700;
  color: #161616;
}

.mobile-app-detail__group-list {
  background: #ffffff;
}

.mobile-app-detail__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 0;
  border-top: 1px solid #ececec;
  background: #ffffff;
  text-align: left;
}

.mobile-app-detail__item-info {
  min-width: 0;
  flex: 1;
}

.mobile-app-detail__item-name {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  color: #171717;
}

.mobile-app-detail__item-type {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.4;
  color: #8b8b8b;
}

.mobile-app-detail__empty {
  height: 100%;
  padding: 48px 20px;
  overflow-y: auto;
  background: #ffffff;
  text-align: center;
}

.mobile-app-detail__empty-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #333333;
}

.mobile-app-detail__empty-back {
  border: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 14px;
  font-weight: 600;
}
</style>
