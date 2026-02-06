<template>
  <div class="clock-widget">
    <div class="clock-widget__date">{{ formattedDate }}</div>
    <div class="clock-widget__time">{{ formattedTime }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentTime = ref(new Date())
let timer = null

const formattedDate = computed(() => {
  const date = currentTime.value
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
})

const formattedTime = computed(() => {
  const date = currentTime.value
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
})

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.clock-widget {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
}

.clock-widget__date {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.clock-widget__time {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
}
</style>