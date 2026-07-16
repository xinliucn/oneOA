<script setup lang="ts">
definePageMeta({
  layout: 'mobile',
  middleware: 'auth',
})

await navigateTo('/mobile/intranets', {
  replace: true,
})
</script>
