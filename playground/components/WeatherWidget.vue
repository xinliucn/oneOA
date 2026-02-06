<template>
  <div class="weather-widget">
    <div class="weather-widget__condition">{{ condition }}</div>
    <div class="weather-widget__main">
      <div class="weather-widget__icon">☀️</div>
      <div class="weather-widget__temp">{{ temperature }}°</div>
    </div>
    <div class="weather-widget__range">
      H: {{ highTemp }}° L: {{ lowTemp }}°
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const condition = ref('Sunny')
const temperature = ref(20)
const highTemp = ref(21)
const lowTemp = ref(17)
</script>

<style scoped>
.weather-widget {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  text-align: center;
}

.weather-widget__condition {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.weather-widget__main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.weather-widget__icon {
  font-size: 32px;
}

.weather-widget__temp {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
}

.weather-widget__range {
  font-size: 14px;
  color: #666666;
}
</style>