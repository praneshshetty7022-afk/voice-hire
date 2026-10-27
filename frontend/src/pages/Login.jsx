import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  Mail,
  Lock,
  ArrowRight,
  Mic,
  Users,
  Building2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSelector from '../components/LanguageSelector'
import { useVoice } from '../context/VoiceContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, isAuthenticated, isEmployer } = useAuth()
  const { selectedLang, setSelectedLang } = useVoice()

  // Pre-select role from URL param if present (e.g. /login?role=employer)
  const queryParams = new URLSearchParams(location.search)
  const queryRole = queryParams.get('role') === 'employer' ? 'employer' : 'employee'

  const [activeRole, setActiveRole] = useState(queryRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [roleMismatchData, setRoleMismatchData] = useState(null)

  // Sync role if query param changes
  useEffect(() => {
    const roleParam = new URLSearchParams(location.search).get('role')
    if (roleParam === 'employer' || roleParam === 'employee') {
      setActiveRole(roleParam)
    }
  }, [location.search])

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(isEmployer ? '/employer/dashboard' : '/jobs', { replace: true })
    return null
  }

  const handleSwitchTab = (targetRole) => {
    setActiveRole(targetRole)
    setErrorMessage('')
    setRoleMismatchData(null)
    navigate(`/login?role=${targetRole}`, { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setRoleMismatchData(null)

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

    // Pass role to enforce strict role isolation
    const res = await login({ email: cleanEmail, password, role: activeRole })
    if (res.success) {
      if (res.user?.role === 'employer') {
        navigate('/employer/dashboard', { replace: true })
      } else {
        navigate('/jobs', { replace: true })
      }
    } else {
      if (res.roleMismatch) {
        setRoleMismatchData({
          actualRole: res.actualRole,
          message: res.message,
        })
      }
      setErrorMessage(res.message || 'Invalid email or password.')
    }
  }

  const isWorker = activeRole === 'employee'

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 space-y-6">
          {/* Two Dedicated Portal Selector Tabs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Your Portal
            </span>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleSwitchTab('employee')}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isWorker
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Worker Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchTab('employer')}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isWorker
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Employer Login</span>
              </button>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-1">
              {isWorker ? (
                <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60">
                  👷 Worker Portal Only
                </span>
              ) : (
                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900/60">
                  🏢 Employer Portal Only
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {isWorker ? 'Skilled Worker Login' : 'Employer & Recruiter Login'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {isWorker
                ? 'Sign in to browse daily wage & monthly jobs and voice applications'
                : 'Sign in to post job vacancies and screen verified applicants'}
            </p>
          </div>

          {/* Role Mismatch Warning Banner */}
          {roleMismatchData && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{roleMismatchData.message}</p>
                  <p className="text-xs opacity-90">
                    Accounts cannot be used interchangeably across Worker and Employer portals.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSwitchTab(roleMismatchData.actualRole || (isWorker ? 'employer' : 'employee'))}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  Switch to {roleMismatchData.actualRole === 'employer' ? 'Employer' : 'Worker'} Login Portal
                </span>
              </button>
            </div>
          )}

          {/* Standard Error Banner */}
          {errorMessage && !roleMismatchData && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dedicated Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isWorker ? 'Worker Email Address' : 'Employer Work Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isWorker ? 'worker@example.com' : 'hr@company.com'}
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
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] mt-2 ${
                isWorker
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying {isWorker ? 'Worker' : 'Employer'} Credentials...</span>
                </>
              ) : (
                <>
                  <span>Log In as {isWorker ? 'Worker' : 'Employer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium space-y-1.5">
            <p>
              Don't have {isWorker ? 'a worker' : 'an employer'} account?{' '}
              <Link
                to={`/register?role=${activeRole}`}
                className={`font-bold hover:underline ${
                  isWorker ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                Sign up as {isWorker ? 'Worker' : 'Employer'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
