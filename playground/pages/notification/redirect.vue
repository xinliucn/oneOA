<template>
  <div />
</template>

<script setup lang="ts">
import { useNotificationDB } from '~/composables/useNotificationDB'
import { getNotificationRequestId } from '~/utils/notification'

definePageMeta({ layout: false })

const route = useRoute()
const { openGuardedUrl } = useNetworkGuard()
const { isMobile } = useDevice()
const { readNotifications } = useNotificationDB()

const resolveRequestId = async () => {
  // 优先用 URL 直接带来的 requestId（SW 从通知 data 里取的）
  const directRequestId = String(route.query.requestId || route.query.requestid || '')
  if (directRequestId) {
    return directRequestId
  }

  // fallback：从 IndexedDB 里找通知记录
  const id = String(route.query.id || '')
  if (!id) {
    return ''
  }

  const notifications = await readNotifications()
  const item = notifications.find(n => String(n.id) === id)
  return item ? getNotificationRequestId(item) : ''
}

const resolveRedirect = async () => {
  const requestId = await resolveRequestId()
  const numericRequestId = Number(requestId)

  if (!Number.isInteger(numericRequestId) || numericRequestId === 0) {
    return navigateTo(isMobile() ? '/mobile' : '/desktop', { replace: true })
  }

  if (numericRequestId < 0) {
    const workflowUrl = `https://platform-uat.dchbi.app/workflow/request/ViewRequestForwardSPA.jsp?requestid=${encodeURIComponent(String(numericRequestId))}`
    void openGuardedUrl(workflowUrl, '_self')
    return
  }

  return navigateTo(
    isMobile()
      ? { path: `/mobile/todo/${encodeURIComponent(String(numericRequestId))}`, query: { notificationReference: String(numericRequestId) } }
      : { path: `/desktop/todo/${encodeURIComponent(String(numericRequestId))}` },
    { replace: true },
  )
}

onMounted(async () => {
  await resolveRedirect()
})
</script>
