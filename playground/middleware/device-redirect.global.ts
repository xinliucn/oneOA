import { detectMobileDevice } from '~/utils/device'

export default defineNuxtRouteMiddleware((to, _from) => {
  // 如果是登录页或错误页面，不进行设备重定向
  if (to.path === '/' || to.path.match(/^\/(403|404|500)$/)) {
    return
  }

  const userAgent = import.meta.server
    ? useRequestHeaders(['user-agent'])['user-agent']
    : navigator.userAgent
  const viewportWidth = import.meta.client ? window.innerWidth : undefined
  const isMobile = detectMobileDevice({
    userAgent,
    viewportWidth,
  })
  const activeTab = useState('mobile:activeTab', () => 1)
  const targetPath = getDeviceTargetPath(to.path, isMobile)

  if (!targetPath || targetPath === to.path) {
    return
  }

  if (targetPath === '/mobile' && to.path.startsWith('/desktop/applications')) {
    activeTab.value = 3
  }

  if (targetPath === '/mobile' && to.path.startsWith('/desktop/todo')) {
    activeTab.value = 2
  }

  return navigateTo({
    path: targetPath,
    query: to.query,
    hash: to.hash,
  })
})

const getDeviceTargetPath = (path: string, isMobile: boolean) => {
  if (isMobile) {
    return getMobileTargetPath(path)
  }

  return getDesktopTargetPath(path)
}

const getMobileTargetPath = (path: string) => {
  if (!path.startsWith('/desktop')) {
    return
  }

  if (path === '/desktop') {
    return '/mobile'
  }

  if (path.startsWith('/desktop/company-information')) {
    return path.replace('/desktop/company-information', '/mobile/companyInformation')
  }

  if (path.startsWith('/desktop/company-documents')) {
    return path.replace('/desktop/company-documents', '/mobile/companyDocuments')
  }

  if (path.startsWith('/desktop/department-intranets')) {
    return path.replace('/desktop/department-intranets', '/mobile/intranets')
  }

  if (path.startsWith('/desktop/notification/')) {
    return path.replace('/desktop/notification', '/mobile/notifications')
  }

  if (path.startsWith('/desktop/notifications')) {
    return path.replace('/desktop/notifications', '/mobile/notifications')
  }

  if (path.startsWith('/desktop/news')) {
    return path.replace('/desktop/news', '/mobile/news')
  }

  if (path.startsWith('/desktop/todo/')) {
    return path.replace('/desktop/todo', '/mobile/approval')
  }

  if (path.startsWith('/desktop/todo') || path.startsWith('/desktop/applications')) {
    return '/mobile'
  }

  return '/mobile'
}

const getDesktopTargetPath = (path: string) => {
  if (!path.startsWith('/mobile')) {
    return
  }

  if (path === '/mobile') {
    return '/desktop'
  }

  if (path.startsWith('/mobile/companyInformation')) {
    return path.replace('/mobile/companyInformation', '/desktop/company-information')
  }

  if (path.startsWith('/mobile/companyDocuments')) {
    return path.replace('/mobile/companyDocuments', '/desktop/company-documents')
  }

  if (path.startsWith('/mobile/intranets')) {
    return path.replace('/mobile/intranets', '/desktop/department-intranets')
  }

  if (path.startsWith('/mobile/departmentIntranets')) {
    return path.replace('/mobile/departmentIntranets', '/desktop/department-intranets')
  }

  if (path.startsWith('/mobile/notifications/')) {
    return path.replace('/mobile/notifications', '/desktop/notification')
  }

  if (path.startsWith('/mobile/notifications')) {
    return path.replace('/mobile/notifications', '/desktop/notifications')
  }

  if (path.startsWith('/mobile/news')) {
    return path.replace('/mobile/news', '/desktop/news')
  }

  if (path.startsWith('/mobile/approval/')) {
    return path.replace('/mobile/approval', '/desktop/todo')
  }

  if (path.startsWith('/mobile/applications')) {
    return path.replace('/mobile/applications', '/desktop/applications')
  }

  return '/desktop'
}
