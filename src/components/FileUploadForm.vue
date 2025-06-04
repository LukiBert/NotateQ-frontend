<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  NInputGroup,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NUpload,
  NTabPane,
  NTabs,
  NDatePicker,
  NDynamicTags,
  NFlex,
  NIcon,
  NUploadDragger,
  NText,
  NP,
  NSpin,
  useMessage,
  type UploadFileInfo,
} from 'naive-ui'
import { MdArchive, IosRemoveCircle, MdSearch, IosAddCircle } from '@vicons/ionicons4'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { addCategoryLabels, formatDate, type Category, type Book } from '@/constants'
import { getAllCategories, searchBibliography } from '@/constants/requests'
import API from '@/constants/api'

const message = useMessage()

const router = useRouter()

const MAX_MB = 10
const MAX_FILE_SIZE_MB = MAX_MB * 1024 * 1024

const title = ref<string>('')
const uploadedFile = ref<UploadFileInfo[]>()

const selectedCategories = ref<number[]>([])
const fetchedCategories = ref<Category[]>([])
const categoryOptions = computed(() => {
  return addCategoryLabels(fetchedCategories.value)
})

const author = ref<string>('')
const description = ref<string>('')
const noteDate = ref<number>()
const tags = ref<string[]>([])

const searchQuery = ref<string>('')
const searchResults = ref<Book[]>([])
const selectedBooks = ref<Book[]>([])
const searchingForBooks = ref<boolean>(false)

async function fetchBibliography() {
  if (!searchQuery.value || searchQuery.value === '') {
    message.info('Wprowadź tytuł książki do wyszukania.', { duration: 5000 })
    return
  }
  try {
    searchingForBooks.value = true
    searchResults.value = await searchBibliography(searchQuery.value)
  } finally {
    searchingForBooks.value = false
  }
}

const addBook = (book: Book) => {
  if (!selectedBooks.value.some((b) => b.title === book.title)) {
    selectedBooks.value.push(book)
  } else {
    alert('Ta książka została już dodana.')
  }
}

const removeBook = (index: number) => {
  selectedBooks.value.splice(index, 1)
}

const formatAuthors = (authors: string[] | string): string => {
  return Array.isArray(authors) ? authors.join(', ') : authors
}

const handleBeforeUpload = ({ file }: { file: UploadFileInfo }) => {
  if (!file.file || !file.file.name) {
    message.error('Nieprawidłowy plik.', { duration: 5000 })
    return false
  }

  const allowedExtensions = ['.pdf', '.docx', '.txt']
  const fileName = file.file.name
  const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
  const isGoodExtension = allowedExtensions.some((ext) => fileExtension === ext)
  if (!isGoodExtension) {
    console.log
    message.warning('Dozwolone są tylko pliki PDF, DOCX lub TXT.', { duration: 5000 })
    return false
  }

  if (file.file.size > MAX_FILE_SIZE_MB) {
    message.warning(`Plik jest za duży. Maksymalny rozmiar to ${MAX_MB} MB.`, { duration: 5000 })
    return false
  }

  return true
}

function clearForm() {
  title.value = ''
  selectedCategories.value = []
  uploadedFile.value = undefined
  description.value = ''
  author.value = ''
  noteDate.value = undefined
  tags.value = ['']
  searchQuery.value = ''
  searchResults.value = []
  selectedBooks.value = []
}

const submitForm = async () => {
  if (
    !title.value ||
    !uploadedFile.value?.length ||
    !description.value ||
    selectedCategories.value.length === 0
  ) {
    alert('Uzupełnij wymagane pola - tytuł, plik oraz przynajmniej jedna kategoria!')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('author', author.value)
  formData.append('file', uploadedFile.value[0].file as File)

  if (!noteDate.value) noteDate.value = Date.now()
  formData.append('date', formatDate(noteDate.value))

  tags.value.forEach((t: string) => {
    formData.append('tags', t.toString())
  })
  selectedCategories.value.forEach((cat) => {
    formData.append('category_ids', cat.toString())
  })
  selectedBooks.value.forEach((b) => {
    formData.append('bibliography', b.title)
  })

  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value)
  // }

  try {
    const res = await API.post(`api/files/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    //console.log('Wysłano pomyślnie ', res.data)
    router.push({ name: 'home' })
    message.success('Plik został pomyślnie przesłany.', { duration: 5000 })
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('STATUS:', err.response?.status)
      console.log('DATA:', err.response?.data)
    }
    message.error('Błąd podczas wysyłania pliku.', { duration: 5000 })
    return
  }

  clearForm()
}

onMounted(async () => {
  fetchedCategories.value = await getAllCategories()
})
</script>

<template>
  <n-flex justify="center">
    <n-card class="upload-form-wrapper">
      <template #header>Dodaj notatkę</template>
      <n-tabs animated>
        <n-tab-pane name="1" tab="Informacje">
          <n-flex justify="center">
            <n-form
              @submit.prevent
              label-placement="left"
              require-mark-placement="right-hanging"
              label-width="auto"
              :style="{
                maxWidth: '900px',
              }"
            >
              <n-form-item required>
                <n-upload
                  v-model:file-list="uploadedFile"
                  directory-dnd
                  :max="1"
                  @before-upload="handleBeforeUpload"
                >
                  <n-upload-dragger>
                    <div style="margin-bottom: 12px">
                      <n-icon size="48" :depth="3">
                        <MdArchive />
                      </n-icon>
                    </div>
                    <n-text style="font-size: 16px">
                      Naciśnij lub przeciągnij wybrany plik w obręb pola
                    </n-text>
                    <n-p depth="3" style="margin: 8px 0 0 0">
                      Akceptowane są pliki w formacie PDF, DOCX lub TXT mniejsze niż {{ MAX_MB }}MB.
                    </n-p>
                  </n-upload-dragger>
                </n-upload>
              </n-form-item>

              <n-form-item label="Tytuł:" required>
                <n-input
                  v-model:value="title"
                  type="text"
                  placeholder="Wprowadź tytuł"
                  class="inputText"
                />
              </n-form-item>

              <n-form-item label="Kategorie:" required>
                <n-select
                  v-model:value="selectedCategories"
                  :options="categoryOptions"
                  placeholder="Wybierz kategorie"
                  multiple
                  class="gradient-select"
                />
              </n-form-item>

              <n-form-item label="Opis:" required>
                <n-input
                  v-model:value="description"
                  type="textarea"
                  placeholder="Wprowadź opis"
                  class="inputText"
                  maxlength="500"
                  show-count
                />
              </n-form-item>

              <n-form-item label="Notatka z dnia:">
                <n-date-picker
                  v-model:value="noteDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  clearable
                />
              </n-form-item>

              <n-form-item label="Dodaj tagi:">
                <n-dynamic-tags class="n-tag" v-model:value="tags" style="margin-top: 16px" />
              </n-form-item>
            </n-form>
          </n-flex>
        </n-tab-pane>
        <n-tab-pane name="2" tab="Bibliografia">
          <n-flex justify="center">
            <n-input-group class="search-input-group">
              <n-input
                placeholder="Wprowadź tytuł książki"
                v-model:value="searchQuery"
                @keyup.enter="fetchBibliography"
                round
              />
              <n-button @click="fetchBibliography" round>
                <n-icon><MdSearch /></n-icon>
              </n-button>
            </n-input-group>
          </n-flex>

          <div class="books-wrapper">
            <n-text strong>Dodane pozycje:</n-text>
            <div v-if="selectedBooks.length">
              <div v-for="(book, index) in selectedBooks" :key="index" class="book-container">
                <n-button @click="removeBook(index)" quaternary type="error">
                  <template #icon>
                    <n-icon size="24"> <IosRemoveCircle /> </n-icon>
                  </template>
                </n-button>
                <n-text>
                  <strong>{{ book.title }}</strong> - {{ formatAuthors(book.authors) }} ({{
                    book.publishedDate
                  }})
                </n-text>
              </div>
            </div>
            <n-p v-else style="margin: 1rem">Nie wybrano pozycji</n-p>
          </div>

          <n-spin :show="searchingForBooks">
            <div class="books-wrapper">
              <n-text strong>Wyniki wyszukania:</n-text>
              <div v-if="searchResults.length">
                <div v-for="(book, index) in searchResults" :key="index" class="book-container">
                  <n-button @click="addBook(book)" quaternary type="primary">
                    <template #icon>
                      <n-icon size="24"> <IosAddCircle /> </n-icon>
                    </template>
                  </n-button>
                  <n-text>
                    <strong>{{ book.title }}</strong> - {{ formatAuthors(book.authors) }} ({{
                      book.publishedDate
                    }})
                  </n-text>
                </div>
              </div>
              <n-p v-else-if="!searchingForBooks" style="margin: 1rem">Brak pozycji</n-p>
            </div>
            <template #description> Wyszukiwanie... </template>
          </n-spin>
        </n-tab-pane>
      </n-tabs>
      <template #action>
        <n-flex justify="center">
          <n-button @click="submitForm" type="success">Prześlij plik</n-button>
        </n-flex>
      </template>
    </n-card>
  </n-flex>
</template>

<style scoped>
.upload-form-wrapper {
  width: 100%;
  max-width: 350px;
  margin: 1rem;
}

.search-input-group {
  width: 100%;
  max-width: 500px;
}

.books-wrapper {
  margin: 1rem 0;
}

.book-container {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 8px;
  margin-bottom: 8px;
}

.book-details-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@media (min-width: 500px) {
  .upload-form-wrapper {
    max-width: 450px;
  }
}

@media (min-width: 768px) {
  .upload-form-wrapper {
    max-width: 700px;
  }
}

@media (min-width: 1024px) {
  .upload-form-wrapper {
    max-width: 900px;
  }
}
</style>
