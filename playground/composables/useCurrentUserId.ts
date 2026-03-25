export const useCurrentUserId = () => {
  const { user } = useAuth()

  const currentUserId = computed(() => {
    const username = user.value?.username?.trim()
    if (username) {
      return username
    }

    const email = user.value?.email?.trim()
    if (email) {
      return email
    }

    return ''
  })

  const getCurrentUserId = () => {
    return currentUserId.value || undefined
  }

  return {
    currentUserId,
    getCurrentUserId,
  }
}
