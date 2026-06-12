<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo and Title -->
      <div class="login-header">
        <div class="login-logo">
          <img
            src="../assets/images/image002.jpg"
            alt="logo"
          >
        </div>
        <div class="subtitle">
          {{ t('auth.subtitle') }}
        </div>
      </div>

      <div class="loading-section">
        <div class="loading-spinner" />
        <div class="loading-text">
          {{ loadingText }}
        </div>
      </div>
    </div>
    <MobileFirstLaunchGuide
      v-if="shouldShowFirstLaunchGuide"
      @complete="handleFirstLaunchGuideComplete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { checkAuth, login } = useAuth()
const { getDeviceRoute, isMobile } = useDevice()
const { t } = useAppI18n()
const loadingState = ref<'checking' | 'success' | 'redirecting' | 'failed'>('checking')
const shouldShowFirstLaunchGuide = ref(false)
const hasStartedLogin = ref(false)
const loadingText = computed(() => t(`auth.loading.${loadingState.value}`))
const firstLaunchGuideStorageKey = 'mobile:first-launch-guide:v1:completed'

const shouldOpenFirstLaunchGuideAfterLogin = () => {
  if (!import.meta.client) {
    return false
  }

  return isMobile() && window.localStorage.getItem(firstLaunchGuideStorageKey) !== '1'
}

const goToDeviceHome = async () => {
  await navigateTo(getDeviceRoute())
}

const loginInit = async () => {
  if (hasStartedLogin.value) {
    return
  }

  hasStartedLogin.value = true

  try {
    const isLoggedIn = await checkAuth()
    if (isLoggedIn) {
      loadingState.value = 'success'

      if (shouldOpenFirstLaunchGuideAfterLogin()) {
        shouldShowFirstLaunchGuide.value = true
        return
      }

      await goToDeviceHome()
    }
    else {
      loadingState.value = 'redirecting'
      await login()
    }
  }
  catch (error) {
    console.error('Login initialization failed:', error)
    loadingState.value = 'failed'
  }
}

const handleFirstLaunchGuideComplete = async () => {
  shouldShowFirstLaunchGuide.value = false
  await goToDeviceHome()
}

onMounted(async () => {
  await loginInit()
})
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%);
}

.login-container {
  background: white;
  border-radius: 8px;
  -webkit-box-shadow: 0 40px 200px rgba(0, 0, 0, 0.15);
  box-shadow: 0 40px 200px rgba(0, 0, 0, 0.15);
  width: 440px;
  padding: 50px 40px;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  .login-logo {
    width: 300px;
    margin: 0 auto 20px;

    img {
      width: 100%;
      display: block;
    }
  }
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 40px;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f0f0f0;
  border-top-color: #a52a2a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #555;
  text-align: center;
  font-weight: 400;
}
</style>
