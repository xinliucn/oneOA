const oaFileBase = 'https://platform-uat.dchbi.app'

const inferContentType = (fileName: string, contentType = '') => {
  if (contentType && !contentType.includes('application/octet-stream')) {
    return contentType
  }

  if (/\.pdf$/i.test(fileName)) {
    return 'application/pdf'
  }

  if (/\.docx$/i.test(fileName)) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }

  if (/\.(?:png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName)) {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return `image/${extension === 'jpg' ? 'jpeg' : extension || 'png'}`
  }

  return contentType || 'application/octet-stream'
}

const normalizeAttachmentUrl = (url: string, apiBase: string) => {
  const normalizedUrl = url.replace(/&amp;/g, '&')

  if (/^https?:\/\//i.test(normalizedUrl)) {
    return normalizedUrl
  }

  if (normalizedUrl.startsWith('//')) {
    return `https:${normalizedUrl}`
  }

  if (normalizedUrl.startsWith('/weaver/')) {
    return `${oaFileBase}${normalizedUrl}`
  }

  return `${apiBase}${normalizedUrl.startsWith('/') ? '' : '/'}${normalizedUrl}`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<Record<string, unknown>>(event).catch(() => ({})) as Record<string, unknown>
  const fileName = String(body.fileName || 'Attachment')
  const sourceUrl = String(body.url || '')

  if (!sourceUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Attachment preview URL is required',
    })
  }

  try {
    const response = await fetch(normalizeAttachmentUrl(sourceUrl, config.public.apiBase), {
      method: 'GET',
      headers: getForwardHeaders(event),
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText || 'Attachment preview fetch failed',
      })
    }

    const contentType = inferContentType(fileName, response.headers.get('content-type') || '')
    const arrayBuffer = await response.arrayBuffer()

    return {
      data: Buffer.from(arrayBuffer).toString('base64'),
      fileName,
      contentType,
    }
  }
  catch (error: unknown) {
    const errorRecord = error && typeof error === 'object' ? error as Record<string, unknown> : {}
    const statusCode = Number(errorRecord.statusCode || errorRecord.status) || 500
    const statusMessage = typeof errorRecord.statusMessage === 'string'
      ? errorRecord.statusMessage
      : typeof errorRecord.message === 'string'
        ? errorRecord.message
        : 'Attachment preview API failed'

    console.error('Attachment preview API error:', {
      statusCode,
      statusMessage,
    })

    throw createError({
      statusCode,
      statusMessage,
    })
  }
})
