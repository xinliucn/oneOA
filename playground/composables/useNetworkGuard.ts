type NetworkGuardProbeResult = {
  type: 'network-guard:probe-result'
  reachable: boolean
  checkedAt: number
}

const PROBE_TIMEOUT_MS = 1500
const PROBE_INTERVAL_MS = 30 * 1000
const PROBE_CACHE_TTL_MS = 15 * 1000

let bootstrapStarted = false
let probeTimer: ReturnType<typeof setInterval> | null = null

const toBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true
    }
    if (['false', '0', 'no', 'off', ''].includes(normalized)) {
      return false
    }
  }

  return fallback
}

const normalizeHosts = (hosts: string) => {
  return hosts
    .split(',')
    .map(host => host.trim().toLowerCase())
    .filter(Boolean)
}

const probeWithFetch = async (probeUrl: string) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

  try {
    await fetch(probeUrl, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
    })

    return true
  }
  catch {
    return false
  }
  finally {
    clearTimeout(timer)
  }
}

const ensureServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  await navigator.serviceWorker.register('/sw.js')
  const registration = await navigator.serviceWorker.ready
  return registration.active || navigator.serviceWorker.controller
}

const probeWithServiceWorker = async (probeUrl: string) => {
  const worker = await ensureServiceWorker()

  if (!worker) {
    return null
  }

  return new Promise<boolean | null>((resolve) => {
    const channel = new MessageChannel()
    const timeout = setTimeout(() => {
      channel.port1.close()
      resolve(null)
    }, PROBE_TIMEOUT_MS + 500)

    channel.port1.onmessage = (event) => {
      clearTimeout(timeout)
      channel.port1.close()

      const data = event.data as NetworkGuardProbeResult
      if (data?.type !== 'network-guard:probe-result') {
        resolve(null)
        return
      }

      resolve(Boolean(data.reachable))
    }

    worker.postMessage({
      type: 'network-guard:probe',
      probeUrl,
      timeoutMs: PROBE_TIMEOUT_MS,
    }, [channel.port2])
  })
}

export const useNetworkGuard = () => {
  const runtimeConfig = useRuntimeConfig()
  const enabled = toBoolean(runtimeConfig.public.internalNetworkGuardEnabled, false)
  const probeUrl = String(runtimeConfig.public.internalNetworkProbeUrl || 'https://intranet.dch.com.hk/')
  const internalHosts = normalizeHosts(String(runtimeConfig.public.internalNetworkHosts || 'intranet.dch.com.hk'))
  const alertMessage = String(runtimeConfig.public.internalNetworkAlertMessage || 'Please connect DCH network to access websites')
  const shouldSkipProbe = import.meta.dev

  const isInternal = useState<boolean | null>('network-guard:is-internal', () => null)
  const checking = useState<boolean>('network-guard:checking', () => false)
  const lastCheckedAt = useState<number>('network-guard:last-checked-at', () => 0)
  const overlayVisible = useState<boolean>('network-guard:overlay-visible', () => false)
  const overlayMessage = useState<string>('network-guard:overlay-message', () => alertMessage)

  const isInternalUrl = (url?: string | null) => {
    if (!import.meta.client || !url) {
      return false
    }

    try {
      const parsed = new URL(url, window.location.origin)
      const hostname = parsed.hostname.toLowerCase()
      return internalHosts.includes(hostname)
    }
    catch {
      return false
    }
  }

  const showNetworkAlert = (message = alertMessage) => {
    if (!enabled) {
      return
    }

    overlayMessage.value = message
    overlayVisible.value = true
  }

  const hideNetworkAlert = () => {
    overlayVisible.value = false
  }

  const probeInternalAccess = async ({ force = false }: { force?: boolean } = {}) => {
    if (!import.meta.client) {
      return true
    }

    if (!enabled) {
      isInternal.value = true
      lastCheckedAt.value = Date.now()
      hideNetworkAlert()
      return true
    }

    if (shouldSkipProbe) {
      isInternal.value = true
      lastCheckedAt.value = Date.now()
      hideNetworkAlert()
      return true
    }

    const now = Date.now()
    if (!force && isInternal.value !== null && now - lastCheckedAt.value < PROBE_CACHE_TTL_MS) {
      return isInternal.value
    }

    checking.value = true

    try {
      const previousReachable = isInternal.value
      const serviceWorkerResult = await probeWithServiceWorker(probeUrl)
      const reachable = serviceWorkerResult ?? await probeWithFetch(probeUrl)

      isInternal.value = reachable
      lastCheckedAt.value = Date.now()

      if (reachable) {
        hideNetworkAlert()
      }
      else if (previousReachable !== false) {
        showNetworkAlert()
      }

      return reachable
    }
    finally {
      checking.value = false
    }
  }

  const openGuardedUrl = async (url?: string | null, target = '_blank') => {
    if (!import.meta.client || !url) {
      return false
    }

    if (!enabled) {
      hideNetworkAlert()

      if (target === '_self') {
        window.location.href = url
        return true
      }

      window.open(url, target, 'noopener,noreferrer')
      return true
    }

    if (shouldSkipProbe) {
      if (target === '_self') {
        window.location.href = url
        return true
      }

      window.open(url, target, 'noopener,noreferrer')
      return true
    }

    if (isInternalUrl(url)) {
      const canAccess = await probeInternalAccess({ force: true })

      if (!canAccess) {
        showNetworkAlert()
        return false
      }
    }

    if (target === '_self') {
      window.location.href = url
      return true
    }

    window.open(url, target, 'noopener,noreferrer')
    return true
  }

  const bootstrap = () => {
    if (!import.meta.client || bootstrapStarted) {
      return
    }

    if (!enabled) {
      isInternal.value = true
      lastCheckedAt.value = Date.now()
      hideNetworkAlert()
      return
    }

    bootstrapStarted = true

    if (shouldSkipProbe) {
      isInternal.value = true
      lastCheckedAt.value = Date.now()
      hideNetworkAlert()
      return
    }

    void probeInternalAccess({ force: true })

    probeTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void probeInternalAccess({ force: true })
      }
    }, PROBE_INTERVAL_MS)

    window.addEventListener('online', () => void probeInternalAccess({ force: true }))
    window.addEventListener('focus', () => void probeInternalAccess({ force: true }))
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void probeInternalAccess({ force: true })
      }
    })
  }

  const stop = () => {
    if (probeTimer) {
      clearInterval(probeTimer)
      probeTimer = null
    }

    bootstrapStarted = false
  }

  return {
    isInternal,
    enabled,
    checking,
    lastCheckedAt,
    overlayVisible,
    overlayMessage,
    isInternalUrl,
    showNetworkAlert,
    hideNetworkAlert,
    probeInternalAccess,
    openGuardedUrl,
    bootstrap,
    stop,
  }
}
