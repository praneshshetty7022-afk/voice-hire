import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import ThreeBackground from '../components/ThreeBackground';
import styles from '../styles/auth.module.css';

/**
 * Login Component - VeriProof Executive Corporate Platform
 * Strictly adhering to Black & Gold luxury aesthetics and smart email redirection.
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your corporate email and password.', {
        style: {
          background: '#121212',
          color: '#ffffff',
          border: '1px solid rgba(191, 149, 63, 0.3)',
        },
      });
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Submit authentication request to backend
      const response = await axios.post('/auth/login', {
        email: normalizedEmail,
        password,
      });

      if (response.data.success) {
        // Store JWT token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_explicit_login', 'true');

        toast.success(`Welcome back, ${response.data.user.fullName || 'Executive'}. Access Granted.`, {
          icon: '✨',
          style: {
            background: '#121212',
            color: '#FCF6BA',
            border: '1px solid #BF953F',
            boxShadow: '0 0 20px rgba(191, 149, 63, 0.3)',
          },
        });

        navigate('/jobs');
      }
    } catch (error) {
      console.warn('[VeriProof Auth Response]:', error.response?.data || error.message);

      const status = error.response?.status;
      const responseCode = error.response?.data?.code;
      const responseMessage = error.response?.data?.message;

      // 2. SMART AUTHENTICATION CHECK & REDIRECTION LOGIC:
      // If user is NOT found in the database, automatically show toast and redirect to Register with pre-filled email
      if (status === 404 || responseCode === 'USER_NOT_FOUND') {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#FCF6BA] shrink-0" />
              <div>
                <p className="font-bold text-[#FCF6BA]">Account not found</p>
                <p className="text-xs text-[#C5A880]">Redirecting to registration...</p>
              </div>
            </div>
          ),
          {
            duration: 3000,
            style: {
              background: '#121212',
              color: '#ffffff',
              border: '1px solid #BF953F',
              boxShadow: '0 0 25px rgba(191, 149, 63, 0.4)',
              borderRadius: '16px',
            },
          }
        );

        setTimeout(() => {
          navigate('/register', {
            state: {
              email: normalizedEmail,
              autoFilled: true,
              fromLoginNotice: 'Account not found. We have pre-filled your corporate email to set up your executive profile.',
            },
          });
        }, 1200);
        return;
      }

      // If user is found but credentials invalid
      if (status === 401 || responseCode === 'INVALID_CREDENTIALS') {
        toast.error('Invalid password. Please verify your credentials and try again.', {
          style: {
            background: '#121212',
            color: '#ffffff',
            border: '1px solid rgba(239, 68, 68, 0.5)',
          },
        });
        return;
      }

      // 3. Graceful Client-Side Demo Check (if backend network is unreachable in demo/preview)
      if (!error.response) {
        const storedUsers = JSON.parse(localStorage.getItem('veriproof_users') || '[]');
        const matched = storedUsers.find((u) => u.email?.toLowerCase() === normalizedEmail);

        if (!matched) {
          toast(
            (t) => (
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#FCF6BA] shrink-0" />
                <div>
                  <p className="font-bold text-[#FCF6BA]">Account not found</p>
                  <p className="text-xs text-[#C5A880]">Redirecting to registration...</p>
                </div>
              </div>
            ),
            {
              duration: 3000,
              style: {
                background: '#121212',
                color: '#ffffff',
                border: '1px solid #BF953F',
                boxShadow: '0 0 25px rgba(191, 149, 63, 0.4)',
                borderRadius: '16px',
              },
            }
          );

          setTimeout(() => {
            navigate('/register', {
              state: {
                email: normalizedEmail,
                autoFilled: true,
                fromLoginNotice: 'Account not found. We have pre-filled your corporate email to set up your executive profile.',
              },
            });
          }, 1200);
          return;
        } else if (matched.password !== password) {
          toast.error('Invalid password. Please check your credentials.', {
            style: {
              background: '#121212',
              color: '#ffffff',
              border: '1px solid rgba(239, 68, 68, 0.5)',
            },
          });
          return;
        } else {
          localStorage.setItem('token', 'jwt_demo_token_' + Date.now());
          localStorage.setItem('user', JSON.stringify(matched));
          toast.success(`Welcome back, ${matched.fullName}! Access Granted.`, {
            icon: '✨',
            style: {
              background: '#121212',
              color: '#FCF6BA',
              border: '1px solid #BF953F',
            },
          });
          navigate('/jobs');
          return;
        }
      }

      toast.error(responseMessage || 'Authentication failed. Please try again.', {
        style: {
          background: '#121212',
          color: '#ffffff',
          border: '1px solid rgba(239, 68, 68, 0.4)',
        },
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
        className={styles.glassCard}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Corporate Brand Identity Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#AA771C] p-[1.5px] shadow-[0_0_25px_rgba(191,149,63,0.35)] mb-3">
            <div className="w-full h-full bg-[#0b0b0b] rounded-[15px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#FCF6BA]" strokeWidth={2.2} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 mb-1.5">
            <h1 className={`${styles.goldGradientText} text-3xl font-black tracking-tight`}>
              VERIPROOF
            </h1>
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#C5A880] uppercase">
            Executive Career & Credential Platform
          </p>

          <div className="mt-3">
            <span className={styles.corporateBadge}>
              <Sparkles className="w-3.5 h-3.5 text-[#FCF6BA]" />
              Enterprise 256-Bit SSL Secured
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Corporate Email Field */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880] mb-2">
              Corporate Email Address
            </label>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Mail className="w-5 h-5 text-[#BF953F]" />
              </div>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.com"
                className={styles.goldInput}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#C5A880]">
                Access Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  toast('Password recovery initiated. Contact your corporate admin or check email.', {
                    icon: '🔒',
                    style: { background: '#121212', color: '#FCF6BA', border: '1px solid #BF953F' },
                  });
                }}
                className="text-xs text-[#C5A880] hover:text-[#FCF6BA] transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Lock className="w-5 h-5 text-[#BF953F]" />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={styles.goldInput}
                autoComplete="current-password"
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
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-[#C5A880]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-amber-600/40 bg-black/60 text-[#BF953F] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#BF953F]"
              />
              <span>Remember this executive session</span>
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className={styles.goldButton}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </div>
            ) : (
              <>
                <span>Sign In to Executive Suite</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.goldDivider}>
          <span>Verified Network Access</span>
        </div>

        {/* Link to Register */}
        <div className="text-center">
          <p className="text-xs text-[#A39171]">
            New to VeriProof Corporate Suite?{' '}
            <Link
              to="/register"
              state={{ email }}
              className="font-bold text-[#FCF6BA] hover:underline underline-offset-4 decoration-[#BF953F] transition-all"
            >
              Request Executive Access
            </Link>
          </p>
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-7 pt-4 border-t border-white/5 flex items-center justify-center gap-5 text-[11px] text-[#A39171]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#BF953F]" />
            SOC-2 Type II Certified
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#BF953F]" />
            Tier-4 Data Protection
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
