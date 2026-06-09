<template>
  <div class="mobile-services">
    <section class="mobile-services__header">
      <h1 class="mobile-services__title">
        {{ t('mobile.services.titlePlural') }}
      </h1>
      <div class="mobile-services__mode">
        <button
          v-for="option in modeOptions"
          :key="option.value"
          type="button"
          :class="['mobile-services__mode-btn', { 'is-active': activeMode === option.value }]"
          @click="activeMode = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </section>

    <section class="mobile-services__toolbar">
      <label class="mobile-services__search">
        <IconCustom
          name="search"
          :size="18"
        />
        <input
          v-model="searchKeyword"
          type="search"
          :placeholder="t('mobile.applications.navigator.searchPlaceholder')"
        >
      </label>
      <button
        type="button"
        class="mobile-services__filter"
        :aria-label="t('mobile.services.filterAriaLabel')"
        @click="showTopicFilters = !showTopicFilters"
      >
        <IconCustom
          name="filterIcon"
          :size="17"
        />
      </button>
    </section>

    <section
      v-if="activeMode === 'topic' && showTopicFilters"
      class="mobile-services__filters"
    >
      <div class="filter-row">
        <div class="filter-row__label">
          {{ t('mobile.services.filters.region') }}
        </div>
        <div class="filter-row__chips">
          <button
            v-for="region in regions"
            :key="region.value"
            type="button"
            :class="['filter-chip', { 'is-active': selectedRegion === region.value }]"
            @click="selectedRegion = region.value"
          >
            {{ region.label }}
          </button>
        </div>
      </div>
      <div class="filter-row">
        <div class="filter-row__label">
          {{ t('mobile.services.filters.serviceType') }}
        </div>
        <div class="filter-row__chips">
          <button
            v-for="type in serviceTypes"
            :key="type.value"
            type="button"
            :class="['filter-chip', { 'is-active': selectedServiceType === type.value }]"
            @click="selectedServiceType = type.value"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
      <div class="filter-row">
        <div class="filter-row__label">
          {{ t('mobile.services.filters.topic') }}
        </div>
        <div class="filter-row__chips">
          <button
            v-for="option in topicChips"
            :key="option.id"
            type="button"
            :class="['filter-chip', { 'is-active': activeChipId === option.id }]"
            @click="activeChipId = option.id"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <section
      v-if="activeMode !== 'topic'"
      class="mobile-services__chips"
    >
      <button
        v-for="option in activeChips"
        :key="option.id"
        type="button"
        :class="['filter-chip', { 'is-active': activeChipId === option.id }]"
        @click="activeChipId = option.id"
      >
        {{ option.label }}
      </button>
    </section>

    <section class="mobile-services__content">
      <div
        v-if="visibleGroups.length === 0"
        class="mobile-services__state"
      >
        {{ t('mobile.applications.navigator.empty') }}
      </div>

      <article
        v-for="group in visibleGroups"
        v-else
        :key="group.id"
        class="service-group"
      >
        <button
          type="button"
          class="service-group__header"
          :aria-label="isGroupExpanded(group.id) ? t('mobile.services.actions.collapse') : t('mobile.services.actions.expand')"
          :aria-expanded="isGroupExpanded(group.id)"
          @click="toggleGroup(group.id)"
        >
          <span class="service-group__icon">
            <IconCustom
              :name="group.icon"
              :size="20"
            />
          </span>
          <span class="service-group__copy">
            <strong>{{ group.title }}</strong>
            <span>{{ group.description }}</span>
          </span>
          <span class="service-group__count">
            {{ group.items.length }}
          </span>
          <IconCustom
            name="chevron-right"
            :size="16"
            color="#b7bec8"
            :rotate="isGroupExpanded(group.id) ? -90 : 90"
          />
        </button>

        <div
          v-if="isGroupExpanded(group.id)"
          class="service-group__items"
        >
          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            class="service-item"
            @click="handleServiceClick(item)"
          >
            <span class="service-item__icon">
              <IconCustom
                :name="item.icon"
                :size="17"
              />
            </span>
            <span class="service-item__copy">
              <strong>{{ item.name }}</strong>
              <span class="service-item__badges">
                <span>{{ item.badge }}</span>
                <span>{{ formatRegions(item.regions) }}</span>
                <span v-if="item.processGroups.length > 0">
                  {{ formatProcessGroups(item.processGroups) }}
                </span>
              </span>
            </span>
            <IconCustom
              name="chevron-right"
              :size="15"
              color="#c4cbd5"
            />
          </button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type {
  ServiceGroup,
  ServiceItem,
  TioTopic,
  TioTopicItem,
} from '~/types/tiopsServices'

type ServiceMode = 'topic' | 'process'

type ChipOption = {
  id: string
  label: string
}

const { t, locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const activeMode = ref<ServiceMode>('topic')
const activeChipId = ref('all')
const searchKeyword = ref('')
const selectedRegion = ref('all')
const selectedServiceType = ref('all')
const showTopicFilters = ref(false)
const expandedGroupIds = ref<Set<string>>(new Set())

const serviceTopics: TioTopic[] = [
  {
    category_en: 'IT and System Support',
    category_sc: 'IT与系统支持',
    category_tc: 'IT與系統支持',
    icon_x86: 'server',
    items: [
      {
        name_en: 'Report an Issue',
        name_sc: '报告问题',
        name_tc: '報告問題',
        icon_x86: 'bug',
        desktop_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=3f1dd0320a0a0b99000a53f7604a2ef9&sysparm_category=af9c65c9db7951908e9ddf0bd3961975',
        mobile_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=3f1dd0320a0a0b99000a53f7604a2ef9&sysparm_category=af9c65c9db7951908e9ddf0bd3961975',
        region: ['hk'],
        service_type: 'workflow',
        process_group: ['Staff Onboarding', 'Staff Offboarding'],
      },
      {
        name_en: 'Open a Service Request',
        name_sc: '一般 IT 服务和应用程式请求',
        name_tc: '一般 IT 服務和應用程式請求',
        icon_x86: 'service',
        desktop_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=ea6aef15db3d91908e9ddf0bd3961922&sysparm_category=22c62651db7991908e9ddf0bd39619d2',
        mobile_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=ea6aef15db3d91908e9ddf0bd3961922&sysparm_category=22c62651db7991908e9ddf0bd39619d2',
        region: ['hk'],
        service_type: 'workflow',
        process_group: ['Staff Onboarding', 'Staff Offboarding'],
      },
    ],
  },
  {
    category_en: 'Company and Administration',
    category_sc: '公司与行政',
    category_tc: '公司與行政',
    icon_x86: 'building',
    items: [
      {
        name_en: 'Intranet',
        name_sc: '企业内网',
        name_tc: '企業內聯網',
        icon_x86: 'portal',
        desktop_url: 'http://intranet.dch.com.hk/',
        mobile_url: 'http://intranet.dch.com.hk/',
        region: ['hk'],
        service_type: 'portal',
        process_group: ['Staff Onboarding'],
      },
      {
        name_en: 'Policy Documents',
        name_sc: '政策文件',
        name_tc: '政策文件',
        icon_x86: 'policy',
        desktop_url: 'https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233',
        mobile_url: 'https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233',
        region: ['hk', 'cn', 'sea'],
        service_type: 'knowledge',
        process_group: ['Staff Onboarding'],
      },
    ],
  },
  {
    category_en: 'Learning and Policy',
    category_sc: '学习与政策',
    category_tc: '學習與政策',
    icon_x86: 'book',
    items: [
      {
        name_en: 'Learning Management System',
        name_sc: '学习管理系统',
        name_tc: '學習管理系統',
        icon_x86: 'learning',
        desktop_url: '',
        mobile_url: '',
        region: ['hk'],
        service_type: 'application',
        process_group: ['Staff Onboarding'],
      },
    ],
  },
  {
    category_en: 'Contracts and Compliance',
    category_sc: '合同与合规',
    category_tc: '合同與合規',
    icon_x86: 'shield',
    items: [
      {
        name_en: 'Contracts Approval Submission',
        name_sc: '合约审批提交',
        name_tc: '合約審批提交',
        icon_x86: 'contract',
        desktop_url: 'https://platform-uat.dchbi.app/spa/workflow/static4form/index.html#/main/workflow/req?iscreate=1&workflowid=213',
        mobile_url: 'https://platform-uat.dchbi.app/spa/workflow/static4form/index.html#/main/workflow/req?iscreate=1&workflowid=213',
        region: ['hk'],
        service_type: 'workflow',
        process_group: ['Contract Clearance'],
      },
      {
        name_en: 'Contract List',
        name_sc: '合同清单',
        name_tc: '合約清單',
        icon_x86: 'list',
        desktop_url: 'https://platform-uat.dchbi.app/spa/cube/index.html#/main/cube/search?customid=542',
        mobile_url: 'https://platform-uat.dchbi.app/wui/cas-entrance.jsp?path=https://platform-uat.dchbi.app/mobilemode/mobile/view.html?appHomepageId=1',
        region: ['hk'],
        service_type: 'record',
        process_group: ['Contract Clearance'],
      },
      {
        name_en: 'Policies and Guidelines',
        name_sc: '政策及指引',
        name_tc: '政策及指引',
        icon_x86: 'guideline',
        desktop_url: '',
        mobile_url: '',
        region: ['hk'],
        service_type: 'knowledge',
        process_group: ['Contract Clearance'],
      },
      {
        name_en: 'Contract Templates &Playbooks',
        name_sc: '合约范本及指引',
        name_tc: '合約範本及指引',
        icon_x86: 'reference',
        desktop_url: '',
        mobile_url: '',
        region: ['hk'],
        service_type: 'knowledge',
        process_group: ['Contract Clearance'],
      },
    ],
  },
  {
    category_en: 'Employee and HR',
    category_sc: '员工与人事',
    category_tc: '員工與人事',
    icon_x86: 'people',
    items: [
      {
        name_en: 'Leave Management',
        name_sc: '请假管理',
        name_tc: '請假管理',
        icon_x86: 'calendar',
        desktop_url: '',
        mobile_url: '',
        region: ['hk', 'sea'],
        service_type: 'workflow',
        process_group: [],
      },
      {
        name_en: 'Payroll Management',
        name_sc: '薪酬管理',
        name_tc: '薪酬管理',
        icon_x86: 'money',
        desktop_url: '',
        mobile_url: '',
        region: ['hk', 'sea'],
        service_type: 'workflow',
        process_group: [],
      },
      {
        name_en: 'Appraisal Management',
        name_sc: '绩效考核管理',
        name_tc: '績效評核管理',
        icon_x86: 'chart',
        desktop_url: '',
        mobile_url: '',
        region: ['hk', 'sea'],
        service_type: 'workflow',
        process_group: ['Staff Offboarding'],
      },
    ],
  },
  {
    category_en: 'Finance and Reimbursement',
    category_sc: '财务与报销',
    category_tc: '財務與報銷',
    icon_x86: 'wallet',
    items: [
      {
        name_en: 'Travel Request',
        name_sc: '差旅申请',
        name_tc: '差旅申請',
        icon_x86: 'travel',
        desktop_url: '',
        mobile_url: '',
        region: ['hk', 'sea'],
        service_type: 'workflow',
        process_group: ['Business Trip Reimbursement'],
      },
      {
        name_en: 'Claim Request',
        name_sc: '报销申请',
        name_tc: '報銷申請',
        icon_x86: 'receipt',
        desktop_url: '',
        mobile_url: '',
        region: ['hk', 'sea'],
        service_type: 'workflow',
        process_group: ['Business Trip Reimbursement'],
      },
      {
        name_en: 'Entertainment Request',
        name_sc: '客户招待申请',
        name_tc: '客戶招待申請',
        icon_x86: 'coffee',
        desktop_url: '',
        mobile_url: '',
        region: ['hk', 'sea'],
        service_type: 'workflow',
        process_group: ['Business Trip Reimbursement'],
      },
    ],
  },
  {
    category_en: 'Projects and Assets',
    category_sc: '项目与资产',
    category_tc: '項目與資產',
    icon_x86: 'rocket',
    items: [],
  },
  {
    category_en: 'Reports and Data',
    category_sc: '报表与数据',
    category_tc: '報表與數據',
    icon_x86: 'report',
    items: [],
  },
]

const modeOptions = computed(() => [
  { value: 'topic' as const, label: t('mobile.services.modes.topic') },
  { value: 'process' as const, label: t('mobile.services.modes.process') },
])

const regions = computed(() => [
  { value: 'all', label: t('mobile.services.filters.all') },
  { value: 'hk', label: 'HK' },
  { value: 'sea', label: 'SEA' },
  { value: 'cn', label: 'CN' },
])

const serviceTypes = computed(() => [
  { value: 'all', label: t('mobile.services.filters.all') },
  { value: 'workflow', label: t('mobile.services.serviceTypes.workflow') },
  { value: 'portal', label: t('mobile.services.serviceTypes.portal') },
  { value: 'knowledge', label: t('mobile.services.serviceTypes.knowledge') },
  { value: 'application', label: t('mobile.services.serviceTypes.application') },
  { value: 'record', label: t('mobile.services.serviceTypes.record') },
])

const processGroupConfig: Record<string, { id: string, labelKey: string, icon: string }> = {
  'Staff Onboarding': {
    id: 'staff-onboarding',
    labelKey: 'mobile.services.processes.staffOnboarding',
    icon: 'service-briefcase',
  },
  'Staff Offboarding': {
    id: 'staff-offboarding',
    labelKey: 'mobile.services.processes.staffOffBoarding',
    icon: 'service-briefcase',
  },
  'Business Trip Reimbursement': {
    id: 'business-trip-reimbursement',
    labelKey: 'mobile.services.processes.businessTripReimbursement',
    icon: 'wallet',
  },
  'Contract Clearance': {
    id: 'contract-clearance',
    labelKey: 'mobile.services.processes.contractClearance',
    icon: 'legal-compliance',
  },
}

const normalizeString = (value: string) => value.trim()

const slugify = (value: string) => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const getTopicName = (topic: TioTopic) => {
  if (locale.value === 'zh-CN') {
    return topic.category_sc || topic.category_en || topic.category_tc
  }

  if (locale.value === 'zh-TW') {
    return topic.category_tc || topic.category_en || topic.category_sc
  }

  return topic.category_en || topic.category_sc || topic.category_tc
}

const getItemName = (item: TioTopicItem) => {
  if (locale.value === 'zh-CN') {
    return item.name_sc || item.name_en || item.name_tc
  }

  if (locale.value === 'zh-TW') {
    return item.name_tc || item.name_en || item.name_sc
  }

  return item.name_en || item.name_sc || item.name_tc
}

const getServiceTypeLabel = (type: string) => {
  return serviceTypes.value.find(option => option.value === type)?.label || type
}

const getProcessGroupId = (processGroup: string) => {
  return processGroupConfig[processGroup]?.id || slugify(processGroup)
}

const getProcessGroupLabel = (processGroup: string) => {
  const labelKey = processGroupConfig[processGroup]?.labelKey

  return labelKey ? t(labelKey) : processGroup
}

const getProcessGroupIcon = (processGroup: string) => {
  return processGroupConfig[processGroup]?.icon || 'service-briefcase'
}

const formatRegions = (regions: string[]) => {
  return regions.map(region => region.toUpperCase()).join(',')
}

const formatProcessGroups = (processGroups: string[]) => {
  return processGroups.map(processGroup => getProcessGroupLabel(processGroup)).join(', ')
}

const createServiceItem = (item: TioTopicItem, groupId: string): ServiceItem => ({
  id: `${slugify(groupId)}:${slugify(item.name_en)}`,
  name: getItemName(item),
  badge: getServiceTypeLabel(item.service_type),
  icon: item.icon_x86,
  type: item.service_type,
  regions: item.region,
  processGroups: item.process_group,
  url: item.mobile_url,
  mobileUrl: item.mobile_url,
  desktopUrl: item.desktop_url,
})

const createTopicGroup = (topic: TioTopic): ServiceGroup => ({
  id: slugify(topic.category_en),
  title: getTopicName(topic),
  description: topic.items.map(item => getItemName(item)).join(' · '),
  business: topic.category_en,
  icon: topic.icon_x86,
  color: '#a60a3a',
  items: topic.items.map(item => createServiceItem(item, topic.category_en)),
})

const topicGroups = computed(() => serviceTopics.map(topic => createTopicGroup(topic)))

const processGroups = computed<ServiceGroup[]>(() => {
  const groups = new Map<string, TioTopicItem[]>()

  serviceTopics.forEach((topic) => {
    topic.items.forEach((item) => {
      if (item.process_group.length === 0) {
        return
      }

      item.process_group.forEach((processGroup) => {
        groups.set(processGroup, [...(groups.get(processGroup) || []), item])
      })
    })
  })

  return [...groups.entries()].map(([processGroup, items]) => ({
    id: getProcessGroupId(processGroup),
    title: getProcessGroupLabel(processGroup),
    description: items.map(item => getItemName(item)).join(' · '),
    business: processGroup,
    icon: getProcessGroupIcon(processGroup),
    color: '#a60a3a',
    items: items.map(item => createServiceItem(item, processGroup)),
  }))
})

const topicChips = computed<ChipOption[]>(() => [
  { id: 'all', label: t('mobile.applications.navigator.allTopics') },
  ...topicGroups.value.map(group => ({
    id: group.id,
    label: group.title,
  })),
])

const processChips = computed<ChipOption[]>(() => [
  { id: 'all', label: t('mobile.services.processes.all') },
  ...processGroups.value.map(group => ({
    id: group.id,
    label: group.title,
  })),
])

const activeChips = computed(() => activeMode.value === 'topic' ? topicChips.value : processChips.value)

const sourceGroups = computed(() => activeMode.value === 'topic' ? topicGroups.value : processGroups.value)

const visibleGroups = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return sourceGroups.value
    .filter(group => activeChipId.value === 'all' || group.id === activeChipId.value)
    .map((group) => {
      const items = group.items.filter((item) => {
        if (selectedRegion.value !== 'all' && !item.regions.includes(selectedRegion.value)) {
          return false
        }

        if (selectedServiceType.value !== 'all' && item.type !== selectedServiceType.value) {
          return false
        }

        if (keyword) {
          return [
            item.name,
            item.badge,
            formatProcessGroups(item.processGroups),
            formatRegions(item.regions),
            group.title,
            group.description,
          ].some(value => value.toLowerCase().includes(keyword))
        }

        return true
      })

      return {
        ...group,
        items,
      }
    })
    .filter((group) => {
      if (group.items.length > 0) {
        return true
      }

      return activeMode.value === 'topic'
        && !keyword
        && selectedRegion.value === 'all'
        && selectedServiceType.value === 'all'
    })
})

const isGroupExpanded = (groupId: string) => expandedGroupIds.value.has(groupId)

const toggleGroup = (groupId: string) => {
  const nextGroups = new Set(expandedGroupIds.value)

  if (nextGroups.has(groupId)) {
    nextGroups.delete(groupId)
  }
  else {
    nextGroups.add(groupId)
  }

  expandedGroupIds.value = nextGroups
}

const handleServiceClick = (item: ServiceItem) => {
  if (!item.mobileUrl) {
    return
  }

  void openGuardedUrl(item.mobileUrl, '_blank')
}

watch(activeMode, () => {
  activeChipId.value = 'all'
  selectedRegion.value = 'all'
  selectedServiceType.value = 'all'
})

watch(
  visibleGroups,
  (groups) => {
    const availableGroupIds = new Set(groups.map(group => group.id))
    expandedGroupIds.value = new Set([...expandedGroupIds.value].filter(groupId => availableGroupIds.has(groupId)))
  },
  { immediate: true },
)
</script>

<style scoped>
.mobile-services {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f4f5f7;
  color: #202124;
  font-family: var(--font-source-sans-pro);
}

.mobile-services button,
.mobile-services input {
  font-family: inherit;
}

.mobile-services__header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 16px 10px;
  background: #ffffff;
  border-bottom: 1px solid #eff1f4;
}

.mobile-services__title {
  margin: 0;
  color: #202124;
  font-size: 23px;
  font-weight: 800;
  line-height: 1;
}

.mobile-services__mode {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 31px;
  padding: 2px;
  border: 1px solid #efd6df;
  border-radius: 999px;
  background: #ffffff;
}

.mobile-services__mode-btn {
  min-width: 64px;
  height: 25px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #8b8f98;
  font-size: 12px;
  font-weight: 800;
}

.mobile-services__mode-btn.is-active {
  background: #f9dfe8;
  color: #a60a3a;
}

.mobile-services__toolbar {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px;
  gap: 9px;
  padding: 11px 16px 8px;
  background: #ffffff;
}

.mobile-services__search {
  min-width: 0;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 9px;
  border: 1px solid #eceff3;
  border-radius: 8px;
  background: #ffffff;
  color: #8b95a1;
  box-shadow: 0 2px 7px rgba(16, 24, 40, 0.04);
}

.mobile-services__search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #242424;
  font-size: 12px;
  font-weight: 700;
  line-height: 38px;
}

.mobile-services__search input::placeholder {
  color: #98a0aa;
}

.mobile-services__filter {
  width: 38px;
  height: 38px;
  border: 1px solid #f0d7df;
  border-radius: 10px;
  background: #ffffff;
  color: #a60a3a;
  box-shadow: 0 2px 7px rgba(16, 24, 40, 0.04);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-services__filters {
  flex: 0 0 auto;
  padding: 9px 16px 8px;
  border-bottom: 1px solid #eceff3;
  background: #ffffff;
}

.filter-row+.filter-row {
  margin-top: 9px;
}

.filter-row__label {
  margin-bottom: 7px;
  color: #3f4650;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
}

.filter-row__chips,
.mobile-services__chips {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scroll-padding: 0 16px;
  scrollbar-width: none;
}

.filter-row__chips::-webkit-scrollbar,
.mobile-services__chips::-webkit-scrollbar {
  display: none;
}

.mobile-services__chips {
  flex: 0 0 auto;
  padding: 8px 16px 9px;
  background: #ffffff;
  border-bottom: 1px solid #eceff3;
}

.filter-chip {
  flex: 0 0 auto;
  height: 28px;
  max-width: 178px;
  padding: 0 13px;
  border: 1px solid #e4e8ee;
  border-radius: 999px;
  background: #ffffff;
  color: #4a515c;
  font-size: 12px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-chip.is-active {
  border-color: #e8b7c8;
  background: #fff1f5;
  color: #a60a3a;
}

.mobile-services__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 8px calc(14px + env(safe-area-inset-bottom));
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mobile-services__content::-webkit-scrollbar {
  display: none;
}

.mobile-services__state {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7a8490;
  font-size: 14px;
  font-weight: 700;
}

.service-group {
  border: 1px solid #ebedf1;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 3px 10px rgba(16, 24, 40, 0.06);
}

.service-group__header {
  width: 100%;
  min-height: 58px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto 16px;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 0;
  border-radius: 10px 10px 0 0;
  background: #ffffff;
  text-align: left;
}

.service-group__icon,
.service-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a60a3a;
}

.service-group__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #fbe4ec;
}

.service-group__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-group__copy strong {
  overflow: hidden;
  color: #262a30;
  font-size: 15px;
  font-weight: 900;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-group__copy span {
  overflow: hidden;
  color: #8a929e;
  font-size: 10px;
  font-weight: 800;
  line-height: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-group__count {
  min-width: 29px;
  height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  background: #fce3ec;
  color: #c03867;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
}

.service-group__items {
  border-top: 1px solid #f0f2f5;
  border-radius: 0 0 10px 10px;
  background: #ffffff;
}

.service-item {
  width: 100%;
  min-height: 52px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 15px;
  align-items: center;
  gap: 9px;
  padding: 7px 12px;
  border: 0;
  border-bottom: 1px solid #f0f2f5;
  background: #ffffff;
  text-align: left;
}

.service-item:last-child {
  border-bottom: 0;
}

.service-item__icon {
  width: 30px;
  height: 30px;
  border: 1px solid #f3d7e1;
  border-radius: 9px;
  background: #ffffff;
}

.service-item__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-item__copy strong {
  overflow: hidden;
  color: #30343a;
  font-size: 13px;
  font-weight: 900;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-item__badges {
  display: flex;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}

.service-item__badges span {
  flex: 0 1 auto;
  overflow: hidden;
  padding: 1px 7px;
  border: 1px solid #e3e8ef;
  border-radius: 999px;
  color: #8c95a2;
  font-size: 9px;
  font-weight: 900;
  line-height: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
