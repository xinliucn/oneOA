<template>
  <div class="mobile-search">
    <div class="mobile-search__header">
      <div class="search-bar">
        <IconCustom name="search" :size="18" class="search-bar__icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="search-bar__input"
          placeholder="Search Intranet"
          @keyup.enter="handleSearch"
        />
        <button class="search-bar__ai-btn">
          AI <span class="ai-star">★</span>
        </button>
      </div>
    </div>

    <!-- 默认：最近搜索 -->
    <div v-if="!searchQuery" class="mobile-search__recent">
      <div
        v-for="item in recentSearches"
        :key="item.id"
        class="recent-item"
        @click="selectRecent(item.query)"
      >
        <IconCustom name="clock" :size="18" class="recent-item__icon" />
        <span class="recent-item__text">{{ item.query }}</span>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="mobile-search__results">
      <div v-if="searchResults.length === 0" class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
      <div v-else>
        <div
          v-for="result in searchResults"
          :key="result.id"
          class="result-item"
          @click="handleResultClick(result)"
        >
          <div class="result-item__title">{{ result.title }}</div>
          <div class="result-item__desc">{{ result.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const recentSearches = ref([
  { id: 1, query: 'ESG Report 2025' },
  { id: 2, query: 'OA Contract' },
  { id: 3, query: 'Competency Framework' },
  { id: 4, query: 'DCH AI Training Material' },
])

const allResults = ref([
  { id: 1, title: 'Search Result 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim v...' },
  { id: 2, title: 'Search Result 2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim v...' },
  { id: 3, title: 'Search Result 3', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim v...' },
  { id: 4, title: 'Search Result 4', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim v...' },
  { id: 5, title: 'Search Result 5', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim v...' },
])

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  return allResults.value
})

const handleSearch = () => {}

const selectRecent = (query) => {
  searchQuery.value = query
}

const handleResultClick = (result) => {
  console.log('Result clicked:', result.title)
}
</script>

<style scoped>
.mobile-search {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F5F5F5;
}

.mobile-search__header {
  padding: 12px 16px;
  background: white;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 24px;
}

.search-bar__icon {
  color: #999999;
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #000000;
  outline: none;
}

.search-bar__input::placeholder {
  color: #999999;
}

.search-bar__ai-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px 12px;
  background: #A60A3A;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}

.ai-star {
  font-size: 11px;
}

/* 最近搜索 */
.mobile-search__recent {
  flex: 1;
  overflow-y: auto;
  background: white;
  margin-top: 8px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
}

.recent-item:active {
  background: #F5F5F5;
}

.recent-item__icon {
  color: #999999;
  flex-shrink: 0;
}

.recent-item__text {
  font-size: 15px;
  color: #000000;
}

/* 搜索结果 */
.mobile-search__results {
  flex: 1;
  overflow-y: auto;
  background: white;
  margin-top: 8px;
}

.no-results {
  padding: 48px 24px;
  text-align: center;
  color: #999999;
  font-size: 15px;
}

.result-item {
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
}

.result-item:active {
  background: #F5F5F5;
}

.result-item__title {
  font-size: 15px;
  font-weight: 600;
  color: #A60A3A;
  margin-bottom: 6px;
}

.result-item__desc {
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
