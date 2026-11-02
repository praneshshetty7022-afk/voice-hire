import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Mic,
  Briefcase,
  UserCheck,
  User,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
  Sparkles,
  FileText,
  Building2,
  Film,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, isAuthenticated, isEmployee, isEmployer, logout } = useAuth()
  const { selectedLang, setSelectedLang, voiceState, startListening, stopListening } = useVoice()
  const t = getTranslation(selectedLang)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleGlobalMic = () => {
    if (voiceState === 'LISTENING') {
      stopListening()
    } else {
      startListening(navigate)
    }
  }

  const isCurrent = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* ===================================================================
            LEFT: Brand Logo & Emblem
            =================================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to={isEmployer ? '/employer/dashboard' : '/jobs'}
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A] dark:text-white leading-none">
                Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5 hidden xs:inline sm:inline">
                {t.brandName || 'Udyoga Mitra'}
              </span>
            </div>
          </Link>

          {/* Quick Role Badge if logged in */}
          {isAuthenticated && (
            <span
              className={`hidden md:inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                isEmployer
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}
            >
              {isEmployer ? <Building2 className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
              <span>{isEmployer ? (t.roleEmployer || 'Employer') : (t.roleWorker || 'Worker')}</span>
            </span>
          )}
        </div>

        {/* ===================================================================
            CENTER: Desktop Navigation Links (Role-Aware)
            =================================================================== */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {!isAuthenticated ? (
            // LOGGED OUT LINKS
            <>
              <Link
                to="/jobs"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/jobs')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                {t.navFindJobs || 'Find Jobs'}
              </Link>
              <Link
                to="/jobs-list"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/jobs-list')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                {t.navBrowseAll || 'Browse All'}
              </Link>
              <Link
                to="/intro"
                className="px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.navStory || 'Story'}</span>
              </Link>
            </>
          ) : isEmployee ? (
            // EMPLOYEE LINKS
            <>
              <Link
                to="/jobs"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/jobs')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                {t.navDashboard || 'Dashboard'}
              </Link>
              <Link
                to="/jobs-list"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/jobs-list')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                {t.navBrowseAll || 'Browse Jobs'}
              </Link>
              <Link
                to="/applications/my"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/applications/my')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                {t.myApplications || 'My Applications'}
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/profile')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                {t.navProfile || 'Profile'}
              </Link>
            </>
          ) : (
            // EMPLOYER LINKS
            <>
              <Link
                to="/employer/dashboard"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/employer/dashboard')
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white'
                }`}
              >
                {t.navDashboard || 'Overview'}
              </Link>
              <Link
                to="/employer/post-job"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  isCurrent('/employer/post-job')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.navPostJob || 'Post Job'}</span>
              </Link>
              <Link
                to="/employer/applicants"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  isCurrent('/employer/applicants')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.navManageApplicants || 'Applicants'}</span>
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/profile')
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white'
                }`}
              >
                {t.navProfile || 'Company'}
              </Link>
            </>
          )}
        </nav>

        {/* ===================================================================
            RIGHT: Language, Theme, Voice Trigger, Auth / User Actions
            =================================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Global Voice Assistant Button (Employee / Public) */}
          <button
            type="button"
            onClick={handleGlobalMic}
            className={`relative p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              voiceState === 'LISTENING'
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                : 'bg-blue-50 dark:bg-white/[0.08] text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-100 dark:hover:bg-white/[0.14]'
            }`}
            title="Tap to activate voice commands"
            aria-label="Voice Assistant"
          >
            <Mic className="w-4 h-4 stroke-[2.5]" />
            {voiceState === 'LISTENING' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
            )}
          </button>

          {/* Theme Switcher */}
          <ThemeToggle className="!w-9 !h-9 !rounded-xl shrink-0" />

          {/* Language Selector */}
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />

          {/* Authentication State Branches */}
          {!isAuthenticated ? (
            // LOGGED OUT: Login + Sign Up
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                to="/login"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all shrink-0"
              >
                {t.navLogin || 'Login'}
              </Link>

              <Link
                to="/register"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-all shrink-0"
              >
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline sm:inline">{t.navSignUp || 'Sign Up'}</span>
              </Link>
            </div>
          ) : (
            // LOGGED IN: User Profile Avatar + Always Visible Red-Themed Logout Button
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] transition-all group shrink-0"
                title={`Logged in as ${user?.companyName || user?.fullName || 'User'} (${user?.role || 'account'})`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-black text-slate-800 dark:text-white truncate max-w-[100px]">
                    {user?.companyName || user?.fullName || 'My Account'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 capitalize">
                    {user?.role || 'User'}
                  </span>
                </div>
              </Link>

              {/* Explicit, Guaranteed-Visible Logout Button in Top Bar */}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60 font-black text-xs transition-all cursor-pointer shadow-xs shrink-0"
                title="Logout / Sign Out"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">{t.navLogout || 'Logout'}</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ===================================================================
          MOBILE SLIDE-DOWN DRAWER
          =================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-white/[0.08]"
              >
                {t.navFindJobs || 'Find Jobs'}
              </Link>
              <Link
                to="/jobs-list"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-white/[0.08]"
              >
                {t.navBrowseAll || 'Browse All Jobs'}
              </Link>
              <Link
                to="/intro"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-white/[0.08]"
              >
                {t.navStory || 'Watch Cinematic Story'}
              </Link>
              <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-white/10">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-white"
                >
                  {t.navLogin || 'Login'}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-[#2563EB] text-white"
                >
                  {t.navSignUp || 'Sign Up'}
                </Link>
              </div>
            </>
          ) : isEmployee ? (
            <>
              {/* Worker Profile Header Card inside Drawer */}
              <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {user?.fullName || 'Worker Account'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 capitalize truncate">
                      {user?.phone || user?.email || 'VoiceHire Worker'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                  {t.roleWorker || 'Worker'}
                </span>
              </div>

              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.navDashboard || 'Dashboard'}
              </Link>
              <Link
                to="/jobs-list"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.navBrowseAll || 'Browse Jobs'}
              </Link>
              <Link
                to="/applications/my"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.myApplications || 'My Applications'}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.myProfile || t.navProfile || 'My Profile'}
              </Link>

              {/* Prominent Red Full-Width Logout Card */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-black text-sm shadow-md shadow-rose-500/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.navLogout || 'Log Out'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Employer Profile Header Card inside Drawer */}
              <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {user?.companyName || user?.fullName || 'Employer Enterprise'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 capitalize truncate">
                      {user?.email || 'Employer Portal'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                  {t.roleEmployer || 'Employer'}
                </span>
              </div>

              <Link
                to="/employer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/[0.08]"
              >
                {t.employerPortalHeading || 'Employer Dashboard'}
              </Link>
              <Link
                to="/employer/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.postNewJobButton || 'Post New Job Listing'}
              </Link>
              <Link
                to="/employer/applicants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.navManageApplicants || 'Manage Candidates & Audio'}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
              >
                {t.companyProfile || 'Company Profile'}
              </Link>

              {/* Prominent Red Full-Width Logout Card */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-black text-sm shadow-md shadow-rose-500/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.navLogout || 'Log Out'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
}
