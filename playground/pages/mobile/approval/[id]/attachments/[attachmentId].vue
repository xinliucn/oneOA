<template>
  <div class="mobile-attachment-preview">
    <header class="mobile-attachment-preview__header">
      <button
        type="button"
        class="mobile-attachment-preview__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
      </button>
      <h1 class="mobile-attachment-preview__title">
        {{ attachment?.name || 'Attachment' }}
      </h1>
      <div class="mobile-attachment-preview__spacer" />
    </header>

    <main class="mobile-attachment-preview__content">
      <div
        v-if="loading || previewLoading"
        class="mobile-attachment-preview__state"
      >
        Loading...
      </div>

      <div
        v-else-if="!attachment"
        class="mobile-attachment-preview__state"
      >
        Attachment not found
      </div>

      <div
        v-else
        class="mobile-attachment-preview__viewer"
      >
        <img
          v-if="blobUrl && isImagePreview && !previewFailed"
          :src="blobUrl"
          :alt="attachment.name"
          class="mobile-attachment-preview__page mobile-attachment-preview__image"
          @error="previewFailed = true"
        >

        <iframe
          v-else-if="blobUrl && isPdfPreview"
          :src="blobUrl"
          class="mobile-attachment-preview__page mobile-attachment-preview__frame"
          title="Attachment preview"
        />

        <article
          v-else-if="isDocxPreview && docxParagraphs.length"
          class="mobile-attachment-preview__page mobile-attachment-preview__docx"
        >
          <p
            v-for="(paragraph, index) in docxParagraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </article>

        <div
          v-else
          class="mobile-attachment-preview__page mobile-attachment-preview__fallback"
        >
          <span class="mobile-attachment-preview__fallback-icon">
            <IconCustom
              name="document"
              :size="32"
              color="#3b82f6"
            />
          </span>
          <span class="mobile-attachment-preview__fallback-name">{{ attachment.name }}</span>
          <span class="mobile-attachment-preview__fallback-text">
            {{ previewError || 'Preview is not available for this file type' }}
          </span>
          <a
            v-if="previewUrl"
            class="mobile-attachment-preview__fallback-link"
            :href="previewUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open / Download
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth',
})

const route = useRoute()
const config = useRuntimeConfig()
const { formAttachments, getFormAttachments } = useToDoData()

const approvalId = computed(() => String(route.params.id || ''))
const attachmentId = computed(() => String(route.params.attachmentId || ''))
const requestId = computed(() => String(route.query.requestId || approvalId.value))
const loading = ref(false)
const previewLoading = ref(false)
const previewFailed = ref(false)
const previewError = ref('')
const blobUrl = ref('')
const previewContentType = ref('')
const docxParagraphs = ref<string[]>([])
const docxPreviewToken = ref(0)
const oaFileBase = 'https://platform-uat.dchbi.app'

const attachment = computed(() => {
  return formAttachments.value.find(item => String(item.id) === attachmentId.value) || null
})

const previewUrl = computed(() => {
  const url = attachment.value?.url?.replace(/&amp;/g, '&')

  if (!url) {
    return ''
  }

  if (/^(?:https?:)?\/\//.test(url)) {
    return url
  }

  if (url.startsWith('/weaver/')) {
    return `${oaFileBase}${url}`
  }

  return `${config.public.apiBase}${url.startsWith('/') ? '' : '/'}${url}`
})

const isImagePreview = computed(() => {
  const name = attachment.value?.name || ''

  return previewContentType.value.startsWith('image/')
    || /\.(?:png|jpe?g|gif|webp|bmp|svg)$/i.test(name)
})

const isPdfPreview = computed(() => {
  return previewContentType.value.includes('application/pdf')
    || /\.pdf$/i.test(attachment.value?.name || '')
})

const isDocxPreview = computed(() => {
  return previewContentType.value.includes('wordprocessingml.document')
    || /\.docx$/i.test(attachment.value?.name || '')
})

const canLoadPreview = computed(() => {
  return !!previewUrl.value && (isImagePreview.value || isPdfPreview.value || isDocxPreview.value)
})

const base64ToBytes = (base64: string) => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

const bytesToBlobUrl = (bytes: Uint8Array, contentType: string) => {
  const arrayBuffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(arrayBuffer).set(bytes)

  return URL.createObjectURL(new Blob([arrayBuffer], { type: contentType }))
}

const getUint16 = (bytes: Uint8Array, offset: number) => {
  return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8)
}

const getUint32 = (bytes: Uint8Array, offset: number) => {
  return ((bytes[offset] ?? 0)
    | ((bytes[offset + 1] ?? 0) << 8)
    | ((bytes[offset + 2] ?? 0) << 16)
    | ((bytes[offset + 3] ?? 0) << 24)) >>> 0
}

const findZipEntry = (bytes: Uint8Array, targetName: string) => {
  for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
    if (getUint32(bytes, offset) !== 0x06054B50) {
      continue
    }

    const centralDirectorySize = getUint32(bytes, offset + 12)
    const centralDirectoryOffset = getUint32(bytes, offset + 16)
    let cursor = centralDirectoryOffset
    const end = centralDirectoryOffset + centralDirectorySize

    while (cursor < end && getUint32(bytes, cursor) === 0x02014B50) {
      const compressionMethod = getUint16(bytes, cursor + 10)
      const compressedSize = getUint32(bytes, cursor + 20)
      const fileNameLength = getUint16(bytes, cursor + 28)
      const extraLength = getUint16(bytes, cursor + 30)
      const commentLength = getUint16(bytes, cursor + 32)
      const localHeaderOffset = getUint32(bytes, cursor + 42)
      const nameStart = cursor + 46
      const name = new TextDecoder().decode(bytes.slice(nameStart, nameStart + fileNameLength))

      if (name === targetName) {
        const localFileNameLength = getUint16(bytes, localHeaderOffset + 26)
        const localExtraLength = getUint16(bytes, localHeaderOffset + 28)
        const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength

        return {
          compressionMethod,
          data: bytes.slice(dataStart, dataStart + compressedSize),
        }
      }

      cursor += 46 + fileNameLength + extraLength + commentLength
    }

    break
  }

  return null
}

const inflateRaw = async (bytes: Uint8Array) => {
  const DecompressionStreamCtor = (globalThis as typeof globalThis & {
    DecompressionStream?: new(format: string) => TransformStream<Uint8Array, Uint8Array>
  }).DecompressionStream

  if (!DecompressionStreamCtor) {
    throw new Error('DOCX preview is not supported in this browser')
  }

  const arrayBuffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(arrayBuffer).set(bytes)

  const stream = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStreamCtor('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

const extractDocxParagraphs = async (bytes: Uint8Array) => {
  const entry = findZipEntry(bytes, 'word/document.xml')

  if (!entry) {
    return []
  }

  const documentBytes = entry.compressionMethod === 0
    ? entry.data
    : await inflateRaw(entry.data)
  const xml = new TextDecoder().decode(documentBytes)
  const xmlDocument = new DOMParser().parseFromString(xml, 'application/xml')
  const paragraphs = Array.from(xmlDocument.getElementsByTagNameNS('*', 'p'))

  return paragraphs
    .map((paragraph) => {
      return Array.from(paragraph.getElementsByTagNameNS('*', 't'))
        .map(node => node.textContent || '')
        .join('')
        .trim()
    })
    .filter(Boolean)
}

const revokeBlobUrl = () => {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ''
  }
}

const loadAttachmentPreview = async () => {
  docxPreviewToken.value += 1
  const token = docxPreviewToken.value
  revokeBlobUrl()
  docxParagraphs.value = []
  previewContentType.value = ''
  previewError.value = ''
  previewFailed.value = false

  if (!attachment.value || !canLoadPreview.value || !import.meta.client) {
    return
  }

  previewLoading.value = true
  try {
    const response = await $fetch<{
      data?: string
      contentType?: string
      fileName?: string
    }>('/api/todo/formAttachmentPreview', {
      method: 'POST',
      body: {
        url: previewUrl.value,
        fileName: attachment.value.name,
      },
    })

    if (!response.data) {
      previewError.value = 'Preview is not available for this file type'
      return
    }

    const bytes = base64ToBytes(response.data)
    previewContentType.value = response.contentType || 'application/octet-stream'
    blobUrl.value = bytesToBlobUrl(bytes, previewContentType.value)

    if (isDocxPreview.value) {
      const paragraphs = await extractDocxParagraphs(bytes)

      if (token === docxPreviewToken.value) {
        docxParagraphs.value = paragraphs
        previewError.value = paragraphs.length ? '' : 'Preview content is empty'
      }
    }
  }
  catch (error) {
    console.error('Attachment preview load failed:', error)
    previewError.value = 'Preview is not available for this file type'
  }
  finally {
    if (token === docxPreviewToken.value) {
      previewLoading.value = false
    }
  }
}

const handleBack = () => {
  return navigateTo({
    path: `/mobile/approval/${approvalId.value}/attachments`,
    query: {
      requestId: requestId.value,
    },
  })
}

watch(
  requestId,
  async (id) => {
    if (!id || formAttachments.value.some(item => String(item.id) === attachmentId.value)) {
      return
    }

    loading.value = true
    try {
      await getFormAttachments(id)
    }
    finally {
      loading.value = false
    }
  },
  { immediate: true },
)

watch(attachmentId, () => {
  previewFailed.value = false
})

watch(
  () => [attachment.value?.id, previewUrl.value],
  loadAttachmentPreview,
  { immediate: true },
)

onBeforeUnmount(revokeBlobUrl)
</script>

<style scoped>
.mobile-attachment-preview {
  min-height: 100vh;
  background: #f1f1f1;
  color: #111827;
}

.mobile-attachment-preview__header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  min-height: 68px;
  padding: 12px 18px 8px;
  background: #ffffff;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.05);
}

.mobile-attachment-preview__back {
  width: 34px;
  height: 34px;
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.mobile-attachment-preview__title {
  margin: 0;
  color: #111111;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-attachment-preview__spacer {
  width: 34px;
  height: 34px;
}

.mobile-attachment-preview__content {
  padding: 0 14px 32px;
}

.mobile-attachment-preview__viewer {
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 4px 40px;
}

.mobile-attachment-preview__page {
  width: 100%;
  max-width: 420px;
  min-height: calc(100vh - 68px);
  border: 1px solid #dddddd;
  background: #ffffff;
  box-shadow: 0 1px 1px rgba(15, 23, 42, 0.04);
}

.mobile-attachment-preview__frame,
.mobile-attachment-preview__image {
  border: 0;
}

.mobile-attachment-preview__image {
  display: block;
  height: auto;
  min-height: 0;
  object-fit: contain;
}

.mobile-attachment-preview__docx {
  padding: 26px 20px 34px;
  color: #202124;
  font-size: 9px;
  line-height: 1.65;
  white-space: pre-wrap;
}

.mobile-attachment-preview__docx p {
  margin: 0 0 13px;
}

.mobile-attachment-preview__fallback,
.mobile-attachment-preview__state {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a94a3;
  font-size: 13px;
}

.mobile-attachment-preview__fallback {
  width: 100%;
  max-width: 420px;
  flex-direction: column;
  gap: 10px;
  padding: 32px 22px;
  background: #ffffff;
  text-align: center;
}

.mobile-attachment-preview__fallback-icon {
  width: 62px;
  height: 62px;
  border-radius: 999px;
  background: #eff6ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-attachment-preview__fallback-name {
  max-width: 320px;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  word-break: break-word;
}

.mobile-attachment-preview__fallback-text {
  max-width: 280px;
  color: #8a94a3;
  font-size: 12px;
  line-height: 1.4;
}

.mobile-attachment-preview__fallback-link {
  min-height: 34px;
  margin-top: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  background: #b10f49;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
}
</style>
