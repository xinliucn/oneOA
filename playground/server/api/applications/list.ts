import type { MobileApplication } from '~/types/applicationCatalog'

const mockApplications: MobileApplication[] = [
  {
    id: 'eleave',
    name: 'eLeave',
    logo: 'eLeave.png',
    url: 'https://hrms.dch.com.hk/hrms/Login/LoginWithSAML?redirect_uri=https://hrms.dch.com.hk/hrms/',
  },
  {
    id: 'yonyou',
    name: 'YonYou',
    logo: 'yonyou.png',
  },
  {
    id: 'elearning',
    name: 'eLearning',
    logo: 'italcant.png',
  },
  {
    id: 'powerbi-report',
    name: 'PowerBI Report',
    logo: 'Test PowerBI Report.png',
    url: 'https://aka.ms/AA10pdw6',
  },
  {
    id: 'it-service-desk',
    name: 'IT Service Desk',
    logo: 'ITServiceDesk.png',
    url: 'https://dch.service-now.com/sp',
  },
  {
    id: 'office-automate',
    name: 'Office Automate',
    logo: 'Group 285.png',
    url: 'https://oa.dchbipoc.cc/spa/coms/static4mobile/index.html#/menu-preview?id=appDefaultPage&checkAccess=1',
  },
]

export default defineEventHandler(() => {
  return mockApplications
})
