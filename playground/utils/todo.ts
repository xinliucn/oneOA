import type {
  WorkflowFormDetail,
  WorkflowFormFieldInfo,
  WorkflowFormMainDataField,
  WorkflowFormRequestField,
  WorkflowFormSpecialObject,
} from '~/types/todo'

const TRAILING_AMOUNT_PATTERN = /^(?:HKD|RMB|CNY|USD|EUR|GBP|JPY|MOP|TWD|[$￥¥])\s*[\d,]+(?:\.\d+)?(?:\s*\([^)]*\))?$/i
const TRAILING_STATUS_PATTERN = /\s*\([^)]*(?:pending|approval|approved|rejected|returned|complete|status)[^)]*\)\s*$/i
const TRAILING_STATUS_KEYWORDS = ['pending', 'approval', 'approved', 'rejected', 'returned', 'complete', 'status']

const normalizeRequestTitle = (value: string) => {
  return value
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/\s+/g, ' ')
    .trim()
}

const getPrimaryRequestTitle = (value: string) => {
  return normalizeRequestTitle(value.replace(TRAILING_STATUS_PATTERN, ''))
}

const hasTrailingStatusText = (value: string) => {
  const normalizedValue = value.toLowerCase()
  return normalizedValue.includes('(')
    && normalizedValue.includes(')')
    && TRAILING_STATUS_KEYWORDS.some(keyword => normalizedValue.includes(keyword))
}

const isTrailingMeta = (value: string) => {
  return TRAILING_AMOUNT_PATTERN.test(value) || TRAILING_STATUS_PATTERN.test(value)
}

export const formatRequestName = (value?: string | number | null) => {
  const requestName = normalizeRequestTitle(String(value ?? ''))
  if (!requestName) {
    return ''
  }

  const requestNameParts = requestName.split('|').map(item => item.trim())
  const trailingField = requestNameParts[requestNameParts.length - 1]
  if (requestNameParts.length >= 3 && trailingField && isTrailingMeta(trailingField)) {
    return getPrimaryRequestTitle(requestNameParts[1] || '') || requestName
  }

  const titleWithTrailingStatus = requestNameParts[1]
  if (requestNameParts.length === 2 && titleWithTrailingStatus && hasTrailingStatusText(titleWithTrailingStatus)) {
    return getPrimaryRequestTitle(titleWithTrailingStatus) || requestName
  }

  return requestName
}

export const stripHtml = (value: string | number | boolean | null | undefined) => {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

const getWorkflowFields = (workflowDetail: WorkflowFormDetail) => {
  return workflowDetail.processInfo?.workflowMainTableInfo?.requestRecords?.[0]?.workflowRequestTableFields
}

const getFieldDisplayValue = (field: WorkflowFormRequestField | undefined) => {
  if (!field) {
    return ''
  }

  return field.fieldShowValue || field.filedHtmlShow || field.fieldValue || ''
}

const getFieldByName = (workflowDetail: WorkflowFormDetail, name: string) => {
  const normalizedName = name.toLowerCase()

  return getWorkflowFields(workflowDetail)?.find((field) => {
    return field.fieldName === name || field.fieldName?.toLowerCase() === normalizedName
  })
}

const getMainFieldInfoByName = (workflowDetail: WorkflowFormDetail, name: string): WorkflowFormFieldInfo | undefined => {
  const fieldInfoMap = workflowDetail.formInfo?.tableInfo?.main?.fieldinfomap
  const normalizedName = name.toLowerCase()

  return Object.values(fieldInfoMap || {}).find((fieldInfo) => {
    return fieldInfo.fieldname === name || fieldInfo.fieldname?.toLowerCase() === normalizedName
  })
}

const getSpecialObjectDisplayValue = (value: WorkflowFormSpecialObject | WorkflowFormSpecialObject[] | undefined) => {
  if (Array.isArray(value)) {
    return value.map(item => item.name || item.showname || item.value || item.id).filter(Boolean).join(', ')
  }

  return value ? String(value.name || value.showname || value.value || value.id || '') : ''
}

const getMainFieldSelectValue = (fieldInfo: WorkflowFormFieldInfo | undefined, value: WorkflowFormMainDataField['value']) => {
  return fieldInfo?.selectattr?.selectitemlist?.find(item => item.selectvalue === value)?.selectname || ''
}

const getMainFieldValue = (workflowDetail: WorkflowFormDetail, name: string) => {
  const fieldInfo = getMainFieldInfoByName(workflowDetail, name)
  const fieldData = fieldInfo ? workflowDetail.formInfo?.maindata?.[`field${fieldInfo.fieldid}`] : undefined

  if (!fieldData) {
    return ''
  }

  return getSpecialObjectDisplayValue(fieldData.specialobj)
    || getMainFieldSelectValue(fieldInfo, fieldData.value)
    || String(fieldData.value || '')
}

export const getWorkflowFieldText = (workflowDetail: WorkflowFormDetail, name: string) => {
  return stripHtml(getFieldDisplayValue(getFieldByName(workflowDetail, name)) || getMainFieldValue(workflowDetail, name))
}
