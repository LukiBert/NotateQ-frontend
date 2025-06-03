import axios from 'axios'
import router from '@/router'

const API_URL = 'http://127.0.0.1:8000/'

const API = axios.create({
  baseURL: API_URL,
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('ERROR intercepted: ', error)
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) throw new Error('Brak refresh tokenu.')

        const res = await API.post(`api/token/refresh/`, {
          refresh,
        })

        const newAccess = res.data.access
        localStorage.setItem('access', newAccess)

        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
        console.log('REFRESHED')
        return API(originalRequest)
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

export default API
