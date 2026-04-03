<template>
  <component
    :is="iconComponent"
    :size="size"
    :color="color"
    :class="className"
    :style="style"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GlobeIcon from './icons/svg/GlobeIcon.vue'
import SearchIcon from './icons/svg/SearchIcon.vue'
import BellIcon from './icons/svg/BellIcon.vue'
import DocumentIcon from './icons/svg/DocumentIcon.vue'
import GlcPortalIcon from './icons/svg/GlcPortalIcon.vue'
import CcaMobileApplyIcon from './icons/svg/CcaMobileApplyIcon.vue'
import CcaApprovalViewIcon from './icons/svg/CcaApprovalViewIcon.vue'
import CcaContractListIcon from './icons/svg/CcaContractListIcon.vue'
import AnalyticsIcon from './icons/svg/AnalyticsIcon.vue'
import SettingsListIcon from './icons/svg/SettingsListIcon.vue'
import FilesGridIcon from './icons/svg/FilesGridIcon.vue'
import NotificationsBagIcon from './icons/svg/NotificationsBagIcon.vue'
import DigitalTechnologyIcon from './icons/svg/DigitalTechnologyIcon.vue'
import FinanceBarsIcon from './icons/svg/FinanceBarsIcon.vue'
import LegalComplianceIcon from './icons/svg/LegalComplianceIcon.vue'
import InfoIcon from './icons/svg/InfoIcon.vue'
import DownloadIcon from './icons/svg/DownloadIcon.vue'
import AppsIcon from './icons/svg/AppsIcon.vue'
import BuildingIcon from './icons/svg/BuildingIcon.vue'
import DashboardIcon from './icons/svg/DashboardIcon.vue'
import EducationIcon from './icons/svg/EducationIcon.vue'
import ShopIcon from './icons/svg/ShopIcon.vue'
import MenuIcon from './icons/svg/MenuIcon.vue'
import ShareIcon from './icons/svg/ShareIcon.vue'
import ChevronRightIcon from './icons/svg/ChevronRightIcon.vue'
import TodoIcon from './icons/svg/TodoIcon.vue'
import PersonnelIcon from './icons/svg/PersonnelIcon.vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    color?: string
    className?: string
    rotate?: number
    spin?: boolean
  }>(),
  {
    size: 20,
    color: 'currentColor',
    rotate: 0,
    spin: false
  }
)

// 图标映射表
const iconMap: Record<string, any> = {
  globe: GlobeIcon,
  search: SearchIcon,
  bell: BellIcon,
  document: DocumentIcon,
  'glc-portal': GlcPortalIcon,
  'cca-mobile-apply': CcaMobileApplyIcon,
  'cca-approval-view': CcaApprovalViewIcon,
  'cca-contract-list': CcaContractListIcon,
  analytics: AnalyticsIcon,
  'settings-list': SettingsListIcon,
  'files-grid': FilesGridIcon,
  'notifications-bag': NotificationsBagIcon,
  'digital-technology': DigitalTechnologyIcon,
  'finance-bars': FinanceBarsIcon,
  'legal-compliance': LegalComplianceIcon,
  info: InfoIcon,
  download: DownloadIcon,
  apps: AppsIcon,
  building: BuildingIcon,
  dashboard: DashboardIcon,
  education: EducationIcon,
  shop: ShopIcon,
  menu: MenuIcon,
  share: ShareIcon,
  'chevron-right': ChevronRightIcon,
  todo: TodoIcon,
  personnel: PersonnelIcon
}

// 动态获取图标组件
const iconComponent = computed(() => {
  return iconMap[props.name] || null
})

// 动态样式
const style = computed(() => ({
  transform: `rotate(${props.rotate}deg)`,
  animation: props.spin ? 'icon-spin 1s linear infinite' : 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}))
</script>

<style scoped>
@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
