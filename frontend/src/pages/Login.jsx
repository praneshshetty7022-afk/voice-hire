import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Volume2, Mic, MicOff, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import ThreeBackground from '../components/ThreeBackground';
import styles from '../styles/auth.module.css';

/**
 * Worker Login Component - Udyoga Mitra / VoiceHire
 * Specially designed for low-literacy informal & blue-collar workers.
 * Features: Voice-assisted inputs, Audio TTS guides, large touch targets, Black & Gold theme.
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [phoneOrEmail, setPhoneOrEmail] = useState(location.state?.phone || location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Audio Text-To-Speech Guide in Hindi/Hinglish
  const speakInstruction = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioHelp = () => {
    speakInstruction(
      'नमस्ते! उद्योग मित्र में आपका स्वागत है। अपना 10 अंकों का मोबाइल नंबर और 4 अंकों का पिन डालें। यदि खाता नहीं बना है, तो हम आपको तुरंत रजिस्टर कर देंगे।'
    );
    toast('🔊 निर्देश सुने जा रहे हैं (Playing audio instructions)...', {
      icon: '📢',
      style: { background: '#121212', color: '#FCF6BA', border: '1px solid #BF953F' },
    });
  };

  // Voice Input Handler for Phone Number
  const startPhoneVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('आपके ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है (Voice not supported).');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningPhone(true);
        speakInstruction('बोलिए अपना 10 अंकों का मोबाइल नंबर');
        toast('🎤 बोलिए अपना मोबाइल नंबर...', {
          style: { background: '#121212', color: '#FCF6BA', border: '1px solid #BF953F' },
        });
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const numbers = spoken.replace(/\D/g, '');
        if (numbers.length >= 10) {
          const clean = numbers.slice(-10);
          setPhoneOrEmail(clean);
          speakInstruction(`नंबर दर्ज हुआ ${clean.split('').join(' ')}`);
          toast.success(`फ़ोन नंबर दर्ज हुआ: ${clean}`);
        } else if (numbers.length > 0) {
          setPhoneOrEmail(numbers);
          toast.success(`नंबर: ${numbers}`);
        } else {
          toast.error('नंबर समझ नहीं आया, दोबारा बोलें (Could not hear digits)');
        }
      };

      recognition.onerror = () => {
        setIsListeningPhone(false);
      };

      recognition.onend = () => {
        setIsListeningPhone(false);
      };

      recognition.start();
    } catch (err) {
      setIsListeningPhone(false);
      console.warn('Voice recognition error:', err);
    }
  };

  // Quick Demo Seeding for testing
  const setDemoWorker = (phone, pass) => {
    setPhoneOrEmail(phone);
    setPassword(pass);
    toast.success(`डेमो खाता भरा गया: ${phone}`);
    speakInstruction('डेमो खाता तैयार है। नीचे लॉगिन बटन दबाएं।');
  };

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

    if (!phoneOrEmail.trim() || !password.trim()) {
      toast.error('कृपया मोबाइल नंबर और पिन दर्ज करें (Please enter phone & PIN).', {
        style: { background: '#121212', color: '#ffffff', border: '1px solid rgba(191, 149, 63, 0.3)' },
      });
      speakInstruction('कृपया अपना मोबाइल नंबर और पिन भरें।');
      return;
    }

    setLoading(true);
    const rawInput = phoneOrEmail.trim();

    try {
      // 1. Submit login request to backend
      const response = await axios.post('/auth/login', {
        phoneNumber: rawInput,
        identifier: rawInput,
        email: rawInput.includes('@') ? rawInput : undefined,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_explicit_login', 'true');

        speakInstruction(`नमस्ते ${response.data.user.fullName}! आपका लॉगिन सफल रहा।`);

        toast.success(`स्वागत है, ${response.data.user.fullName}!`, {
          icon: '👑',
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
      console.warn('[Worker Auth Error]:', error.response?.data || error.message);

      const status = error.response?.status;
      const responseCode = error.response?.data?.code;

      // 2. SMART AUTHENTICATION CHECK & REDIRECTION LOGIC:
      // If user is NOT found in the database, notify and redirect to Register with pre-filled phone number
      if (status === 404 || responseCode === 'USER_NOT_FOUND') {
        speakInstruction('यह खाता नहीं मिला। आइए आपका नया पंजीकरण करते हैं।');

        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#FCF6BA] shrink-0" />
              <div>
                <p className="font-bold text-[#FCF6BA]">खाता नहीं मिला (Account not found)</p>
                <p className="text-xs text-[#C5A880]">पंजीकरण पेज पर जा रहे हैं... (Redirecting to registration)</p>
              </div>
            </div>
          ),
          {
            duration: 3500,
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
              phone: rawInput,
              autoFilled: true,
              fromNotice: `यह नंबर (${rawInput}) नया है! बस अपना नाम और काम चुनकर 1 मिनट में रजिस्टर करें।`,
            },
          });
        }, 1300);
        return;
      }

      // If credentials invalid
      if (status === 401 || responseCode === 'INVALID_CREDENTIALS') {
        speakInstruction('गलत पिन! कृपया सही 4 अंकों का पिन डालें।');
        toast.error('गलत पिन या पासवर्ड। दोबारा प्रयास करें (Wrong PIN).', {
          style: { background: '#121212', color: '#ffffff', border: '1px solid rgba(239, 68, 68, 0.5)' },
        });
        return;
      }

      // 3. Fallback client-side demo check if network is offline
      if (!error.response) {
        const storedUsers = JSON.parse(localStorage.getItem('veriproof_users') || '[]');
        const matched = storedUsers.find(
          (u) => u.phoneNumber === rawInput || u.email?.toLowerCase() === rawInput.toLowerCase()
        );

        if (!matched) {
          speakInstruction('यह खाता नहीं मिला। आइए आपका नया पंजीकरण करते हैं।');
          toast('खाता नहीं मिला। आइए पंजीकरण करें! (Redirecting to register...)', {
            icon: '✨',
            style: { background: '#121212', color: '#FCF6BA', border: '1px solid #BF953F' },
          });

          setTimeout(() => {
            navigate('/register', { state: { phone: rawInput, autoFilled: true } });
          }, 1200);
          return;
        } else if (matched.password !== password) {
          toast.error('गलत पिन या पासवर्ड (Invalid PIN).');
          return;
        } else {
          localStorage.setItem('token', 'jwt_worker_token_' + Date.now());
          localStorage.setItem('user', JSON.stringify(matched));
          speakInstruction(`स्वागत है ${matched.fullName}!`);
          navigate('/jobs');
          return;
        }
      }

      toast.error(error.response?.data?.message || 'लॉगिन विफल (Login failed).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Three.js Interactive 3D Gold Wireframe & Particles */}
      <ThreeBackground />

      <motion.div
        className={styles.glassCard}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with Bilingual & Audio Help for Low Literacy Workers */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#AA771C] p-[1.5px] shadow-[0_0_25px_rgba(191,149,63,0.35)] mb-3">
            <div className="w-full h-full bg-[#0b0b0b] rounded-[15px] flex items-center justify-center">
              <span className="text-3xl">🤝</span>
            </div>
          </div>

          <h1 className={`${styles.goldGradientText} text-2xl sm:text-3xl font-black tracking-tight mb-1`}>
            उद्योग मित्र • UDYOGA MITRA
          </h1>

          <p className="text-sm font-bold text-[#FCF6BA] tracking-wide">
            श्रमिक रोजगार मंच (Worker Employment Platform)
          </p>
          <p className="text-xs text-[#C5A880] mt-0.5">
            बोलिए और काम पाइए • Speak. Connect. Get Employed.
          </p>

          {/* Audio Instruction Speaker Pill */}
          <div className="mt-3.5">
            <button
              type="button"
              onClick={handleAudioHelp}
              className={styles.audioHelpBtn}
              aria-label="Listen to instructions in audio"
            >
              <Volume2 className="w-4 h-4 text-[#FCF6BA]" />
              <span>🔊 आवाज से निर्देश सुनें (Listen Audio)</span>
            </button>
          </div>
        </div>

        {/* 1-Tap Quick Demo Chips for Instant Testing */}
        <div className="mb-5 bg-black/40 border border-[#BF953F]/25 rounded-2xl p-3">
          <p className="text-[11px] font-bold text-[#C5A880] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FCF6BA]" />
            तुरंत जांचें (1-Tap Worker Login Demo):
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDemoWorker('9876543210', '1234')}
              className="text-xs font-bold bg-[#BF953F]/15 hover:bg-[#BF953F]/30 text-[#FCF6BA] border border-[#BF953F]/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              🚗 ड्राइवर रमेश (PIN: 1234)
            </button>
            <button
              type="button"
              onClick={() => setDemoWorker('9123456780', '1234')}
              className="text-xs font-bold bg-[#BF953F]/15 hover:bg-[#BF953F]/30 text-[#FCF6BA] border border-[#BF953F]/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              🧑‍🍳 रसोइया सुनीता (PIN: 1234)
            </button>
          </div>
        </div>

        {/* Worker Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Mobile Number Field with Voice Mic Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-[#FCF6BA]">
                📱 मोबाइल नंबर (Mobile Number)
              </label>
              <span className="text-[11px] text-[#C5A880]">10 अंक</span>
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Phone className="w-5 h-5 text-[#BF953F]" />
              </div>
              <input
                id="login-email-input"
                type="tel"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="उदा. 9876543210"
                className={styles.goldInput}
                autoComplete="tel"
              />
              {/* Mic voice input button */}
              <button
                type="button"
                onClick={startPhoneVoiceInput}
                className={`${styles.micActionBtn} ${isListeningPhone ? styles.micActionBtnActive : ''}`}
                title="बोलकर नंबर भरें (Speak Phone Number)"
              >
                {isListeningPhone ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 4-Digit PIN or Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-[#FCF6BA]">
                🔒 4 अंकों का गुप्त पिन या पासवर्ड (4-Digit PIN)
              </label>
              <span className="text-[11px] text-[#A39171]">उदा. 1234</span>
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
                placeholder="पिन डालें (उदा. 1234)"
                className={styles.goldInput}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A39171] hover:text-[#FCF6BA] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide PIN' : 'Show PIN'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Primary Action Button (Big 60px target) */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className={`${styles.goldButton} mt-2`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>जांच की जा रही है...</span>
              </div>
            ) : (
              <>
                <UserCheck className="w-5 h-5 stroke-[2.5]" />
                <span>लॉगिन करें (LOGIN)</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.goldDivider}>
          <span>नया खाता? (New Account)</span>
        </div>

        {/* Link to Register */}
        <div className="text-center">
          <Link
            to="/register"
            state={{ phone: phoneOrEmail }}
            className="inline-flex items-center gap-2 font-black text-sm text-[#FCF6BA] bg-[#BF953F]/15 hover:bg-[#BF953F]/25 border border-[#BF953F]/40 px-5 py-3 rounded-2xl shadow-sm transition-all"
          >
            <span>👉 नया खाता बनाएं (Register Here)</span>
          </Link>
        </div>

        {/* Bottom Dignity Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-[#C5A880]">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#BF953F]" />
            श्रमिक सम्मान सुरक्षा
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-[#BF953F]" />
            सीधे काम पाएं
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
