<script setup>
definePageMeta({ layout: 'desktop', middleware: 'auth' })

const searchQuery = ref('')
const selectedRegion = ref('HK/SEA')
const selectedGrouping = ref('By BU / Department')

const regions = ['HK/SEA', 'China', 'ASEAN']
const groupings = ['By BU / Department', 'By Category', 'By Type']

const departments = [
  {
    id: 'dt',
    name: 'Digital & Technology',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
    color: '#4a90d9',
    intranetLabel: 'Group IT Intranet',
    apps: [
      { name: 'Staff Onboarding IT Service', type: 'Weaver Process' },
      { name: 'IT Demand Creation', type: 'Weaver Process Form' },
      { name: 'IT Project Change Submission', type: 'Weaver Process Form' },
      { name: 'IT Project Creation', type: 'Weaver Process Form' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
    color: '#26a69a',
    intranetLabel: 'Group Finance Intranet',
    apps: [
      { name: 'Bounced Cheque Record', type: 'Weaver Process Form' },
      { name: 'Bounced Cheque Refund Application', type: 'Weaver Process Form' },
      { name: 'TBC', type: 'Redirect to []' },
      { name: 'Bounced Cheque Data List', type: 'Weaver Data' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
    color: '#b06080',
    intranetLabel: 'Group Legal Intranet',
    apps: [
      { name: 'Dispute Submission', type: 'Weaver Process Form' },
      { name: 'Group Contract Clearance & Approval', type: 'Weaver Process Form' },
      { name: 'Signed Contract Submission (Group...)', type: 'Weaver Process Form' },
      { name: 'Trademark Registration', type: 'Weaver Process Form' },
    ],
  },
]

const filteredDepartments = computed(() => {
  if (!searchQuery.value.trim()) return departments
  const q = searchQuery.value.trim().toLowerCase()
  return departments
    .map((dept) => ({
      ...dept,
      apps: dept.apps.filter(
        (app) => app.name.toLowerCase().includes(q) || app.type.toLowerCase().includes(q),
      ),
    }))
    .filter((dept) => dept.apps.length > 0 || dept.name.toLowerCase().includes(q))
})
</script>

<template>
  <div class="applications">
    <!-- Banner -->
    <div class="applications__banner">
      <span class="applications__banner-title">Applications</span>
    </div>

    <!-- Breadcrumb -->
    <div class="applications__breadcrumb">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/desktop' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Applications</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Search & Filters -->
    <div class="applications__toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Search Applications"
        prefix-icon="Search"
        class="applications__search"
        clearable
        size="default"
      />
      <div class="applications__filters">
        <div class="applications__filter-group">
          <span class="applications__filter-label">Region</span>
          <el-select v-model="selectedRegion" style="width: 140px">
            <el-option v-for="r in regions" :key="r" :label="r" :value="r" />
          </el-select>
        </div>
        <div class="applications__filter-group">
          <span class="applications__filter-label">Grouping</span>
          <el-select v-model="selectedGrouping" style="width: 200px">
            <el-option v-for="g in groupings" :key="g" :label="g" :value="g" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Color Divider -->
    <div class="applications__divider">
      <span style="background: #4a90d9" />
      <span style="background: #26a69a" />
      <span style="background: #b06080" />
    </div>

    <!-- Department Cards -->
    <div class="applications__grid">
      <div v-for="dept in filteredDepartments" :key="dept.id" class="applications__card">
        <!-- Card Header -->
        <div class="applications__card-header">
          <div class="applications__card-icon" :style="{ color: dept.color }">
            <svg v-if="dept.id === 'dt'" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="20" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>
              <path d="M14 32h12M20 28v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              <rect x="8" y="12" width="24" height="12" rx="1" :fill="dept.color" fill-opacity="0.15"/>
            </svg>
            <svg v-else-if="dept.id === 'finance'" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="24" width="6" height="10" rx="1" :fill="dept.color"/>
              <rect x="17" y="16" width="6" height="18" rx="1" :fill="dept.color"/>
              <rect x="28" y="8" width="6" height="26" rx="1" :fill="dept.color"/>
            </svg>
            <svg v-else width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="14" r="7" stroke="currentColor" stroke-width="2.5" fill="none"/>
              <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M26 20h8M26 24h6M26 28h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="applications__card-name">{{ dept.name }}</h3>
          <p class="applications__card-desc">{{ dept.description }}</p>
          <a class="applications__card-link" :style="{ color: dept.color }">
            {{ dept.intranetLabel }} &gt;
          </a>
        </div>

        <!-- App List -->
        <div class="applications__app-list">
          <div
            v-for="app in dept.apps"
            :key="app.name"
            class="applications__app-item"
          >
            <div class="applications__app-info">
              <span class="applications__app-name">{{ app.name }}</span>
              <span class="applications__app-type">{{ app.type }}</span>
            </div>
            <el-icon class="applications__app-arrow"><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="applications__card-footer">
          <a class="applications__view-all" :style="{ color: dept.color }">View All &gt;</a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="applications__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
.applications {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Banner */
.applications__banner {
  height: 320px;
  background: url("../../assets/images/Rectangle\ 2.png") center/cover no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 24px 32px;
  position: relative;
  overflow: hidden;
}

.applications__banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 50%, rgba(30, 100, 200, 0.3) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 30%, rgba(0, 150, 255, 0.2) 0%, transparent 50%);
}

.applications__banner-title {
  position: relative;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

/* Breadcrumb */
.applications__breadcrumb {
  height: 65px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-breadcrumb__inner),
:deep(.el-breadcrumb__separator) {
  font-size: 16px;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #a60a3a;
  font-weight: 600;
}

/* Toolbar */
.applications__toolbar {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 20px 32px;
}

.applications__search {
  width: 220px;
}

.applications__divider {
  display: flex;
  height: 3px;
  margin: 0 32px;
}

.applications__divider span {
  flex: 1;
}

:deep(.applications__search .el-input__inner),
:deep(.applications__search .el-input__placeholder) {
  font-size: 16px !important;
}

:deep(.el-select .el-select__placeholder span),
:deep(.el-select .el-select__selected-item span) {
  font-size: 16px !important;
}

.applications__filters {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.applications__filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.applications__filter-label {
  font-size: 14px;
  color: #888;
  white-space: nowrap;
}

/* Grid */
.applications__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex: 1;
  padding: 0 32px 32px;
}

/* Card */
.applications__card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.applications__card-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.applications__card-icon {
  margin-bottom: 4px;
}

.applications__card-name {
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
}

.applications__card-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.applications__card-link {
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.applications__card-link:hover {
  text-decoration: underline;
}

/* App List */
.applications__app-list {
  flex: 1;
}

.applications__app-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
}

.applications__app-item:hover {
  background: #fafafa;
}

.applications__app-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.applications__app-name {
  font-size: 13px;
  color: #1f2328;
  font-weight: 500;
}

.applications__app-type {
  font-size: 11px;
  color: #999;
}

.applications__app-arrow {
  color: #ccc;
  font-size: 14px;
}

/* Card Footer */
.applications__card-footer {
  padding: 12px 16px;
  text-align: center;
}

.applications__view-all {
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.applications__view-all:hover {
  text-decoration: underline;
}

/* Footer */
.applications__footer {
  background: #8b1a2e;
  color: #fff;
  text-align: center;
  padding: 16px;
  font-size: 13px;
  margin-top: auto;
}
</style>
