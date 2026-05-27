<template>
  <div class="mobile-services">
    <section class="mobile-services__hero">
      <h2 class="mobile-services__title">
        {{ t('mobile.applications.navigator.title') }}
      </h2>
      <div class="mobile-services__stats">
        <div class="mobile-services__stat">
          <strong>{{ topicCount }}</strong>
          <span>{{ t('mobile.applications.navigator.topicCount') }}</span>
        </div>
        <div class="mobile-services__stat">
          <strong>{{ serviceCount }}</strong>
          <span>{{ t('mobile.applications.navigator.serviceCount') }}</span>
        </div>
      </div>
    </section>

    <label class="mobile-services__search">
      <IconCustom
        name="search"
        :size="16"
        color="#667085"
      />
      <input
        v-model="searchKeyword"
        type="search"
        :placeholder="t('mobile.applications.navigator.searchPlaceholder')"
      >
    </label>

    <div class="mobile-services__topics">
      <button
        v-for="topic in topics"
        :key="topic.id"
        type="button"
        :class="['mobile-services__topic', { 'is-active': selectedTopicId === topic.id }]"
        @click="selectedTopicId = topic.id"
      >
        {{ topic.label }}
      </button>
    </div>

    <div class="mobile-services__content">
      <div
        v-if="loading"
        class="mobile-services__state"
      >
        {{ t('mobile.applications.navigator.loading') }}
      </div>
      <div
        v-else-if="visibleGroups.length === 0"
        class="mobile-services__state"
      >
        {{ t('mobile.applications.navigator.empty') }}
      </div>
      <section
        v-for="group in visibleGroups"
        v-else
        :key="group.id"
        :class="['service-group', { 'is-expanded': isGroupExpanded(group.id) }]"
      >
        <button
          type="button"
          class="service-group__header"
          @click="toggleGroup(group.id)"
        >
          <span
            class="service-group__icon"
            :style="{ color: group.color }"
          >
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
            {{ t('mobile.applications.navigator.itemCount', { count: group.items.length }) }}
          </span>
          <IconCustom
            name="chevron-right"
            :size="16"
            color="#8a94a6"
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
            <span
              class="service-item__icon"
              :style="{ color: group.color }"
            >
              <IconCustom
                :name="item.icon"
                :size="17"
              />
            </span>
            <span class="service-item__copy">
              <strong>{{ item.name }}</strong>
              <span>{{ item.badge }}</span>
            </span>
            <IconCustom
              name="chevron-right"
              :size="15"
              color="#98a2b3"
            />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ServiceGroup, ServiceItem, TioTopic, TioTopicItem } from '~/types/tiopsServices'

const { t, locale } = useAppI18n()
const { openGuardedUrl } = useNetworkGuard()
const searchKeyword = ref('')
const selectedTopicId = ref('all')
const expandedGroupIds = ref<Set<string>>(new Set())
const topicAccent = '#b0003a'

const serviceTopics: TioTopic[] = [
  {
    category_en: 'IT and Systems Support',
    category_sc: 'IT與系統支援',
    category_tc: 'IT與系統支援',
    icon_x86: 'server',
    items: [
      {
        name_en: 'Open a Service Request',
        name_sc: 'IT服务申请',
        name_tc: 'IT服務申請',
        icon_x86: 'service',
        desktop_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=ea6aef15db3d91908e9ddf0bd3961922&sysparm_category=22c62651db7991908e9ddf0bd39619d2',
        mobile_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=ea6aef15db3d91908e9ddf0bd3961922&sysparm_category=22c62651db7991908e9ddf0bd39619d2',
      },
      {
        name_en: 'Report an Issue',
        name_sc: '回报系统问题',
        name_tc: '回報系統問題',
        icon_x86: 'bug',
        desktop_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=3f1dd0320a0a0b99000a53f7604a2ef9&sysparm_category=af9c65c9db7951908e9ddf0bd3961975',
        mobile_url: 'https://dch.service-now.com/sp?id=sc_cat_item&sys_id=3f1dd0320a0a0b99000a53f7604a2ef9&sysparm_category=af9c65c9db7951908e9ddf0bd3961975',
      },
    ],
  },
  {
    category_en: 'Contracts and Compliance',
    category_sc: '合同與合規',
    category_tc: '合同與合規',
    icon_x86: 'shield',
    items: [
      {
        name_en: 'Group Contract Clearance Approval',
        name_sc: '集团合同结清审批',
        name_tc: '集團合約結清審批',
        icon_x86: 'contract',
        desktop_url: 'https://platform-uat.dchbi.app/spa/workflow/static4form/index.html#/main/workflow/req?iscreate=1&workflowid=213',
        mobile_url: 'https://platform-uat.dchbi.app/spa/workflow/static4form/index.html#/main/workflow/req?iscreate=1&workflowid=213',
      },
      {
        name_en: 'Contract List',
        name_sc: '合同清单',
        name_tc: '合約清單',
        icon_x86: 'list',
        desktop_url: 'https://platform-uat.dchbi.app/spa/cube/index.html#/main/cube/search?customid=542',
        mobile_url: 'https://platform-uat.dchbi.app/wui/cas-entrance.jsp?path=https://platform-uat.dchbi.app/mobilemode/mobile/view.html?appHomepageId=1',
      },
    ],
  },
  {
    category_en: 'Company and Administration',
    category_sc: '公司與行政',
    category_tc: '公司與行政',
    icon_x86: 'building',
    items: [
      {
        name_en: 'Policy Documents',
        name_sc: '政策文件',
        name_tc: '政策文件',
        icon_x86: 'policy',
        desktop_url: 'https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233',
        mobile_url: 'https://oa.dchbipoc.cc/mobilemode/admin/preview.jsp?appHomepageId=116&dataid=1233',
      },
      {
        name_en: 'Intranet',
        name_sc: '企业内网',
        name_tc: '企業內聯網',
        icon_x86: 'portal',
        desktop_url: 'http://intranet.dch.com.hk/',
        mobile_url: 'http://intranet.dch.com.hk/',
      },
    ],
  },
  {
    category_en: 'Learning and Policy',
    category_sc: '學習與政策',
    category_tc: '學習與政策',
    icon_x86: 'book',
    items: [
      {
        name_en: 'Learning Management System',
        name_sc: '学习管理系统',
        name_tc: '學習管理系統',
        icon_x86: 'learning',
        desktop_url: 'https://lms.dchbi.com/',
        mobile_url: 'https://lms.dchbi.com/',
      },
    ],
  },
]

const normalizeString = (value: string) => {
  return value.trim()
}

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

const serviceGroups = computed<ServiceGroup[]>(() => {
  return serviceTopics.map(topic => ({
    id: slugify(topic.category_en),
    title: getTopicName(topic),
    description: topic.items.map(item => getItemName(item)).join(' · '),
    business: topic.category_en,
    icon: topic.icon_x86,
    color: topicAccent,
    items: topic.items.map<ServiceItem>(item => ({
      id: `${slugify(topic.category_en)}:${slugify(item.name_en)}`,
      name: getItemName(item),
      badge: t('mobile.applications.navigator.badges.process'),
      icon: item.icon_x86,
      type: 'Workflow',
      url: item.mobile_url,
      mobileUrl: item.mobile_url,
      desktopUrl: item.desktop_url,
    })),
  }))
})

const topics = computed(() => [
  {
    id: 'all',
    label: t('mobile.applications.navigator.allTopics'),
  },
  ...serviceGroups.value.map(group => ({
    id: group.id,
    label: group.title,
  })),
])

const topicCount = computed(() => serviceGroups.value.length)
const serviceCount = computed(() => serviceGroups.value.reduce((total, group) => total + group.items.length, 0))
const loading = computed(() => false)

const visibleGroups = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return serviceGroups.value
    .filter(group => selectedTopicId.value === 'all' || group.id === selectedTopicId.value)
    .map((group) => {
      if (!keyword) {
        return group
      }

      const items = group.items.filter((item) => {
        return [
          item.name,
          item.badge,
          group.title,
          group.description,
        ].some(value => value.toLowerCase().includes(keyword))
      })

      return {
        ...group,
        items,
      }
    })
    .filter(group => group.items.length > 0)
})

const isGroupExpanded = (groupId: string) => {
  return expandedGroupIds.value.has(groupId)
}

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

watch(
  visibleGroups,
  (groups) => {
    const availableGroupIds = new Set(groups.map(group => group.id))
    const nextExpanded = new Set([...expandedGroupIds.value].filter(groupId => availableGroupIds.has(groupId)))

    expandedGroupIds.value = nextExpanded
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
  padding: 16px 16px 0;
  background: linear-gradient(180deg, #f6f8fb 0%, #f3f5f8 100%);
  font-family: var(--font-source-sans-pro);
}

.mobile-services button,
.mobile-services input {
  font-family: inherit;
}

.mobile-services__hero {
  flex: 0 0 auto;
  padding: 24px 24px 12px;
  border: 1px solid #e5e9f0;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(166, 10, 58, 0.04) 0%, rgba(255, 255, 255, 0) 52%),
    #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
}

.mobile-services__title {
  margin: 0 0 8px;
  color: #111827;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.08;
}

.mobile-services__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.mobile-services__stat {
  min-height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid rgba(214, 40, 99, 0.28);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.74);
}

.mobile-services__stat strong {
  color: #c70b49;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.mobile-services__stat span {
  color: #475467;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.mobile-services__search {
  flex: 0 0 auto;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 0 12px;
  border: 1px solid #dde3ec;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.mobile-services__search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font-size: 13px;
  line-height: 40px;
}

.mobile-services__search input::placeholder {
  color: #7a8495;
}

.mobile-services__topics {
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  margin: 10px -16px 12px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  touch-action: pan-x;
}

.mobile-services__topics::-webkit-scrollbar {
  display: none;
}

.mobile-services__topic {
  flex: 0 0 auto;
  min-height: 32px;
  padding: 0 13px;
  border: 1px solid #dce2eb;
  border-radius: 999px;
  background: #ffffff;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.mobile-services__topic.is-active {
  border-color: rgba(166, 10, 58, 0.46);
  background: #fff5f8;
  color: #a60a3a;
}

.mobile-services__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 -16px;
  padding: 0 16px calc(16px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.mobile-services__state {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667085;
  font-size: 14px;
}

.service-group {
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid #e2e7ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.service-group.is-expanded {
  border-color: #e2e7ef;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.07);
}

.service-group__header {
  width: 100%;
  min-height: 68px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto 16px;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 0;
  outline: 0;
  background: #ffffff;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.service-group.is-expanded .service-group__header {
  background: #ffffff;
}

.service-group__header:active,
.service-item:active {
  background: #fafbfd;
}

.service-group__icon,
.service-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(166, 10, 58, 0.16);
  background: #fff4f7;
}

.service-group__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

.service-group__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.service-group__copy strong {
  overflow: hidden;
  color: #101828;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-group__copy span {
  overflow: hidden;
  color: #667085;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-group__count {
  min-width: 32px;
  padding: 3px 8px;
  border: 1px solid rgba(166, 10, 58, 0.12);
  border-radius: 999px;
  background: #fde8f0;
  color: #a60a3a;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
}

.service-group__items {
  border-top: 1px solid #edf0f4;
  background: #ffffff;
}

.service-item {
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 15px;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 0;
  border-bottom: 1px solid #edf0f4;
  background: #ffffff;
  text-align: left;
}

.service-item:last-child {
  border-bottom: 0;
}

.service-item__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}

.service-item__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-item__copy strong {
  overflow: hidden;
  color: #101828;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.28;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-item__copy span {
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  padding: 2px 7px;
  border: 1px solid #dce2eb;
  border-radius: 999px;
  color: #667085;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
