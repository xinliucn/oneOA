<template>
  <Teleport to="body">
    <Transition name="home-guide-fade">
      <div
        v-if="isVisible"
        class="home-guide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-guide-title"
      >
        <button
          type="button"
          class="home-guide__backdrop"
          aria-label="Close add to home screen guide"
          @click="dismissGuide"
        />
        <section class="home-guide__panel">
          <header class="home-guide__header">
            <div>
              <p class="home-guide__eyebrow">
                iOS Safari
              </p>
              <h2
                id="home-guide-title"
                class="home-guide__title"
              >
                Add DCH Intranet to your home screen
              </h2>
            </div>
            <button
              type="button"
              class="home-guide__close"
              aria-label="Close"
              @click="dismissGuide"
            >
              ×
            </button>
          </header>

          <div
            class="home-guide__steps"
            aria-label="Add to home screen steps"
          >
            <article
              v-for="step in steps"
              :key="step.id"
              class="home-guide__step"
            >
              <div class="home-guide__step-label">
                iOS {{ step.id }}
              </div>
              <div class="phone">
                <div class="phone__status">
                  <span>{{ step.time }}</span>
                  <span>5G 80%</span>
                </div>
                <div
                  class="phone__screen"
                  :class="`phone__screen--${step.type}`"
                >
                  <template v-if="step.type === 'page'">
                    <div class="mock-site">
                      <div class="mock-site__topbar">
                        <span class="mock-site__logo">DCH</span>
                        <span>ENG</span>
                        <span>☰</span>
                      </div>
                      <div class="mock-site__hero">
                        DCH Intranet
                      </div>
                      <div class="mock-site__prompt">
                        <strong>Add DCH Intranet to your home screen</strong>
                        <ol>
                          <li>Tap <b>...</b> on the bottom right corner</li>
                          <li>Tap <b>Share</b></li>
                          <li>Tap <b>View More</b></li>
                          <li>Tap <b>Add to Home Screen</b></li>
                        </ol>
                      </div>
                    </div>
                    <div class="phone__safari">
                      <span>‹</span>
                      <span class="phone__url">dch.com.hk</span>
                      <strong>...</strong>
                    </div>
                  </template>

                  <template v-else-if="step.type === 'menu'">
                    <div class="mock-site mock-site--dimmed">
                      <div class="mock-site__topbar">
                        <span class="mock-site__logo">DCH</span>
                        <span>ENG</span>
                        <span>☰</span>
                      </div>
                      <div class="mock-site__hero">
                        DCH Intranet
                      </div>
                    </div>
                    <div class="ios-sheet">
                      <button type="button">
                        Share
                      </button>
                      <button type="button">
                        Add to Bookmarks
                      </button>
                      <button type="button">
                        Add Bookmark to...
                      </button>
                      <button type="button">
                        New Tab
                      </button>
                    </div>
                  </template>

                  <template v-else-if="step.type === 'share'">
                    <div class="ios-share">
                      <div class="ios-share__header">
                        <span class="app-icon">DCH</span>
                        <div>
                          <strong>Dah Chong Hong Holdings...</strong>
                          <small>dch.com.hk</small>
                        </div>
                      </div>
                      <div class="ios-share__apps">
                        <span>AirDrop</span>
                        <span>Messages</span>
                        <span>Mail</span>
                      </div>
                      <div class="ios-share__actions">
                        <button type="button">
                          Copy
                        </button>
                        <button type="button">
                          Add to Bookmarks
                        </button>
                        <button type="button">
                          View More
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="step.type === 'more'">
                    <div class="ios-share ios-share--more">
                      <div class="ios-share__header">
                        <span class="app-icon">DCH</span>
                        <div>
                          <strong>Dah Chong Hong Holdings...</strong>
                          <small>dch.com.hk</small>
                        </div>
                      </div>
                      <div class="ios-share__apps">
                        <span>AirDrop</span>
                        <span>Messages</span>
                        <span>Mail</span>
                      </div>
                      <div class="ios-share__actions">
                        <button type="button">
                          Add Bookmark to...
                        </button>
                        <button type="button">
                          Add to Favorites
                        </button>
                        <button
                          type="button"
                          class="is-highlight"
                        >
                          Add to Home Screen
                        </button>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="step.type === 'confirm'">
                    <div class="ios-confirm">
                      <div class="ios-confirm__bar">
                        <span>×</span>
                        <strong>Add to Home Screen</strong>
                        <button type="button">
                          Add
                        </button>
                      </div>
                      <div class="ios-confirm__app">
                        <span class="app-icon">DCH</span>
                        <div>
                          <strong>DCH Intranet</strong>
                          <small>https://dch.com.hk/...</small>
                        </div>
                      </div>
                      <label class="ios-confirm__toggle">
                        <span>Open as Web App</span>
                        <span class="switch" />
                      </label>
                      <div class="ios-keyboard" />
                    </div>
                  </template>

                  <template v-else>
                    <div class="ios-home">
                      <div class="ios-home__icons">
                        <span>myGov</span>
                        <span>Uber</span>
                        <span>Octopus</span>
                        <span>DCH</span>
                      </div>
                      <div class="ios-home__spotlight">
                        Search
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <p class="home-guide__caption">
                {{ step.caption }}
              </p>
            </article>
          </div>

          <footer class="home-guide__footer">
            <p>
              Open this page in Safari, then follow the steps above.
            </p>
            <button
              type="button"
              @click="dismissGuide"
            >
              Got it
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

type GuideStep = {
  id: number
  time: string
  type: 'page' | 'menu' | 'share' | 'more' | 'confirm' | 'home'
  caption: string
}

const route = useRoute()
const isVisible = useState('mobile:add-to-home-screen-guide-visible', () => false)
const hasDismissed = useState('mobile:add-to-home-screen-guide-dismissed', () => false)

const steps = computed<GuideStep[]>(() => [
  {
    id: 1,
    time: '10:34',
    type: 'page',
    caption: 'Tap the Safari ... button at the bottom right.',
  },
  {
    id: 2,
    time: '10:35',
    type: 'menu',
    caption: 'Tap Share from the Safari menu.',
  },
  {
    id: 3,
    time: '10:35',
    type: 'share',
    caption: 'Open the iOS share sheet.',
  },
  {
    id: 4,
    time: '10:35',
    type: 'more',
    caption: 'Choose Add to Home Screen.',
  },
  {
    id: 5,
    time: '10:35',
    type: 'confirm',
    caption: 'Keep Open as Web App enabled, then tap Add.',
  },
  {
    id: 6,
    time: '10:36',
    type: 'home',
    caption: 'Launch DCH Intranet from the home screen.',
  },
])

const isIosSafari = () => {
  if (!import.meta.client) return false

  const userAgent = window.navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(userAgent) || (
    window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1
  )
  const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent)

  return isIos && isSafari
}

const isStandalone = () => {
  if (!import.meta.client) return false

  return window.matchMedia('(display-mode: standalone)').matches
    || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
}

const openGuideFromRoute = () => {
  if (route.query.installGuide === '1') {
    isVisible.value = true
  }
}

const dismissGuide = () => {
  isVisible.value = false
  hasDismissed.value = true

  if (import.meta.client) {
    window.localStorage.setItem('mobile:add-to-home-screen-guide-dismissed', '1')
  }
}

onMounted(() => {
  if (!import.meta.client) return

  hasDismissed.value = window.localStorage.getItem('mobile:add-to-home-screen-guide-dismissed') === '1'
  openGuideFromRoute()

  if (!hasDismissed.value && isIosSafari() && !isStandalone()) {
    window.setTimeout(() => {
      isVisible.value = true
    }, 800)
  }
})

watch(
  () => route.query.installGuide,
  () => openGuideFromRoute(),
)
</script>

<style scoped>
.home-guide {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.home-guide__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(0 0 0 / 48%);
}

.home-guide__panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-height: min(86vh, 760px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
  background: #f4f4f4;
  box-shadow: 0 -18px 40px rgb(0 0 0 / 18%);
}

.home-guide__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 10px;
  background: #ffffff;
}

.home-guide__eyebrow {
  margin: 0 0 4px;
  color: #777777;
  font-size: 12px;
  line-height: 1.2;
}

.home-guide__title {
  margin: 0;
  color: #a60a3a;
  font-size: 18px;
  line-height: 1.25;
}

.home-guide__close {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: #f2f2f2;
  color: #777777;
  font-size: 22px;
  line-height: 1;
}

.home-guide__steps {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 16px 16px 12px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.home-guide__steps::-webkit-scrollbar {
  display: none;
}

.home-guide__step {
  width: 214px;
  flex: 0 0 214px;
  scroll-snap-align: center;
}

.home-guide__step-label {
  margin-bottom: 8px;
  color: #777777;
  font-size: 12px;
  line-height: 1;
}

.phone {
  height: 372px;
  overflow: hidden;
  border: 8px solid #141414;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgb(0 0 0 / 10%);
}

.phone__status {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: #000000;
  font-size: 9px;
  font-weight: 700;
}

.phone__screen {
  position: relative;
  height: calc(100% - 24px);
  overflow: hidden;
  background: #f7f7f7;
}

.mock-site {
  height: 100%;
  background: #e9f3f7;
}

.mock-site--dimmed {
  filter: brightness(0.82);
}

.mock-site__topbar {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: #f8fbfc;
  color: #222222;
  font-size: 10px;
}

.mock-site__logo,
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 9px;
  font-weight: 800;
}

.mock-site__hero {
  height: 160px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 28px;
  background:
    linear-gradient(180deg, rgb(0 0 0 / 8%), rgb(0 0 0 / 24%)),
    linear-gradient(135deg, #8bd0e5 0%, #6f9fb5 52%, #d0dee5 100%);
  color: #ffffff;
  font-size: 18px;
  font-style: italic;
  font-weight: 800;
}

.mock-site__prompt {
  width: 142px;
  margin: -28px auto 0;
  padding: 12px 10px;
  background: #ffffff;
  color: #a60a3a;
  box-shadow: 0 10px 18px rgb(0 0 0 / 12%);
}

.mock-site__prompt strong {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 1.2;
}

.mock-site__prompt ol {
  margin: 0;
  padding-left: 14px;
}

.mock-site__prompt li {
  margin-top: 4px;
  color: #333333;
  font-size: 8px;
  line-height: 1.35;
}

.phone__safari {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 22px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 8px 16px rgb(0 0 0 / 12%);
  font-size: 18px;
}

.phone__url {
  width: 104px;
  padding: 5px 8px;
  border-radius: 999px;
  background: #efefef;
  color: #222222;
  font-size: 10px;
  text-align: center;
}

.ios-sheet {
  position: absolute;
  right: 10px;
  bottom: 54px;
  left: 10px;
  overflow: hidden;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgb(0 0 0 / 16%);
}

.ios-sheet button,
.ios-share__actions button {
  width: 100%;
  height: 34px;
  border: 0;
  border-bottom: 1px solid #ececec;
  background: #ffffff;
  color: #111111;
  font-size: 11px;
  text-align: left;
  padding: 0 14px;
}

.ios-share {
  height: 100%;
  padding: 16px 10px;
  background: linear-gradient(180deg, #636363, #2a2a2a);
  color: #ffffff;
}

.ios-share__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 12px;
  background: rgb(0 0 0 / 32%);
}

.ios-share__header strong,
.ios-confirm__app strong {
  display: block;
  max-width: 118px;
  overflow: hidden;
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ios-share__header small,
.ios-confirm__app small {
  display: block;
  margin-top: 2px;
  color: #bdbdbd;
  font-size: 8px;
}

.ios-share__apps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 14px 0;
}

.ios-share__apps span {
  height: 58px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 12px;
  background: #ffffff;
  color: #222222;
  font-size: 9px;
  padding-bottom: 6px;
}

.ios-share__actions {
  overflow: hidden;
  border-radius: 12px;
}

.ios-share__actions .is-highlight {
  color: #0a84ff;
  font-weight: 700;
}

.ios-confirm {
  height: 100%;
  background: #181818;
  color: #ffffff;
}

.ios-confirm__bar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 11px;
}

.ios-confirm__bar button {
  border: 0;
  border-radius: 14px;
  background: #0a84ff;
  color: #ffffff;
  font-size: 10px;
  padding: 5px 9px;
}

.ios-confirm__app {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 10px 18px;
  padding: 10px;
  border-radius: 12px;
  background: #242424;
}

.ios-confirm__toggle {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
  color: #ffffff;
  font-size: 11px;
}

.switch {
  width: 38px;
  height: 22px;
  display: inline-block;
  border-radius: 999px;
  background: #34c759;
  position: relative;
}

.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
}

.ios-keyboard {
  height: 122px;
  margin: 30px 8px 0;
  border-radius: 12px 12px 0 0;
  background:
    repeating-linear-gradient(0deg, transparent 0 28px, rgb(255 255 255 / 14%) 28px 30px),
    repeating-linear-gradient(90deg, transparent 0 30px, rgb(255 255 255 / 14%) 30px 32px),
    #4b4b4b;
}

.ios-home {
  height: 100%;
  padding: 18px 12px;
  background:
    linear-gradient(180deg, rgb(0 0 0 / 18%), rgb(0 0 0 / 32%)),
    linear-gradient(135deg, #7e8790 0%, #2d3036 100%);
  color: #ffffff;
}

.ios-home__icons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.ios-home__icons span {
  height: 46px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 12px;
  background: rgb(255 255 255 / 20%);
  font-size: 8px;
  padding-bottom: 5px;
}

.ios-home__icons span:last-child {
  background: #a60a3a;
  font-weight: 800;
}

.ios-home__spotlight {
  position: absolute;
  right: 18px;
  bottom: 18px;
  left: 18px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgb(255 255 255 / 22%);
  color: #e8e8e8;
  font-size: 10px;
  text-align: center;
}

.home-guide__caption {
  min-height: 38px;
  margin: 10px 0 0;
  color: #333333;
  font-size: 12px;
  line-height: 1.35;
}

.home-guide__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #e7e7e7;
  background: #ffffff;
}

.home-guide__footer p {
  margin: 0;
  color: #666666;
  font-size: 12px;
  line-height: 1.35;
}

.home-guide__footer button {
  height: 36px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 18px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  padding: 0 18px;
}

.home-guide-fade-enter-active,
.home-guide-fade-leave-active {
  transition: opacity 0.2s ease;
}

.home-guide-fade-enter-from,
.home-guide-fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .home-guide {
    align-items: center;
  }

  .home-guide__panel {
    max-width: 860px;
    border-radius: 18px;
  }
}
</style>
