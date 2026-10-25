import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import '../styles/index.css'
import WorkerDashboardPage from '../pages/WorkerDashboardPage'
import JobListingPage from '../pages/JobListingPage'
import JobDetailPage from '../pages/JobDetailPage'
import MyApplicationsPage from '../pages/MyApplicationsPage'
import ProfilePage from '../pages/ProfilePage'
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
import { Mic, UserCheck } from 'lucide-react'

function AppContent() {
  const { selectedLang, setSelectedLang, voiceState, startListening, stopListening } = useVoice()
  const t = getTranslation(selectedLang)
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Desktop Sidebar Layout */}
      <DesktopSidebar lang={selectedLang} onMicTap={handleGlobalMicTap} />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-40 border-b-4 border-blue-600">
          <div className="container mx-auto max-w-5xl flex items-center justify-between gap-3">
            {/* Logo Brand (Mobile & Desktop Header) */}
            <Link to="/jobs" className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-2xl font-black text-xl flex items-center justify-center border border-blue-400">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">{t.brandName}</span>
                <span className="text-xs text-blue-400 font-extrabold block -mt-1 uppercase tracking-wider hidden sm:block">
                  {t.tagline}
                </span>
              </div>
            </Link>

            {/* Language Selector & Signup */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />

              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-base shadow-lg flex items-center gap-1.5 border border-blue-400/30 active:scale-95"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Signup</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Real-time Voice Debug Panel */}
        <VoiceDebugPanel />

        {/* Main Route Content */}
        <main className="container-custom py-6 flex-1">
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

      {/* Mobile Bottom Navbar */}
      <MobileNavbar lang={selectedLang} onMicTap={handleGlobalMicTap} />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#38bdf8',
            fontWeight: 'bold',
            borderRadius: '1rem',
            border: '2px solid #2563eb',
            fontSize: '1.1rem',
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
