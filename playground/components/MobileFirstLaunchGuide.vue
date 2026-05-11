<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="first-launch-fade">
        <div
          v-if="isVisible"
          class="first-launch"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @keydown.esc="skipGuide"
        >
          <div
            class="first-launch__backdrop"
            aria-hidden="true"
          />

          <section class="first-launch__panel">
            <p class="first-launch__intro">
              {{ currentSlide.intro }}
            </p>

            <article class="first-launch-card">
              <img
                :src="firstLaunchBackground"
                alt=""
                class="first-launch-card__background"
                aria-hidden="true"
              >

              <div class="first-launch-card__content">
                <h2
                  :id="titleId"
                  class="first-launch-card__title"
                >
                  {{ currentSlide.title }}
                </h2>
                <p class="first-launch-card__description">
                  {{ currentSlide.description }}
                </p>

                <div
                  class="approval-preview"
                  aria-hidden="true"
                >
                  <div class="approval-preview__header">
                    <span>{{ currentSlide.previewTitle }}</span>
                    <span class="approval-preview__icons">
                      <i class="approval-preview__filter" />
                      <i class="approval-preview__search" />
                    </span>
                  </div>

                  <div
                    v-for="item in currentSlide.items"
                    :key="`${item.code}-${item.name}`"
                    class="approval-preview__item"
                  >
                    <div class="approval-preview__meta">
                      <span>
                        <strong>{{ item.code }}</strong>
                        <em :class="`is-${item.statusTone}`">{{ item.status }}</em>
                      </span>
                      <span>{{ item.time }}</span>
                    </div>
                    <p>{{ item.name }}</p>
                    <span>{{ item.owner }}</span>
                  </div>
                </div>
              </div>

              <footer class="first-launch-card__footer">
                <div
                  class="first-launch__dots"
                  aria-label="Guide progress"
                >
                  <button
                    v-for="(slide, index) in slides"
                    :key="slide.key"
                    type="button"
                    class="first-launch__dot"
                    :class="{ 'is-active': index === activeIndex }"
                    :aria-label="`Go to ${slide.intro}`"
                    @click="activeIndex = index"
                  />
                </div>

                <button
                  type="button"
                  class="first-launch__primary"
                  @click="goNext"
                >
                  {{ isLastSlide ? currentSlide.doneText : currentSlide.nextText }}
                </button>

                <button
                  type="button"
                  class="first-launch__skip"
                  @click="skipGuide"
                >
                  {{ currentSlide.skipText }}
                </button>
              </footer>
            </article>
          </section>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import firstLaunchBackground from '~/assets/images/Rectangle 2 (1).png'

type LaunchGuideItem = {
  code: string
  time: string
  status: string
  statusTone: 'pending' | 'approved'
  name: string
  owner: string
}

type LaunchGuideSlide = {
  key: string
  intro: string
  title: string
  description: string
  previewTitle: string
  nextText: string
  doneText: string
  skipText: string
  items: LaunchGuideItem[]
}

const route = useRoute()
const emit = defineEmits<{
  complete: []
}>()

const storageKey = 'mobile:first-launch-guide:v1:completed'
const titleId = 'first-launch-guide-title'
const isVisible = useState('mobile:first-launch-guide-visible', () => false)
const hasCompleted = useState('mobile:first-launch-guide-completed', () => false)
const activeIndex = useState('mobile:first-launch-guide-active-index', () => 0)

const slides: LaunchGuideSlide[] = [
  {
    key: 'approvals',
    intro: 'Intro 1',
    title: 'Keep track of your approvals',
    description: 'Boost productivity by having all important information available at a glance.',
    previewTitle: 'My Approvals',
    nextText: 'Next',
    doneText: 'Get started',
    skipText: 'Skip',
    items: [
      {
        code: 'WOA-CPM-26010001',
        time: '2025-10-24',
        status: 'Pending',
        statusTone: 'pending',
        name: 'Demand & Business Case Approval (GDT)',
        owner: 'Victor Ho via WOA-CPM',
      },
      {
        code: 'YY-CCA-202500995',
        time: '2025-10-24',
        status: 'Pending',
        statusTone: 'pending',
        name: 'Contract Clearance Approval (GDT)',
        owner: 'Bob Wan via YY-CCA',
      },
      {
        code: 'YY-ECAPEX-20250094',
        time: '2025-10-24',
        status: 'Approved',
        statusTone: 'approved',
        name: 'eCAPEX Approval (GDT)',
        owner: 'Victor Ho via Form e-CAPEX',
      },
      {
        code: 'BIPO-EAPPRAISAL-20250093',
        time: '2025-10-24',
        status: 'Approved',
        statusTone: 'approved',
        name: 'eAppraisal 2025 (Victor Ho)',
        owner: 'Victor Ho via BIPO-eAppraisal',
      },
    ],
  },
  {
    key: 'todo',
    intro: 'Intro 2',
    title: 'Find every task in one place',
    description: 'Review pending work, requests, and updates without jumping between systems.',
    previewTitle: 'To-Do',
    nextText: 'Next',
    doneText: 'Get started',
    skipText: 'Skip',
    items: [
      {
        code: 'TASK-2026-0042',
        time: '11:20',
        status: 'Pending',
        statusTone: 'pending',
        name: 'IT Service Request',
        owner: 'Pending your action',
      },
      {
        code: 'REQ-2026-0188',
        time: '12:05',
        status: 'Pending',
        statusTone: 'pending',
        name: 'Travel Application',
        owner: 'Submitted by you',
      },
      {
        code: 'NEWS-2026-0031',
        time: '13:45',
        status: 'Approved',
        statusTone: 'approved',
        name: 'Department Notice',
        owner: 'Recently updated',
      },
    ],
  },
  {
    key: 'applications',
    intro: 'Intro 3',
    title: 'Open key apps faster',
    description: 'Use the mobile portal to reach common tools and company resources quickly.',
    previewTitle: 'Applications',
    nextText: 'Next',
    doneText: 'Get started',
    skipText: 'Skip',
    items: [
      {
        code: 'APP',
        time: 'Pinned',
        status: 'Approved',
        statusTone: 'approved',
        name: 'eLeave',
        owner: 'Digital & Technology',
      },
      {
        code: 'APP',
        time: 'Pinned',
        status: 'Approved',
        statusTone: 'approved',
        name: 'IT Service Desk',
        owner: 'Digital & Technology',
      },
      {
        code: 'DOC',
        time: 'Recent',
        status: 'Pending',
        statusTone: 'pending',
        name: 'Company Documents',
        owner: 'Company resources',
      },
    ],
  },
  {
    key: 'news',
    intro: 'Intro 4',
    title: 'Stay close to company updates',
    description: 'Catch news, documents, and department resources as soon as they are available.',
    previewTitle: 'Latest Updates',
    nextText: 'Next',
    doneText: 'Get started',
    skipText: 'Skip',
    items: [
      {
        code: 'NEWS-2026-0104',
        time: 'Today',
        status: 'Approved',
        statusTone: 'approved',
        name: 'Group Announcement',
        owner: 'Company Information',
      },
      {
        code: 'DOC-2026-0029',
        time: 'Today',
        status: 'Pending',
        statusTone: 'pending',
        name: 'Policy Document',
        owner: 'Company Documents',
      },
      {
        code: 'DEPT-2026-0018',
        time: 'Today',
        status: 'Approved',
        statusTone: 'approved',
        name: 'Department Intranet Update',
        owner: 'Department resources',
      },
    ],
  },
]

const currentSlide = computed<LaunchGuideSlide>(() => slides[activeIndex.value] || slides[0]!)
const isLastSlide = computed(() => activeIndex.value >= slides.length - 1)

const completeGuide = () => {
  isVisible.value = false
  hasCompleted.value = true

  if (import.meta.client) {
    window.localStorage.setItem(storageKey, '1')
  }

  emit('complete')
}

const goNext = () => {
  if (isLastSlide.value) {
    completeGuide()
    return
  }

  activeIndex.value += 1
}

const skipGuide = () => {
  completeGuide()
}

const openFromRoute = () => {
  if (route.query.firstLaunchGuide === '1') {
    activeIndex.value = 0
    isVisible.value = true
  }
}

onMounted(() => {
  if (!import.meta.client) return

  hasCompleted.value = window.localStorage.getItem(storageKey) === '1'
  openFromRoute()

  if (!hasCompleted.value) {
    window.setTimeout(() => {
      activeIndex.value = 0
      isVisible.value = true
    }, 420)
  }
})

watch(
  () => route.query.firstLaunchGuide,
  () => openFromRoute(),
)
</script>

<style scoped>
.first-launch {
  position: fixed;
  inset: 0;
  z-index: 2147483645;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.first-launch__backdrop {
  position: absolute;
  inset: 0;
  background: transparent;
}

.first-launch__panel {
  position: relative;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.first-launch__intro {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.first-launch-card {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  border-radius: 0;
  background-color: #fbf2f4;
}

.first-launch-card__background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
}

.first-launch-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(116px, 20.8dvh, 170px) 18px 0;
  text-align: center;
}

.first-launch-card__title {
  width: 228px;
  margin: 0 0 17px;
  color: #b90842;
  font-weight: 600;
  font-size: 32px;
  line-height: 100%;
  text-align: center;
}

.first-launch-card__description {
  width: 291px;
  max-width: calc(100% - 36px);
  margin: 0 0 clamp(50px, 7.8dvh, 68px);
  color: #111111;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
}

.approval-preview {
  width: min(76.6vw, 300px);
  overflow: hidden;
  border-radius: 9px;
  background: #ffffff;
  color: #222222;
  text-align: left;
  box-shadow: 0 13px 28px rgb(65 35 45 / 18%);
}

.approval-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 9px;
  border-bottom: 1px solid #f0dbe2;
  color: #191919;
  font-size: 16px;
  font-weight: 800;
}

.approval-preview__icons {
  display: inline-flex;
  gap: 5px;
}

.approval-preview__icons i {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f5d8e1;
}

.approval-preview__filter::before,
.approval-preview__filter::after,
.approval-preview__search::before,
.approval-preview__search::after {
  content: "";
  position: absolute;
}

.approval-preview__filter::before {
  top: 6px;
  left: 5px;
  width: 8px;
  height: 1px;
  background: #b90842;
  box-shadow: 0 4px 0 #b90842;
}

.approval-preview__filter::after {
  top: 5px;
  left: 8px;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #b90842;
  box-shadow: -3px 4px 0 #b90842;
}

.approval-preview__search::before {
  top: 5px;
  left: 5px;
  width: 5px;
  height: 5px;
  border: 1px solid #b90842;
  border-radius: 50%;
}

.approval-preview__search::after {
  top: 11px;
  left: 11px;
  width: 5px;
  height: 1px;
  border-radius: 1px;
  background: #b90842;
  transform: rotate(45deg);
  transform-origin: left center;
}

.approval-preview__item {
  position: relative;
  padding: 9px 24px 9px 12px;
  border-bottom: 1px solid #f5edf0;
}

.approval-preview__item:last-child {
  border-bottom: 0;
}

.approval-preview__item::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 13px;
  width: 8px;
  height: 8px;
  border-top: 1.5px solid #b90842;
  border-right: 1.5px solid #b90842;
  transform: translateY(-50%) rotate(45deg);
}

.approval-preview__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 3px;
  color: #222222;
  font-size: 9px;
  line-height: 1.2;
}

.approval-preview__meta>span:first-child {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}

.approval-preview__meta strong {
  min-width: 0;
  overflow: hidden;
  color: #222222;
  font-size: inherit;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.approval-preview__meta em {
  flex: 0 0 auto;
  font-size: inherit;
  font-style: normal;
  font-weight: 800;
}

.approval-preview__meta em.is-pending {
  color: #d5a100;
}

.approval-preview__meta em.is-approved {
  color: #139338;
}

.approval-preview__meta>span:last-child {
  flex: 0 0 auto;
  color: #a7adb3;
  font-size: inherit;
}

.approval-preview__item p,
.approval-preview__item>span {
  font-size: inherit;
}

.approval-preview__item p {
  margin: 0 0 3px;
  color: #1d1d1d;
  font-weight: 800;
  font-size: 10px;
  line-height: 1.25;
}

.approval-preview__item>span {
  display: block;
  color: #222222;
  font-size: 8px;
  line-height: 1.22;
}

.first-launch-card__footer {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: clamp(46px, 8.6dvh, 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.first-launch__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 14px;
  margin-bottom: 14px;
}

.first-launch__dot {
  width: 6px;
  height: 6px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: #e6b5c5;
}

.first-launch__dot.is-active {
  width: 7px;
  height: 7px;
  background: #b90842;
}

.first-launch__primary {
  width: min(91.8vw, 360px);
  min-height: 38px;
  border: 0;
  border-radius: 5px;
  background: #b90842;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 9px 18px rgb(185 8 66 / 22%);
}

.first-launch__primary::after {
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-left: 8px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  transform: translateY(-1px) rotate(45deg);
}

.first-launch__skip {
  min-height: 28px;
  margin-top: 16px;
  border: 0;
  background: transparent;
  color: #b90842;
  font-size: 12px;
  font-weight: 800;
}

.first-launch-fade-enter-active,
.first-launch-fade-leave-active {
  transition: opacity 0.2s ease;
}

.first-launch-fade-enter-from,
.first-launch-fade-leave-to {
  opacity: 0;
}

@media (max-height: 640px) {
  .first-launch-card__content {
    padding-top: 86px;
  }

  .first-launch-card__description {
    margin-bottom: 34px;
  }

  .first-launch-card__footer {
    bottom: 28px;
  }
}
</style>
