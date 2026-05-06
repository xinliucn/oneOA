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
      </div>
      <button
        type="button"
        class="search-bar__ai-btn"
        :class="{ 'search-bar__ai-btn--active': isAiMode }"
        :disabled="!normalizedSearchQuery || isAiBusy"
        @click="runAiSearch"
      >
        <span>{{ aiButtonLabel }}</span>
        <span class="ai-star">
          <IconCustom name="starIcon" :size="20" />
        </span>
      </button>
    </div>

    <!-- 默认：最近搜索 -->
    <div v-if="!normalizedSearchQuery" class="mobile-search__recent">
      <div
        v-for="item in recentSearches"
        :key="item.id"
        class="recent-item"
        @click="selectRecent(item.query)"
      >
        <IconCustom name="clockIcon" :size="28" class="recent-item__icon" />
        <span class="recent-item__text">{{ item.query }}</span>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="mobile-search__results">
      <div v-if="aiStatusMessage" class="ai-status" :class="{ 'ai-status--error': aiError }">
        {{ aiStatusMessage }}
      </div>
      <div v-if="displayedResults.length === 0 && !isAiBusy" class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
      <div v-else>
        <div
          v-for="result in displayedResults"
          :key="result.id"
          class="result-item"
          @click="handleResultClick(result)"
        >
          <div class="result-item__topline">
            <div class="result-item__title">
              {{ result.title }}
            </div>
            <div v-if="isAiMode && result.aiScore !== undefined" class="result-item__score">
              {{ Math.round(result.aiScore * 100) }}%
            </div>
          </div>
          <div class="result-item__desc">
            {{ result.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type SearchResult = {
  id: number
  title: string
  description: string
  keywords: string[]
  aiScore?: number
}

type EmbeddingExtractor = (
  input: string | string[],
  options: { pooling: 'mean', normalize: boolean },
) => Promise<{ data: ArrayLike<number>, dims?: number[] }>

type TransformersModule = {
  env?: {
    allowLocalModels?: boolean
    useBrowserCache?: boolean
  }
  pipeline: (task: string, model: string) => Promise<EmbeddingExtractor>
}

const AI_MODEL = 'Xenova/multilingual-e5-small'

const searchQuery = ref('')
const isAiMode = ref(false)
const isAiBusy = ref(false)
const aiError = ref('')
const semanticResults = ref<SearchResult[]>([])
let extractorPromise: Promise<EmbeddingExtractor> | null = null
let aiSearchTimer: ReturnType<typeof setTimeout> | null = null
let latestAiRequestId = 0

const recentSearches = ref([
  { id: 1, query: 'ESG Report 2025' },
  { id: 2, query: 'OA Contract' },
  { id: 3, query: 'Competency Framework' },
  { id: 4, query: 'DCH AI Training Material' },
])

const allResults = ref<SearchResult[]>([
  {
    id: 1,
    title: 'ESG Report 2025',
    description: 'Environmental, social and governance performance report, sustainability goals, and annual disclosure materials.',
    keywords: ['esg', 'sustainability', 'report', 'environment', 'governance'],
  },
  {
    id: 2,
    title: 'OA Contract Approval Guide',
    description: 'Workflow instructions for contract submission, legal review, approval routing, and archived OA records.',
    keywords: ['oa', 'contract', 'approval', 'legal', 'workflow'],
  },
  {
    id: 3,
    title: 'Competency Framework',
    description: 'Role expectations, skill levels, leadership behaviours, and performance development criteria for employees.',
    keywords: ['competency', 'performance', 'skills', 'career', 'employee'],
  },
  {
    id: 4,
    title: 'DCH AI Training Material',
    description: 'Internal AI learning resources covering prompt writing, productivity scenarios, governance, and responsible usage.',
    keywords: ['ai', 'training', 'prompt', 'productivity', 'governance'],
  },
  {
    id: 5,
    title: 'Annual Leave Policy',
    description: 'Human resources policy for leave balance, holiday application, manager approval, and payroll cut-off dates.',
    keywords: ['hr', 'leave', 'holiday', 'payroll', 'manager'],
  },
  {
    id: 6,
    title: 'IT Service Desk',
    description: 'Support channel for laptop setup, account access, password reset, system incidents, and software requests.',
    keywords: ['it', 'support', 'service', 'password', 'software'],
  },
  {
    id: 7,
    title: 'Procurement Approval Matrix',
    description: 'Purchasing thresholds, budget owner rules, vendor onboarding, quotation requirements, and finance approval levels.',
    keywords: ['procurement', 'purchase', 'vendor', 'finance', 'budget'],
  },
  {
    id: 8,
    title: 'Staff Directory',
    description: 'Employee contacts, department information, office location, reporting line, and business unit details.',
    keywords: ['staff', 'employee', 'contact', 'department', 'directory'],
  },
])

const normalizedSearchQuery = computed(() => searchQuery.value.trim())

const keywordResults = computed(() => {
  const query = normalizedSearchQuery.value.toLowerCase()
  if (!query) return []

  const terms = query.split(/\s+/).filter(Boolean)
  return allResults.value
    .map((result) => {
      const title = result.title.toLowerCase()
      const description = result.description.toLowerCase()
      const keywords = result.keywords.join(' ').toLowerCase()
      const score = terms.reduce((total, term) => {
        if (title.includes(term)) return total + 4
        if (keywords.includes(term)) return total + 3
        if (description.includes(term)) return total + 1
        return total
      }, 0)

      return { result, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result)
})

const displayedResults = computed(() => {
  if (isAiMode.value && semanticResults.value.length > 0) {
    return semanticResults.value
  }

  return keywordResults.value
})

const aiButtonLabel = computed(() => {
  if (isAiBusy.value) return '...'
  return isAiMode.value ? 'AI' : 'AI'
})

const aiStatusMessage = computed(() => {
  if (aiError.value) return aiError.value
  if (isAiBusy.value) return 'AI semantic search is loading locally...'
  if (isAiMode.value && semanticResults.value.length > 0) return `AI semantic ranking by ${AI_MODEL}`
  return ''
})

const handleSearch = () => {
  if (isAiMode.value) {
    scheduleAiSearch()
  }
}

const selectRecent = (query: string) => {
  searchQuery.value = query
}

const handleResultClick = (result: SearchResult) => {
  console.log('Result clicked:', result.title)
}

const getExtractor = async () => {
  if (!import.meta.client) {
    throw new Error('AI search only runs in the browser.')
  }

  if (!extractorPromise) {
    extractorPromise = import('@huggingface/transformers').then(async (module) => {
      const transformers = module as unknown as TransformersModule

      if (transformers.env) {
        transformers.env.allowLocalModels = false
        transformers.env.useBrowserCache = true
      }

      return transformers.pipeline('feature-extraction', AI_MODEL)
    })
  }

  return extractorPromise
}

const createQueryInput = (query: string) => `query: ${query}`

const createPassageInput = (result: SearchResult) => (
  `passage: ${result.title}. ${result.description}. ${result.keywords.join(', ')}`
)

const getVector = async (extractor: EmbeddingExtractor, input: string) => {
  const output = await extractor(input, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

const getVectors = async (extractor: EmbeddingExtractor, input: string[]) => {
  const output = await extractor(input, { pooling: 'mean', normalize: true })
  const dims = output.dims || []
  const itemCount = dims[0] || input.length
  const vectorSize = dims[1] || Math.floor(output.data.length / itemCount)
  const data = Array.from(output.data)
  const vectors: number[][] = []

  for (let index = 0; index < itemCount; index += 1) {
    const start = index * vectorSize
    vectors.push(data.slice(start, start + vectorSize))
  }

  return vectors
}

const dotProduct = (left: number[], right: number[]) => (
  left.reduce((total, value, index) => total + value * (right[index] || 0), 0)
)

const performAiSearch = async () => {
  const query = normalizedSearchQuery.value
  if (!query) return

  const requestId = latestAiRequestId + 1
  latestAiRequestId = requestId
  isAiMode.value = true
  isAiBusy.value = true
  aiError.value = ''

  try {
    const extractor = await getExtractor()
    const queryVector = await getVector(extractor, createQueryInput(query))
    const resultVectors = await getVectors(extractor, allResults.value.map(createPassageInput))

    if (requestId !== latestAiRequestId || query !== normalizedSearchQuery.value) return

    semanticResults.value = allResults.value
      .map((result, index) => ({
        ...result,
        aiScore: dotProduct(queryVector, resultVectors[index] || []),
      }))
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
  }
  catch (error) {
    if (requestId !== latestAiRequestId) return

    console.error(error)
    aiError.value = 'AI search failed to load. Showing keyword results instead.'
    semanticResults.value = []
    isAiMode.value = false
  }
  finally {
    if (requestId === latestAiRequestId) {
      isAiBusy.value = false
    }
  }
}

const scheduleAiSearch = () => {
  if (aiSearchTimer) {
    clearTimeout(aiSearchTimer)
  }

  aiSearchTimer = setTimeout(() => {
    void performAiSearch()
  }, 350)
}

const runAiSearch = () => {
  void performAiSearch()
}

watch(normalizedSearchQuery, (query) => {
  aiError.value = ''

  if (!query) {
    semanticResults.value = []
    isAiMode.value = false
    return
  }

  if (isAiMode.value) {
    scheduleAiSearch()
  }
})

onBeforeUnmount(() => {
  if (aiSearchTimer) {
    clearTimeout(aiSearchTimer)
  }
})
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
  display: flex;
  justify-content: space-between;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  width: 100%;
  margin-right: 8px;
  background: #F5F5F5;
  border: none;
  border-radius: 8px;
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
  width: 56px;
  height: 39px;
  background: #A60A3A26;
  color: #A60A3A;
  border: none;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}

.search-bar__ai-btn--active {
  background: #A60A3A;
  color: #FFFFFF;
}

.search-bar__ai-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
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

.ai-status {
  padding: 10px 16px;
  background: #FFF7FA;
  color: #A60A3A;
  font-size: 12px;
  line-height: 1.4;
  border-bottom: 1px solid #F0D8E1;
}

.ai-status--error {
  background: #FFF6F4;
  color: #B42318;
  border-bottom-color: #F6D4CF;
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

.result-item__topline {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.result-item__title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #A60A3A;
  margin-bottom: 6px;
}

.result-item__score {
  flex-shrink: 0;
  min-width: 42px;
  padding: 3px 6px;
  border-radius: 8px;
  background: #F7E7ED;
  color: #A60A3A;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
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
