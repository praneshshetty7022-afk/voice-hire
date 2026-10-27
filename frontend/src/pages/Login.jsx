import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  ArrowRight,
  Mic,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSelector from '../components/LanguageSelector'
import { useVoice } from '../context/VoiceContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated, isEmployer } = useAuth()
  const { selectedLang, setSelectedLang } = useVoice()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(isEmployer ? '/employer/dashboard' : '/jobs', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.')
      toast.error('Email address is required.')
      return
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.')
      toast.error('Invalid email address format.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      toast.error('Password is required.')
      return
    }

    const res = await login({ email: cleanEmail, password })
    if (res.success) {
      if (res.user?.role === 'employer') {
        navigate('/employer/dashboard', { replace: true })
      } else {
        navigate('/jobs', { replace: true })
      }
    } else {
      setErrorMessage(res.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white">
            Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle className="!w-9 !h-9 !rounded-xl" />
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} isCompact={true} />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Log in to your VoiceHire worker or employer account
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
