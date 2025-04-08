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
} from 'naive-ui'
import axios from 'axios'
import type { UploadFileInfo } from 'naive-ui'

const title = ref('')
const fileList = ref<UploadFileInfo[]>([])
const category = ref(null)
const description = ref('')
const author = ref('')

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

  if (!title.value || fileList.value.length === 0 || !category || !description.value || !author.value) {
    alert('Wszystkie pola są wymagane (na razie bez categorii)!')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  //formData.append('category', category.value)
  formData.append('author', author.value)
  formData.append('file', fileList.value[0].file as File)



  try {
    const res = await axios.post('http://20.26.121.115:8000/api/files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Wysłano pomyślnie ', res.data)
    alert('Plik został pomyślnie przesłany.')
  } catch (err) {
    console.log('Błąd podczas wysyłania pliku ', err)
    alert('Nie udało się przesłać pliku.')
  }

  title.value = ''
  category.value = null
  description.value = ''
  author.value = ''
}
</script>

<template>
  <n-config-provider
    :theme-overrides="{
      Select: {
        peers: {
          InternalSelection: {
            color: 'rgba(0, 0, 0, 0.75)',
            textColor: '#888',
            colorActive: 'black',
            placeholderColor: '#888',
          },
          InternalSelectMenu: {
            color: 'rgba(0, 0, 0, 1)',
          },
        },
      },
      Input: {
        color: 'rgba(0, 0, 0, 0.75)',
        textColor: '#888',
        placeholderColor: '#888',
      },
    }"
  >
    <n-card class="upload-form">
      <div class="container">
        <h2>Dodaj plik</h2>

        <n-form @submit.prevent="submitForm">
          <n-form-item label="Wybierz plik" required>
            <n-upload v-model:file-list="fileList">
              <n-button>Wybierz plik</n-button>
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
            <n-button class="dark-button" type="primary" attr-type="submit"> Dodaj </n-button>
          </n-form-item>
        </n-form>
      </div>
    </n-card>
  </n-config-provider>
</template>

<style scoped>
.upload-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to right top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.25));
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-height: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to left top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.25));
  border-radius: 15px;
  position: relative;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: auto;
}

.upload-button {
  color: #888;
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to left top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
}

.upload-button:hover {
  color: #888;
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to left top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
}

.upload-button:enabled {
  color: #888;
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to left top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
}

h2 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputText {
  background: rgba(0, 0, 0, 0.75);
  background: linear-gradient(to left top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
}
</style>
