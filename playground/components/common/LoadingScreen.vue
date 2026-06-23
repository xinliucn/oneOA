<template>
  <div
    class="common-loading-screen"
    :class="`common-loading-screen--${variant}`"
  >
    <div class="common-loading-screen__content">
      <div class="common-loading-screen__title">
        {{ title }}
      </div>
      <div
        class="common-loading-screen__track"
        aria-hidden="true"
      >
        <span class="common-loading-screen__bar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  variant?: 'desktop' | 'mobile'
}>(), {
  variant: 'desktop',
})
</script>

<style scoped>
.common-loading-screen {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.common-loading-screen--desktop {
  padding: 24px;
}

.common-loading-screen--mobile {
  padding: 64px 24px 112px;
}

.common-loading-screen__content {
  width: min(100%, 270px);
}

.common-loading-screen--mobile .common-loading-screen__content {
  width: min(100%, 250px);
}

.common-loading-screen__title {
  margin-bottom: 24px;
  text-align: center;
  color: #111111;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
}

.common-loading-screen__track {
  position: relative;
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #dcdde1;
}

.common-loading-screen__bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  border-radius: inherit;
  background: #b20d45;
  animation: common-loading-screen-slide 1.4s ease-in-out infinite;
}

@keyframes common-loading-screen-slide {
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
