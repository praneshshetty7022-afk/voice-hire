import axios from 'axios'

// Enforce HTTPS on remote domains (like *.onrender.com) to prevent 301 redirect method drop
const enforceHttps = (url) => {
  if (!url) return url
  let u = url.trim()
  if (u.startsWith('http://') && !u.includes('localhost') && !u.includes('127.0.0.1')) {
    u = u.replace('http://', 'https://')
  }
  return u
}

export const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query parameters (e.g. ?backend=https://your-service.onrender.com)
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const paramBackend = urlParams.get('backend') || urlParams.get('apiUrl')
      if (paramBackend) {
        let clean = enforceHttps(paramBackend.trim().replace(/\/+$/, ''))
        if (clean.startsWith('http') && !clean.endsWith('/api')) clean = `${clean}/api`
        localStorage.setItem('voicehire_backend_url', clean)
        return clean
      }
    } catch (e) {}

    // 2. Check localStorage custom backend override
    const saved = localStorage.getItem('voicehire_backend_url')
    if (saved && saved.startsWith('http')) {
      return enforceHttps(saved)
    }
  }

  // 3. Check environment variable
  let raw = (import.meta.env.VITE_API_BASE_URL || '/api').trim().replace(/\/+$/, '')
  // Ignore dummy template placeholder from .env.example
  if (raw.includes('your-backend-service.onrender.com')) {
    raw = '/api'
  }
  raw = enforceHttps(raw)
  if (raw.startsWith('http') && !raw.endsWith('/api')) {
    raw = `${raw}/api`
  }
  return raw
}

export const setBackendUrl = (url) => {
  if (!url) {
    localStorage.removeItem('voicehire_backend_url')
    return getBaseURL()
  }
  let clean = enforceHttps(url.trim().replace(/\/+$/, ''))
  if (clean.startsWith('http') && !clean.endsWith('/api')) {
    clean = `${clean}/api`
  }
  localStorage.setItem('voicehire_backend_url', clean)
  return clean
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to dynamically attach latest baseURL and auth token
api.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseURL()
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
    if (error.response?.status === 405) {
      console.error(
        '[VoiceHire 405 Diagnostic]: Vercel rejected the request with 405 Method Not Allowed. ' +
        'This means the frontend is sending POST /api requests to Vercel instead of your Render backend. ' +
        'Set VITE_API_BASE_URL in your Vercel Project Settings (e.g. https://<render-service>.onrender.com/api) and Redeploy, ' +
        'or call setBackendUrl("https://<render-service>.onrender.com") in your browser console.'
      )
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/' && currentPath !== '/intro') {
        localStorage.removeItem('token')
      }
    }
    return Promise.reject(error)
  }
)

export default api

