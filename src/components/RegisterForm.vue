<script setup lang="ts">
import {
  NCard,
  NFormItem,
  NButton,
  NTabs,
  NTabPane,
  NForm,
  NFormItemRow,
  NInput,
  NCheckbox,
  NSpace,
  NPopover,
} from 'naive-ui'
import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '@/constants'
import { useRouter } from 'vue-router'

const router = useRouter()

const logUsername = ref('')
const logPassword = ref('')

const regEmail = ref('')
const regUsername = ref('')
const regPassword = ref('')
const regSecondPassword = ref('')
const acceptTerms = ref(false)

const submitRegisterForm = async () => {
  if(!acceptTerms.value || !regEmail.value || !regUsername.value || !regPassword.value || !regSecondPassword.value){
    alert('Uzupełnij wymagane pola.')
    return
  }

  const formData = new FormData()
  formData.append('username', regUsername.value)
  formData.append('password1', regPassword.value)
  formData.append('password2', regSecondPassword.value)
  formData.append('email', regEmail.value)

  try {
    const res = await axios.post(`${API_URL}register/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Pomyślna rejestracja ', res.data)
    alert('Aktywuj konto i zaloguj się, aby korzystać z aplikacji.')

    router.push({ name: 'register' })
  } catch (err) {
    console.log('Błąd podczas rejestracji ', err)

    if (axios.isAxiosError(err)) {
      console.log('STATUS:', err.response?.status)
      console.log('DATA:', err.response?.data)
    }
  }
}

const submitLoginForm = async () => {
  if(!logUsername.value || !logPassword.value){
    alert('Uzupełnij wymagane pola.')
    return
  }

  try {
    const login = await axios.post(`${API_URL}api/token/`, {
      username: logUsername.value,
      password: logPassword.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    localStorage.setItem('access', login.data.access)
    localStorage.setItem('refresh', login.data.refresh)

    router.push({ name: 'home' })
    console.log('Pomyślne logowanie ', login.data)
  } catch (err) {
    console.log('Błąd podczas logowania ', err)

    if (axios.isAxiosError(err)) {
      console.log('STATUS:', err.response?.status)
      console.log('DATA:', err.response?.data)
    }
  }
}
</script>

<template>
  <div class="back">
    <n-card class="card">
      <n-form-item>
        <n-button @click="" style="width: 100%; margin: 0 auto">
          Wykorzystaj konto Google
        </n-button>
      </n-form-item>

      <n-form-item>
        <h3 style="width: 80%; margin: 0 auto">Użyj nowych danych</h3>
      </n-form-item>

      <n-form-item>
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="Logowanie">
            <n-form @submit.prevent="submitLoginForm">
              <n-form-item-row label="username lub e-mail" required>
                <n-input v-model:value="logUsername" style="width: 80%; margin: 0 auto" />
              </n-form-item-row>
              <n-form-item-row label="hasło" required>
                <n-input v-model:value="logPassword" style="width: 80%; margin: 0 auto" />
              </n-form-item-row>
              <n-button type="primary" attr-type="submit" block secondary strong> Zaloguj</n-button>
            </n-form>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="Rejestracja">
            <n-form @submit.prevent="submitRegisterForm">
              <n-form-item-row label="username" required>
                <n-input v-model:value="regUsername" style="width: 80%; margin: 0 auto" />
              </n-form-item-row>
              <n-form-item-row label="e-mail" required>
                <n-input v-model:value="regEmail" style="width: 80%; margin: 0 auto" />
              </n-form-item-row>
              <n-form-item-row label="hasło" required style="justify-content: center">
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-input v-model:value="regPassword" style="width: 80%; margin: 0 auto" />
                  </template>
                  <div>
                    Hasło musi zawierać:
                    <ul style="text-align: left; padding-left: 16px">
                      <li>minimum 8 znaków</li>
                      <li>jedną cyfrę</li>
                      <li>specjalny znak (!@#$%^&*)</li>
                    </ul>
                  </div>
                </n-popover>
              </n-form-item-row>
              <n-form-item-row label="powtórz hasło" required>
                <n-input v-model:value="regSecondPassword" style="width: 80%; margin: 0 auto" />
              </n-form-item-row>
              <n-space>
                <n-checkbox v-model:checked="acceptTerms" style="margin-right: 12px" required>
                  Akceptuj regulamin korzystania z Notateq
                </n-checkbox>
              </n-space>
              <n-button
                class="register-button"
                type="primary"
                attr-type="submit"
                block
                secondary
                strong
              >
                Utwórz nowe konto
              </n-button>
            </n-form>
          </n-tab-pane>
        </n-tabs>
      </n-form-item>
    </n-card>
  </div>
</template>

<style scoped>
.back {
  background: #14532d;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  display: flex;
  align-items: center;
  max-width: 450px;
  min-height: 650px;
  max-height: none;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  text-align: center;
}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}

.register-button {
  margin-top: 12px;
}
</style>
