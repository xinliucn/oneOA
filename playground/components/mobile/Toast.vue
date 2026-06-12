<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="mobile-toast">
        <div
          v-if="toast.visible"
          :class="['mobile-toast', `mobile-toast--${toast.type}`]"
        >
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const { toast } = useMobileToast()
</script>

<style scoped>
.mobile-toast {
  position: fixed;
  z-index: 9999;
  top: calc(env(safe-area-inset-top, 0px) + 18px);
  left: 50%;
  max-width: calc(100vw - 96px);
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 15px;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  pointer-events: none;
}

.mobile-toast--success {
  border: 1px solid #43b563;
  background: #d9f3df;
  color: #007a1d;
}

.mobile-toast--error {
  border: 1px solid #d4586f;
  background: #fde7ec;
  color: #a60a3a;
}

.mobile-toast--reject {
  border: 1px solid #ff6f86;
  background: #ffe5ec;
  color: #ff1f2d;
}

.mobile-toast-enter-active,
.mobile-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-toast-enter-from,
.mobile-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
