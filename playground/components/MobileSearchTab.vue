<template>
  <div class="mobile-search">
    <div class="mobile-search__header">
      <div class="search-bar">
        <IconCustom name="search" :size="20" class="search-bar__icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="search-bar__input"
          placeholder="Search apps, documents, contacts..."
          @input="handleSearch"
        />
        <button
          v-if="searchQuery"
          class="search-bar__clear"
          @click="clearSearch"
        >
          <IconCustom name="x" :size="16" />
        </button>
      </div>
    </div>

    <div v-if="!searchQuery" class="mobile-search__suggestions">
      <h3 class="suggestions__title">Recent Searches</h3>
      <div class="suggestions__list">
        <div
          v-for="item in recentSearches"
          :key="item.id"
          class="suggestion-item"
          @click="selectSuggestion(item.query)"
        >
          <IconCustom name="clock" :size="18" class="suggestion-item__icon" />
          <span class="suggestion-item__text">{{ item.query }}</span>
        </div>
      </div>

      <h3 class="suggestions__title">Popular Searches</h3>
      <div class="suggestions__tags">
        <button
          v-for="tag in popularSearches"
          :key="tag"
          class="tag-btn"
          @click="selectSuggestion(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <div v-else class="mobile-search__results">
      <div v-if="searchResults.length === 0" class="no-results">
        <IconCustom name="search" :size="48" />
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
      <div v-else class="results-list">
        <div
          v-for="result in searchResults"
          :key="result.id"
          class="result-item"
          @click="handleResultClick(result)"
        >
          <div class="result-item__icon">
            <IconCustom :name="result.icon" :size="24" />
          </div>
          <div class="result-item__content">
            <div class="result-item__title">{{ result.title }}</div>
            <div class="result-item__type">{{ result.type }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const recentSearches = ref([
  { id: 1, query: 'Project reports' },
  { id: 2, query: 'Team calendar' },
  { id: 3, query: 'Budget 2026' }
])

const popularSearches = ref([
  'Documents',
  'Calendar',
  'Contacts',
  'Reports',
  'Settings'
])

const allItems = ref([
  { id: 1, title: 'Documents', type: 'Application', icon: 'document' },
  { id: 2, title: 'Calendar', type: 'Application', icon: 'calendar' },
  { id: 3, title: 'Email', type: 'Application', icon: 'mail' },
  { id: 4, title: 'Contacts', type: 'Application', icon: 'users' },
  { id: 5, title: 'Analytics', type: 'Application', icon: 'chart' },
  { id: 6, title: 'Settings', type: 'Application', icon: 'settings' },
  { id: 7, title: 'Q4 Report 2025', type: 'Document', icon: 'file' },
  { id: 8, title: 'Budget Planning', type: 'Document', icon: 'file' },
  { id: 9, title: 'Team Meeting Notes', type: 'Document', icon: 'file' }
])

const searchResults = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  return allItems.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query)
  )
})

const handleSearch = () => {
  // Search is handled by computed property
}

const clearSearch = () => {
  searchQuery.value = ''
}

const selectSuggestion = (query) => {
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
  padding: 16px;
  background: white;
  margin-bottom: 8px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F5F5F5;
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

.search-bar__clear {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #CCCCCC;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  flex-shrink: 0;
}

.mobile-search__suggestions {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.suggestions__title {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestions__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.suggestion-item:active {
  transform: scale(0.98);
}

.suggestion-item__icon {
  color: #999999;
}

.suggestion-item__text {
  font-size: 15px;
  color: #000000;
}

.suggestions__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-btn:active {
  background: #A60A3A;
  color: white;
  border-color: #A60A3A;
}

.mobile-search__results {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #999999;
}

.no-results p {
  margin-top: 16px;
  font-size: 15px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:active {
  transform: scale(0.98);
}

.result-item__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #A60A3A26;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A60A3A;
  flex-shrink: 0;
}

.result-item__content {
  flex: 1;
}

.result-item__title {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 2px;
}

.result-item__type {
  font-size: 12px;
  color: #666666;
}
</style>