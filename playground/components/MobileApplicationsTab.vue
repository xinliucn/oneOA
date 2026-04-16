<template>
  <div class="mobile-applications">
    <div class="mobile-applications__header">
      <h2 class="mobile-applications__title">
        {{ t('desktopApps.title') }}
      </h2>
      <el-button
        circle
        class="search-btn"
      >
        <IconCustom
          name="search"
          :size="20"
        />
      </el-button>
    </div>

    <div class="mobile-applications__tabs">
      <div class="applications__tabs__box">
        <button
          :class="['tab-btn', { active: activeTab === 'Application' }]"
          @click="activeTab = 'Application'"
        >
          {{ t('mobile.applications.tabs.byApplication') }}
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'Business' }]"
          @click="activeTab = 'Business'"
        >
          {{ t('mobile.applications.tabs.byBusiness') }}
        </button>
      </div>
    </div>

    <!-- By Application -->
    <div
      v-if="activeTab === 'Application'"
      class="app-grid"
    >
      <div
        v-for="app in catalog"
        :key="app.mainTable.id"
        class="app-card"
        @click="handleAppClick(app)"
      >
        <div class="app-card__logo">
          <img
            v-if="app.mainTable.image"
            :src="app.mainTable.image"
            :alt="app.mainTable.name_en"
            class="app-card__img"
          >
          <IconCustom
            v-else
            :name="app.mainTable.icon"
            :size="36"
          />
        </div>
        <div class="app-card__name">
          {{ app.mainTable.name_en }}
        </div>
      </div>
    </div>

    <!-- By Business -->
    <div
      v-else
      class="business-grid"
    >
      <div
        v-for="biz in catalog"
        :key="biz.mainTable.id"
        class="biz-card"
        @click="handleBizClick(biz.mainTable)"
      >
        <div
          class="biz-card__icon"
          :style="{ color: biz.color }"
        >
          <IconCustom
            :name="biz.icon"
            :size="32"
          />
        </div>
        <div class="biz-card__name">
          {{ biz.mainTable.name_en }}
        </div>
        <div class="biz-card__desc">
          {{ biz.mainTable.description_en }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'

const { t } = useAppI18n()
const { catalog, getApplicationCatalogData } = useApplicationCatalog()
const { openGuardedUrl } = useNetworkGuard()
const activeTab = ref('Application')
const selectedBusiness = useState('mobile:selected-business', () => null)

const getApplicationUrl = (app) => {
  return app?.mainTable?.mobileurl || app?.mainTable?.homepage_url || app?.mobileUrl || app?.homepageUrl || ''
}

const handleAppClick = async (app) => {
  const url = getApplicationUrl(app)
  if (!url) {
    return
  }

  await openGuardedUrl(url, '_blank')
}

const handleBizClick = (biz) => {
  selectedBusiness.value = biz
  return navigateTo(`/mobile/applications/business/${encodeURIComponent(biz.id)}`)
}

watch(
  activeTab,
  async (tab) => {
    await getApplicationCatalogData({ type: tab })
  },
  { immediate: true },
)
</script>

<style scoped>
.mobile-applications {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F5F5F5;
}

.mobile-applications__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;

  .search-btn {
    height: 40px;
    width: 40px;
    background-color: #fce4ec;
    border: none;
    color: #c2185b;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

.mobile-applications__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.mobile-applications__tabs {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f2f2f2;
}

.applications__tabs__box {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(217, 217, 217, 0.75);
}

.tab-btn {
  flex: 1;
  min-height: 48px;
  padding: 0 20px;
  border: 0;
  background: transparent;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  color: #171717;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(166, 10, 58, 0.28);
}

/* By Application Grid */
.app-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.app-card {
  background: white;
  border-radius: 12px;
  padding: 20px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.app-card:active {
  transform: scale(0.97);
}

.app-card__logo {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
}

.app-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-card__name {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  text-align: center;
}

/* By Business Grid */
.business-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-content: start;
}

.biz-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.applications__tabs__box {
  display: flex;
  ;
  align-items: center;
  width: 100%;
  box-shadow: 0 4px 12px #D9D9D9;
}

.biz-card:active {
  transform: scale(0.97);
}

.biz-card__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.biz-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.biz-card__desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
