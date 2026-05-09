<template>
  <div class="desktop-loading">
    <div class="desktop-loading__panel">
      <div class="desktop-loading__text">
        Loading...
      </div>
      <div class="desktop-loading__progress">
        <div class="desktop-loading__progress-bar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'desktop',
  middleware: 'auth',
})
</script>

<style scoped>
.desktop-loading {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.desktop-loading__panel {
  width: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(-14px);
}

.desktop-loading__text {
  margin-bottom: 28px;
  color: #000000;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
}

.desktop-loading__progress {
  width: 270px;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #d9d9d9;
}

.desktop-loading__progress-bar {
  width: 82px;
  height: 100%;
  border-radius: inherit;
  background: #a60a3a;
  animation: desktop-loading-progress 1.4s ease-in-out infinite;
}

@keyframes desktop-loading-progress {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(188px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
