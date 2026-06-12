<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="iosPermissionPrompt.visible"
        class="mobile-ios-notification-prompt"
      >
        <section class="mobile-ios-notification-prompt__dialog">
          <h2 class="mobile-ios-notification-prompt__title">
            {{ t('notification.push.iosPermissionPromptTitle', { appName: t('common.appName') }) }}
          </h2>
          <p class="mobile-ios-notification-prompt__message">
            {{ t('notification.push.iosPermissionPromptMessage') }}
          </p>
          <div class="mobile-ios-notification-prompt__actions">
            <button
              type="button"
              class="mobile-ios-notification-prompt__action"
              @click="denyIOSPermissionPrompt"
            >
              {{ t('notification.push.iosPermissionPromptDeny') }}
            </button>
            <button
              type="button"
              class="mobile-ios-notification-prompt__action"
              @click="allowIOSPermissionPrompt"
            >
              {{ t('notification.push.iosPermissionPromptAllow') }}
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const {
  iosPermissionPrompt,
  allowIOSPermissionPrompt,
  denyIOSPermissionPrompt,
} = usePushSubscription()
const { t } = useAppI18n()
</script>

<style scoped>
.mobile-ios-notification-prompt {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 32%);
}

.mobile-ios-notification-prompt__dialog {
  width: min(292px, calc(100vw - 64px));
  overflow: hidden;
  border-radius: 18px;
  background: #f7f7f7;
  color: #111111;
  box-shadow: 0 16px 40px rgb(0 0 0 / 22%);
}

.mobile-ios-notification-prompt__title {
  margin: 0;
  padding: 20px 18px 8px;
  font-size: 17px;
  line-height: 1.18;
  font-weight: 700;
}

.mobile-ios-notification-prompt__message {
  margin: 0;
  padding: 0 18px 18px;
  color: #111111;
  font-size: 13px;
  line-height: 1.28;
}

.mobile-ios-notification-prompt__actions {
  display: flex;
  gap: 8px;
  padding: 0 12px 12px;
}

.mobile-ios-notification-prompt__action {
  flex: 1;
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  background: #d9d9d9;
  color: #111111;
  font-size: 12px;
  font-weight: 700;
}
</style>
