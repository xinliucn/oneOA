<template>
  <div class="meeting-widget">
    <div class="meeting-widget__date">{{ formattedDate }}</div>
    <div class="meeting-widget__title">{{ meetingTitle }}</div>
    <div class="meeting-widget__time">{{ meetingTime }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const meetingTitle = ref('Weekly Meeting')
const meetingTime = ref('15:00 - 15:30')

const formattedDate = computed(() => {
  const date = currentDate.value
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
})
</script>

<style scoped>
.meeting-widget {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
}

.meeting-widget__date {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.meeting-widget__title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.meeting-widget__time {
  font-size: 14px;
  color: #666666;
}
</style>