import { computed, useRuntimeConfig, useState } from '#imports'

type LocaleDefinition = {
  code: string
  label: string
}

type TranslateParams = Record<string, string | number>

type RuntimeI18nConfig = {
  defaultLocale?: string
  fallbackLocale?: string
  storageKey?: string
  cookieKey?: string
  locales?: LocaleDefinition[]
  messages?: Record<string, Record<string, any>>
}

const DEFAULT_LOCALES: LocaleDefinition[] = [
  { code: 'zh-CN', label: '简体' },
  { code: 'zh-TW', label: '繁體' },
  { code: 'en', label: 'ENG' }
]

const normalizeLocaleDefinitions = (locales?: LocaleDefinition[]) => {
  const source = locales?.length ? locales : DEFAULT_LOCALES
  const deduped = new Map<string, LocaleDefinition>()

  for (const locale of source) {
    if (!locale?.code) {
      continue
    }

    const code = locale.code.toLowerCase()
    if (!deduped.has(code)) {
      deduped.set(code, locale)
    }
  }

  return Array.from(deduped.values())
}

const getNestedValue = (source: Record<string, any> | undefined, path: string) => {
  if (!source) {
    return undefined
  }

  return path.split('.').reduce<any>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return current[segment]
    }

    return undefined
  }, source)
}

const applyParams = (message: string, params?: TranslateParams) => {
  if (!params) {
    return message
  }

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value))
  }, message)
}

const resolveI18nConfig = (config?: RuntimeI18nConfig): Required<Pick<RuntimeI18nConfig, 'defaultLocale' | 'locales'>> & RuntimeI18nConfig => {
  const locales = normalizeLocaleDefinitions(config?.locales)
  const defaultLocale = config?.defaultLocale || locales[0]?.code || 'zh-CN'

  return {
    ...config,
    locales,
    defaultLocale
  }
}

export const normalizeAppLocale = (candidate?: string | null, config?: RuntimeI18nConfig) => {
  const resolvedConfig = resolveI18nConfig(config)
  const locales = resolvedConfig.locales
  const defaultLocale = resolvedConfig.defaultLocale

  if (!candidate) {
    return defaultLocale
  }

  const normalizedCandidate = candidate.toLowerCase()
  const exactMatch = locales.find(locale => locale.code.toLowerCase() === normalizedCandidate)
  if (exactMatch) {
    return exactMatch.code
  }

  if (normalizedCandidate.startsWith('zh')) {
    const traditionalLocale = locales.find(locale => locale.code === 'zh-TW')
    const simplifiedLocale = locales.find(locale => locale.code === 'zh-CN')

    if (normalizedCandidate.includes('tw') || normalizedCandidate.includes('hk') || normalizedCandidate.includes('mo') || normalizedCandidate.includes('hant')) {
      return traditionalLocale?.code || defaultLocale
    }

    return simplifiedLocale?.code || defaultLocale
  }

  const baseLanguage = normalizedCandidate.split('-')[0]
  const baseMatch = locales.find(locale => locale.code.toLowerCase() === baseLanguage)

  return baseMatch?.code || defaultLocale
}

export const useAppI18n = () => {
  const runtimeConfig = useRuntimeConfig()
  const rawConfig = runtimeConfig.public.superAppI18n as unknown as RuntimeI18nConfig | undefined
  const config = resolveI18nConfig(rawConfig || {})
  const locale = useState<string>('superapp:locale', () => normalizeAppLocale(config.defaultLocale, config))
  const locales = computed<LocaleDefinition[]>(() => {
    return config.locales
  })
  const fallbackLocale = computed(() => {
    return normalizeAppLocale(config.fallbackLocale || config.defaultLocale, config)
  })
  const messages = computed(() => config.messages || {})

  const setLocale = (nextLocale: string) => {
    locale.value = normalizeAppLocale(nextLocale, config)
  }

  const localeLabel = computed(() => {
    return locales.value.find(item => item.code === locale.value)?.label || locale.value
  })

  const hasLocale = (localeCode: string) => {
    return locales.value.some(item => item.code === localeCode)
  }

  const t = (key: string, params?: TranslateParams) => {
    const currentMessage = getNestedValue(messages.value[locale.value], key)
    const fallbackMessage = getNestedValue(messages.value[fallbackLocale.value], key)
    const resolvedMessage = currentMessage ?? fallbackMessage

    if (typeof resolvedMessage === 'string') {
      return applyParams(resolvedMessage, params)
    }

    return key
  }

  return {
    locale,
    locales,
    localeLabel,
    fallbackLocale,
    hasLocale,
    setLocale,
    t
  }
}
