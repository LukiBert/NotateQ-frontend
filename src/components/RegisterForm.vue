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
import axios, { AxiosError } from 'axios'
import API from '@/constants/api'
import { useRouter } from 'vue-router'
import { isLoggedIn, myId } from '@/constants/authState'
import { jwtDecode } from 'jwt-decode'
import { useMessage } from 'naive-ui'

const message = useMessage()

const router = useRouter()

const logUsername = ref('')
const logPassword = ref('')

const regEmail = ref('')
const regUsername = ref('')
const regPassword = ref('')
const regSecondPassword = ref('')
const acceptTerms = ref(false)

const submitRegisterForm = async () => {
  if (
    !acceptTerms.value ||
    !regEmail.value ||
    !regUsername.value ||
    !regPassword.value ||
    !regSecondPassword.value
  ) {
    alert('Uzupełnij wymagane pola.')
    return
  }

  const usernamePattern = /^(?=.*\d)[A-Za-z\d_.-]{8,}$/

  if (!usernamePattern.test(regUsername.value)) {
    alert(
      'Nazwa użytkownika musi mieć co najmniej 8 znaków (litery lub znaki "_", ".", "-") i zawierać cyfrę.',
    )
    return
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/

  if (!passwordPattern.test(regPassword.value)) {
    alert('Hasło musi mieć co najmniej 8 znaków, zawierać dużą literę, cyfrę i znak specjalny.')
    return
  }

  const formData = new FormData()
  formData.append('username', regUsername.value)
  formData.append('password1', regPassword.value)
  formData.append('password2', regSecondPassword.value)
  formData.append('email', regEmail.value)

  try {
    const res = await API.post(`register/`, formData, {
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

      if (err.response?.data?.username) {
        alert(`Błąd : Użytkownik z tą nazwą już istnieje.`)
        return
      }

      if (err.response?.data?.email) {
        alert(`Błąd : Błędny format pola email.`)
        return
      }

      if (err.response?.data?.non_field_errors) {
        alert(`Błąd: ${err.response.data.non_field_errors.join(' ')}`)
        return
      }
    }
  }
}

const submitLoginForm = async () => {
  if (!logUsername.value && !logPassword.value) {
    message.warning('Uzupełnij nazwę użytkownika i hasło')
    return
  } else if (!logUsername.value) {
    message.warning('Uzupełnij nazwę użytkownika')
    return
  } else if (!logPassword.value) {
    message.warning('Uzupełnij hasło')
    return
  }

  try {
    const login = await API.post(`api/token/`, {
      username: logUsername.value,
      password: logPassword.value,
    })

    localStorage.setItem('access', login.data.access)
    localStorage.setItem('refresh', login.data.refresh)

    const decoded = jwtDecode<{ user_id: number }>(login.data.access)
    myId.value = decoded.user_id
    localStorage.setItem('myId', String(decoded.user_id))

    isLoggedIn.value = true

    router.push({ name: 'home' })
    message.success('Pomyślne logowanie')
  } catch (err: AxiosError) {
    logUsername.value = ''
    logPassword.value = ''
    message.error(`Błąd podczas logowania\n"${err.response.data.detail}"`)
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
                <n-input
                  v-model:value="logUsername"
                  class="auth-input"
                  placeholder="Nazwa użytkownika"
                />
              </n-form-item-row>
              <n-form-item-row label="hasło" required>
                <n-input
                  v-model:value="logPassword"
                  type="password"
                  class="auth-input"
                  placeholder="Hasło"
                />
              </n-form-item-row>
              <n-button type="primary" attr-type="submit" block secondary strong> Zaloguj</n-button>
            </n-form>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="Rejestracja">
            <n-form @submit.prevent="submitRegisterForm">
              <n-form-item-row label="username" required>
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-input v-model:value="regUsername" class="auth-input" />
                  </template>
                  <div>
                    Username musi zawierać:
                    <ul style="text-align: left; padding-left: 16px">
                      <li>minimum 8 znaków (litery i/lub znaki "_", ".", "-")</li>
                      <li>co najmniej jedną cyfrę</li>
                    </ul>
                  </div>
                </n-popover>
              </n-form-item-row>
              <n-form-item-row label="e-mail" required>
                <n-input v-model:value="regEmail" class="auth-input" />
              </n-form-item-row>
              <n-form-item-row label="hasło" required style="justify-content: center">
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-input v-model:value="regPassword" type="password" class="auth-input" />
                  </template>
                  <div>
                    Hasło musi zawierać:
                    <ul style="text-align: left; padding-left: 16px">
                      <li>minimum 8 znaków</li>
                      <li>wielką literę</li>
                      <li>cyfrę</li>
                      <li>znak specjalny(!@#$%^&*)</li>
                    </ul>
                  </div>
                </n-popover>
              </n-form-item-row>
              <n-form-item-row label="powtórz hasło" required>
                <n-input v-model:value="regSecondPassword" type="password" class="auth-input" />
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
.auth-input {
  width: 80%;
  max-width: 320px;
  margin: 0 auto;
}

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

.register-button {
  margin-top: 12px;
}
</style>
