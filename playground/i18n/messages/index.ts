import { baseMessages } from './base'
import { homeMessages } from './home'
import { mobileMessages } from './mobile'
import { notificationMessages } from './notification'
import { pageMessages } from './pages'

const locales = ['zh-CN', 'zh-TW', 'en'] as const

export const appMessages = Object.fromEntries(
  locales.map(locale => [
    locale,
    {
      ...baseMessages[locale],
      ...mobileMessages[locale],
      ...homeMessages[locale],
      ...notificationMessages[locale],
      ...pageMessages[locale],
    },
  ]),
)
