<template>
    <div class="desktop">
        <div class="desktop__banner" :style="{ backgroundImage: `url(${desktopBanner})` }">
            <div class="desktop__greeting">
                Good morning, {{ userName || 'Guest' }}
            </div>
            <div class="desktop__widgets">
                <ClockWidget />
                <WeatherWidget />
                <MeetingWidget />
            </div>
        </div>
        <div class="desktop__content">
            <div class="desktop__row">
                <div class="desktop__col">
                    <FavouritesGrid />
                </div>
                <div class="desktop__col">
                    <CalendarWidget />
                </div>
            </div>
            <div class="desktop__row">
                <div class="desktop__col">
                    <GroupNews />
                </div>
                <div class="desktop__col">
                    <TasksList />
                </div>
            </div>
        </div>
        <footer class="desktop__footer">
            Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
        </footer>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'desktop',
    middleware: 'auth'
})
import desktopBanner from '~/assets/images/desktop-banner.jpg'

// 获取用户信息 - 中间件已经验证登录，直接使用 useAuth 的状态
const { user } = useAuth()
const userName = computed(() => user.value?.name || user.value?.username || user.value?.displayName)
</script>

<style>
.desktop {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.desktop__banner {
    height: 320px;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: space-between;
    padding: 120px 64px 0px 80px;
     /* 上内边距足够大以将问候语推到下方 */
}

.desktop__greeting {
    font-size: 48px;
    color: #FFFFFF;
    
    width: 320px;
    height: 120px;
}

.desktop__widgets {
    display: flex;
    gap: 16px;
    padding: 20px;
    align-items: flex-start;
}

.desktop__content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.desktop__row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    align-items: stretch;
}

.desktop__col {
    min-width: 0;
    display: flex;
}

.desktop__col > * {
    flex: 1;
}

.desktop__footer {
    text-align: center;
    padding: 20px;
    background-color: #A60A3A;
    color: #FFFFFF;
}
</style>