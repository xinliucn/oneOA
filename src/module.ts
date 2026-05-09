import { addImportsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface LocaleDefinition {
  code: string
  label: string
}

export interface TranslationMessages {
  [localeCode: string]: Record<string, unknown>
}

export interface ModuleOptions {
  defaultLocale?: string
  fallbackLocale?: string
  storageKey?: string
  cookieKey?: string
  locales?: LocaleDefinition[]
  messages?: TranslationMessages
}

const defaultLocales: LocaleDefinition[] = [
  { code: 'zh-CN', label: '简体' },
  { code: 'zh-TW', label: '繁體' },
  { code: 'en', label: 'ENG' },
]

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

const normalizeLocales = (locales?: LocaleDefinition[]) => {
  const source = locales?.length ? locales : defaultLocales
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

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'superApp',
    configKey: 'myModule',
  },
  defaults: {
    defaultLocale: 'zh-CN',
    fallbackLocale: 'en',
    storageKey: 'superapp-locale',
    cookieKey: 'superapp-locale',
    locales: defaultLocales,
    messages: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const publicRuntimeConfig = nuxt.options.runtimeConfig.public as Record<string, unknown>
    const currentI18nConfig = publicRuntimeConfig.superAppI18n

    publicRuntimeConfig.superAppI18n = {
      ...(isRecord(currentI18nConfig) ? currentI18nConfig : {}),
      defaultLocale: options.defaultLocale,
      fallbackLocale: options.fallbackLocale,
      storageKey: options.storageKey,
      cookieKey: options.cookieKey,
      locales: normalizeLocales(options.locales),
      messages: options.messages || {},
    }

    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))
  },
})
