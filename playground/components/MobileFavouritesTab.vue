<template>
  <div class="mobile-applications">
    <div class="mobile-applications__header">
      <h1 class="mobile-applications__title">
        {{ t('mobile.tabs.applications') }}
      </h1>
      <button
        type="button"
        class="mobile-applications__search"
        :aria-label="t('mobile.applications.searchAriaLabel')"
        @click="openSearch"
      >
        <IconCustom
          name="search"
          :size="22"
        />
      </button>
    </div>

    <div class="mobile-applications__grid">
      <button
        v-for="app in apps"
        :key="app.id"
        type="button"
        class="application-card"
        @click="openApplication(app)"
      >
        <img
          :src="app.logo"
          :alt="app.name"
          class="application-card__logo"
        >
        <span class="application-card__name">{{ app.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import bipoLogo from '~/assets/images/applications/eLeave.png'
import yonyouLogo from '~/assets/images/applications/yonyou.png'
import italantLogo from '~/assets/images/applications/italcant.png'
import powerBiLogo from '~/assets/images/applications/Test PowerBI Report.png'
import serviceDeskLogo from '~/assets/images/applications/ITServiceDesk.png'
import officeAutomateLogo from '~/assets/images/applications/Group 285.png'

type MobileApplication = {
  id: string
  name: string
  logo: string
  url?: string
}

const { t } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()

const apps: MobileApplication[] = [
  {
    id: 'eleave',
    name: 'eLeave',
    logo: bipoLogo,
    url: 'https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/',
  },
  {
    id: 'yonyou',
    name: 'YonYou',
    logo: yonyouLogo,
  },
  {
    id: 'elearning',
    name: 'eLearning',
    logo: italantLogo,
  },
  {
    id: 'powerbi-report',
    name: 'PowerBI Report',
    logo: powerBiLogo,
    url: 'https://aka.ms/AA10pdw6',
  },
  {
    id: 'it-service-desk',
    name: 'IT Service Desk',
    logo: serviceDeskLogo,
    url: 'https://dch.service-now.com/sp',
  },
  {
    id: 'office-automate',
    name: 'Office Automate',
    logo: officeAutomateLogo,
    url: 'https://oa.dchbipoc.cc/spa/coms/static4mobile/index.html#/menu-preview?id=appDefaultPage&checkAccess=1',
  },
]

const openSearch = () => {
  return navigateTo('/mobile/search')
}

const openApplication = async (app: MobileApplication) => {
  if (!app.url) {
    return
  }

  await openGuardedUrl(app.url, '_self')
}
</script>

<style scoped>
.mobile-applications {
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
  padding: 24px 8px 24px;
  color: #1f1f1f;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mobile-applications::-webkit-scrollbar {
  display: none;
}

.mobile-applications__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 0 8px;
}

.mobile-applications__title {
  margin: 0;
  color: #171717;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.mobile-applications__search {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: #f9dbe5;
  color: #a60a3a;
  box-shadow: 0 5px 12px rgba(166, 10, 58, 0.13);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-applications__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.application-card {
  min-width: 0;
  height: 112px;
  border: 1px solid #ededed;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.06);
  padding: 18px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.application-card__logo {
  width: min(92px, 72%);
  height: 42px;
  object-fit: contain;
}

.application-card__name {
  width: 100%;
  overflow: hidden;
  color: #242424;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
