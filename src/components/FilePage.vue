<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type FileData, getCategoryMap, incrementDownload, rateFile } from '../constants'
import { NDescriptions, NDescriptionsItem, NTime, NTag, NButton, NSkeleton, NRate } from 'naive-ui'
import PdfEmbed from 'vue-pdf-embed'

const props = defineProps<{
  fileData: FileData
  loading: boolean
}>()

const userRating = ref(0)

const categoryMap = ref<Record<number, string>>({})

const pdfUrl = computed(() => props.fileData.file);
const pdfRef = ref<InstanceType<typeof PdfEmbed> | null>(null)
const currentPage = ref(1)
const pageCount = ref(1)

function handleLoaded(pdf: any) {
  pageCount.value = pdf.numPages
}

function nextPage() {
  if (currentPage.value < pageCount.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}


onMounted(async () => {
  categoryMap.value = await getCategoryMap()
})

const categoryNames = computed(() => {
  return props.fileData.categories
    ?.map((id) => categoryMap.value[id])
    .filter(Boolean)
    .join(', ') || 'Brak kategorii'
})

async function downloadFile() {
  const filename = props.fileData.file.split('/').pop()
  const downloadUrl = `http://127.0.0.1:8000/download/${filename}`

  try {
    await incrementDownload(props.fileData.id)
    props.fileData.downloads += 1
  } catch (err) {
    console.error('Nie udało się zaktualizować pobrań:', err)
  }

  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute('download', '')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}




async function handleRate(value: number) {
  try {
    const result = await rateFile(props.fileData.id, value)
    props.fileData.rating = result.rating
    props.fileData.rating_count = result.rating_count
    userRating.value = value
  } catch (err) {
    console.error('Błąd podczas oceniania pliku:', err)
  }
}

</script>

<template>
  <div class="file-data-wrapper">
    <n-descriptions v-if="loading" class="file-data" label-placement="top" :column="3">
      <n-descriptions-item label="Autor">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Dodano">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Kategoria">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Tagi" :span="2">
        <n-skeleton text width="60%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Pobrano">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Opis">
        <n-skeleton text :repeat="3" width="80%"></n-skeleton>
      </n-descriptions-item>
    </n-descriptions>

    <n-descriptions
      v-else
      class="file-data"
      label-placement="top"
      :title="fileData.title"
      :column="3"
    >
      <n-descriptions-item label="Autor">{{ fileData.author }} </n-descriptions-item>

      <n-descriptions-item label="Dodano">
        <n-time :time="new Date(fileData.upload_date)" format="yyyy-MM-dd"></n-time>
      </n-descriptions-item>

      <n-descriptions-item label="Kategoria"> {{ categoryNames }} </n-descriptions-item>

      <n-descriptions-item label="Tagi" :span="2">
        <n-tag v-for="(tag, index) in fileData.tag_names" :key="index" type="info" size="small">
          {{ tag }}
        </n-tag>
      </n-descriptions-item>

      <n-descriptions-item label="Pobrano">{{ fileData.downloads }} </n-descriptions-item>

      <n-descriptions-item label="Opis">{{ fileData.description }} </n-descriptions-item>

      <n-descriptions-item label="Ocena" :span="3">
    <div>
      <div>Średnia: {{ fileData.rating.toFixed(1) }} ({{ fileData.rating_count }} ocen)</div>
      <n-rate
        v-model:value="userRating"
        allow-half
        @update:value="handleRate"
      />
    </div>
      </n-descriptions-item>

    </n-descriptions>

    <n-button type="primary" @click="downloadFile">
      Pobierz plik
    </n-button>


<div v-if="fileData.file.endsWith('.pdf')" class="pdf-preview-container">
  <div class="pdf-controls">
  <n-button @click="prevPage" :disabled="currentPage <= 1">←</n-button>
  <span>Strona {{ currentPage }} z {{ pageCount }}</span>
  <n-button @click="nextPage" :disabled="currentPage >= pageCount">→</n-button>
</div>

  <div class="pdf-inner-wrapper">
   <PdfEmbed
  ref="pdfRef"
  :source="pdfUrl"
  :page="currentPage"
  @loaded="handleLoaded"
  class="pdf-embed"
/>
  </div>
</div>

  </div>
</template>

<style scoped>
.file-data-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
}
.file-data {
  width: 80%;
  min-width: 300px;
}

.pdf-preview-container {
  margin: 2rem auto;
  width: 100%;
  max-width: 800px;
  height: auto;
  aspect-ratio: 8.5 / 11;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.pdf-inner-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.pdf-inner-wrapper > * {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.pdf-embed {
  width: 100%;
  height: auto;
}

.pdf-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}



</style>
