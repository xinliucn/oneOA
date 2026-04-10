<template>
    <div class="news_page">
        <div class="news_tab">
            <div class="news_header">
                <h1>News</h1>
                <IconCustom name="filterIcon" :size="28" color="#A60A3A" class="filter_icon" />
            </div>
            <div class="mobile-todo__filters">
                <button v-for="newTable in newFilters" :key="newTable.value"
                    :class="['filter-btn', { active: activeFilter === newTable.value }]"
                    @click="activeFilter = newTable.value">
                    {{ newTable.label }}
                </button>
            </div>
        </div>

        <div class="news_list">
            <div v-if="loading" class="news_state">Loading news...</div>
            <div v-else-if="error" class="news_state news_state--error">Failed to load news.</div>
            <div v-else-if="filteredNewsList.length === 0" class="news_state">No news found.</div>

            <template v-else>
                <div v-for="item in filteredNewsList" :key="item.id" class="news_content">
                    <div class="news_content__image">
                        <img :src="item.image" :alt="item.title">
                        <div v-if="item.category" class="news_content__tag">
                            {{ item.category }}
                        </div>
                    </div>
                    <div class="news_content__body">
                        <div class="news_content__title">{{ item.title }}</div>
                        <div class="news_content__date">{{ formatNewsDate(item.date, locale) }}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatNewsDate } from '~/utils/date'

const { locale } = useAppI18n()
const { newsList, loading, error, fetchNewsList } = useNewsList()

definePageMeta({
    layout: 'mobile',
    middleware: 'auth'
})

const activeFilter = ref('all')

const newFilters = [
    { label: 'All', value: 'all' },
    { label: 'Group News', value: 'Group News' },
    { label: 'Internal Publish', value: 'Internal Publish' },
    { label: 'Promotion', value: 'Promotion' },
]

const filteredNewsList = computed(() => {
    if (activeFilter.value === 'all') {
        return newsList.value
    }

    return newsList.value.filter((item) => item.category === activeFilter.value)
})

onMounted(async () => {
    await fetchNewsList()
})
</script>

<style scoped>
.news_page {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
    min-height: 0;
}

.news_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter_icon {
    margin: 16px;
}

.mobile-todo__filters {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
    background: white;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-bottom: #D9D9D9 0.5px solid;
}

.mobile-todo__filters::-webkit-scrollbar {
    display: none;
}

.filter-btn {
    flex-shrink: 0;
    padding: 8px 16px;
    border: 1px solid #E0E0E0;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
}

.filter-btn.active {
    background: #A60A3A;
    color: white;
    border-color: #A60A3A;
}

.news_tab {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background: white;

    h1 {
        font-size: 24px;
        color: #000000;
        margin: 16px;
    }
}

.news_list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 16px 24px;
    background: #f6f6f6;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    min-height: 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.news_list::-webkit-scrollbar {
    display: none;
}

.news_state {
    padding: 24px 16px;
    color: #666666;
    text-align: center;
}

.news_state--error {
    color: #A60A3A;
}

.news_content {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    width: 100%;
}

.news_content__image {
    position: relative;
    overflow: hidden;

    img {
        width: 100%;
        object-fit: cover;
        display: block;
    }
}

.news_content__tag {
    position: absolute;
    left: 12px;
    bottom: 12px;
    display: inline-flex;
    height: 32px;
    padding: 0 13px;
    border-radius: 999px;
    background: white;
    color: #A60A3A;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    justify-content: center;
    align-items: center;
}

.news_content__body {
    padding: 14px 16px 16px;
}

.news_content__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: #1f2328;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.news_content__date {
    font-size: 12px;
    color: #b4b4b4;
}
</style>
