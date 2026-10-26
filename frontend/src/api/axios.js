import axios from 'axios'

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'
const baseURL = rawBaseURL.replace(/\/+$/, '')

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT auth token
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

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid and on protected route
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/' && currentPath !== '/intro') {
        localStorage.removeItem('token')
      }
    }
    return Promise.reject(error)
  }
)

export default api
