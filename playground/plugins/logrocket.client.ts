import LogRocket from 'logrocket'

let isLogRocketInitialized = false

export const initializeLogRocket = () => {
  if (isLogRocketInitialized) {
    return
  }

  const runtimeConfig = useRuntimeConfig()
  const appId = runtimeConfig.public.logrocketAppId

  if (!appId || import.meta.dev) {
    return
  }

  LogRocket.init(appId)
  isLogRocketInitialized = true
}

export const identifyLogRocketUser = (user: {
  name?: string
  email?: string
  username?: string
  displayName?: string
}) => {
  initializeLogRocket()
  if (!isLogRocketInitialized) {
    return
  }
  const identifier = user.username || user.email || user.name || user.displayName
  if (!identifier) {
    return
  }

  const traits = Object.entries({
    name: user.name,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
  }).reduce<Record<string, string | number | boolean>>((result, [key, value]) => {
    if (value !== undefined) {
      result[key] = value
    }

    return result
  }, {})

  LogRocket.identify(identifier, traits)
}

export default defineNuxtPlugin(() => {
  initializeLogRocket()

  return {
    provide: {
      identifyLogRocketUser,
    },
  }
})
