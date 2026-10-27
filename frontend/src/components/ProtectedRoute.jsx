import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, allowedRoles = ['employee', 'employer'] }) => {
  const { user, token, loading, isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const currentRole = role?.toLowerCase() || 'employee'
  if (!allowedRoles.includes(currentRole)) {
    if (currentRole === 'employer') {
      return <Navigate to="/employer/dashboard" replace />
    }
    return <Navigate to="/jobs" replace />
  }

  return children
}

export default ProtectedRoute
