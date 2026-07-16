<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

await navigateTo('/mobile/news', { replace: true })
</script>
