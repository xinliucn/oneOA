<template>
  <div class="calendar-widget">
    <div class="calendar-widget__header">
      <h3 class="calendar-widget__title">Calendar</h3>
      <a href="#" class="calendar-widget__link">></a>
    </div>
    <div class="calendar-widget__nav">
      <button class="calendar-widget__nav-btn" @click="previousMonth">&lt;</button>
      <div class="calendar-widget__month">{{ currentMonthYear }}</div>
      <button class="calendar-widget__nav-btn" @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-widget__grid">
      <div v-for="day in weekDays" :key="day" class="calendar-widget__weekday">
        {{ day }}
      </div>
      <div
        v-for="date in calendarDates"
        :key="date.key"
        :class="['calendar-widget__date', {
          'calendar-widget__date--today': date.isToday,
          'calendar-widget__date--empty': date.isEmpty
        }]"
      >
        {{ date.day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const currentMonthYear = computed(() => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const firstDayOfWeek = firstDay.getDay()
  const lastDateOfMonth = lastDay.getDate()

  const dates = []

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    dates.push({
      key: `empty-${i}`,
      day: '',
      isEmpty: true,
      isToday: false
    })
  }

  // Current month dates only
  const today = new Date()
  for (let i = 1; i <= lastDateOfMonth; i++) {
    dates.push({
      key: `current-${i}`,
      day: i,
      isEmpty: false,
      isToday: year === today.getFullYear() &&
               month === today.getMonth() &&
               i === today.getDate()
    })
  }

  return dates
})

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}
</script>

<style scoped>
.calendar-widget {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 24px;
}

.calendar-widget__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;
}

.calendar-widget__title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.calendar-widget__link {
  font-size: 20px;
  color: #A60A3A;
  text-decoration: none;
  font-weight: 600;
}

.calendar-widget__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.calendar-widget__nav-btn {
  width: 40px;
  height: 40px;
  background: #FFE4E8;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  color: #A60A3A;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: #FFD0D8;
  }
}

.calendar-widget__month {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.calendar-widget__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.calendar-widget__weekday {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  padding: 12px 0;
}

.calendar-widget__date {
  text-align: center;
  font-size: 16px;
  color: #000000;
  padding: 12px 0;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #F5F5F5;
  }

  &--today {
    background: #A60A3A;
    color: white;
    font-weight: 600;

    &:hover {
      background: #8A0A2A;
    }
  }

  &--other-month {
    color: #E0E0E0;
  }

  &--empty {
    cursor: default;
    pointer-events: none;
  }
}
</style>