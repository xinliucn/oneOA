<template>
  <div class="mobile-profile">
    <section class="mobile-profile__hero">
      <div class="mobile-profile__avatar">
        {{ profileInitials }}
      </div>
      <div class="mobile-profile__identity">
        <h1>{{ displayName }}</h1>
        <p>{{ emailText }}</p>
      </div>
    </section>

    <section class="mobile-profile__section">
      <div class="mobile-profile__row">
        <span class="mobile-profile__label">{{ t('mobile.profile.fields.username') }}</span>
        <span class="mobile-profile__value">{{ usernameText }}</span>
      </div>
      <div class="mobile-profile__row">
        <span class="mobile-profile__label">{{ t('mobile.profile.fields.email') }}</span>
        <span class="mobile-profile__value">{{ emailText }}</span>
      </div>
    </section>

    <section class="mobile-profile__section">
      <div class="mobile-profile__row mobile-profile__row--inline">
        <div>
          <span class="mobile-profile__label_nav">{{ t('notification.push.title') }}</span>
        </div>
        <button
          type="button"
          class="mobile-profile__toggle"
          :class="{ 'is-on': pushToggleOn, 'is-loading': isPushToggleLoading }"
          :disabled="isPushToggleLoading"
          :aria-label="t('notification.push.title')"
          @click="togglePushSubscription"
        >
          <span class="mobile-profile__toggle-knob" />
        </button>
      </div>
    </section>

    <section class="mobile-profile__section">
      <button
        type="button"
        class="mobile-profile__action"
        @click="handleLogout"
      >
        {{ t('user.logout') }}
      </button>
    </section>

    <div
      v-if="subscriptionPrompt.visible"
      class="mobile-profile__ios-overlay"
    >
      <section class="mobile-profile__ios-dialog">
        <h2 class="mobile-profile__ios-title">
          {{ subscriptionPrompt.type === 'enabled'
            ? t('notification.push.enabledTitle')
            : t('notification.push.disabledTitle') }}
        </h2>
        <p class="mobile-profile__ios-message">
          {{ subscriptionPrompt.type === 'enabled'
            ? t('notification.push.enabledMessage')
            : t('notification.push.disabledMessage') }}
        </p>
        <div class="mobile-profile__ios-actions">
          <button
            type="button"
            class="mobile-profile__ios-action"
            @click="dismissSubscriptionPrompt"
          >
            {{ t('notification.push.dismiss') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePushSubscriptionStore } from '~/stores/pushSubscription'

const { user, logout } = useAuth()

definePageMeta({ layout: 'mobile', middleware: 'auth' })
const pushSubscriptionStore = usePushSubscriptionStore()
const { t } = useAppI18n()
const { showToast } = useMobileToast()

const subscriptionPrompt = reactive({
  visible: false,
  type: 'enabled' as 'enabled' | 'disabled',
})
const pushToggleOn = computed(() => pushSubscriptionStore.isSubscribed)
const isPushToggleLoading = computed(() => pushSubscriptionStore.toggling)

const displayName = computed(() => {
  return user.value?.name || user.value?.displayName || user.value?.username || t('user.profile')
})

const emailText = computed(() => user.value?.email || '-')
const usernameText = computed(() => user.value?.name || '-')

const profileInitials = computed(() => {
  const source = displayName.value.trim()
  if (!source) {
    return 'P'
  }

  const parts = source.split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'P'
})

const dismissSubscriptionPrompt = () => {
  subscriptionPrompt.visible = false
}

const showSubscriptionResultPrompt = (enabled: boolean) => {
  subscriptionPrompt.type = enabled ? 'enabled' : 'disabled'
  subscriptionPrompt.visible = true
}

const togglePushSubscription = async () => {
  if (isPushToggleLoading.value) {
    return
  }

  const result = await pushSubscriptionStore.setEnabled(!pushToggleOn.value)

  if (result === 'enabled') {
    showSubscriptionResultPrompt(true)
    return
  }

  if (result === 'disabled') {
    showSubscriptionResultPrompt(false)
    return
  }

  showToast(pushSubscriptionStore.error || t('notification.push.subscribeFailed'), 'error', 4500)
}

const handleLogout = async () => {
  await logout()
}

onMounted(async () => {
  await pushSubscriptionStore.init()
})
</script>

<style scoped>
.mobile-profile {
  height: 100%;
  overflow-y: auto;
  padding: 20px 16px 28px;
  background:
    radial-gradient(circle at top right, rgba(166, 10, 58, 0.06), transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #faf7f8 100%);
}

.mobile-profile__hero,
.mobile-profile__section {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #efe5e8;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(69, 26, 41, 0.08);
}

.mobile-profile__hero {
  padding: 24px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-profile__avatar {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c85d83 0%, #8d103c 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 14px 28px rgba(166, 10, 58, 0.22);
}

.mobile-profile__identity {
  min-width: 0;
}

.mobile-profile__identity h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: #2f1a22;
}

.mobile-profile__identity p {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.4;
  color: #7c6570;
  word-break: break-all;
}

.mobile-profile__section {
  margin-top: 16px;
  padding: 10px 16px;
}

.mobile-profile__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
}

.mobile-profile__row--inline {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.mobile-profile__row+.mobile-profile__row {
  border-top: 1px solid #f1e8eb;
}

.mobile-profile__label {
  font-size: 12px;
  font-weight: 600;
  color: #8e7781;
}

.mobile-profile__label_nav {
  font-size: 16px;
  font-weight: 600;
  color: #8e7781;
}

.mobile-profile__value {
  font-size: 16px;
  color: #24151b;
  word-break: break-all;
}

.mobile-profile__toggle {
  position: relative;
  width: 38px;
  height: 22px;
  flex-shrink: 0;
  border: 0;
  border-radius: 999px;
  background: #b10f49;
  padding: 2px;
  transition: background-color 0.2s ease;
}

.mobile-profile__toggle:disabled {
  cursor: default;
  opacity: 0.72;
}

.mobile-profile__toggle-knob {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
  transform: translateX(16px);
  transition: transform 0.2s ease;
}

.mobile-profile__toggle:not(.is-on) {
  background: #d7d0d3;
}

.mobile-profile__toggle:not(.is-on) .mobile-profile__toggle-knob {
  transform: translateX(0);
}

.mobile-profile__toggle.is-loading .mobile-profile__toggle-knob {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.mobile-profile__action {
  width: 100%;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #a60a3a 0%, #7c0d33 100%);
  color: #ffffff;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 700;
}

.mobile-profile__secondary-action {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #e8d5dc;
  border-radius: 14px;
  background: #fff6f8;
  color: #a60a3a;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
}

.mobile-profile__secondary-action:disabled {
  cursor: default;
  opacity: 0.65;
}

.mobile-profile__ios-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 28%);
}

.mobile-profile__ios-dialog {
  width: min(290px, calc(100vw - 64px));
  overflow: hidden;
  border-radius: 18px;
  background: #f7f7f7;
  color: #111111;
  text-align: center;
  box-shadow: 0 16px 40px rgb(0 0 0 / 22%);
}

.mobile-profile__ios-title {
  margin: 0;
  padding: 18px 20px 6px;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 700;
}

.mobile-profile__ios-message {
  margin: 0;
  padding: 0 20px 18px;
  color: #111111;
  font-size: 12px;
  line-height: 1.28;
}

.mobile-profile__ios-actions {
  display: flex;
  padding: 0 12px 12px;
}

.mobile-profile__ios-action {
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
