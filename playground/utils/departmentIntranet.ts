export const getDepartmentIntranetUrl = (locale: string) => {
  return locale === 'zh-TW'
    ? 'https://intranet.dch.com.hk/tc/department-intranet'
    : 'https://intranet.dch.com.hk/en/department-intranet'
}

export const getEShopUrl = (locale: string) => {
  return locale === 'zh-TW'
    ? 'https://www.dchliving.com/tc'
    : 'https://www.dchliving.com/en'
}
