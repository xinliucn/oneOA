<template>
  <div class="desktop-coming-soon">
    <header class="desktop-coming-soon__header">
      <nav class="desktop-coming-soon__breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/desktop">
          Home
        </NuxtLink>
        <span>&gt;</span>
        <span>{{ title }}</span>
      </nav>
      <h1>{{ title }}</h1>
    </header>

    <main class="desktop-coming-soon__body">
      <section class="desktop-coming-soon__panel" aria-live="polite">
        <div class="desktop-coming-soon__mark">
          <IconCustom :name="icon" :size="32" color="#A60A3A" />
        </div>

        <p class="desktop-coming-soon__eyebrow">
          {{ status }}
        </p>
        <h2>{{ title }}</h2>
        <p class="desktop-coming-soon__description">
          {{ description }}
        </p>

        <div class="desktop-coming-soon__divider" aria-hidden="true" />

        <button type="button" class="desktop-coming-soon__button" @click="navigateTo('/desktop')">
          {{ actionLabel }}
        </button>
      </section>
    </main>

    <footer class="desktop-coming-soon__footer">
      Copyright © 2026 Dah Chong Hong Holdings Limited. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  icon?: string
  status: string
  actionLabel: string
}>(), {
  icon: 'dashboard',
})
</script>

<style scoped>
.desktop-coming-soon {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.desktop-coming-soon__header {
  min-height: 112px;
  padding: 21px 75px 20px;
  border-bottom: 1px solid #d9d9d9;
  background: #f5f5f5;
}

.desktop-coming-soon__breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
}

.desktop-coming-soon__breadcrumb a {
  color: inherit;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;
  text-decoration: underline;
}

.desktop-coming-soon__breadcrumb span {
  font-size: 12px;
  line-height: 100%;
}

.desktop-coming-soon__breadcrumb span:last-child {
  font-weight: 700;
}

.desktop-coming-soon__header h1 {
  margin: 29px 0 0;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 100%;
}

.desktop-coming-soon__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 75px 86px;
}

.desktop-coming-soon__panel {
  width: min(100%, 520px);
  min-height: 318px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 48px 34px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.desktop-coming-soon__mark {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  border-radius: 50%;
  background: #f8dbe6;
}

.desktop-coming-soon__eyebrow {
  margin: 0 0 10px;
  color: #a60a3a;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
  text-transform: uppercase;
}

.desktop-coming-soon__panel h2 {
  margin: 0;
  color: #000000;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 120%;
}

.desktop-coming-soon__description {
  max-width: 360px;
  margin: 14px 0 0;
  color: #666666;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
}

.desktop-coming-soon__divider {
  width: 100%;
  height: 1px;
  margin: 28px 0 24px;
  background: #d9d9d9;
}

.desktop-coming-soon__button {
  min-width: 132px;
  height: 38px;
  border: 0;
  border-radius: 7px;
  background: #a60a3a;
  color: #ffffff;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 100%;
  cursor: pointer;
}

.desktop-coming-soon__button:hover {
  background: #8f0831;
}

.desktop-coming-soon__footer {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #a60a3a;
  color: #ffffff;
  font-family: "Source Sans Pro", sans-serif;
  font-size: 10px;
  line-height: 1.2;
}
</style>
