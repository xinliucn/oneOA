<template>
  <Teleport to="body">
    <Transition name="network-guard-fade">
      <div
        v-if="overlayVisible"
        class="network-guard"
        role="alertdialog"
        aria-modal="true"
      >
        <div class="network-guard__panel">
          <div class="network-guard__icon">
            !
          </div>
          <p class="network-guard__message">
            {{ overlayMessage }}
          </p>
          <button
            type="button"
            class="network-guard__button"
            @click="hideNetworkAlert"
          >
            OK
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { overlayVisible, overlayMessage, hideNetworkAlert } = useNetworkGuard()
</script>

<style scoped>
.network-guard {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(17, 24, 39, 0.54);
  backdrop-filter: blur(4px);
}

.network-guard__panel {
  width: min(360px, 100%);
  padding: 28px 24px 24px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 60px rgba(17, 24, 39, 0.28);
  text-align: center;
}

.network-guard__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 16px;
  border-radius: 999px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.network-guard__message {
  margin: 0 0 22px;
  color: #171717;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.network-guard__button {
  min-width: 120px;
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #bf124b 0%, #a60a3a 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.network-guard-fade-enter-active,
.network-guard-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.network-guard-fade-enter-from,
.network-guard-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
