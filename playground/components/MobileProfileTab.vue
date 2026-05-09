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
        <span class="mobile-profile__label">Username</span>
        <span class="mobile-profile__value">{{ usernameText }}</span>
      </div>
      <div class="mobile-profile__row">
        <span class="mobile-profile__label">Email</span>
        <span class="mobile-profile__value">{{ emailText }}</span>
      </div>
    </section>

    <section class="mobile-profile__section">
      <button
        type="button"
        class="mobile-profile__action"
        @click="handleLogout"
      >
        Sign out
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const displayName = computed(() => {
  return user.value?.name || user.value?.displayName || user.value?.username || 'Profile'
})

const emailText = computed(() => user.value?.email || '-')
const usernameText = computed(() => user.value?.username || '-')

const profileInitials = computed(() => {
  const source = displayName.value.trim()
  if (!source) {
    return 'P'
  }

  const parts = source.split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() || '').join('') || 'P'
})

const handleLogout = async () => {
  await logout()
}
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
  font-size: 22px;
  line-height: 1.2;
  color: #2f1a22;
}

.mobile-profile__identity p {
  margin: 6px 0 0;
  font-size: 13px;
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

.mobile-profile__row + .mobile-profile__row {
  border-top: 1px solid #f1e8eb;
}

.mobile-profile__label {
  font-size: 11px;
  font-weight: 600;
  color: #8e7781;
}

.mobile-profile__value {
  font-size: 15px;
  color: #24151b;
  word-break: break-all;
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
</style>
