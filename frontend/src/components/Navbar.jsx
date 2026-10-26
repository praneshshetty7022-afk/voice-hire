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
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, isAuthenticated, isEmployee, isEmployer, logout } = useAuth()
  const { selectedLang, setSelectedLang, voiceState, startListening, stopListening } = useVoice()
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
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ===================================================================
            LEFT: Brand Logo & Emblem
            =================================================================== */}
        <div className="flex items-center gap-3">
          <Link
            to={isEmployer ? '/employer/dashboard' : '/jobs'}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white leading-none">
                Voice<span className="text-[#2563EB] dark:text-[#60A5FA]">Hire</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                Udyoga Mitra
              </span>
            </div>
          </Link>

          {/* Quick Role Badge if logged in */}
          {isAuthenticated && (
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isEmployer
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}
            >
              {isEmployer ? <Building2 className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
              <span>{isEmployer ? 'Employer' : 'Worker'}</span>
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
                Find Jobs
              </Link>
              <Link
                to="/jobs-list"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/jobs-list')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                Browse All
              </Link>
              <Link
                to="/intro"
                className="px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5 text-blue-500" />
                <span>Story</span>
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
                Dashboard
              </Link>
              <Link
                to="/jobs-list"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/jobs-list')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                Browse Jobs
              </Link>
              <Link
                to="/applications/my"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/applications/my')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                My Applications
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/profile')
                    ? 'text-[#2563EB] dark:text-[#60A5FA] bg-blue-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white'
                }`}
              >
                Profile
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
                Overview
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
                <span>Post Job</span>
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
                <span>Applicants</span>
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  isCurrent('/profile')
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-white/[0.06]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white'
                }`}
              >
                Company
              </Link>
            </>
          )}
        </nav>

        {/* ===================================================================
            RIGHT: Language, Theme, Voice Trigger, Auth / User Actions
            =================================================================== */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Voice Assistant Button (Employee / Public) */}
          <button
            type="button"
            onClick={handleGlobalMic}
            className={`relative p-2 rounded-xl transition-all cursor-pointer ${
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
          <ThemeToggle className="!w-9 !h-9 !rounded-xl" />

          {/* Language Selector */}
          <LanguageSelector selectedLang={selectedLang} onSelectLang={setSelectedLang} />

          {/* Authentication State Branches */}
          {!isAuthenticated ? (
            // LOGGED OUT: Login + Sign Up
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-extrabold px-4 py-2 rounded-full text-xs sm:text-sm shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-all"
              >
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Sign Up</span>
              </Link>
            </div>
          ) : (
            // LOGGED IN: User Badge + Logout (Hides Login and Sign Up!)
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.14] transition-all group"
                title="View and edit profile"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-black text-slate-800 dark:text-white truncate max-w-[110px]">
                    {user?.companyName || user?.fullName || 'My Account'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 capitalize">
                    {user?.role || 'User'}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-200"
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
        <div className="md:hidden px-4 pt-2 pb-5 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-white/[0.08]"
              >
                Find Jobs
              </Link>
              <Link
                to="/jobs-list"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-white/[0.08]"
              >
                Browse All Jobs
              </Link>
              <Link
                to="/intro"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-white/[0.08]"
              >
                Watch Cinematic Story
              </Link>
              <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-white/10">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-[#2563EB] text-white"
                >
                  Sign Up
                </Link>
              </div>
            </>
          ) : isEmployee ? (
            <>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Dashboard
              </Link>
              <Link
                to="/jobs-list"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Browse Jobs
              </Link>
              <Link
                to="/applications/my"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                My Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/employer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400"
              >
                Employer Dashboard
              </Link>
              <Link
                to="/employer/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Post New Job Listing
              </Link>
              <Link
                to="/employer/applicants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Manage Candidates & Audio
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                Company Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
