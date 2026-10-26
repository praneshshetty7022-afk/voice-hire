import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, User, Globe, Volume2, Mic, MicOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import ThreeBackground from '../components/ThreeBackground';
import { useVoice } from '../context/VoiceContext';
import styles from '../styles/auth.module.css';

/**
 * Worker Register Component - Udyoga Mitra / VoiceHire
 * Required Form Fields:
 * 1. Full Name
 * 2. Phone Number
 * 3. Language Selection Dropdown
 * Completely removed: Email and Password.
 */
export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedLang } = useVoice();

  // Extract pre-filled phone from location state or search params (?phone=...)
  const queryParams = new URLSearchParams(location.search);
  const initialPhone = location.state?.phone || queryParams.get('phone') || '';
  const isAutoRedirected = Boolean(location.state?.autoFilled || queryParams.get('phone'));

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [isListeningName, setIsListeningName] = useState(false);
  const [isListeningPhone, setIsListeningPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supported Indian Languages with Native Scripts & Speech Codes
  const LANGUAGES = [
    { code: 'hi-IN', langKey: 'hi', name: 'हिन्दी', englishName: 'Hindi', flag: '🇮🇳', greeting: 'नमस्ते' },
    { code: 'kn-IN', langKey: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', flag: '🇮🇳', greeting: 'ನಮಸ್ಕಾರ' },
    { code: 'te-IN', langKey: 'te', name: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳', greeting: 'నమస్కారం' },
    { code: 'ta-IN', langKey: 'ta', name: 'தமிழ்', englishName: 'Tamil', flag: '🇮🇳', greeting: 'வணக்கம்' },
    { code: 'en-IN', langKey: 'en', name: 'English', englishName: 'English', flag: '🇬🇧', greeting: 'Welcome' },
  ];

  // Speech Synthesis Audio Guidance
  const speakInstruction = (text, langCode = selectedLanguage) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioHelp = () => {
    speakInstruction(
      'नमस्ते! अपना नाम बोलें या लिखें, 10 अंकों का मोबाइल नंबर भरें, और अपनी भाषा चुनें। फिर रजिस्टर बटन दबाएं।'
    );
    toast('🔊 निर्देश सुने जा रहे हैं (Playing audio instructions)...', {
      icon: '📢',
      style: { background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' },
    });
  };

  useEffect(() => {
    if (location.state?.phone && !phoneNumber) {
      setPhoneNumber(location.state.phone);
    }
    if (isAutoRedirected) {
      speakInstruction('आपका मोबाइल नंबर पहले से भरा हुआ है। बस अपना नाम लिखें और भाषा चुनें।');
    }
  }, [location.state, phoneNumber, isAutoRedirected]);

  // Voice Input for Worker Name
  const startNameVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input not supported in browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListeningName(true);
        speakInstruction('बोलिए अपना पूरा नाम');
        toast('🎤 बोलिए अपना नाम...', {
          style: { background: '#0f172a', color: '#34d399', border: '1px solid #10b981' },
        });
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim();
        const cleanName = spoken.replace(/[0-9]/g, '').trim();
        if (cleanName) {
          setFullName(cleanName);
          speakInstruction(`धन्यवाद ${cleanName}!`);
          toast.success(`नाम दर्ज हुआ: ${cleanName}`, {
            style: { background: '#0f172a', color: '#34d399', border: '1px solid #10b981' },
          });
        }
      };

      recognition.onerror = () => setIsListeningName(false);
      recognition.onend = () => setIsListeningName(false);
      recognition.start();
    } catch (err) {
      setIsListeningName(false);
    }
  };

  // Voice Input for Phone
  const startPhoneVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListeningPhone(true);
        speakInstruction('बोलिए अपना 10 अंकों का मोबाइल नंबर');
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const numbers = spoken.replace(/\D/g, '');
        if (numbers.length >= 10) {
          setPhoneNumber(numbers.slice(-10));
          toast.success(`नंबर: ${numbers.slice(-10)}`, {
            style: { background: '#0f172a', color: '#34d399', border: '1px solid #10b981' },
          });
        }
      };

      recognition.onerror = () => setIsListeningPhone(false);
      recognition.onend = () => setIsListeningPhone(false);
      recognition.start();
    } catch (err) {
      setIsListeningPhone(false);
    }
  };

  // Language Change Handler
  const handleLanguageChange = (e) => {
    const newLangCode = e.target.value;
    setSelectedLanguage(newLangCode);

    const langObj = LANGUAGES.find((l) => l.code === newLangCode);
    if (langObj) {
      if (setSelectedLang) {
        setSelectedLang(langObj.langKey);
      }
      speakInstruction(`${langObj.greeting}! ${langObj.name} भाषा चुनी गई।`, newLangCode);
      toast.success(`भाषा: ${langObj.name} (${langObj.englishName})`, {
        icon: '🌐',
        style: { background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' },
      });
    }
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation ONLY for Name, Phone Number, and Language Selection
    if (!fullName.trim() || !phoneNumber.trim() || !selectedLanguage) {
      toast.error('कृपया अपना नाम, मोबाइल नंबर और भाषा भरें (Please fill Name, Phone & Language).', {
        style: { background: '#0f172a', color: '#f87171', border: '1px solid #ef4444' },
      });
      speakInstruction('कृपया अपना नाम और मोबाइल नंबर भरें।');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए (Phone must be 10 digits).', {
        style: { background: '#0f172a', color: '#f87171', border: '1px solid #ef4444' },
      });
      speakInstruction('कृपया पूरा 10 अंकों का मोबाइल नंबर डालें।');
      return;
    }

    setLoading(true);

    try {
      // API payload strictly contains ONLY Name, Phone Number, and Language (NO email, NO password)
      const response = await axios.post('/auth/register', {
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        preferredLanguage: selectedLanguage,
        language: selectedLanguage,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_explicit_login', 'true');

        speakInstruction(`बधाई हो ${fullName}! आपका पंजीकरण सफल रहा।`);

        toast.success(`खाता सफलतापूर्वक बना! स्वागत है, ${fullName}`, {
          icon: '🎉',
          style: {
            background: '#0f172a',
            color: '#34d399',
            border: '1.5px solid #10b981',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
          },
        });

        navigate('/jobs');
      }
    } catch (error) {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (status === 409 || code === 'USER_ALREADY_EXISTS') {
        speakInstruction('यह नंबर पहले से पंजीकृत है। आइए लॉगिन करें।');
        toast.error('यह नंबर पहले से पंजीकृत है। लॉगिन करें (Already registered).', {
          style: { background: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8' },
        });
        setTimeout(() => {
          navigate('/login', { state: { phone: cleanPhone } });
        }, 1500);
        return;
      }

      // Offline fallback
      if (!error.response) {
        const fallbackUser = {
          id: 'worker_' + Date.now(),
          fullName: fullName.trim(),
          phoneNumber: cleanPhone,
          preferredLanguage: selectedLanguage,
          role: 'WORKER',
          verificationStatus: 'verified',
          trustScore: 95,
        };

        const existingUsers = JSON.parse(localStorage.getItem('veriproof_users') || '[]');
        existingUsers.push(fallbackUser);
        localStorage.setItem('veriproof_users', JSON.stringify(existingUsers));

        localStorage.setItem('token', 'jwt_demo_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        localStorage.setItem('user_explicit_login', 'true');

        speakInstruction(`बधाई हो ${fullName}! आपका खाता बन गया है।`);
        toast.success(`खाता बन गया! स्वागत है, ${fullName}`, {
          style: { background: '#0f172a', color: '#34d399', border: '1px solid #10b981' },
        });
        navigate('/jobs');
        return;
      }

      toast.error(error.response?.data?.message || 'पंजीकरण विफल (Registration failed).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Three.js Interactive 3D Vibrant Constellation Background */}
      <ThreeBackground />

      <motion.div
        className={`${styles.glassCard} ${styles.glassCardWide}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 p-[2px] shadow-[0_0_25px_rgba(52,211,153,0.35)] mb-2">
            <div className="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
          </div>

          <h1 className={`${styles.colorfulGradientText} text-2xl sm:text-3xl font-black tracking-tight mb-1`}>
            श्रमिक पंजीकरण • NEW WORKER
          </h1>

          <p className="text-sm font-bold text-[#e2e8f0]">
            नाम, मोबाइल नंबर और भाषा दर्ज करें (Quick 1-Minute Setup)
          </p>

          {/* Audio Instruction Speaker Pill */}
          <div className="mt-2.5">
            <button
              type="button"
              onClick={handleAudioHelp}
              className={styles.audioHelpBtn}
              aria-label="Listen to audio instructions"
            >
              <Volume2 className="w-4 h-4 text-[#38bdf8]" />
              <span>🔊 आवाज से निर्देश सुनें (Listen Audio)</span>
            </button>
          </div>
        </div>

        {/* Smart Redirection Notice Banner (Triggered when redirected from Login) */}
        {isAutoRedirected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.redirectNoticeBanner}
          >
            <Sparkles className="w-6 h-6 text-[#34d399] shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-[#34d399]">यह नंबर नया है! </span>
              <span className="text-[#f8fafc]">
                आपका मोबाइल नंबर (<strong className="text-[#38bdf8]">{phoneNumber}</strong>) पहले से भर दिया गया है। बस अपना नाम लिखें और भाषा चुनें।
              </span>
            </div>
          </motion.div>
        )}

        {/* Registration Form - Required: Name, Phone Number, Language Dropdown ONLY */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Field 1: Worker Full Name with Mic */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                👤 आपका पूरा नाम (Your Full Name) <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-[#94a3b8]">बोलकर भर सकते हैं</span>
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <User className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <input
                id="register-name-input"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="उदा. रमेश कुमार (Ramesh Kumar)"
                className={styles.friendlyInput}
                autoComplete="name"
              />
              <button
                type="button"
                onClick={startNameVoiceInput}
                className={`${styles.micActionBtn} ${isListeningName ? styles.micActionBtnActive : ''}`}
                title="बोलकर नाम भरें"
              >
                {isListeningName ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 2: Mobile Number (Pre-filled if redirected from login) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                📱 मोबाइल नंबर (Mobile Number) <span className="text-rose-400">*</span>
              </label>
              {isAutoRedirected && (
                <span className="text-[10px] font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 px-2.5 py-0.5 rounded-full shadow-sm">
                  पहले से भरा हुआ (Pre-filled)
                </span>
              )}
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Phone className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <input
                id="register-phone-input"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="उदा. 9876543210"
                className={`${styles.friendlyInput} ${isAutoRedirected ? '!border-[#34d399] !bg-slate-900/90' : ''}`}
                autoComplete="tel"
              />
              <button
                type="button"
                onClick={startPhoneVoiceInput}
                className={`${styles.micActionBtn} ${isListeningPhone ? styles.micActionBtnActive : ''}`}
                title="बोलकर नंबर भरें"
              >
                {isListeningPhone ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 3: Language Selection Dropdown Menu */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                🌐 अपनी भाषा चुनें (Select Your Language) <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-[#34d399]">आवाज़ इसी भाषा में आएगी</span>
            </div>
            <div className="relative">
              <div className={styles.inputIconWrapper}>
                <Globe className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <select
                id="register-language-select"
                required
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className={`${styles.friendlyInput} appearance-none cursor-pointer pr-10`}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white py-2">
                    {lang.flag} {lang.name} ({lang.englishName})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                ▼
              </div>
            </div>
          </div>

          {/* Submit Registration Button */}
          <button
            id="register-submit-button"
            type="submit"
            disabled={loading}
            className={`${styles.primaryButton} mt-3`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>खाता बन रहा है...</span>
              </div>
            ) : (
              <>
                <span>✨ खाता बनाएं और काम पाएं (REGISTER NOW)</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.cleanDivider}>
          <span>पहले से खाता है? (Already Registered)</span>
        </div>

        {/* Link to Login */}
        <div className="text-center">
          <Link
            to="/login"
            state={{ phone: phoneNumber }}
            className="inline-flex items-center gap-2 font-black text-sm text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 px-5 py-3 rounded-2xl shadow-sm transition-all"
          >
            <span>👉 लॉगिन करें (Sign In Here)</span>
          </Link>
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-5 text-xs text-[#94a3b8]">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            सरल व सुरक्षित पंजीकरण
          </span>
          <span className="flex items-center gap-1.5 font-bold text-cyan-400">
            <Sparkles className="w-4 h-4" />
            1 मिनट में काम पाएं
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
