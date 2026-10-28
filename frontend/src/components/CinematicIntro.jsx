import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus,
  Zap,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import { useVoice } from '../context/VoiceContext'
import { useAuth } from '../context/AuthContext'
import { getTranslation } from '../utils/translations'

export default function CinematicIntro({ isOpen = true, onClose }) {
  const navigate = useNavigate()
  const { selectedLang, setSelectedLang } = useVoice()
  const { isAuthenticated, isEmployer } = useAuth()
  const t = getTranslation(selectedLang)

  const handleGetStarted = (role) => {
    if (isAuthenticated) {
      navigate(isEmployer ? '/employer/dashboard' : '/jobs')
      return
    }
    if (role) {
      navigate(`/register?role=${role}`)
    } else {
      navigate('/register')
    }
  }

  const handleLogin = (role) => {
    if (isAuthenticated) {
      navigate(isEmployer ? '/employer/dashboard' : '/jobs')
      return
    }
    if (role) {
      navigate(`/login?role=${role}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0B0F19]/80 border-b border-slate-200/80 dark:border-white/10 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white leading-none">
                Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                {t.brandName || 'Udyoga Mitra'}
              </span>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <LanguageSelector
              selectedLang={selectedLang}
              onSelectLang={setSelectedLang}
              isCompact={true}
            />
            <ThemeToggle className="!w-9 !h-9 !rounded-xl" />

            {isAuthenticated ? (
              <button
                onClick={() => navigate(isEmployer ? '/employer/dashboard' : '/jobs')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{t.navDashboard}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleLogin()}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>{t.navLogin}</span>
                </button>
                <button
                  onClick={() => handleGetStarted()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t.navSignUp}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-12 flex-1 flex flex-col justify-center items-center text-center">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t.heroBadge}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            {t.heroHeadlineMain}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-400">
              {t.heroHeadlineGradient}
            </span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {t.heroSubhead}
          </motion.p>

          {/* Call-to-Actions (Prominent Log In & Sign Up) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => handleGetStarted()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Mic className="w-5 h-5 text-amber-300" />
              <span>{t.btnCreateAccount}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleLogin()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-400 text-slate-800 dark:text-white font-extrabold text-base hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
            >
              <LogIn className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t.btnLoginAccount}</span>
            </button>
          </motion.div>

          {/* Quick Features Row */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.featureVoiceTitle}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.featureVoiceDesc}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.featureVerifiedTitle}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.featureVerifiedDesc}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.featureDirectTitle}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.featureDirectDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} VoiceHire ({t.brandName || 'Udyoga Mitra'}). {t.footerTagline || 'Built with Voice AI & MERN Stack.'}</p>
      </footer>
    </div>
  )
}
