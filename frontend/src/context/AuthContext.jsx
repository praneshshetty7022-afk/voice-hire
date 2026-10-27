import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify and restore session on mount/refresh via GET /api/auth/me
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token')
    if (!currentToken) {
      setUser(null)
      setToken(null)
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
      throw new Error('Authentication check failed')
    } catch (err) {
      // Invalid/expired token or user deleted: purge session
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  // Login handler with email & password
  const login = async ({ email, password }) => {
    try {
      setLoading(true)
      const res = await api.post('/auth/login', { email, password })

      if (res.data?.token && res.data?.user) {
        const { token: receivedToken, user: receivedUser } = res.data
        setToken(receivedToken)
        setUser(receivedUser)
        localStorage.setItem('token', receivedToken)
        localStorage.setItem('user', JSON.stringify(receivedUser))
        toast.success(res.data.message || `Welcome back, ${receivedUser.name || 'User'}!`)
        return { success: true, user: receivedUser }
      }
      throw new Error(res.data?.message || 'Login failed')
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Invalid email or password.'
      toast.error(msg)
      return { success: false, message: msg, status: error.response?.status }
    } finally {
      setLoading(false)
    }
  }

  // Register handler with name, email, password, role
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
        toast.success(res.data.message || 'Account created successfully!')
        return { success: true, user: receivedUser }
      }
      throw new Error(res.data?.message || 'Registration failed')
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed.'
      toast.error(msg)
      return { success: false, message: msg, status: error.response?.status }
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
        toast.success(res.data.message || 'Profile updated successfully!')
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
