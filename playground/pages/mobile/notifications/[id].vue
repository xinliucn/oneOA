<template>
  <div class="mobile-notification-detail">
    <header class="mobile-notification-detail__header">
      <button
        type="button"
        class="mobile-notification-detail__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
        <span class="mobile-notification-detail__back-label">{{ headerTitle }}</span>
      </button>
    </header>

    <main class="mobile-notification-detail__content">
      <div v-if="loading" class="mobile-notification-detail__state">{{ loadingText }}</div>
      <div v-else-if="!notification" class="mobile-notification-detail__state">{{ emptyText }}</div>
      <article v-else class="mobile-notification-detail__card">
        <div class="mobile-notification-detail__meta">
          <span v-if="notification.category" class="mobile-notification-detail__category">
            {{ notification.category }}
          </span>
          <span class="mobile-notification-detail__time">{{ formattedTime }}</span>
        </div>

        <h2 class="mobile-notification-detail__title">{{ notification.title }}</h2>

        <p v-if="notification.source" class="mobile-notification-detail__source">
          {{ sourceLabel }}: {{ notification.source }}
        </p>

        <div class="mobile-notification-detail__body">
          <p v-if="notification.summary">{{ notification.summary }}</p>
          <p v-if="notification.content">{{ notification.content }}</p>
          <p v-if="!notification.summary && !notification.content">{{ emptyContentText }}</p>
        </div>

        <button
          v-if="notification.link"
          type="button"
          class="mobile-notification-detail__link"
          @click="openOriginalLink"
        >
          {{ linkText }}
        </button>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NotificationItem } from '~/types/notification'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { locale, t } = useAppI18n()
const notificationId = computed(() => String(route.params.id || ''))
const returnPath = useState<string>('mobile:notification:return-path', () => '/mobile')
const { notifications } = useNotification()

const loading = ref(true)
const notification = ref<NotificationItem | null>(null)

const localText = (key: string, fallback: Record<string, string>) => {
  const message = t(key)
  return message === key ? fallback[locale.value] || fallback.en || '' : message
}

const headerTitle = computed(() => {
  return localText('mobile.notifications.title', {
    'zh-CN': '通知',
    'zh-TW': '通知',
    en: 'Notifications',
  })
})

const loadingText = computed(() => {
  return localText('mobile.notifications.detail.loading', {
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  })
})

const emptyText = computed(() => {
  return localText('mobile.notifications.detail.empty', {
    'zh-CN': '未找到通知内容',
    'zh-TW': '找不到通知內容',
    en: 'Notification not found',
  })
})

const emptyContentText = computed(() => {
  return localText('mobile.notifications.detail.emptyContent', {
    'zh-CN': '暂无详细内容',
    'zh-TW': '暫無詳細內容',
    en: 'No detail available',
  })
})

const sourceLabel = computed(() => {
  return localText('mobile.notifications.detail.source', {
    'zh-CN': '来源',
    'zh-TW': '來源',
    en: 'Source',
  })
})

const linkText = computed(() => {
  return localText('mobile.notifications.detail.openLink', {
    'zh-CN': '打开原始链接',
    'zh-TW': '開啟原始連結',
    en: 'Open Original Link',
  })
})

const formattedTime = computed(() => {
  if (!notification.value?.createdAt) {
    return ''
  }

  const date = new Date(notification.value.createdAt)
  if (Number.isNaN(date.getTime())) {
    return notification.value.createdAt
  }

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})

const loadNotification = async () => {
  loading.value = true

  try {
    const cached = notifications.value.find(item => item.id === notificationId.value)
    if (cached) {
      notification.value = cached
    }

    const detail = await $fetch<{ item: NotificationItem | null }>(`/api/notifications/${encodeURIComponent(notificationId.value)}`)
    if (detail?.item) {
      notification.value = detail.item
    }
  } catch (error) {
    console.error('Load mobile notification detail failed:', error)
  } finally {
    loading.value = false
  }
}

const handleBack = async () => {
  const targetPath = returnPath.value && returnPath.value !== route.fullPath
    ? returnPath.value
    : '/mobile/notifications'

  await navigateTo(targetPath)
}

const openOriginalLink = async () => {
  if (!notification.value?.link) {
    return
  }

  await navigateTo(notification.value.link, {
    external: true,
  })
}

watch(notificationId, async (id) => {
  if (!id) {
    loading.value = false
    return
  }

  await loadNotification()
}, { immediate: true })
</script>

<style scoped>
.mobile-notification-detail {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.mobile-notification-detail__header {
  padding: 18px 16px 14px;
  background: #ffffff;
  border-bottom: 1px solid #ece3e6;
}

.mobile-notification-detail__back {
  border: 0;
  padding: 0;
  background: transparent;
  color: #b10f49;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mobile-notification-detail__back-label {
  font-size: 15px;
  line-height: 1.2;
  font-weight: 500;
  color: #b10f49;
}

.mobile-notification-detail__content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.mobile-notification-detail__state {
  padding: 48px 16px;
  text-align: center;
  font-size: 14px;
  color: #8b8b8b;
}

.mobile-notification-detail__card {
  padding: 20px 16px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 14px 40px rgba(17, 17, 17, 0.06);
}

.mobile-notification-detail__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.mobile-notification-detail__category {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fce4ec;
  color: #a60a3a;
  font-size: 12px;
  font-weight: 600;
}

.mobile-notification-detail__time {
  font-size: 12px;
  line-height: 1.3;
  color: #8b8b8b;
}

.mobile-notification-detail__title {
  margin: 0 0 10px;
  font-size: 22px;
  line-height: 1.35;
  font-weight: 700;
  color: #171717;
}

.mobile-notification-detail__source {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.4;
  color: #555555;
}

.mobile-notification-detail__body {
  font-size: 15px;
  line-height: 1.7;
  color: #262626;
  white-space: pre-wrap;
  word-break: break-word;
}

.mobile-notification-detail__body p {
  margin: 0;
}

.mobile-notification-detail__body p + p {
  margin-top: 12px;
}

.mobile-notification-detail__link {
  width: 100%;
  height: 48px;
  margin-top: 20px;
  border: 0;
  border-radius: 12px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
}
</style>
