import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Fetch current user from MongoDB via GET /api/auth/me
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token')
    if (!currentToken) {
      setUser(null)
      setLoading(false)
      return null
    }

    try {
      const res = await api.get('/auth/me')
      if (res.data?.success && res.data?.user) {
        const liveUser = res.data.user
        setUser(liveUser)
        localStorage.setItem('user', JSON.stringify(liveUser))
        return liveUser
      }
    } catch (err) {
      // If server is unreachable, retain cached user
      const cached = localStorage.getItem('user')
      if (cached) {
        try {
          setUser(JSON.parse(cached))
        } catch (e) {}
      }
    } finally {
      setLoading(false)
    }
    return null
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  // Login handler
  const login = async ({ phone, role = 'employee' }) => {
    try {
      setLoading(true)
      const res = await api.post('/auth/login', { phone, role })

      if (res.data?.token && res.data?.user) {
        const { token: receivedToken, user: receivedUser } = res.data
        setToken(receivedToken)
        setUser(receivedUser)
        localStorage.setItem('token', receivedToken)
        localStorage.setItem('user', JSON.stringify(receivedUser))
        localStorage.setItem('user_explicit_login', 'true')
        toast.success(res.data.message || `Welcome, ${receivedUser.fullName}!`)
        return { success: true, user: receivedUser }
      }
      throw new Error(res.data?.message || 'Login failed')
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed. Please check phone number.'
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  // Register handler
  const register = async (formData) => {
    try {
      setLoading(true)
      const res = await api.post('/auth/register', formData)

      if (res.data?.token && res.data?.user) {
        const { token: receivedToken, user: receivedUser } = res.data
        setToken(receivedToken)
        setUser(receivedUser)
        localStorage.setItem('token', receivedToken)
        localStorage.setItem('user', JSON.stringify(receivedUser))
        localStorage.setItem('user_explicit_login', 'true')
        toast.success(res.data.message || 'Profile created successfully!')
        return { success: true, user: receivedUser }
      }
      throw new Error(res.data?.message || 'Registration failed')
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed.'
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  // Update profile handler (calls PUT /api/auth/profile)
  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates)
      if (res.data?.user) {
        const updated = res.data.user
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
        toast.success(res.data.message || 'Profile saved!')
        return { success: true, user: updated }
      }
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Could not update profile.'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('user_explicit_login')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully.')
    window.location.href = '/login'
  }

  const role = user?.role?.toLowerCase() || 'employee'
  const isEmployee = role === 'employee'
  const isEmployer = role === 'employer'
  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        role,
        isEmployee,
        isEmployer,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
