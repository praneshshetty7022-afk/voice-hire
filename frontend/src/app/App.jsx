import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import '../styles/index.css'

// Context Providers
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { VoiceProvider, useVoice } from '../context/VoiceContext'

// Components
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import VoiceDebugPanel from '../components/VoiceDebugPanel'
import CinematicIntro from '../components/CinematicIntro'
import ProtectedRoute from '../components/ProtectedRoute'

// Public & Auth Pages
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProfilePage from '../pages/ProfilePage'

// Employee Pages
import WorkerDashboardPage from '../pages/WorkerDashboardPage'
import JobListingPage from '../pages/JobListingPage'
import JobDetailPage from '../pages/JobDetailPage'
import MyApplicationsPage from '../pages/MyApplicationsPage'

// Employer Pages
import EmployerDashboard from '../pages/EmployerDashboard'
import PostJobPage from '../pages/PostJobPage'
import ManageApplicantsPage from '../pages/ManageApplicantsPage'

function AppContent() {
  const { isDark } = useTheme()
  const { user, isEmployer, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [showStoryModal, setShowStoryModal] = useState(false)

  useEffect(() => {
    const handleOpen = () => setShowStoryModal(true)
    window.addEventListener('open-cinematic-intro', handleOpen)
    return () => window.removeEventListener('open-cinematic-intro', handleOpen)
  }, [])

  const isIntroRoute = location.pathname === '/' || location.pathname === '/intro'
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  // 1. Landing Page (Public Hero) - redirect to dashboard if already authenticated
  if (isIntroRoute) {
    if (!loading && isAuthenticated) {
      return <Navigate to={isEmployer ? '/employer/dashboard' : '/jobs'} replace />
    }
    return <CinematicIntro isOpen={true} />
  }

  // 2. Authentication Pages (Login & Register) - Redirect away if already authenticated
  if (isAuthRoute) {
    if (!loading && isAuthenticated) {
      return <Navigate to={isEmployer ? '/employer/dashboard' : '/jobs'} replace />
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] relative overflow-hidden font-sans transition-colors duration-300">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AnimatePresence>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: isDark ? '#151C2C' : '#0F172A',
              color: '#F8FAFC',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              borderRadius: '16px',
              fontWeight: 700,
            },
          }}
        />
      </div>
    )
  }

  // 3. Authenticated App Pages with Sticky Top Navbar
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Dual Theme Ambient Background */}
      <AnimatedBackground />

      {/* Single Unified Sticky Top Navbar */}
      <Navbar />

      {/* Voice Debugger Monitor */}
      <VoiceDebugPanel />

      {/* Route Views */}
      <main className="flex-1 relative z-10">
        <Routes>
          {/* Employee & Shared Protected Routes */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={['employee', 'employer']}>
                <WorkerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs-list"
            element={
              <ProtectedRoute allowedRoles={['employee', 'employer']}>
                <JobListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={['employee', 'employer']}>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/my"
            element={
              <ProtectedRoute allowedRoles={['employee', 'employer']}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Unified Profile Page (MongoDB synced for Employee and Employer) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['employee', 'employer']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applicants"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ManageApplicantsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={<Navigate to={isEmployer ? '/employer/dashboard' : '/jobs'} replace />}
          />
        </Routes>
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: isDark ? '#151C2C' : '#0F172A',
            color: '#F8FAFC',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            borderRadius: '16px',
            fontWeight: 700,
          },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VoiceProvider>
          <Router>
            <AppContent />
          </Router>
        </VoiceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
