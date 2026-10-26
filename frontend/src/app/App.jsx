import React, { useEffect, useState } from 'react'
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
import EmployerDashboard from '../pages/EmployerDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import AnimatedBackground from '../components/AnimatedBackground'
import VoiceDebugPanel from '../components/VoiceDebugPanel'
import DesktopSidebar from '../components/DesktopSidebar'
import MobileNavbar from '../components/MobileNavbar'
import LanguageSelector from '../components/LanguageSelector'
import ThemeToggle from '../components/ThemeToggle'
import CinematicIntro from '../components/CinematicIntro'
import { ThemeProvider, useTheme } from '../context/ThemeContext'
import { VoiceProvider, useVoice } from '../context/VoiceContext'
import { Mic, UserCheck, User, Film } from 'lucide-react'

function AppContent() {
  const { selectedLang, setSelectedLang, voiceState, startListening, stopListening } = useVoice()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [showCinematicIntro, setShowCinematicIntro] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('intro') === 'true'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    const handleOpen = () => setShowCinematicIntro(true)
    window.addEventListener('open-cinematic-intro', handleOpen)
    return () => window.removeEventListener('open-cinematic-intro', handleOpen)
  }, [])

  const isIntroRoute = location.pathname === '/' || location.pathname === '/intro'
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  const handleIntroClose = () => {
    navigate('/register')
  }

  // 1. First Page: Cinematic Intro Experience
  if (isIntroRoute) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white relative overflow-hidden font-sans">
        <CinematicIntro
          isOpen={true}
          onClose={handleIntroClose}
        />
      </div>
    )
  }

  // 2. Second Page: Quick Worker Authentication / Signup
  if (isAuthRoute) {
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

  const handleGlobalMicTap = () => {
    if (voiceState === 'LISTENING') {
      stopListening()
    } else {
      startListening(navigate)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col md:flex-row font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Dual Theme Animated Background */}
      <AnimatedBackground />

      {/* Desktop Floating Sidebar */}
      <DesktopSidebar lang={selectedLang} onMicTap={handleGlobalMicTap} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* ===================================================================
            SECTION A: Top Navigation Bar (Sticky / Glassmorphic)
            Left: Brand Logo ("VoiceHire" + Glowing Microphone Emblem)
            Center: Nav Links (Home, Browse Jobs, For Workers, For Employers, About)
            Right: Theme Switcher, Language Switcher, Login (Ghost), Sign Up (Solid Blue Pill)
            =================================================================== */}
        <header className="bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl text-[#0F172A] dark:text-[#F8FAFC] px-4 sm:px-8 py-3.5 shadow-sm sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
          <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
            {/* Left: Brand Logo */}
            <Link to="/jobs" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white rounded-xl font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                <Mic className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-white flex items-center gap-1">
                  Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-[#94A3B8]">
              <Link to="/jobs" className="hover:text-[#2563EB] dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/jobs-list" className="hover:text-[#2563EB] dark:hover:text-white transition-colors">
                Browse Jobs
              </Link>
              <Link to="/jobs" className="hover:text-[#2563EB] dark:hover:text-white transition-colors">
                For Workers
              </Link>
              <Link to="/employer/dashboard" className="hover:text-[#2563EB] dark:hover:text-white transition-colors">
                For Employers
              </Link>
              <a href="#about" className="hover:text-[#2563EB] dark:hover:text-white transition-colors">
                About
              </a>
              <button
                type="button"
                onClick={() => setShowCinematicIntro(true)}
                className="flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Play Cinematic Intro: The Power of Voice"
              >
                <span>🎬 Watch Story</span>
              </button>
            </nav>

            {/* Right: Mobile Header (Compact logo + story button + profile avatar icon + language pill switcher) */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowCinematicIntro(true)}
                className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-white/[0.08] text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-white/10 flex items-center justify-center active:scale-95 transition-all cursor-pointer text-sm"
                title="Watch Cinematic Story: The Power of Voice"
                aria-label="Watch Cinematic Story"
              >
                🎬
              </button>
              <ThemeToggle className="!w-8 !h-8 !rounded-xl" />
              <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />
              <Link
                to="/profile"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-[#F8FAFC] active:scale-95 transition-all"
                title="Worker Profile"
                aria-label="Worker Profile"
              >
                <User className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

            {/* Desktop Navigation Actions: Theme, Language Switcher, Login (Ghost) & Sign Up (Solid Blue Pill) */}
            <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Theme Switcher Toggle (Sun / Moon) */}
              <ThemeToggle />

              {/* Language Switcher Dropdown */}
              <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />

              {/* Login (Ghost Button) */}
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all"
              >
                Login
              </Link>

              {/* Sign Up (Solid Primary Blue Pill Button) */}
              <Link
                to="/register"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center gap-1.5 transition-all duration-200"
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
            <Route path="/" element={<Navigate to="/intro" replace />} />
            <Route path="/jobs" element={<WorkerDashboardPage />} />
            <Route path="/jobs-list" element={<JobListingPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/applications/my" element={<MyApplicationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/intro" element={<CinematicIntro isOpen={true} onClose={() => navigate('/jobs')} />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
      </div>

      {/* Full-screen Cinematic Story Modal Experience */}
      <CinematicIntro
        isOpen={showCinematicIntro}
        onClose={() => setShowCinematicIntro(false)}
      />

      {/* Mobile Floating Bottom Dock (Page 3 Touch Interface) */}
      <MobileNavbar lang={selectedLang} onMicTap={handleGlobalMicTap} />

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
      <VoiceProvider>
        <Router>
          <AppContent />
        </Router>
      </VoiceProvider>
    </ThemeProvider>
  )
}
