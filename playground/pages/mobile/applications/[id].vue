<script setup lang="ts">
import type { ApplicationDepartment } from '~/composables/useApplicationCatalog'
import { getApplicationDepartmentBySlug } from '~/composables/useApplicationCatalog'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const route = useRoute()
const activeTab = useState<number>('mobile:activeTab', () => 3)

const departmentSlug = computed(() => String(route.params.id || ''))
const department = computed<ApplicationDepartment | null>(() => getApplicationDepartmentBySlug(departmentSlug.value))
const selectedRegion = ref('CN')
const openGroups = ref<string[]>(['forms', 'data'])

const visibleGroups = computed(() => {
  if (!department.value) {
    return []
  }

  return department.value.groups.map((group) => ({
    ...group,
    filteredItems: group.items.filter((item) => item.regions.includes(selectedRegion.value)),
  }))
})

const isGroupOpen = (groupId: string) => openGroups.value.includes(groupId)

const toggleGroup = (groupId: string) => {
  if (isGroupOpen(groupId)) {
    openGroups.value = openGroups.value.filter((id) => id !== groupId)
    return
  }

  openGroups.value = [...openGroups.value, groupId]
}

const handleBack = () => {
  activeTab.value = 3
  return navigateTo('/mobile')
}

const handleItemClick = (itemName: string) => {
  console.log('Application item clicked:', itemName)
}

watch(
  department,
  (value) => {
    if (value?.regions?.length) {
      selectedRegion.value = value.regions[0]
    }
  },
  { immediate: true },
)

onMounted(() => {
  activeTab.value = 3
})
</script>

<template>
  <div v-if="department" class="mobile-app-detail">
    <div class="mobile-app-detail__breadcrumb">
      <button type="button" class="mobile-app-detail__back" @click="handleBack">
        <IconCustom name="chevron-right" :size="16" :rotate="180" color="#A60A3A" />
        <span>Applications</span>
      </button>
    </div>

    <section class="mobile-app-detail__hero">
      <div class="mobile-app-detail__icon" :style="{ color: department.color }">
        <IconCustom :name="department.icon" :size="48" />
      </div>
      <h1 class="mobile-app-detail__title">{{ department.name }}</h1>
      <p class="mobile-app-detail__description">{{ department.description }}</p>
      <button type="button" class="mobile-app-detail__intranet" :style="{ color: department.color }">
        {{ department.intranetLabel }} &gt;
      </button>
    </section>

    <section class="mobile-app-detail__regions">
      <button
        v-for="region in department.regions"
        :key="region"
        type="button"
        :class="['mobile-app-detail__region-btn', { active: selectedRegion === region }]"
        @click="selectedRegion = region"
      >
        {{ region }}
      </button>
    </section>

    <section
      v-for="group in visibleGroups"
      :key="group.id"
      class="mobile-app-detail__group"
    >
      <button
        type="button"
        class="mobile-app-detail__group-header"
        @click="toggleGroup(group.id)"
      >
        <span>{{ group.title }} ({{ group.filteredItems.length }})</span>
        <IconCustom
          name="chevron-right"
          :size="16"
          color="#171717"
          :rotate="isGroupOpen(group.id) ? -90 : 90"
        />
      </button>

      <div v-show="isGroupOpen(group.id)" class="mobile-app-detail__group-list">
        <button
          v-for="item in group.filteredItems"
          :key="item.id"
          type="button"
          class="mobile-app-detail__item"
          @click="handleItemClick(item.name)"
        >
          <div class="mobile-app-detail__item-info">
            <div class="mobile-app-detail__item-name">{{ item.name }}</div>
            <div class="mobile-app-detail__item-type">{{ item.type }}</div>
          </div>
          <IconCustom name="chevron-right" :size="18" color="#A60A3A" />
        </button>
      </div>
    </section>
  </div>

  <div v-else class="mobile-app-detail__empty">
    <p class="mobile-app-detail__empty-title">Application group not found</p>
    <button type="button" class="mobile-app-detail__empty-back" @click="handleBack">Back to Applications</button>
  </div>
</template>

<style scoped>
.mobile-app-detail {
  height: 100%;
  overflow-y: auto;
  background: #f7f7f7;
}

.mobile-app-detail__breadcrumb {
  padding: 14px 16px 10px;
  background: #ffffff;
  border-bottom: 1px solid #ededed;
}

.mobile-app-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 16px;
  color: #a60a3a;
}

.mobile-app-detail__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26px 20px 22px;
  background: #ffffff;
  text-align: center;
}

.mobile-app-detail__icon {
  margin-bottom: 12px;
}

.mobile-app-detail__title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #111111;
}

.mobile-app-detail__description {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #666666;
}

.mobile-app-detail__intranet {
  border: 0;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
}

.mobile-app-detail__regions {
  display: flex;
  gap: 4px;
  margin: 14px 16px 12px;
  padding: 4px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(217, 217, 217, 0.65);
}

.mobile-app-detail__region-btn {
  flex: 1;
  min-height: 40px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #171717;
}

.mobile-app-detail__region-btn.active {
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: #ffffff;
}

.mobile-app-detail__group {
  margin-bottom: 10px;
  background: #ffffff;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}

.mobile-app-detail__group-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  border: 0;
  background: #ffffff;
  font-size: 16px;
  font-weight: 700;
  color: #161616;
}

.mobile-app-detail__group-list {
  background: #ffffff;
}

.mobile-app-detail__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 0;
  border-top: 1px solid #ececec;
  background: #ffffff;
  text-align: left;
}

.mobile-app-detail__item-info {
  min-width: 0;
  flex: 1;
}

.mobile-app-detail__item-name {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  color: #171717;
}

.mobile-app-detail__item-type {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.4;
  color: #8b8b8b;
}

.mobile-app-detail__empty {
  height: 100%;
  padding: 48px 20px;
  overflow-y: auto;
  background: #ffffff;
  text-align: center;
}

.mobile-app-detail__empty-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #333333;
}

.mobile-app-detail__empty-back {
  border: 0;
  background: transparent;
  color: #a60a3a;
  font-size: 14px;
  font-weight: 600;
}
</style>
