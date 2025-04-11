<script setup lang="ts">
import { ref } from 'vue'
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
  NDynamicInput,
} from 'naive-ui'
import axios from 'axios'
import type { UploadFileInfo } from 'naive-ui'
import { useRouter } from 'vue-router'
import { API_URL } from '../constants'

const router = useRouter()

const title = ref('')
const fileList = ref<UploadFileInfo[]>([])
const category = ref(null)
const description = ref('')
const author = ref('')
const formattedValue = ref('2025-01-01 00:00:00')
const tags = ref(['yout tag'])
const books = ref([])

const categoryOptions = [
  { label: 'Matematyka', value: 'matematyka' },
  { label: 'Fizyka', value: 'fizyka' },
  { label: 'Informatyka', value: 'informatyka' },
  { label: 'Geografia', value: 'geografia' },
  { label: 'Język angielski', value: 'angielski' },
  { label: 'Język polski', value: 'polski' },
  { label: 'Biologia', value: 'biologia' },
]

const submitForm = async () => {
  if (
    !title.value ||
    fileList.value.length === 0 ||
    !category.value ||
    !description.value ||
    !author.value ||
    !formattedValue.value
    //tags opcjonalne (?)
    //bibliografia opcjonalnie (?)
  ) {
    alert('Uzupełnij wymagane pola!')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('category', category.value)
  formData.append('author', author.value)
  formData.append('file', fileList.value[0].file as File)
  formData.append('date', formattedValue.value)
  //formData.append('tags', tags.value)

  try {
    const res = await axios.post(`${API_URL}/api/files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Wysłano pomyślnie ', res.data)
    alert('Plik został pomyślnie przesłany.')
    await router.push({ name: 'home' })
  } catch (err) {
    console.log('Błąd podczas wysyłania pliku ', err)
  }

  title.value = ''
  category.value = null
  fileList.value = []
  description.value = ''
  author.value = ''
  formattedValue.value = '2025-01-01 00:00:00'
  tags.value = ['your tag', 'tkowi']
  books.value = []
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
              <n-upload v-model:file-list="fileList" :max="1">
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

            <n-form-item label="Kategoria:" required>
              <n-select
                v-model:value="category"
                :options="categoryOptions"
                placeholder="Wybierz kategorię"
                class="gradient-select"
              />
            </n-form-item>

            <n-form-item label="Opis:" required>
              <n-input
                v-model:value="description"
                type="textarea"
                placeholder="Wprowadź opis"
                class="inputText"
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
          <n-form-item label="Ustaw datę:" required>
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
          <n-form-item label="Dodaj bibliografię:">
            <n-dynamic-input v-model:value="books" placeholder="Wpisz nazwę ksiązki:" />
          </n-form-item>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-config-provider>
</template>

<style scoped>
.upload-form {
  max-width: 600px;
  height: 650px;
  max-height: 800px;
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
