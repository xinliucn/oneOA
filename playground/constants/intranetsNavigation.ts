export type IntranetsSectionKey
  = 'home'
    | 'overview'
    | 'leadership'
    | 'visionMissionValues'
    | 'news'
    | 'newsletter'

export type IntranetsNavigationItem = {
  key: IntranetsSectionKey
  labelKey: string
  path: string
  children?: IntranetsNavigationChildItem[]
}

export type IntranetsNavigationChildItem = {
  key: 'dchLetter' | 'dchConnect'
  labelKey: string
  path: string
}

export const intranetsNavigationItems: IntranetsNavigationItem[] = [
  { key: 'home', labelKey: 'pages.intranets.navigation.home', path: '/mobile/intranets' },
  { key: 'overview', labelKey: 'pages.intranets.navigation.overview', path: '/mobile/intranets/overview' },
  { key: 'leadership', labelKey: 'pages.intranets.navigation.leadership', path: '/mobile/intranets/leadership' },
  { key: 'visionMissionValues', labelKey: 'pages.intranets.navigation.visionMissionValues', path: '/mobile/intranets/vision-mission-values' },
  { key: 'news', labelKey: 'pages.intranets.navigation.news', path: '/mobile/intranets/news' },
  {
    key: 'newsletter',
    labelKey: 'pages.intranets.navigation.newsletter',
    path: '/mobile/intranets/newsletter',
    children: [
      { key: 'dchLetter', labelKey: 'pages.intranets.navigation.dchLetter', path: '/mobile/intranets/newsletter/dch-letter' },
      { key: 'dchConnect', labelKey: 'pages.intranets.navigation.dchConnect', path: '/mobile/intranets/newsletter/dch-connect' },
    ],
  },
]
