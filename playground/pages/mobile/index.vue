<template>
    <div class="mobile-page">
        <!-- Home Tab -->
        <div v-if="activeTab === 1" class="tab-content">
            <MobileHomeTab />
        </div>

        <!-- To-Do Tab -->
        <div v-else-if="activeTab === 2" class="tab-content">
            <MobileTodoTab />
        </div>

        <!-- Applications Tab -->
        <div v-else-if="activeTab === 3" class="tab-content">
            <MobileApplicationsTab />
        </div>

        <!-- Profile Tab -->
        <div v-else-if="activeTab === 4" class="tab-content">
            <MobileProfileTab />
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'

definePageMeta({
  layout: 'mobile',
  middleware: 'auth'
})

// Inject activeTab from layout
const activeTab = inject('activeTab')
</script>

<style scoped>
.mobile-page {
    height: 100%;
}

.tab-content {
    height: 100%;
}
</style>
