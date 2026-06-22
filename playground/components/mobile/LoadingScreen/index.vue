<template>
  <div class="mobile-loading-screen">
    <div class="mobile-loading-screen__content">
      <div class="mobile-loading-screen__title">
        {{ title }}
      </div>
      <div
        class="mobile-loading-screen__track"
        aria-hidden="true"
      >
        <span class="mobile-loading-screen__bar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.mobile-loading-screen {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px 112px;
  background: #ffffff;
}

.mobile-loading-screen__content {
  width: min(100%, 250px);
}

.mobile-loading-screen__title {
  margin-bottom: 22px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: #111111;
}

.mobile-loading-screen__track {
  position: relative;
  width: 100%;
  height: 6px;
  overflow: hidden;
  background: #dcdde1;
}

.mobile-loading-screen__bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background: #b20d45;
  animation: mobile-loading-screen-slide 1.4s ease-in-out infinite;
}

@keyframes mobile-loading-screen-slide {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(235%);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
