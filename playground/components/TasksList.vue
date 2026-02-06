<template>
  <div class="tasks-list">
    <div class="tasks-list__header">
      <h3 class="tasks-list__title">My Outstanding Tasks</h3>
      <a href="#" class="tasks-list__link">></a>
    </div>
    <div class="tasks-list__items">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
        @click="handleClick(task)"
      >
        <div class="task-item__content">
          <div class="task-item__code">{{ task.code }}</div>
          <div class="task-item__title">{{ task.title }}</div>
          <div class="task-item__subtitle">{{ task.subtitle }}</div>
        </div>
        <div class="task-item__actions">
          <div class="task-item__date">{{ task.date }}</div>
          <button class="task-item__button">{{ task.buttonText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tasks = ref([
  {
    id: 1,
    code: 'CCA20250095',
    title: 'ICSA | 2025_10_17 ||By Sum...',
    subtitle: 'Developer 1',
    date: '2025-10-24',
    buttonText: 'TAF'
  },
  {
    id: 2,
    code: 'CCA20250095',
    title: 'ICSA | 2025_10_17 ||By 2025...',
    subtitle: 'Developer 1',
    date: '2025-10-24',
    buttonText: 'TAF'
  },
  {
    id: 3,
    code: 'CCA20250095',
    title: 'ICSA | 2025_10_17 ||By 2025...',
    subtitle: 'Developer 1',
    date: '2025-10-24',
    buttonText: 'TAF'
  },
  {
    id: 4,
    code: 'CCA20250095',
    title: 'ICSA | 2025_10_17 ||By 2025...',
    subtitle: 'Developer 1',
    date: '2025-10-24',
    buttonText: 'TAF'
  },
  {
    id: 5,
    code: 'CCA20250095',
    title: 'ICSA | 2025_10_17 ||By 2025...',
    subtitle: 'Developer 1',
    date: '2025-10-24',
    buttonText: 'TAF'
  },
  {
    id: 6,
    code: 'CCA20250095',
    title: 'ICSA | 2025_10_17 ||By 2025...',
    subtitle: 'Developer 1',
    date: '2025-10-24',
    buttonText: 'TAF'
  }
])

const handleClick = (task) => {
  console.log('Clicked task:', task.code)
}
</script>

<style scoped>
.tasks-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tasks-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;
}

.tasks-list__title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.tasks-list__link {
  font-size: 18px;
  color: #A60A3A;
  text-decoration: none;
}

.tasks-list__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #F5F5F5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #E0E0E0;
  }
}

.task-item__content {
  flex: 1;
}

.task-item__code {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.task-item__title {
  font-size: 13px;
  color: #000000;
  margin-bottom: 2px;
}

.task-item__subtitle {
  font-size: 12px;
  color: #666666;
}

.task-item__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-item__date {
  font-size: 12px;
  color: #999999;
}

.task-item__button {
  background: #A60A3A;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #8A0A2A;
  }
}
</style>