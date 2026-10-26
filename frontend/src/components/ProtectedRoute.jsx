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
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const currentRole = role?.toLowerCase() || 'employee'
  if (!allowedRoles.includes(currentRole)) {
    // If role is employee trying to access employer page, redirect to /jobs
    if (currentRole === 'employee') {
      return <Navigate to="/jobs" replace />
    }
    // If role is employer trying to access employee page, redirect to /employer/dashboard
    if (currentRole === 'employer') {
      return <Navigate to="/employer/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
