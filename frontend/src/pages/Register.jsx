import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, User, Building2, Briefcase, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import ThreeBackground from '../components/ThreeBackground';
import styles from '../styles/auth.module.css';

/**
 * Register Component - VeriProof Executive Corporate Platform
 * Pre-fills corporate email from login redirection & applies Black & Gold luxury aesthetic.
 */
export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract pre-filled email from route state or URL search query (?email=...)
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = location.state?.email || queryParams.get('email') || '';
  const isAutoRedirected = Boolean(location.state?.autoFilled || queryParams.get('email'));

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [company, setCompany] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Senior Executive');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sync if location state changes
  useEffect(() => {
    if (location.state?.email && !email) {
      setEmail(location.state.email);
    }
  }, [location.state, email]);

  // Framer Motion Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Password Strength Calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Required', color: 'bg-zinc-700', width: '5%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (password.length < 10) return { label: 'Moderate', color: 'bg-amber-400', width: '60%' };
    return { label: 'Executive Gold Standard', color: 'bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error('Please complete all required fields.', {
        style: { background: '#121212', color: '#ffffff', border: '1px solid rgba(191, 149, 63, 0.3)' },
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Password must contain at least 6 characters.', {
        style: { background: '#121212', color: '#ffffff', border: '1px solid rgba(239, 68, 68, 0.5)' },
      });
      return;
    }

    if (!agreeTerms) {
      toast.error('Please accept the Executive Terms of Verification.', {
        style: { background: '#121212', color: '#ffffff', border: '1px solid rgba(191, 149, 63, 0.3)' },
      });
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Submit Registration Request
      const response = await axios.post('/auth/register', {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        role,
        company: company.trim() || 'VeriProof Corporate Network',
        headline: `${experienceLevel} | Verified Member`,
        experienceLevel,
      });

      if (response.data.success) {
        // Save auth data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_explicit_login', 'true');

        // Also persist in demo mock list for offline resilience
        const existingUsers = JSON.parse(localStorage.getItem('veriproof_users') || '[]');
        if (!existingUsers.find((u) => u.email === normalizedEmail)) {
          existingUsers.push({
            id: response.data.user?.id || 'usr_' + Date.now(),
            fullName: fullName.trim(),
            email: normalizedEmail,
            password,
            role,
            company,
            experienceLevel,
            verificationStatus: 'verified',
            trustScore: 95,
          });
          localStorage.setItem('veriproof_users', JSON.stringify(existingUsers));
        }

        toast.success(`Executive profile verified! Welcome to VeriProof, ${fullName}.`, {
          icon: '👑',
          style: {
            background: '#121212',
            color: '#FCF6BA',
            border: '1px solid #BF953F',
            boxShadow: '0 0 25px rgba(191, 149, 63, 0.4)',
          },
        });

        navigate('/jobs');
      }
    } catch (error) {
      console.warn('[VeriProof Register API]:', error.response?.data || error.message);

      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (status === 409 || code === 'USER_ALREADY_EXISTS') {
        toast.error('An account with this email already exists. Redirecting to login...', {
          style: { background: '#121212', color: '#ffffff', border: '1px solid #BF953F' },
        });
        setTimeout(() => {
          navigate('/login', { state: { email: normalizedEmail } });
        }, 1500);
        return;
      }

      // 2. Demo offline fallback if network is unreachable
      if (!error.response) {
        const fallbackUser = {
          id: 'usr_' + Date.now(),
          fullName: fullName.trim(),
          email: normalizedEmail,
          password,
          role,
          company: company.trim() || 'VeriProof Corporate Network',
          experienceLevel,
          verificationStatus: 'verified',
          trustScore: 95,
        };

        const existingUsers = JSON.parse(localStorage.getItem('veriproof_users') || '[]');
        existingUsers.push(fallbackUser);
        localStorage.setItem('veriproof_users', JSON.stringify(existingUsers));

        localStorage.setItem('token', 'jwt_demo_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        localStorage.setItem('user_explicit_login', 'true');

        toast.success(`Executive profile registered successfully! Welcome, ${fullName}.`, {
          icon: '👑',
          style: {
            background: '#121212',
            color: '#FCF6BA',
            border: '1px solid #BF953F',
            boxShadow: '0 0 25px rgba(191, 149, 63, 0.4)',
          },
        });

        navigate('/jobs');
        return;
      }

      toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
        style: { background: '#121212', color: '#ffffff', border: '1px solid rgba(239, 68, 68, 0.5)' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Three.js Interactive 3D Wireframe & Particle Background */}
      <ThreeBackground />

      <motion.div
        className={`${styles.glassCard} ${styles.glassCardWide}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Corporate Brand Identity Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#AA771C] p-[1.5px] shadow-[0_0_25px_rgba(191,149,63,0.35)] mb-3">
            <div className="w-full h-full bg-[#0b0b0b] rounded-[15px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#FCF6BA]" strokeWidth={2.2} />
            </div>
          </div>

          <h1 className={`${styles.goldGradientText} text-3xl font-black tracking-tight mb-1`}>
            VERIPROOF
          </h1>

          <p className="text-xs font-bold tracking-[0.2em] text-[#C5A880] uppercase">
            Executive Membership & Profile Verification
          </p>

          <div className="mt-2.5">
            <span className={styles.corporateBadge}>
              <Sparkles className="w-3.5 h-3.5 text-[#FCF6BA]" />
              Elite Talent & Employer Network
            </span>
          </div>
        </div>

        {/* Smart Redirection Notice Banner (Triggered when redirected from Login) */}
        {isAutoRedirected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.redirectNoticeBanner}
          >
            <Sparkles className="w-5 h-5 text-[#FCF6BA] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[#FCF6BA]">Account not found for sign-in: </span>
              <span className="text-[#C5A880]">
                We have automatically pre-filled your corporate email (<strong className="text-white">{email}</strong>) below so you can register your profile.
              </span>
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880] mb-1.5">
              Executive Full Name <span className="text-[#BF953F]">*</span>
            </label>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <User className="w-4 h-4 text-[#BF953F]" />
              </div>
              <input
                id="register-name-input"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alexandra Vance"
                className={styles.goldInput}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Corporate Email Field (Pre-filled) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880]">
                Corporate Email Address <span className="text-[#BF953F]">*</span>
              </label>
              {isAutoRedirected && (
                <span className="text-[10px] font-bold text-[#FCF6BA] bg-[#BF953F]/15 border border-[#BF953F]/40 px-2 py-0.5 rounded-full">
                  Pre-filled
                </span>
              )}
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Mail className="w-4 h-4 text-[#BF953F]" />
              </div>
              <input
                id="register-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexandra@vanguard.com"
                className={`${styles.goldInput} ${isAutoRedirected ? '!border-[#BF953F] !bg-[#141414]' : ''}`}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Seniority / Experience Level & Role Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Account Role Track */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880] mb-1.5">
                Membership Track
              </label>
              <div className="relative">
                <div className={styles.inputIconWrapper}>
                  <Briefcase className="w-4 h-4 text-[#BF953F]" />
                </div>
                <select
                  id="register-role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${styles.goldInput} appearance-none cursor-pointer`}
                >
                  <option value="candidate" className="bg-[#121212] text-white">
                    Corporate Candidate
                  </option>
                  <option value="recruiter" className="bg-[#121212] text-white">
                    Talent Acquisition / Partner
                  </option>
                  <option value="corporate_admin" className="bg-[#121212] text-white">
                    Corporate Enterprise Admin
                  </option>
                </select>
              </div>
            </div>

            {/* Seniority Level */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880] mb-1.5">
                Seniority Level
              </label>
              <div className="relative">
                <div className={styles.inputIconWrapper}>
                  <Building2 className="w-4 h-4 text-[#BF953F]" />
                </div>
                <select
                  id="register-seniority-select"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className={`${styles.goldInput} appearance-none cursor-pointer`}
                >
                  <option value="Senior Executive" className="bg-[#121212] text-white">
                    Senior Executive
                  </option>
                  <option value="Director / VP" className="bg-[#121212] text-white">
                    Director / VP
                  </option>
                  <option value="C-Suite" className="bg-[#121212] text-white">
                    C-Suite / Founder
                  </option>
                  <option value="Mid-Level" className="bg-[#121212] text-white">
                    Mid-Level Professional
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Current / Previous Company */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880] mb-1.5">
              Current / Target Enterprise
            </label>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Building2 className="w-4 h-4 text-[#BF953F]" />
              </div>
              <input
                id="register-company-input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Goldman Sachs, Morgan Stanley, Apple"
                className={styles.goldInput}
              />
            </div>
          </div>

          {/* Password Field & Strength Indicator */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880] mb-1.5">
              Master Access Password <span className="text-[#BF953F]">*</span>
            </label>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Lock className="w-4 h-4 text-[#BF953F]" />
              </div>
              <input
                id="register-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={styles.goldInput}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A39171] hover:text-[#FCF6BA] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#A39171]">Security Rating:</span>
                  <span className="font-bold text-[#FCF6BA]">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Terms Acceptance */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none text-[#C5A880]">
              <input
                id="register-terms-checkbox"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-amber-600/40 bg-black/60 text-[#BF953F] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#BF953F] shrink-0"
              />
              <span>
                I accept the{' '}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#FCF6BA] underline underline-offset-2 decoration-[#BF953F]"
                >
                  VeriProof Executive Charter & Verification Standard
                </a>
                .
              </span>
            </label>
          </div>

          {/* Submit Registration Button */}
          <button
            id="register-submit-button"
            type="submit"
            disabled={loading}
            className={`${styles.goldButton} mt-3`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Creating Executive Profile...</span>
              </div>
            ) : (
              <>
                <span>Initialize Executive Profile</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.goldDivider}>
          <span>Already Verified?</span>
        </div>

        {/* Link to Login */}
        <div className="text-center">
          <p className="text-xs text-[#A39171]">
            Already hold an active credential?{' '}
            <Link
              to="/login"
              state={{ email }}
              className="font-bold text-[#FCF6BA] hover:underline underline-offset-4 decoration-[#BF953F] transition-all"
            >
              Sign In to VeriProof
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
