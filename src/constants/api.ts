import axios from 'axios'
import router from '@/router'

const API = axios.create({
  // baseURL: window.location.origin,
  baseURL: 'http://127.0.0.1:8000/',
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) {
          router.push({ name: 'register' })
        }

        const res = await API.post(`api/token/refresh/`, {
          refresh,
        })

        const newAccess = res.data.access
        localStorage.setItem('access', newAccess)

        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
        return API(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        router.push({ name: 'register' })
      }
    }

    return Promise.reject(error)
  },
)

export default API
