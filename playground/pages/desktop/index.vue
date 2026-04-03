<template>
    <div class="desktop">
        <div class="desktop__banner" :style="{ backgroundImage: `url(${desktopBanner})` }">
            <div class="desktop__banner-left">
                <div class="desktop__date">{{ formattedDate }}</div>
                <div class="desktop__time">{{ formattedTime }}</div>
                <div class="desktop__greeting">
                    {{ greetingText }}
                </div>
                <div class="desktop__search-bar">
                    <IconCustom name="search" :size="18" class="desktop__search-icon" />
                    <input type="text" class="desktop__search-input" :placeholder="t('home.searchPlaceholder')" />
                    <button class="desktop__ai-btn">AI <span>★</span></button>
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
definePageMeta({
    layout: 'desktop',
    middleware: 'auth'
})
import { ref, computed, onMounted, onUnmounted } from 'vue'
import desktopBanner from '~/assets/images/desktop-banner.jpg'

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
        year: 'numeric'
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

onMounted(() => { timer = setInterval(() => { currentTime.value = new Date() }, 1000) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style>
.desktop {
    display: flex;
    flex-direction: column;
}

.desktop__banner {
    background-size: cover;
    background-position: center;
    padding: 32px 48px 40px;
    min-height: 220px;
    display: flex;
    align-items: flex-end;
}

.desktop__banner-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.desktop__date {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
}

.desktop__time {
    font-size: 48px;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1;
}

.desktop__greeting {
    font-size: 22px;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 12px;
}

.desktop__search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    border-radius: 24px;
    padding: 10px 10px 10px 16px;
    width: 340px;
}

.desktop__search-icon {
    color: #999999;
    flex-shrink: 0;
}

.desktop__search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333;
    background: transparent;
}

.desktop__search-input::placeholder {
    color: #999999;
}

.desktop__ai-btn {
    background: #A60A3A;
    color: white;
    border: none;
    border-radius: 16px;
    padding: 5px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
}

.desktop__content {
    padding: 0;
    display: flex;
    flex-direction: column;
}

.desktop__bottom-row {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 0;
}

.desktop__footer {
    text-align: center;
    padding: 20px;
    background-color: #A60A3A;
    color: #FFFFFF;
    font-size: 13px;
}
</style>
