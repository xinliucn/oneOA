<template>
  <div class="desktop">
    <div
      class="desktop__banner"
      :style="{ backgroundImage: `url(${desktopBanner})` }"
    >
      <div class="desktop__banner-left">
        <div class="desktop__date">
          {{ formattedDate }}
        </div>
        <div class="desktop__time">
          {{ formattedTime }}
        </div>
        <div class="desktop__greeting">
          {{ greetingText }}
        </div>
        <div class="desktop__search-bar">
          <IconCustom
            name="search"
            :size="18"
            class="desktop__search-icon"
          />
          <input
            type="text"
            class="desktop__search-input"
            :placeholder="t('home.searchPlaceholder')"
          >
          <button class="desktop__ai-btn">
            AI <span>★</span>
          </button>
        </div>
      </div>
    </div>

    <div class="desktop__content">
      <FavouritesGrid />
      <DesktopApplications />
      <div class="desktop__bottom-row">
        <GroupNews />
        <TasksList />
      </div>
    </div>

    <footer class="desktop__footer">
      {{ t('home.footerCopyright', { year: currentYear }) }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import desktopBanner from '~/assets/images/Group 120.png'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})

const { user } = useAuth()
const { locale, t } = useAppI18n()
const userName = computed(() => user.value?.name || user.value?.username || user.value?.displayName)
const currentYear = computed(() => currentTime.value.getFullYear())
const currentTime = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(currentTime.value)
})

const formattedTime = computed(() => {
  const d = currentTime.value
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})

const greetingText = computed(() => {
  const displayName = userName.value || t('common.guest')
  return t('home.greeting', { name: displayName })
})

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style>
.desktop {
    display: flex;
    flex-direction: column;
}

.desktop__banner {
    background-size: cover;
    background-position: center;
    padding: 42px 0 44px 88px;
    min-height: 400px;
    display: flex;
    align-items: flex-start;
}

.desktop__banner-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: min(520px, 44vw);
}

.desktop__date {
    margin-bottom: 3px;
    font-size: 11px;
    line-height: 1.2;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.92);
}

.desktop__time {
    margin-bottom: 56px;
    font-size: 44px;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 0.95;
}

.desktop__greeting {
    margin: 0 0 34px;
    max-width: 390px;
    font-size: 42px;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.28;
    letter-spacing: 0;
    white-space: pre-line;
}

.desktop__search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 450px;
    height: 42px;
    padding: 0 18px;
    background: #ffffff;
    border-radius: 999px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
}

.desktop__search-icon {
    color: #5f5f5f;
    flex-shrink: 0;
}

.desktop__search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 11px;
    font-weight: 400;
    line-height: 1;
    color: #555555;
    background: transparent;
}

.desktop__search-input::placeholder {
    color: #8f8f8f;
    opacity: 1;
}

.desktop__ai-btn {
    display: none;
}

.desktop__content {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 120px;
}

.desktop__bottom-row {
    width: 100%;
    display: grid;
    grid-template-columns: 458px 504px;
    justify-content: start;
    gap: 78px;
    padding: 22px 0 58px;
}

.desktop__bottom-row > * {
    min-width: 0;
}

.desktop__footer {
    text-align: center;
    padding: 20px;
    background-color: #A60A3A;
    color: #FFFFFF;
    font-size: 13px;
}
</style>
