import { watch } from 'vue'
import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig, useState } from '#imports'
import { normalizeAppLocale } from './composables/useAppI18n'

type RuntimeI18nConfig = {
  storageKey?: string
  cookieKey?: string
  defaultLocale?: string
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const config = (runtimeConfig.public.superAppI18n || {}) as RuntimeI18nConfig
  const storageKey = config.storageKey || 'superapp-locale'
  const cookieKey = config.cookieKey || 'superapp-locale'
  const locale = useState<string>('superapp:locale', () => normalizeAppLocale(config.defaultLocale, config))
  const localeCookie = useCookie<string>(cookieKey, {
    sameSite: 'lax'
  })

  const syncLocale = (candidate?: string | null) => {
    const nextLocale = normalizeAppLocale(candidate || localeCookie.value || config.defaultLocale, config)
    locale.value = nextLocale
    localeCookie.value = nextLocale
  }

  if (import.meta.client) {
    const storedLocale = localStorage.getItem(storageKey)
    const browserLocale = navigator.language
    syncLocale(storedLocale || localeCookie.value || locale.value || browserLocale)

    watch(
      locale,
      (value) => {
        const normalizedLocale = normalizeAppLocale(value, config)
        if (normalizedLocale !== value) {
          locale.value = normalizedLocale
          return
        }

        localeCookie.value = normalizedLocale
        localStorage.setItem(storageKey, normalizedLocale)
        document.documentElement.lang = normalizedLocale
      },
      { immediate: true }
    )
  } else {
    syncLocale(localeCookie.value || locale.value)
  }

  useHead(() => ({
    htmlAttrs: {
      lang: locale.value
    }
  }))
})
