<template>
  <section class="intranets-shared-footer__links-panel">
    <div class="intranets-shared-footer__links-group">
      <h2 class="intranets-shared-footer__links-title">
        {{ t('pages.departmentIntranets.footerPanel.departmentTitle') }}
      </h2>

      <button
        v-for="item in departmentItems"
        :key="item.label"
        type="button"
        class="intranets-shared-footer__links-item"
        @click="openFooterLink(item.url)"
      >
        <span class="intranets-shared-footer__links-chevron">›</span>
        <span>{{ item.label }}</span>
      </button>
    </div>

    <div class="intranets-shared-footer__links-divider" />

    <div class="intranets-shared-footer__links-group">
      <h2 class="intranets-shared-footer__links-title">
        {{ t('pages.departmentIntranets.footerPanel.eShopTitle') }}
      </h2>

      <button
        v-for="item in eShopItems"
        :key="item.label"
        type="button"
        class="intranets-shared-footer__links-item"
        @click="openFooterLink(item.url)"
      >
        <span class="intranets-shared-footer__links-chevron">›</span>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </section>

  <section class="intranets-shared-footer__carousel-section">
    <button
      v-if="brandCarouselItems.length > 1"
      type="button"
      class="intranets-shared-footer__carousel-control intranets-shared-footer__carousel-control--previous"
      :aria-label="t('pages.departmentIntranets.carousel.previous')"
      :disabled="!canScrollCarouselLeft"
      @click="scrollCarousel('previous')"
    >
      <IconCustom
        name="arrow-right"
        :size="14"
        :rotate="180"
      />
    </button>

    <div
      ref="carouselTrack"
      class="intranets-shared-footer__carousel-track"
      @scroll="updateCarouselControls"
    >
      <div
        v-for="item in brandCarouselItems"
        :key="item.id"
        class="intranets-shared-footer__carousel-card"
      >
        <div
          class="intranets-shared-footer__carousel-card-media"
          :class="{ 'intranets-shared-footer__carousel-card-media--fallback': !item.imageUrl }"
        >
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="intranets-shared-footer__carousel-card-image"
          >
        </div>
      </div>
    </div>

    <button
      v-if="brandCarouselItems.length > 1"
      type="button"
      class="intranets-shared-footer__carousel-control intranets-shared-footer__carousel-control--next"
      :aria-label="t('pages.departmentIntranets.carousel.next')"
      :disabled="!canScrollCarouselRight"
      @click="scrollCarousel('next')"
    >
      <IconCustom
        name="arrow-right"
        :size="14"
      />
    </button>
  </section>

  <footer class="intranets-shared-footer__footer">
    <span>{{ t('pages.intranets.footer.disclaimer') }}</span>
    <span class="intranets-shared-footer__footer-divider" />
    <span>{{ t('pages.intranets.footer.siteMap') }}</span>
    <span class="intranets-shared-footer__footer-divider" />
    <span>{{ t('pages.intranets.footer.copyright') }}</span>
  </footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { getEShopUrl } from '~/utils/departmentIntranet'

const { locale, t } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const intranetsBrandCarouselStore = useIntranetsBrandCarouselStore()
const { brandCarouselItems } = storeToRefs(intranetsBrandCarouselStore)

const departmentItems = computed(() => [
  {
    label: t('pages.departmentIntranets.footerPanel.departmentItems.groupHumanResources'),
    url: 'https://group-hr.dch.com.hk/',
  },
  {
    label: t('pages.departmentIntranets.footerPanel.departmentItems.greenOffice'),
    url: 'https://environment.dch.com.hk/',
  },
  {
    label: t('pages.departmentIntranets.footerPanel.departmentItems.groupLegalAndCompliance'),
    url: 'https://dchapps.dchbi.com/wui/index.html#/main/portal/portal-38-1',
  },
])

const eShopItems = computed(() => {
  const eShopUrl = getEShopUrl(locale.value)

  return [
    'Ahaa',
    'Auriga',
    'DCHEA',
    'DCH EA Butler',
    'DCH living',
    'DCH Motor Leasing',
    'Hong Kong Motor Club',
    'Gilman',
    'IGF',
    'IMSA',
    'Sims',
    'UCC',
    'YOKOHAMA',
  ].map(label => ({
    label,
    url: eShopUrl,
  }))
})

const carouselTrack = ref<HTMLElement | null>(null)
const canScrollCarouselLeft = ref(false)
const canScrollCarouselRight = ref(false)

const updateCarouselControls = () => {
  const track = carouselTrack.value

  if (!track) {
    return
  }

  const maxScrollLeft = track.scrollWidth - track.clientWidth
  canScrollCarouselLeft.value = track.scrollLeft > 1
  canScrollCarouselRight.value = track.scrollLeft < maxScrollLeft - 1
}

const scrollCarousel = (direction: 'previous' | 'next') => {
  const track = carouselTrack.value

  if (!track) {
    return
  }

  const scrollAmount = Math.max(track.clientWidth - 32, 1)
  track.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  })
}

const openFooterLink = async (url: string) => {
  await openGuardedUrl(url, '_blank')
}

onMounted(() => {
  intranetsBrandCarouselStore.fetchBrandCarousel().catch((fetchError) => {
    console.error('Get intranets brand carousel failed:', fetchError)
  })

  nextTick(updateCarouselControls)
})

watch(brandCarouselItems, async () => {
  await nextTick()
  updateCarouselControls()
})
</script>

<style scoped>
.intranets-shared-footer__links-panel {
  padding: 20px 16px 22px;
  background:
    linear-gradient(180deg, rgba(109, 123, 136, 0.98) 0%, rgba(91, 106, 118, 0.98) 100%),
    #738593;
  color: #ffffff;
}

.intranets-shared-footer__links-group + .intranets-shared-footer__links-group {
  margin-top: 18px;
}

.intranets-shared-footer__links-title {
  margin: 0 0 14px;
  color: #ffffff;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 700;
}

.intranets-shared-footer__links-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  font-size: 15px;
  line-height: 1.35;
}

.intranets-shared-footer__links-item + .intranets-shared-footer__links-item {
  margin-top: 12px;
}

.intranets-shared-footer__links-chevron {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1.1;
}

.intranets-shared-footer__links-divider {
  height: 1px;
  margin: 18px 0;
  background: rgba(255, 255, 255, 0.18);
}

.intranets-shared-footer__carousel-section {
  position: relative;
  padding: 8px 0 24px;
}

.intranets-shared-footer__carousel-track {
  display: flex;
  gap: 12px;
  padding: 14px 16px 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.intranets-shared-footer__carousel-track::-webkit-scrollbar {
  display: none;
}

.intranets-shared-footer__carousel-control {
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: rgba(0, 0, 0, 0.64);
  color: #ffffff;
  transform: translateY(-50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
}

.intranets-shared-footer__carousel-control:disabled {
  opacity: 0.35;
}

.intranets-shared-footer__carousel-control--previous {
  left: 4px;
}

.intranets-shared-footer__carousel-control--next {
  right: 4px;
}

.intranets-shared-footer__carousel-card {
  width: 202px;
  min-width: 202px;
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 22px rgba(24, 24, 24, 0.06);
}

.intranets-shared-footer__carousel-card-media {
  width: 100%;
  height: 124px;
  overflow: hidden;
  background: #f7f7f7;
}

.intranets-shared-footer__carousel-card-media--fallback {
  background:
    radial-gradient(circle at 72% 18%, rgba(255, 230, 166, 0.92), transparent 24%),
    linear-gradient(140deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.02) 38%, rgba(0, 0, 0, 0.16) 100%);
}

.intranets-shared-footer__carousel-card-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.intranets-shared-footer__footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px;
  border-top: 1px solid #d9d9d9;
  background: #ffffff;
  color: #666666;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
}

.intranets-shared-footer__footer-divider {
  width: 1px;
  height: 14px;
  flex-shrink: 0;
  background: #b5b5b5;
}
</style>
