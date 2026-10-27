import React, { useState, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  Phone,
  User,
  Building2,
  Mic,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useVoice } from '../context/VoiceContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSelector from '../components/LanguageSelector'

import { setBackendUrl, getBaseURL } from '../api/axios'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  const { selectedLang, setSelectedLang } = useVoice()

  const [role, setRole] = useState('employee')
  const [phone, setPhone] = useState(location.state?.phone || '')
  const [isListeningPhone, setIsListeningPhone] = useState(false)
  const phoneRecognitionRef = useRef(null)

  // Backend connection helper state (shown automatically if 405 occurs on Vercel)
  const [showBackendConfig, setShowBackendConfig] = useState(false)
  const [customBackend, setCustomBackend] = useState(() => getBaseURL())

  // Voice speech-to-text for phone input
  const startPhoneVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.')
      return
    }

    try {
      if (phoneRecognitionRef.current) phoneRecognitionRef.current.abort()
      const recognition = new SpeechRecognition()
      recognition.lang = selectedLang === 'kn' ? 'kn-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-IN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListeningPhone(true)
        toast('🎤 Listening... Speak your 10-digit number', { id: 'voice-login' })
      }

      recognition.onresult = (e) => {
        const spoken = e.results[0][0].transcript
        const digits = spoken.replace(/\D/g, '').slice(-10)
        if (digits) {
          setPhone(digits)
          toast.success(`Captured: ${digits}`, { id: 'voice-login' })
        }
      }

      recognition.onerror = () => setIsListeningPhone(false)
      recognition.onend = () => setIsListeningPhone(false)

      phoneRecognitionRef.current = recognition
      recognition.start()
    } catch (e) {
      setIsListeningPhone(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.')
      return
    }

    const res = await login({ phone: cleanPhone, role })
    if (res.success) {
      if (role === 'employer') {
        navigate('/employer/dashboard', { replace: true })
      } else {
        navigate('/jobs', { replace: true })
      }
    } else if (res.status === 405) {
      setShowBackendConfig(true)
    }
  }

  const handleSaveBackend = (e) => {
    e.preventDefault()
    if (!customBackend.trim()) {
      setBackendUrl('')
      toast.success('Reset to default /api')
      setShowBackendConfig(false)
      return
    }
    const updated = setBackendUrl(customBackend)
    setCustomBackend(updated)
    toast.success(`Connected to: ${updated}`)
    setShowBackendConfig(false)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length >= 10) {
      login({ phone: cleanPhone, role })
    }
  }

  // 1-Tap Quick Sample Login for testing
  const handleQuickLogin = (targetRole, samplePhone) => {
    setRole(targetRole)
    setPhone(samplePhone)
    login({ phone: samplePhone, role: targetRole }).then((res) => {
      if (res.success) {
        if (targetRole === 'employer') {
          navigate('/employer/dashboard', { replace: true })
        } else {
          navigate('/jobs', { replace: true })
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-md">
        <Link to="/jobs" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white">
            Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="!w-9 !h-9 !rounded-xl" />
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />
          <Link
            to="/register"
            className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08]"
          >
            Create Profile
          </Link>
        </div>
      </header>

      {/* Main Split-Screen Layout */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 sm:p-8 lg:p-12 gap-8 items-center justify-center">
        {/* ===================================================================
            LEFT COLUMN: Editorial Brand Narrative & Role Explainer
            =================================================================== */}
        <div className="w-full lg:w-5/12 flex flex-col space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs font-black uppercase tracking-wider w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Passwordless Sign In</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome back to{' '}
            <span className="text-[#2563EB] dark:text-[#60A5FA]">VoiceHire.</span>
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Fast, secure access using your verified 10-digit mobile number. No password memorization required.
          </p>

          {/* Quick Demo Access Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/40 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1-Tap Instant Testing Profiles
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLogin('employee', '9876543210')}
                className="p-3 rounded-2xl bg-blue-50 dark:bg-white/[0.04] hover:bg-blue-100 dark:hover:bg-white/[0.08] border border-blue-200/80 dark:border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">Worker Account</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Ramesh Kumar • Driver
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('employer', '9123456789')}
                className="p-3 rounded-2xl bg-amber-50 dark:bg-white/[0.04] hover:bg-amber-100 dark:hover:bg-white/[0.08] border border-amber-200/80 dark:border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">Employer Account</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Nandi Logistics • Hiring
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: Clean High-Contrast Tactile Login Form
            =================================================================== */}
        <div className="w-full lg:w-7/12 max-w-md">
          <div className="bg-white dark:bg-[#151C2C] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Sign In As:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'employee'
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Worker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'employer'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Employer</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered 10-Digit Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-500 border-r border-slate-300 dark:border-slate-700 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-16 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-900 dark:text-white outline-none tracking-wider transition-all"
                  />
                  <button
                    type="button"
                    onClick={startPhoneVoice}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                      isListeningPhone
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/[0.08]'
                    }`}
                    title="Speak Mobile Number"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Backend API Connection Helper (rendered if 405 error or toggled) */}
              {showBackendConfig && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      ⚠️ Connect Render Backend URL
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBackendConfig(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    Vercel returned <strong>405 Method Not Allowed</strong> because requests are hitting Vercel static files instead of your Render server. Enter your live Render URL below:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customBackend}
                      onChange={(e) => setCustomBackend(e.target.value)}
                      placeholder="https://your-service.onrender.com"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSaveBackend}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      Connect
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    💡 Permanent fix: Set <code>VITE_API_BASE_URL</code> in Vercel Project Settings &amp; Redeploy.
                  </p>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to {role === 'employer' ? 'Employer Portal' : 'Worker Portal'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 text-center space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#2563EB] dark:text-[#60A5FA] font-black hover:underline">
                  Create New Profile
                </Link>
              </p>
              <button
                type="button"
                onClick={() => setShowBackendConfig(!showBackendConfig)}
                className="text-[11px] text-slate-400 hover:text-blue-500 underline cursor-pointer"
              >
                {showBackendConfig ? 'Hide Backend Settings' : '⚙️ Configure Backend URL'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
