<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
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
  NBadge,
  NFlex,
  NIcon,
  NUploadDragger,
  NText,
  NP,
  useMessage,
  type UploadFileInfo,
} from 'naive-ui'
import { MdArchive } from '@vicons/ionicons4'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { addCategoryLabels, type Category } from '@/constants'
import { getAllCategories, searchBibliography } from '@/constants/requests'
import API from '@/constants/api'

const message = useMessage()

const router = useRouter()

const MAX_MB = 5
const MAX_FILE_SIZE_MB = MAX_MB * 1024 * 1024

const getToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const title = ref('')
const fileList = ref<UploadFileInfo[]>([])
const category = ref<number[]>([])
const fetchedCategories = ref<Category[]>([])
const categoryOptions = computed(() => {
  return addCategoryLabels(fetchedCategories.value)
})
const description = ref('')
const author = ref('')
const formattedValue = ref(getToday())
const tags = ref<string[]>([])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedBooks = ref<any[]>([])

async function fetchBibliography() {
  if (!searchQuery.value) {
    message.info('Wprowadź tytuł książki do wyszukania.', { duration: 5000 })
    return
  }
  searchResults.value = await searchBibliography(searchQuery.value)
}

const addBook = (book: any) => {
  if (!selectedBooks.value.some((b) => b.title === book.title)) {
    selectedBooks.value.push(book)
  } else {
    alert('Ta książka została już dodana.')
  }
}

const removeBook = (index: number) => {
  selectedBooks.value.splice(index, 1)
}

const handleBeforeUpload = ({ file }: { file: UploadFileInfo }) => {
  if (!file.file || !file.file.name) {
    message.error('Nieprawidłowy plik.', { duration: 5000 })
    return false
  }

  const allowedExtensions = ['.pdf', '.docx', '.txt']
  const fileName = file.file.name
  const fileExtension = fileName?.substring(fileName.lastIndexOf('.')).toLowerCase()
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

  console.log(`OK`)
  return true
}

const submitForm = async () => {
  if (!title.value || !fileList.value.length || category.value.length === 0) {
    alert('Uzupełnij wymagane pola - tytuł, plik oraz przynajmniej jedna kategoria!')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('author', author.value)
  formData.append('file', fileList.value[0].file as File)
  formData.append('date', formattedValue.value.split(' ')[0])
  tags.value.forEach((t: string) => {
    formData.append('tags', t.toString())
  })
  category.value.forEach((cat) => {
    formData.append('categories', cat.toString())
  })
  selectedBooks.value.forEach((b) => {
    formData.append('bibliography', b.title)
  })

  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  // try {
  //   const res = await API.post(`api/files/`, formData, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('access')}`,
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })

  //   console.log('Wysłano pomyślnie ', res.data)
  //   router.push({ name: 'home' })
  //   message.success('Plik został pomyślnie przesłany.', { duration: 5000 })
  // } catch (err) {
  //   if (axios.isAxiosError(err)) {
  //     console.log('STATUS:', err.response?.status)
  //     console.log('DATA:', err.response?.data)
  //   }
  //   message.error('Błąd podczas wysyłania pliku.', { duration: 5000 })
  // }

  // title.value = ''
  // category.value = []
  // fileList.value = []
  // description.value = ''
  // author.value = ''
  // formattedValue.value = getToday()
  // tags.value = ['']
  // searchQuery.value = ''
  // searchResults.value = []
  // selectedBooks.value = []
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
                maxWidth: '640px',
              }"
            >
              <n-form-item required>
                <n-upload
                  v-model:file-list="fileList"
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
                      Akceptowane są pliki w formacie PDF, DOCX lub TXT mniejsze niż 5MB.
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
                  v-model:value="category"
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
                  v-model:formatted-value="formattedValue"
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
          <n-form>
            <n-form-item label="Wyszukaj książkę:">
              <div style="display: flex; width: 100%; align-items: center; gap: 8px">
                <n-input
                  v-model:value="searchQuery"
                  placeholder="Wprowadź tytuł książki"
                  style="flex-grow: 1"
                />
                <n-button @click="fetchBibliography" style="flex-shrink: 0">Szukaj</n-button>
              </div>
            </n-form-item>

            <n-form-item label="Wybrane książki:">
              <ul style="color: black">
                <li v-for="(book, index) in selectedBooks" :key="index">
                  {{ book.title }}
                  <n-button size="tiny" style="color: black" @click="removeBook(index)">
                    Usuń
                  </n-button>
                </li>
              </ul>
            </n-form-item>

            <n-form-item label="Wyniki wyszukiwania:">
              <div v-if="searchResults.length > 0">
                <ul style="color: black">
                  <li
                    v-for="(book, index) in searchResults"
                    :key="index"
                    style="margin-bottom: 8px"
                  >
                    <div>
                      <strong>{{ book.title }}</strong> - {{ book.authors?.join(', ') }} ({{
                        book.publishedDate
                      }})
                      <n-button
                        size="small"
                        style="margin-left: 8px; color: black"
                        @click="addBook(book)"
                        >Dodaj
                      </n-button>
                    </div>
                  </li>
                </ul>
              </div>
            </n-form-item>
          </n-form>
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
