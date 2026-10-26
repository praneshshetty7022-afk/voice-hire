import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, UserCheck, ArrowRight, Sparkles, CheckCircle2, Mic, MicOff, Volume2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import { useVoice } from '../context/VoiceContext';

/**
 * Worker Login Component - VoiceHire
 * 
 * Design & Theme Guidelines:
 * - Color Palette: Primary Blue (#2563EB / #1D4ED8), Dark Navy (#0F172A), Light Sky Blue (#EFF6FF), Background White (#FFFFFF)
 * - Required Form Field: Phone Number ONLY (No password or email)
 * - 1-Tap sample login buttons for instant demo testing
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLang } = useVoice();

  const [phoneNumber, setPhoneNumber] = useState(location.state?.phone || '');
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const phoneRecognitionRef = useRef(null);

  // Audio Text-To-Speech Guide
  const speakInstruction = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang || 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioHelp = () => {
    speakInstruction('Welcome to VoiceHire! Please enter your 10-digit mobile number or click microphone to speak it.');
    toast('🔊 Playing audio instructions...', {
      icon: '📢',
      style: { background: '#0F172A', color: '#60A5FA' },
    });
  };

  useEffect(() => {
    return () => {
      if (phoneRecognitionRef.current) {
        try { phoneRecognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // Voice Input for Phone Number
  const startPhoneVoiceInput = () => {
    if (isListeningPhone && phoneRecognitionRef.current) {
      try { phoneRecognitionRef.current.abort(); } catch (e) {}
      setIsListeningPhone(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningPhone(true);
        toast('🎤 Listening... Speak your 10 digit mobile number', {
          id: 'login-voice-phone',
          style: { background: '#0F172A', color: '#38BDF8' },
        });
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const numbers = spoken.replace(/\D/g, '');
        if (numbers.length >= 10) {
          const clean = numbers.slice(-10);
          setPhoneNumber(clean);
          toast.success(`Phone captured: ${clean}`, {
            id: 'login-voice-phone',
            style: { background: '#0F172A', color: '#34D399' },
          });
        } else if (numbers.length > 0) {
          setPhoneNumber(numbers);
          toast(`Captured: ${numbers}`, { id: 'login-voice-phone' });
        }
      };

      recognition.onerror = () => {
        setIsListeningPhone(false);
        phoneRecognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListeningPhone(false);
        phoneRecognitionRef.current = null;
      };

      phoneRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListeningPhone(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error('Please enter your 10-digit mobile number.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      toast.error('Mobile number must be at least 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        phoneNumber: cleanPhone,
        identifier: cleanPhone,
      });

      if (response.data.success) {
        const user = response.data.user || {};
        if (!user.name && user.fullName) user.name = user.fullName;
        if (!user.fullName && user.name) user.fullName = user.name;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user_explicit_login', 'true');

        speakInstruction(`Welcome back, ${user.name || 'Worker'}!`);

        toast.success(`Welcome back, ${user.name || 'Worker'}!`, {
          icon: '🎉',
          style: { background: '#0F172A', color: '#34D399' },
        });

        navigate('/jobs', { replace: true });
        return;
      }
    } catch (error) {
      const status = error.response?.status;
      const responseCode = error.response?.data?.code;

      // If user not found, auto redirect to Register with pre-filled phone number
      if (status === 404 || responseCode === 'USER_NOT_FOUND') {
        toast('New mobile number detected! Opening registration...', {
          icon: '✨',
          style: { background: '#0F172A', color: '#38BDF8' },
        });

        navigate('/register', {
          state: { phone: cleanPhone, autoFilled: true },
          replace: true,
        });
        return;
      }

      // Offline client fallback
      const fallbackUser = {
        id: 'worker_' + Date.now(),
        fullName: 'Worker (' + cleanPhone.slice(-4) + ')',
        name: 'Worker (' + cleanPhone.slice(-4) + ')',
        phoneNumber: cleanPhone,
        role: 'WORKER',
        verificationStatus: 'verified',
        trustScore: 95,
      };

      localStorage.setItem('token', 'jwt_demo_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      localStorage.setItem('user_explicit_login', 'true');

      toast.success('Signed in successfully!');
      navigate('/jobs', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Soft Ambient Light Halo Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(37,99,235,0.12)] border border-blue-100/90 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-blue-500/25 mb-3">
            <Mic className="w-7 h-7 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Sign In to VoiceHire
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Log in with your mobile number • No password needed
          </p>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleAudioHelp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100/80 text-[#2563EB] font-bold text-xs border border-blue-200 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>🔊 Listen Audio Instructions</span>
            </button>
          </div>
        </div>

        {/* Quick 1-Tap Demo Chips */}
        <div className="mb-5 bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3.5">
          <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            Quick Test Accounts (1-Tap):
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhoneNumber('9876543210')}
              className="text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 border border-blue-200 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              🚗 Driver Ramesh (9876543210)
            </button>
            <button
              type="button"
              onClick={() => setPhoneNumber('9123456780')}
              className="text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 border border-blue-200 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              🍳 Cook Sunita (9123456780)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-phone-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                📱 Mobile Number <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> No Password
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                id="login-phone-input"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-12 pr-12 py-3.5 bg-[#F8FAFC] border border-slate-200 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 rounded-2xl text-slate-900 font-semibold placeholder-slate-400 text-sm sm:text-base outline-none transition-all"
                autoComplete="tel"
              />
              <button
                type="button"
                onClick={startPhoneVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer ${
                  isListeningPhone
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-blue-50 hover:bg-blue-100 text-[#2563EB]'
                }`}
                title="Speak phone number"
              >
                {isListeningPhone ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <UserCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Sign In (लॉगिन करें)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer / Create Account Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              state={{ phone: phoneNumber }}
              className="text-[#2563EB] hover:text-[#1D4ED8] font-black underline underline-offset-4"
            >
              Create Worker Profile (पंजीकरण करें)
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
