import axios from 'axios'

// Konfigurasi base URL untuk API backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://202.10.45.138:3000/api'

// Base URL untuk uploads/images (tanpa /api)
export const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || 'http://202.10.45.138:3000'

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor untuk handle response
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau tidak valid - untuk frontend publik, cukup hapus token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api
