<template>
  <div class="mobile-page">
    <div
      class="tab-content"
    >
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component, Ref } from 'vue'
import { computed, inject } from 'vue'
import MobileApplicationsTab from '~/components/MobileApplicationsTab.vue'
import MobileHomeTab from '~/components/MobileHomeTab.vue'
import MobileProfileTab from '~/components/MobileProfileTab.vue'
import MobileTodoTab from '~/components/MobileTodoTab.vue'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

const tabComponents: Record<number, Component> = {
  1: MobileHomeTab,
  2: MobileTodoTab,
  3: MobileApplicationsTab,
  4: MobileProfileTab,
}

const activeTab = inject<Ref<number>>('activeTab')
const activeComponent = computed(() => tabComponents[activeTab?.value || 1] || MobileHomeTab)
</script>

<style scoped>
.mobile-page {
    height: 100%;
}

.tab-content {
    height: 100%;
}
</style>
