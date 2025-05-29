<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type FileData, getCategoryMap, incrementDownload, rateFile, getUserRating, fetchComments, postComment } from '../constants'
import { NTime, NTag, NButton, NRate, NInput, NSpace, NCard, NFlex, NText } from 'naive-ui'
import PdfEmbed from 'vue-pdf-embed'

const props = defineProps<{
  fileData: FileData
  loading: boolean
}>()

const userRating = ref(0)

const categoryMap = ref<Record<number, string>>({})

const pdfUrl = computed(() => props.fileData.file)
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

  if (localStorage.getItem('access')) {
    const rating = await getUserRating(props.fileData.id)
    if (rating !== null) {
      userRating.value = rating
      hasRated.value = true
    }
  }

  await loadComments()
})


const categoryNames = computed(() => {
  return props.fileData.categories?.map((id) => categoryMap.value[id]).filter(Boolean)
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

const hasRated = ref(false)
const hasRatedShow = ref(false)

async function handleRate(value: number) {
  if (!localStorage.getItem('access')) {
    alert('Musisz być zalogowany, aby ocenić plik.')
    userRating.value = 0
    return
  }

  try {
    await rateFile(props.fileData.id, value)
    userRating.value = value
    hasRated.value = true
    hasRatedShow.value = true
  } catch (err) {
    console.error('Błąd podczas oceniania pliku:', err)
  }
}

const comments = ref<any[]>([])
const newComment = ref('')

async function loadComments() {
  try {
    comments.value = await fetchComments(props.fileData.id)
  } catch (err) {
    console.error('Błąd pobierania komentarzy:', err)
  }
}

async function handleAddComment() {
  if (!localStorage.getItem('access')) {
    alert('Musisz być zalogowany, aby dodać komentarz.')
    return
  }

  if (!newComment.value.trim()) {
    alert('Komentarz nie może być pusty.')
    return
  }

  try {
    await postComment(props.fileData.id, newComment.value)
    newComment.value = ''
    await loadComments()
  } catch (err) {
    console.error('Błąd podczas dodawania komentarza:', err)
  }
}
</script>

<template>
  <div class="file-data-wrapper">
    <n-card
      v-if="!loading"
      bordered
      size="large"
      :segmented="{ content: true, footer: 'soft' }"
      class="file-data-info"
    >
      <template #header>
        <h1 style="font-weight: bold">
          {{ fileData.title }}
        </h1>
      </template>

      <div class="info-grid">
        <div><n-text strong>Autor:</n-text> {{ fileData.author }}</div>
        <div><n-text strong>Dotyczy wydarzenia:</n-text> {{ fileData.date }}</div>
        <div class="span-2">
          <n-text strong>Dodano: </n-text>
          <n-time :time="new Date(fileData.upload_date)" format="yyyy-MM-dd" />
        </div>
        <div>
          Pobrano: <n-text strong>{{ fileData.downloads }}</n-text>
        </div>
        <div>
          <n-text v-if="!hasRatedShow">
            Średnia:
            <n-text strong>{{ fileData.rating.toFixed(1) }}</n-text>
            ({{ fileData.rating_count }} ocen)
          </n-text>
          <n-text v-else>
            Dałeś ocenę: {{ userRating }}
          </n-text>
          <n-rate v-model:value="userRating" @update:value="handleRate" />
        </div>
        <div>
          <n-text strong>Kategorie:</n-text>
          <n-space wrap>
            <n-tag v-for="(cat, index) in categoryNames" :key="'cat-' + index" type="success" round>
              {{ cat }}
            </n-tag>
          </n-space>
        </div>
        <div>
          <n-text strong>Tagi:</n-text>
          <n-space wrap>
            <n-tag
              v-for="(tag, index) in fileData.tag_names"
              :key="'tag-' + index"
              type="info"
              round
            >
              {{ tag }}
            </n-tag>
          </n-space>
        </div>
        <div class="span-2">
          <n-text strong>Bibliografia:</n-text>
          <n-space>
            <n-tag v-if="fileData.bibliography_titles.length <= 0" round>Brak</n-tag>
            <n-tag
              v-for="(book, index) in fileData.bibliography_titles"
              :key="'book-' + index"
              round
              style="text-wrap: wrap"
            >
              {{ book }}
            </n-tag>
          </n-space>
        </div>
        <div class="span-2">
          <n-text strong>Opis:</n-text>
          <p>{{ fileData.description }}</p>
        </div>
      </div>

      <template #action>
        <n-flex justify="center">
          <n-button size="large" type="primary" @click="downloadFile"> Pobierz plik </n-button>
        </n-flex>
      </template>
    </n-card>

    <!-- Nowy kontener lokalny -->
<div class="pdf-and-comments">
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

  <!-- Komentarze -->
<div class="comments-section">
  <div class="comment-form">
    <n-input
      v-model:value="newComment"
      type="textarea"
      placeholder="Napisz komentarz..."
      autosize
    />
    <n-button
      type="primary"
      style="margin-top: 0.5rem;"
      @click="handleAddComment"
    >
      Dodaj komentarz
    </n-button>
  </div>

  <div v-if="comments.length === 0">
    Brak komentarzy. Bądź pierwszym!
  </div>

  <div v-for="comment in comments" :key="comment.id" class="comment">
    <div class="comment-header">
      <span><strong>{{ comment.author_username }}</strong></span>
      <span>{{ new Date(comment.created_at).toLocaleDateString() }}</span>
    </div>
    <div class="comment-body">
      {{ comment.content }}
    </div>
  </div>
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
.file-data-info {
  max-width: 300px;
  margin: auto;
  margin-top: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px 26px;
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

.comments-section {
  width: 80%;
  max-width: 1800px;
  margin-top: 15rem;
  padding: 1rem;
  border-top: 2px solid transparent;
  padding-left: 15rem;
  align-self: flex-start;
  text-align: left;
}

.comment-form {
  margin-bottom: 1.5rem;
}

.comment {
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 1rem;
  background-color: #fafafa;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.comment-body {
  font-size: 1rem;
  color: #333;
}

.pdf-and-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

@media (min-width: 500px) {
  .file-data-info {
    max-width: 420px;
  }
}

@media (min-width: 768px) {
  .file-data-info {
    max-width: 700px;
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .span-2 {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .file-data-info {
    max-width: 900px;
  }
}
</style>
