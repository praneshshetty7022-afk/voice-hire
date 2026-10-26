import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import '../styles/index.css'
import WorkerDashboardPage from '../pages/WorkerDashboardPage'
import JobListingPage from '../pages/JobListingPage'
import JobDetailPage from '../pages/JobDetailPage'
import MyApplicationsPage from '../pages/MyApplicationsPage'
import ProfilePage from '../pages/ProfilePage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import EmployerDashboard from '../pages/EmployerDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import AnimatedBackground from '../components/AnimatedBackground'
import VoiceDebugPanel from '../components/VoiceDebugPanel'
import DesktopSidebar from '../components/DesktopSidebar'
import MobileNavbar from '../components/MobileNavbar'
import LanguageSelector from '../components/LanguageSelector'
import { VoiceProvider, useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import { Mic, UserCheck, LogIn } from 'lucide-react'

function AppContent() {
  const { selectedLang, setSelectedLang, voiceState, startListening, stopListening } = useVoice()
  const t = getTranslation(selectedLang)
  const navigate = useNavigate()
  const location = useLocation()

  // Full-bleed Accessible & Vibrant Worker View for Authentication
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  useEffect(() => {
    // If the legacy mock dummy user was previously seeded, clear it so genuine guest/registered user state is respected
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.id === 'worker_1' && parsed?.name === 'Pranesh' && !localStorage.getItem('user_explicit_login')) {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [])

  const handleGlobalMicTap = () => {
    if (voiceState === 'LISTENING') {
      stopListening()
    } else {
      startListening(navigate)
    }
  }

  // Full-Bleed Accessible & Vibrant Worker Authentication Experience
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 relative overflow-hidden font-sans selection:bg-blue-500/30 selection:text-cyan-200">
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
              background: '#0f172a',
              backdropFilter: 'blur(16px)',
              color: '#f8fafc',
              border: '1.5px solid #38bdf8',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 25px rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              fontWeight: 700,
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row font-sans relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900">
      {/* Premium Animated Background (Mesh gradients, flowing curves, floating bubbles & particles) */}
      <AnimatedBackground />

      {/* Desktop Floating Sidebar */}
      <DesktopSidebar lang={selectedLang} onMicTap={handleGlobalMicTap} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Floating Clean White Header */}
        <header className="bg-white/90 backdrop-blur-xl text-slate-800 px-4 sm:px-6 py-3.5 shadow-[0_4px_20px_rgba(37,99,235,0.05)] sticky top-0 z-40 border-b border-blue-100/80">
          <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4">
            {/* Logo Brand */}
            <Link to="/jobs" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 bg-[#2563EB] text-white rounded-xl font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <Mic className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-1.5">
                  Voice<span className="text-[#2563EB]">Hire</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600">
              <Link to="/jobs" className="hover:text-[#2563EB] transition-colors">
                Home
              </Link>
              <Link to="/jobs-list" className="hover:text-[#2563EB] transition-colors">
                Browse Jobs
              </Link>
              <Link to="/jobs" className="hover:text-[#2563EB] transition-colors">
                For Workers
              </Link>
              <Link to="/employer/dashboard" className="hover:text-[#2563EB] transition-colors">
                For Employers
              </Link>
              <a href="#about" className="hover:text-[#2563EB] transition-colors">
                About
              </a>
            </nav>

            {/* Language Selector & Auth Capsules */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />

              <Link
                to="/login"
                className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#2563EB] px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors border border-slate-200 flex items-center gap-1.5 bg-white shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-1.5 active:scale-95 hover:scale-[1.02] transition-all duration-300"
              >
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Real-time Voice Debug Panel */}
        <VoiceDebugPanel />

        {/* Main Route Content */}
        <main className="container-custom py-6 flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/jobs" element={<WorkerDashboardPage />} />
            <Route path="/jobs-list" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/applications/my" element={<MyApplicationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Floating Bottom Dock */}
      <MobileNavbar lang={selectedLang} onMicTap={handleGlobalMicTap} />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            backdropFilter: 'blur(20px)',
            color: '#f8fafc',
            border: '1.5px solid #38bdf8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 25px rgba(56, 189, 248, 0.3)',
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
    <VoiceProvider>
      <Router>
        <AppContent />
      </Router>
    </VoiceProvider>
  )
}
