import '@/assets/main.css'
import axios from 'axios'
import { createApp } from 'vue'
import App from '@/App.vue'
import { API_URL } from '@/constants'
import router from '@/router'

createApp(App).use(router).mount('#app')

// AUTOMATYCZNE ODŚWIEŻANIE TOKENA JWT
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) throw new Error('Brak refresh tokenu.')

        const res = await axios.post(`${API_URL}api/token/refresh/`, {
          refresh,
        })

        const newAccess = res.data.access
        localStorage.setItem('access', newAccess)

        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
        return axios(originalRequest)
      } catch (refreshError) {
        console.error('Błąd odświeżania tokena:', refreshError)
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        router.push({ name: 'register' })
      }
    }

    return Promise.reject(error)
  },
)
