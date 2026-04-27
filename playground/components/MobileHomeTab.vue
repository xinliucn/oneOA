<template>
  <div class="mobile-home">
    <section class="home-hero"
      :style="{ backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.12)), url(${heroImage})` }">
      <div class="home-hero__greeting">
        <span>{{ greetingLabel }}</span>
        <strong>{{ displayName }}</strong>
      </div>
      <div class="home-hero__time">
        <span>{{ currentDateLabel }}</span>
        <strong>{{ currentTimeLabel }}</strong>
      </div>
    </section>
    <section class="home-section">
      <div class="home-shortcuts">
        <button type="button" class="home-shortcut-card" @click="openSearch">
          <IconCustom name="search" :size="24" color="#b20f4b" />
          <span>Search</span>
        </button>

        <button type="button" class="home-shortcut-card" @click="openNotifications">
          <IconCustom name="bell" :size="24" color="#b20f4b" />
          <span>Notifications</span>
        </button>
      </div>
    </section>
    <section class="home-section">
      <div class="home-section__header">
        <div class="home-section__tabs" role="tablist" aria-label="Favourite views">
          <button type="button" class="home-section__tab" :class="{ 'is-active': favouriteView === 'favourites' }"
            role="tab" :aria-selected="favouriteView === 'favourites'" @click="favouriteView = 'favourites'">
            Favourites
          </button>
          <button type="button" class="home-section__tab" :class="{ 'is-active': favouriteView === 'recents' }"
            role="tab" :aria-selected="favouriteView === 'recents'" @click="favouriteView = 'recents'">
            Recents
          </button>
        </div>
        <!-- <button type="button">Edit</button> -->
      </div>
      <div class="favourites-grid">
        <button v-for="item in visibleFavouriteItems" :key="item.label" type="button" class="favourite-item">
          <IconCustom :name="item.icon" :size="39" color="#A60A3A" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </section>

    <section class="home-section">
      <div class="home-section__header">
        <h2>Applications</h2>
        <button type="button" @click="openApplicationsPage">View all</button>
      </div>
      <div class="applications-grid">
        <button v-for="item in applicationItems" :key="item.title" type="button" class="application-card"
          @click="openBusinessDetail(item.entry)">
          <IconCustom :name="item.icon" :size="39" :color="item.color" />
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
        </button>
      </div>
    </section>

    <section class="home-section home-section--news">
      <div class="home-section__header">
        <h2>Group News</h2>
        <button type="button" @click="navigateTo('/mobile/news')">View all</button>
      </div>
      <div class="news-strip">
        <article v-for="item in newsItems" :key="item.title" class="news-card" @click="navigateTo('/mobile/news')">
          <img :src="item.image" :alt="item.title">
          <div class="news-card__body">
            <h3>{{ item.title }}</h3>
            <time>{{ item.date }}</time>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import heroImage from '~/assets/images/Group 120.png'
import newsImage1 from '~/assets/images/news/news1.png'
import newsImage2 from '~/assets/images/news/news2.png'
import { APPLICATION_BUSINESS_FILTER } from '~/composables/useApplicationCatalog'

const { user } = useAuth()
const { t } = useAppI18n()
const { requestApplicationCatalogData } = useApplicationCatalog()

const activeTab = useState<number>('mobile:activeTab', () => 1)
const mobileReturnPath = useState<string>('mobile:notification:return-path', () => '/mobile')
const selectedBusiness = useState<{
  id?: string
  icon?: string
  name_en?: string
  business?: string
  description_en?: string
  color?: string
  intranetLabel?: string
  intranetUrl?: string
} | null>('mobile:selected-business', () => null)
const currentTime = ref(new Date())
const favouriteView = ref<'favourites' | 'recents'>('favourites')
const businessEntries = ref<Array<{
  mainTable?: {
    id?: string
    name_en?: string
    description_en?: string
    business?: string
    tag?: string
    color?: string
    homepage_url?: string
    mobileurl?: string
  }
}>>([])
let timer: ReturnType<typeof setInterval> | null = null

const displayName = computed(() => {
  return user.value?.name || user.value?.username || user.value?.displayName || 'John'
})

const currentDateLabel = computed(() => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(currentTime.value)
})

const currentTimeLabel = computed(() => {
  const hours = String(currentTime.value.getHours()).padStart(2, '0')
  const minutes = String(currentTime.value.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
})

const greetingLabel = computed(() => {
  const hour = currentTime.value.getHours()

  if (hour < 12) {
    return t('home.greetings.morning')
  }

  if (hour < 18) {
    return t('home.greetings.afternoon')
  }

  return t('home.greetings.evening')
})

const favouriteItems = [
  { icon: 'document', label: 'ePolicy' },
  { icon: 'finance-bars', label: 'eClaim' },
  { icon: 'globe', label: 'eTravel' },
  { icon: 'personnel', label: 'HR Intranet' },
  { icon: 'education', label: 'eLearning' },
  { icon: 'legal-compliance', label: 'Admin Portal' },
  { icon: 'dashboard', label: 'Dashboards' },
  { icon: 'shop', label: 'eShop' },
]

const recentItems = [
  { icon: 'shop', label: 'eShop' },
  { icon: 'finance-bars', label: 'eClaim' },
  { icon: 'globe', label: 'eTravel' },
  { icon: 'personnel', label: 'HR Intranet' },
  { icon: 'education', label: 'eLearning' },
  { icon: 'legal-compliance', label: 'Admin Portal' },
  { icon: 'dashboard', label: 'Dashboards' },

  { icon: 'document', label: 'ePolicy' },
]

const visibleFavouriteItems = computed(() => {
  return favouriteView.value === 'recents' ? recentItems : favouriteItems
})

const regionOrder = ['HK', 'CN', 'SEA']
const detailRouteTypes = ['Data', 'Form']

const normalizeString = (value?: string | null) => {
  return typeof value === 'string' ? value.trim() : ''
}

const splitMultiValue = (value?: string | null) => {
  return normalizeString(value)
    .split(/[\/,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const sortByKnownOrder = (items: string[], order: string[]) => {
  return [...items].sort((left, right) => {
    const leftIndex = order.indexOf(left)
    const rightIndex = order.indexOf(right)
    const safeLeft = leftIndex === -1 ? order.length : leftIndex
    const safeRight = rightIndex === -1 ? order.length : rightIndex

    if (safeLeft !== safeRight) {
      return safeLeft - safeRight
    }

    return left.localeCompare(right)
  })
}

const getBusinessDisplayName = (name?: string) => {
  const normalized = normalizeString(name)
  const lowerName = normalized.toLowerCase()

  if (lowerName.includes('digital') || lowerName.includes('technology') || lowerName.includes('it')) {
    return 'Digital & Technology'
  }

  if (lowerName.includes('finance')) {
    return 'Finance'
  }

  if (lowerName.includes('legal') || lowerName.includes('compliance')) {
    return 'Legal & Compliance'
  }

  if (lowerName.includes('human resources') || lowerName.includes('hr')) {
    return 'Human Resources'
  }

  return normalized.replace(/^group\s+/i, '') || 'Business'
}

const getBusinessDescription = (name?: string, description?: string) => {
  const normalizedDescription = normalizeString(description)
  if (normalizedDescription) {
    return normalizedDescription
  }

  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return 'Core applications for infrastructure, collaboration, and operational support.'
  }

  if (normalized.includes('finance')) {
    return 'Finance operations, reporting tools, and workflow entry points.'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return 'Legal, compliance, and governance related applications.'
  }

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return 'People operations, leave, payroll, and related HR services.'
  }

  return 'Business applications, workflows, and related entry points.'
}

const getBusinessFallbackIcon = (name?: string) => {
  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return 'digital-technology'
  }

  if (normalized.includes('finance')) {
    return 'finance-bars'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return 'legal-compliance'
  }

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return 'personnel'
  }

  if (normalized.includes('china')) {
    return 'building'
  }

  return 'apps'
}

const getBusinessAccentColor = (name?: string, color?: string) => {
  if (color) {
    return color
  }

  const normalized = normalizeString(name).toLowerCase()

  if (normalized.includes('digital') || normalized.includes('technology') || normalized.includes('it')) {
    return '#3c8aff'
  }

  if (normalized.includes('finance')) {
    return '#009a88'
  }

  if (normalized.includes('legal') || normalized.includes('compliance')) {
    return '#d7008f'
  }

  if (normalized.includes('human resources') || normalized.includes('hr')) {
    return '#a60a3a'
  }

  return '#a60a3a'
}

const applicationItems = computed(() => {
  return businessEntries.value.slice(0, 4).map((item) => {
    const businessName = item.mainTable?.name_en || item.mainTable?.business

    return {
      entry: item,
      icon: getBusinessFallbackIcon(businessName),
      color: getBusinessAccentColor(businessName, item.mainTable?.color),
      title: getBusinessDisplayName(businessName),
      description: getBusinessDescription(businessName, item.mainTable?.description_en),
    }
  })
})

const newsItems = [
  {
    image: newsImage1,
    title: 'DCH Foods Hosts Trade Event to Promote New Bran...',
    date: '24 October, 2024',
  },
  {
    image: newsImage2,
    title: 'DCH Foods Hosts Trade Event to Promote New Bran...',
    date: '24 October, 2024',
  },
]

const activateTab = (value: number) => {
  activeTab.value = value
}

const openApplicationsPage = async () => {
  activeTab.value = 3
  await navigateTo('/mobile')
}

const openBusinessDetail = async (item: {
  mainTable?: {
    id?: string
    name_en?: string
    description_en?: string
    business?: string
    tag?: string
    color?: string
    homepage_url?: string
    mobileurl?: string
  }
}) => {
  const businessName = normalizeString(item.mainTable?.business || item.mainTable?.name_en)
  const businessTags = sortByKnownOrder(splitMultiValue(item.mainTable?.tag), regionOrder)
  const displayName = getBusinessDisplayName(item.mainTable?.name_en || businessName)

  selectedBusiness.value = {
    id: businessName,
    icon: getBusinessFallbackIcon(item.mainTable?.name_en || businessName),
    name_en: displayName,
    business: businessName,
    description_en: getBusinessDescription(item.mainTable?.name_en || businessName, item.mainTable?.description_en),
    color: getBusinessAccentColor(item.mainTable?.name_en || businessName, item.mainTable?.color),
    intranetLabel: `${displayName} Intranet >`,
    intranetUrl: item.mainTable?.homepage_url || item.mainTable?.mobileurl || 'https://intranet.dch.com.hk/',
  }

  activeTab.value = 3
  await navigateTo(
    `/mobile/applications/business/${encodeURIComponent(businessName)}/${encodeURIComponent((businessTags.length ? businessTags : regionOrder).join('/'))}/${encodeURIComponent(detailRouteTypes.join('/'))}`,
  )
}

const openSearch = async () => {
  await navigateTo('/mobile/search')
}

const openNotifications = async () => {
  mobileReturnPath.value = '/mobile'
  await navigateTo('/mobile/notifications')
}

onMounted(async () => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)

  businessEntries.value = await requestApplicationCatalogData(APPLICATION_BUSINESS_FILTER)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.mobile-home {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;
}

.home-hero {
  min-height: 134px;
  margin: 0 -16px;
  padding: 28px 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-size: cover;
  background-position: center;
  color: #ffffff;
}

.home-hero__greeting,
.home-hero__time {
  display: flex;
  flex-direction: column;
}

.home-hero__greeting {
  gap: 4px;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 700;
}

.home-hero__greeting span,
.home-hero__greeting strong {
  font-size: inherit;
}

.home-hero__time {
  align-items: flex-end;
  gap: 2px;
  transform: translateY(4px);
}

.home-hero__time span {
  font-size: 16px;
  font-weight: 500;
}

.home-hero__time strong {
  font-size: 32px;
  line-height: 1;
}

.home-section {
  padding: 16px 0 18px;
  border-bottom: 1px solid #eeeeee;
}

.home-section--news {
  border-bottom: 0;
}

.home-shortcuts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.home-shortcut-card {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #f7dce4 0%, #f2d8de 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #b20f4b;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.home-shortcut-card span {
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
}

.home-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.home-section__tabs {
  display: inline-flex;
  align-items: center;
  width: 250px;
  height: 48px;
  padding: 4px;
  border: 0;
  border-radius: 24.5px;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 6px rgba(0, 0, 0, 0.05);
}

.home-section__tab {
  flex: 1;
  height: 40px;
  border: 0;
  border-radius: 20px;
  background: transparent;
  color: #111111;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
}

.home-section__tab.is-active {
  background: #a60a3a;
  color: #ffffff;
}

.home-section__header h2 {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 24px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;

}

.home-section__header>button {
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  border: none;
  color: #A60A3A;
  background: none;
}

.favourites-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  row-gap: 18px;
  margin-bottom: 16px;
}

.favourite-item {
  border: 0;
  background: transparent;
  padding: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #111111;
}

.favourite-item span {
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.2;
  font-weight: 600;
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.application-card {
  min-width: 179px;
  min-height: 124px;
  border: 0.5px solid #D9D9D9;
  border-radius: 8px;
  padding: 14px 10px 10px;
  background: #ffffff;
  box-shadow: 0px 2px 50px 6px #0000000D;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.application-card strong {
  width: 141;
  height: 20;
  top: 703px;
  left: 36px;
  angle: 0 deg;
  opacity: 1;
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: #000000;

}

.application-card span {
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
}

.news-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.news-card {
  width: 179px;
  height: 251px;
  top: 995px;
  left: 16px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0px 2px 50px 6px #0000001A;
}

.news-card img {
  width: 179px;
  height: 130px;
  angle: 0 deg;
  opacity: 1;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;

}

.news-card__body {
  padding: 10px 10px 12px;
}

.news-card__body h3 {
  font-family: Source Sans Pro;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 16px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  border-bottom: 1px solid #D9D9D9;
  margin-bottom: 8px;
  height: 60px;
}

.news-card__body time {
  font-family: Source Sans Pro;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-top: 16px;
}
</style>
