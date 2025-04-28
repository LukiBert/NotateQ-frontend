<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NConfigProvider,
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
} from 'naive-ui'
import axios from 'axios'
import type { UploadFileInfo } from 'naive-ui'
import { useRouter } from 'vue-router'
import { API_URL } from '../constants'

const router = useRouter()

const getToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} 00:00:00`
}

const title = ref('')
const fileList = ref<UploadFileInfo[]>([])
const category = ref<number[]>([])
const categoryOptions = ref<any[]>([])
const description = ref('')
const author = ref('')
const formattedValue = ref(getToday())
const tags = ref(['your tag'])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedBooks = ref<any[]>([])


const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}api/categories/`)
    categoryOptions.value = res.data.map((category: { id: number; name: string }) => ({
      label: category.name,
      value: category.id,
    }))
  } catch (err) {
    console.error('Błąd podczas pobierania kategorii:', err)
    alert('Błąd podczas pobierania kategorii.')
  }
}

onMounted(() => {
  fetchCategories()
})

const handleBeforeUpload = (file: UploadFileInfo, fileList: UploadFileInfo[]) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt']
  const isGoodExtension = allowedExtensions.some((ext) => file.file?.name?.endsWith(ext))

  if (!isGoodExtension) {
    alert('Dozwolone są tylko pliki PDF, DOCX lub TXT.')
    return false
  }

  return true
}

const searchBibliography = async () => {
  if (!searchQuery.value) {
    alert('Wprowadź tytuł książki do wyszukania.')
    return
  }
  try {
    const res = await axios.get(`${API_URL}api/books/search/${searchQuery.value}`)
    searchResults.value = res.data
  } catch (err) {
    console.error('Błąd podczas wyszukiwania książek:', err)
    alert('Błąd podczas wyszukiwania książek.')
  }
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


const submitForm = async () => {
  if (!title.value || !fileList.value.length || !author.value) {
    alert('Uzupełnij wymagane pola!')
    return
  }

  if (description.value.length > 500) {
    alert('Opis jest za długi. Maksymalna długość to 500 znaków.')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('author', author.value)
  formData.append('file', fileList.value[0].file as File)
  formData.append('date', formattedValue.value.split(' ')[0])
  // formData.append('tags', JSON.stringify(tags.value))
  // formData.append('bibliography', JSON.stringify(selectedBooks.value.map(b => b.id))) //póki co nie da dodać się książek do bazy
  tags.value.forEach((t) => {
    formData.append('tags', t.toString())
  })
  category.value.forEach((cat) => {
    formData.append('categories', cat.toString())
  })
  // selectedBooks.value.forEach((b) => {
  //   formData.append('bibliography', b.id)
  // })

  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  try {
    const res = await axios.post(`${API_URL}api/files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Wysłano pomyślnie ', res.data)
    alert('Plik został pomyślnie przesłany.')
    router.push({ name: 'home' })
  } catch (err) {
    console.log('Błąd podczas wysyłania pliku ', err)

    if (axios.isAxiosError(err)) {
      console.log('STATUS:', err.response?.status)
      console.log('DATA:', err.response?.data)
      alert(err.response?.data?.file[0])
    }
  }

  title.value = ''
  category.value = []
  fileList.value = []
  description.value = ''
  author.value = ''
  formattedValue.value = getToday()
  tags.value = ['your tag']
  searchQuery.value = ''
  searchResults.value = []
  selectedBooks.value = []
}
</script>

<template>
  <n-config-provider
    :theme-overrides="{
      Select: {
        peers: {
          InternalSelection: {
            color: 'rgba(123, 124, 130, 0.1)',
            textColor: 'black',
            placeholderColor: 'black',
          },
          InternalSelectMenu: {
            color: 'rgba(123, 124, 130, 1)',
          },
        },
      },
      Input: {
        color: 'rgba(123, 124, 130, 0.1)',
        textColor: 'rgba(0, 0, 0, 1)',
        colorActive: 'rgba(123, 124, 130, 0.1)',
        placeholderColor: 'black',
      },
    }"
  >
    <n-card class="upload-form">
      <n-tabs
        class="card-tabs"
        default-value="first"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <n-tab-pane name="first" tab="Załącz plik">
          <n-form @submit.prevent="submitForm">
            <n-form-item label="Wybierz plik" required>
              <n-upload
                v-model:file-list="fileList"
                :max="1"
                :on-before-upload="handleBeforeUpload"
              >
                <n-button class="inputText">Wybierz plik</n-button>
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

            <n-form-item label="Kategorie:">
              <n-select
                v-model:value="category"
                :options="categoryOptions"
                placeholder="Wybierz kategorie"
                multiple
                class="gradient-select"
              />
            </n-form-item>

            <n-badge style="margin-left: 135px;" :value="description.length" :max="500" />

            <n-form-item label="Opis (max 500 znaków):">
                <n-input
                  v-model:value="description"
                  type="textarea"
                  placeholder="Wprowadź opis"
                  class="inputText"
                  maxlength="500"
                />
            </n-form-item>

            <n-form-item label="Autor:" required>
              <n-input
                v-model:value="author"
                type="text"
                placeholder="Podaj nazwę autora"
                class="inputText"
              />
            </n-form-item>

            <n-form-item>
              <n-button class="dark-button" type="primary" attr-type="submit"> Dodaj</n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="second" tab="Dodaj datę i tagi">
          <pre>{{ formattedValue }}</pre>
          <n-form-item label="Ustaw datę:">
            <n-date-picker
              v-model:formatted-value="formattedValue"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
            />
          </n-form-item>
          <n-form-item label="Dodaj tagi:">
            <n-dynamic-tags class="n-tag" v-model:value="tags" style="margin-top: 16px" />
          </n-form-item>
        </n-tab-pane>
        <n-tab-pane name="third" tab="Dodaj bibliografię">
          <n-form-item label="Wyszukaj książkę:">
            <div style="display: flex; width: 100%; align-items: center; gap: 8px">
              <n-input
                v-model:value="searchQuery"
                placeholder="Wprowadź tytuł książki"
                style="flex-grow: 1"
              />
              <n-button @click="searchBibliography" style="flex-shrink: 0">Szukaj</n-button>
            </div>
          </n-form-item>

          <n-form-item label="Wyniki wyszukiwania:">
            <div v-if="searchResults.length > 0">
              <ul style="color: black">
                <li v-for="(book, index) in searchResults" :key="index" style="margin-bottom: 8px">
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

          <n-form-item label="Wybrane książki:">
            <ul style="color: black">
              <li v-for="(book, index) in selectedBooks" :key="index">
                {{ book.title }}
                <n-button size="tiny" style="color: black" @click="removeBook(index)"
                  >Usuń</n-button
                >
              </li>
            </ul>
          </n-form-item>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-config-provider>
</template>

<style scoped>
.upload-form {
  max-width: 600px;
  min-height: 650px;
  max-height: none;
  margin: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to right top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.25));
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputText {
  color: black;
  background-color: rgba(123, 124, 130, 0.1);
}

.inputText :deep(.n-input__input:focus) {
  background-color: rgba(123, 124, 130, 0.1);
}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}

:deep(.n-tag) {
  color: black;
  background-color: rgba(123, 124, 130, 0.1);
}
</style>
