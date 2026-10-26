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

  // Full-bleed Black & Gold VeriProof view for Authentication
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

  // Pure Full-Bleed VeriProof Black & Gold Authentication Experience
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white relative overflow-hidden font-sans selection:bg-[#bf953f]/30 selection:text-[#fcf6ba]">
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
              background: '#121212',
              backdropFilter: 'blur(16px)',
              color: '#fcf6ba',
              border: '1px solid #bf953f',
              boxShadow: '0 0 25px rgba(191, 149, 63, 0.4)',
              borderRadius: '16px',
              fontWeight: 700,
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col md:flex-row font-sans relative overflow-x-hidden selection:bg-gold-400/30 selection:text-gold-200">
      {/* Dynamic Ambient Light Field Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gold-400/10 via-amber-500/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-gradient-to-bl from-silver-400/10 via-slate-500/5 to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-gold-400/5 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Desktop Floating Liquid Glass Sidebar */}
      <DesktopSidebar lang={selectedLang} onMicTap={handleGlobalMicTap} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Floating Liquid Glass Header */}
        <header className="bg-obsidian-surface/60 backdrop-blur-2xl text-white px-4 sm:px-6 py-3.5 shadow-liquid-glass sticky top-0 z-40 border-b border-white/10">
          <div className="container mx-auto max-w-5xl flex items-center justify-between gap-3">
            {/* Logo Brand */}
            <Link to="/jobs" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-obsidian rounded-2xl font-black text-xl flex items-center justify-center shadow-liquid-gold border border-white/40 group-hover:scale-105 transition-transform duration-300">
                <Mic className="w-5 h-5 text-[#0c0c0e] stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{t.brandName}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-gold-400/15 text-gold-300 border border-gold-400/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    LUXURY EDITION
                  </span>
                </span>
                <span className="text-xs text-silver-400 font-extrabold block -mt-0.5 uppercase tracking-wider hidden sm:block">
                  {t.tagline}
                </span>
              </div>
            </Link>

            {/* Language Selector & Auth Capsules */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />

              <Link
                to="/login"
                className="text-xs sm:text-sm font-bold text-[#fcf6ba] hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition-colors border border-gold-400/25 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0c0c0e] font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs sm:text-sm shadow-liquid-gold hover:shadow-gold-glow flex items-center gap-1.5 border border-white/40 active:scale-95 hover:scale-[1.02] transition-all duration-300"
              >
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Real-time Voice Debug Panel */}
        <VoiceDebugPanel />

        {/* Main Route Content */}
        <main className="container-custom py-6 flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
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
            background: 'rgba(18, 18, 22, 0.9)',
            backdropFilter: 'blur(20px)',
            color: '#f8fafc',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
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
