import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Volume2, Mic, MicOff, ArrowRight, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import ThreeBackground from '../components/ThreeBackground';
import styles from '../styles/auth.module.css';

/**
 * Worker Login Component - Udyoga Mitra / VoiceHire
 * Streamlined: Log in with just 10-digit Mobile Number.
 * Completely removed Email and Password.
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [phoneNumber, setPhoneNumber] = useState(location.state?.phone || '');
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
      'नमस्ते! उद्योग मित्र में आपका स्वागत है। केवल अपना 10 अंकों का मोबाइल नंबर डालें या माइक दबाकर बोलें। यदि खाता नहीं बना है, तो हम आपको तुरंत रजिस्टर कर देंगे।'
    );
    toast('🔊 निर्देश सुने जा रहे हैं (Playing audio instructions)...', {
      icon: '📢',
      style: { background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' },
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
          style: { background: '#0f172a', color: '#34d399', border: '1px solid #10b981' },
        });
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const numbers = spoken.replace(/\D/g, '');
        if (numbers.length >= 10) {
          const clean = numbers.slice(-10);
          setPhoneNumber(clean);
          speakInstruction(`नंबर दर्ज हुआ ${clean.split('').join(' ')}`);
          toast.success(`फ़ोन नंबर दर्ज हुआ: ${clean}`, {
            style: { background: '#0f172a', color: '#34d399', border: '1px solid #10b981' },
          });
        } else if (numbers.length > 0) {
          setPhoneNumber(numbers);
          toast.success(`नंबर: ${numbers}`);
        } else {
          toast.error('नंबर समझ नहीं आया, दोबारा बोलें (Could not hear digits)');
        }
      };

      recognition.onerror = () => setIsListeningPhone(false);
      recognition.onend = () => setIsListeningPhone(false);
      recognition.start();
    } catch (err) {
      setIsListeningPhone(false);
      console.warn('Voice recognition error:', err);
    }
  };

  // Quick Demo Seeding for testing
  const setDemoWorker = (phone) => {
    setPhoneNumber(phone);
    toast.success(`डेमो खाता भरा गया: ${phone}`, {
      style: { background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' },
    });
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

    if (!phoneNumber.trim()) {
      toast.error('कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें (Please enter phone number).', {
        style: { background: '#0f172a', color: '#f87171', border: '1px solid #ef4444' },
      });
      speakInstruction('कृपया अपना मोबाइल नंबर भरें।');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए (Phone must be 10 digits).');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit login request with just phone number
      const response = await axios.post('/auth/login', {
        phoneNumber: cleanPhone,
        identifier: cleanPhone,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_explicit_login', 'true');

        speakInstruction(`नमस्ते ${response.data.user.fullName}! आपका लॉगिन सफल रहा।`);

        toast.success(`स्वागत है, ${response.data.user.fullName}!`, {
          icon: '🎉',
          style: {
            background: '#0f172a',
            color: '#34d399',
            border: '1.5px solid #10b981',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
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
              <Sparkles className="w-5 h-5 text-[#38bdf8] shrink-0" />
              <div>
                <p className="font-bold text-[#38bdf8]">खाता नहीं मिला (Account not found)</p>
                <p className="text-xs text-[#94a3b8]">पंजीकरण पेज पर जा रहे हैं... (Redirecting to register)</p>
              </div>
            </div>
          ),
          {
            duration: 3500,
            style: {
              background: '#0f172a',
              color: '#ffffff',
              border: '1.5px solid #38bdf8',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
            },
          }
        );

        setTimeout(() => {
          navigate('/register', {
            state: {
              phone: cleanPhone,
              autoFilled: true,
              fromNotice: `यह नंबर (${cleanPhone}) नया है! बस अपना नाम लिखें और 1 मिनट में रजिस्टर करें।`,
            },
          });
        }, 1300);
        return;
      }

      // 3. Fallback client-side demo check if network is offline
      if (!error.response) {
        const storedUsers = JSON.parse(localStorage.getItem('veriproof_users') || '[]');
        const matched = storedUsers.find((u) => u.phoneNumber === cleanPhone);

        if (!matched) {
          speakInstruction('यह खाता नहीं मिला। आइए आपका नया पंजीकरण करते हैं।');
          toast('खाता नहीं मिला। आइए पंजीकरण करें! (Redirecting to register...)', {
            icon: '✨',
            style: { background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' },
          });

          setTimeout(() => {
            navigate('/register', { state: { phone: cleanPhone, autoFilled: true } });
          }, 1200);
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
      {/* Three.js Interactive 3D Vibrant Constellation Background */}
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-400 to-emerald-400 p-[2px] shadow-[0_0_25px_rgba(56,189,248,0.35)] mb-3">
            <div className="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center">
              <span className="text-3xl">🤝</span>
            </div>
          </div>

          <h1 className={`${styles.colorfulGradientText} text-2xl sm:text-3xl font-black tracking-tight mb-1`}>
            उद्योग मित्र • UDYOGA MITRA
          </h1>

          <p className="text-sm font-bold text-[#e2e8f0] tracking-wide">
            श्रमिक रोजगार मंच (Worker Employment Platform)
          </p>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            बोलिए और काम पाइए • केवल मोबाइल नंबर से लॉगिन करें
          </p>

          {/* Audio Instruction Speaker Pill */}
          <div className="mt-3.5">
            <button
              type="button"
              onClick={handleAudioHelp}
              className={styles.audioHelpBtn}
              aria-label="Listen to instructions in audio"
            >
              <Volume2 className="w-4 h-4 text-[#38bdf8]" />
              <span>🔊 आवाज से निर्देश सुनें (Listen Audio)</span>
            </button>
          </div>
        </div>

        {/* 1-Tap Quick Demo Chips for Instant Testing */}
        <div className="mb-5 bg-slate-900/60 border border-blue-500/25 rounded-2xl p-3">
          <p className="text-[11px] font-bold text-[#94a3b8] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            तुरंत जांचें (1-Tap Worker Login Demo):
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDemoWorker('9876543210')}
              className="text-xs font-bold bg-blue-500/20 hover:bg-blue-500/35 text-blue-200 border border-blue-400/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              🚗 ड्राइवर रमेश (9876543210)
            </button>
            <button
              type="button"
              onClick={() => setDemoWorker('9123456780')}
              className="text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              🧑‍🍳 रसोइया सुनीता (9123456780)
            </button>
          </div>
        </div>

        {/* Worker Login Form - ONLY Mobile Number */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Mobile Number Field with Voice Mic Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                📱 मोबाइल नंबर (Mobile Number)
              </label>
              <span className="text-[11px] text-[#94a3b8]">10 अंक</span>
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Phone className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <input
                id="login-email-input"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="उदा. 9876543210"
                className={styles.friendlyInput}
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

          {/* Primary Action Button (Big 60px target) */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className={`${styles.primaryButton} mt-2`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <div className={styles.cleanDivider}>
          <span>नया खाता? (New Account)</span>
        </div>

        {/* Link to Register */}
        <div className="text-center">
          <Link
            to="/register"
            state={{ phone: phoneNumber }}
            className="inline-flex items-center gap-2 font-black text-sm text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 px-5 py-3 rounded-2xl shadow-sm transition-all"
          >
            <span>👉 नया खाता बनाएं (Register Here)</span>
          </Link>
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-5 text-xs text-[#94a3b8]">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            पासवर्ड की कोई जरूरत नहीं
          </span>
          <span className="flex items-center gap-1.5 font-bold text-cyan-400">
            <Sparkles className="w-4 h-4" />
            सीधे काम पाएं
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
