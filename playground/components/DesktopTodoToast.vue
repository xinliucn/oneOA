<template>
  <Transition name="desktop-todo-toast">
    <div
      v-if="toast.visible"
      :class="['desktop-todo-toast', `desktop-todo-toast--${toast.type}`]"
    >
      <div class="desktop-todo-toast__icon">
        <IconCustom name="personnel" :size="18" color="#ffffff" />
      </div>
      <div class="desktop-todo-toast__copy">
        <span>{{ toast.reference }}</span>
        <strong>{{ actionLabel }}</strong>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { toast } = useDesktopTodoToast()

const actionLabel = computed(() => toast.value.type === 'rejected' ? 'Rejected!' : 'Approved!')
</script>

<style scoped>
.desktop-todo-toast {
  position: absolute;
  top: 16px;
  right: 24px;
  z-index: 20;
  min-width: 220px;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 10px 12px;
  border-radius: 8px;
  box-shadow: 0 6px 14px rgb(0 0 0 / 18%);
  font-family: "Source Sans Pro", sans-serif;
  pointer-events: none;
}

.desktop-todo-toast--approved {
  border: 1px solid #139222;
  background: #d9f3df;
  color: #008a1c;
}

.desktop-todo-toast--rejected {
  border: 1px solid #ff1f2d;
  background: #ffe5ec;
  color: #ff1f2d;
}

.desktop-todo-toast__icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: currentColor;
  flex-shrink: 0;
}

.desktop-todo-toast__copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  line-height: 100%;
}

.desktop-todo-toast__copy span {
  font-weight: 400;
}

.desktop-todo-toast__copy strong {
  font-weight: 700;
}

.desktop-todo-toast-enter-active,
.desktop-todo-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.desktop-todo-toast-enter-from,
.desktop-todo-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
