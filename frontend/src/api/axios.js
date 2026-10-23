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

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Disable automatic 401 redirect for now since we're using simple auth
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token')
    //   window.location.href = '/login'
    // }
    return Promise.reject(error)
  }
)

export default api
