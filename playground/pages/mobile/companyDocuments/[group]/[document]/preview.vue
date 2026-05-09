<template>
  <div class="mobile-company-document-preview">
    <header class="mobile-company-document-preview__header">
      <button
        type="button"
        class="mobile-company-document-preview__back"
        @click="handleBack"
      >
        <IconCustom
          name="chevron-right"
          :size="18"
          :rotate="180"
          color="#B10F49"
        />
      </button>
      <h1 class="mobile-company-document-preview__title">
        {{ previewFile?.fileName || fileName }}
      </h1>
      <div class="mobile-company-document-preview__spacer" />
    </header>

    <main class="mobile-company-document-preview__content">
      <div
        v-if="loading"
        class="mobile-company-document-preview__state"
      >
        Loading...
      </div>

      <div
        v-else
        class="mobile-company-document-preview__stage"
      >
        <img
          v-if="blobUrl && isImage"
          :src="blobUrl"
          :alt="previewFile?.fileName || fileName"
          class="mobile-company-document-preview__page mobile-company-document-preview__image"
        >

        <iframe
          v-else-if="blobUrl && isPdf"
          :src="blobUrl"
          class="mobile-company-document-preview__page mobile-company-document-preview__frame"
          title="Company document preview"
        />

        <article
          v-else-if="isDocx && docxParagraphs.length"
          class="mobile-company-document-preview__page mobile-company-document-preview__docx"
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
          class="mobile-company-document-preview__page mobile-company-document-preview__fallback"
        >
          <span class="mobile-company-document-preview__fallback-icon">
            <IconCustom
              name="document"
              :size="34"
              color="#B10F49"
            />
          </span>
          <span class="mobile-company-document-preview__fallback-name">
            {{ previewFile?.fileName || fileName }}
          </span>
          <a
            v-if="blobUrl"
            :href="blobUrl"
            :download="previewFile?.fileName || fileName"
            class="mobile-company-document-preview__download"
          >
            Download
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface CompanyDocumentPreviewResponse {
  data?: string
  fileName?: string
  contentType?: string
  documentId?: string
}

definePageMeta({
  layout: false,
  middleware: 'auth',
})

const route = useRoute()
const groupSlug = computed(() => String(route.params.group || ''))
const documentSlug = computed(() => String(route.params.document || ''))
const folderbaseid = computed(() => String(route.query.folderbaseid || groupSlug.value))
const groupTitle = computed(() => String(route.query.groupTitle || 'Company Documents'))
const fixedPreviewFileName = 'testpdf.pdf'
const fixedPreviewServerRelativeUrl = '%2Fsites%2FDCHGroupLegalCompliancePublicSite%2FTemplates%2FShared%20Documents%2FKey%20Functions%20-%2002.%20Contract%20Templates%20%26%20Digital%20Playbooks%2F%E5%86%85%E5%9C%B0%E7%89%A9%E6%B5%81%2F01.%20Digital%20Playbooks%2F02.%20Non%E2%80%91Disclosure%20Agreement%20Playbook%2Ftestpdf.pdf'
const fileName = computed(() => fixedPreviewFileName)
const serverRelativeUrl = computed(() => fixedPreviewServerRelativeUrl)
const selectedDocumentPreview = useState<CompanyDocumentPreviewResponse | null>('company-document:selected-preview', () => null)
const loading = ref(false)
const blobUrl = ref('')
const docxParagraphs = ref<string[]>([])
const docxPreviewToken = ref(0)

const previewFile = computed(() => {
  return selectedDocumentPreview.value?.documentId === documentSlug.value
    ? selectedDocumentPreview.value
    : null
})

const normalizedContentType = computed(() => {
  const contentType = previewFile.value?.contentType || ''
  const name = previewFile.value?.fileName || fileName.value

  if (contentType.includes('application/octet-stream')) {
    if (/\.pdf$/i.test(name)) {
      return 'application/pdf'
    }

    if (/\.(?:png|jpe?g|gif|webp|bmp|svg)$/i.test(name)) {
      return `image/${name.split('.').pop()?.replace('jpg', 'jpeg') || 'png'}`
    }

    if (/\.docx$/i.test(name)) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  }

  return contentType || 'application/octet-stream'
})

const isPdf = computed(() => normalizedContentType.value.includes('application/pdf') || /\.pdf$/i.test(previewFile.value?.fileName || fileName.value))
const isImage = computed(() => normalizedContentType.value.startsWith('image/') || /\.(?:png|jpe?g|gif|webp|bmp|svg)$/i.test(previewFile.value?.fileName || fileName.value))
const isDocx = computed(() => /\.docx$/i.test(previewFile.value?.fileName || fileName.value)
  || normalizedContentType.value.includes('wordprocessingml.document'))

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

const loadPreview = async () => {
  if (previewFile.value?.data) {
    return
  }

  loading.value = true
  try {
    const response = await $fetch<CompanyDocumentPreviewResponse>('/api/ecologyOa/companyDocumentPreview', {
      method: 'GET',
      query: {
        serverRelativeUrl: serverRelativeUrl.value,
        fileName: fileName.value,
      },
    })
    selectedDocumentPreview.value = {
      ...response,
      documentId: documentSlug.value,
    }
  }
  finally {
    loading.value = false
  }
}

const handleBack = () => {
  return navigateTo({
    path: `/mobile/companyDocuments/${encodeURIComponent(groupSlug.value)}/${encodeURIComponent(documentSlug.value)}`,
    query: {
      groupTitle: groupTitle.value,
      folderbaseid: folderbaseid.value,
      serverRelativeUrl: serverRelativeUrl.value,
      fileName: fileName.value,
    },
  })
}

watch(
  previewFile,
  async (file) => {
    docxPreviewToken.value += 1
    const token = docxPreviewToken.value
    revokeBlobUrl()
    docxParagraphs.value = []

    if (file?.data && import.meta.client) {
      const bytes = base64ToBytes(file.data)
      blobUrl.value = bytesToBlobUrl(bytes, normalizedContentType.value)

      if (isDocx.value) {
        try {
          const paragraphs = await extractDocxParagraphs(bytes)

          if (token === docxPreviewToken.value) {
            docxParagraphs.value = paragraphs
          }
        }
        catch (error) {
          console.error('DOCX preview parse failed:', error)
        }
      }
    }
  },
  { immediate: true },
)

onMounted(loadPreview)
onBeforeUnmount(revokeBlobUrl)
</script>

<style scoped>
.mobile-company-document-preview {
  min-height: 100%;
  background: #eeeeee;
}

.mobile-company-document-preview__header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  min-height: calc(52px + env(safe-area-inset-top));
  padding: calc(8px + env(safe-area-inset-top)) 14px 8px;
  background: #ffffff;
  border-bottom: 1px solid #e7e7e7;
}

.mobile-company-document-preview__back {
  width: 32px;
  height: 32px;
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.mobile-company-document-preview__title {
  margin: 0;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-company-document-preview__spacer {
  width: 32px;
  height: 32px;
}

.mobile-company-document-preview__content {
  min-height: calc(100vh - 52px - env(safe-area-inset-top));
  padding: 8px 15px 32px;
  background: #eeeeee;
}

.mobile-company-document-preview__stage {
  display: flex;
  justify-content: center;
  width: 100%;
}

.mobile-company-document-preview__page {
  width: 100%;
  max-width: 720px;
  min-height: calc(100vh - 84px - env(safe-area-inset-top));
  border: 1px solid #dddddd;
  background: #ffffff;
  box-shadow: 0 1px 1px rgba(15, 23, 42, 0.04);
}

.mobile-company-document-preview__frame,
.mobile-company-document-preview__image {
  border: 0;
}

.mobile-company-document-preview__image {
  display: block;
  height: auto;
  min-height: 0;
  object-fit: contain;
}

.mobile-company-document-preview__state,
.mobile-company-document-preview__fallback {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a94a3;
  font-size: 13px;
}

.mobile-company-document-preview__docx {
  padding: 26px 20px 34px;
  color: #202124;
  font-size: 9px;
  line-height: 1.65;
  white-space: pre-wrap;
}

.mobile-company-document-preview__docx p {
  margin: 0 0 13px;
}

.mobile-company-document-preview__fallback {
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
}

.mobile-company-document-preview__fallback-icon {
  width: 62px;
  height: 62px;
  border-radius: 999px;
  background: #fff3f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-company-document-preview__fallback-name {
  max-width: 280px;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-company-document-preview__download {
  min-width: 112px;
  min-height: 36px;
  padding: 8px 16px;
  border-radius: 999px;
  background: #a60a3a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}
</style>
