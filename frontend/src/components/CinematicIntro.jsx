import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lock,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react'

/**
 * Web Audio Synthesizer for rich cinematic audio without external mp3 dependencies
 */
class CinematicAudioEngine {
  constructor() {
    this.ctx = null
    this.droneGain = null
    this.isMuted = false
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setMuted(muted) {
    this.isMuted = muted
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime)
    }
  }

  playBoom() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(120, t)
      osc.frequency.exponentialRampToValueAtTime(30, t + 1.2)
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 1.6)
    } catch (e) {}
  }

  playWhoosh() {
    if (this.isMuted || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(180, t)
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.4)
      gain.gain.setValueAtTime(0.01, t)
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.55)
    } catch (e) {}
  }

  cleanup() {
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close()
      } catch (e) {}
      this.ctx = null
    }
  }
}

const audioEngine = new CinematicAudioEngine()

// 3 Impactful Acts totaling strictly 27 seconds (< 30s)
const ACTS = [
  {
    id: 'act1',
    number: '1',
    pillTitle: '1. The Problem',
    title: 'THE BARRIER',
    subtitle: 'Text-Heavy Portals Lock Out Real Workers',
    startSec: 0,
    endSec: 7,
    theme: 'problem',
    voiceovers: {
      en: 'For millions of workers, job applications are a locked door. Complicated text forms, language barriers, and endless paperwork.',
      kn: 'ಲಕ್ಷಾಂತರ ಶ್ರಮಿಕರಿಗೆ, ಉದ್ಯೋಗ ಹುಡುಕಾಟ ಕಷ್ಟಕರವಾಗಿದೆ. ಸಂಕೀರ್ಣ ಫಾರ್ಮ್‌ಗಳು ಮತ್ತು ಭಾಷೆಯ ಅಡೆತಡೆಗಳು.',
      hi: 'लाखों मेहनती कामगारों के लिए नौकरी ढूंढना एक बंद दरवाज़ा रहा है। कठिन फॉर्म, भाषा की रुकावटें और दस्तावेज़।',
      ta: 'கோடிக்கணக்கான தொழிலாளர்களுக்கு வேலைவாய்ப்பு கதவுகள் மூடப்பட்டிருந்தன. சிக்கலான விண்ணப்ப படிவங்கள் மற்றும் மொழி தடைகள்.',
      te: 'లక్షలాది మంది శ్రామికులకు ఉద్యోగ పోర్టల్స్ కష్టంగా మారాయి. క్లిష్టమైన ఫారమ్‌లు మరియు భాషా సమస్యలు.',
    },
  },
  {
    id: 'act2',
    number: '2',
    pillTitle: '2. Voice Power',
    title: 'THE POWER OF VOICE',
    subtitle: 'Your Native Tongue is Your Resume',
    startSec: 7,
    endSec: 18,
    theme: 'voice',
    voiceovers: {
      en: 'Until now. With VoiceHire, your voice is your power. Just speak your name, your trade, your language. No typing required.',
      kn: 'ಇನ್ನು ಮುಂದೆ ಅಲ್ಲ. ವಾಯ್ಸ್‌ಹೈರ್ ಮೂಲಕ ನಿಮ್ಮ ಧ್ವನಿಯೇ ನಿಮ್ಮ ಶಕ್ತಿ. ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಉದ್ಯೋಗ ಪಡೆಯಿರಿ.',
      hi: 'अब नहीं। वॉयसहायर के साथ आपकी आवाज़ ही आपकी ताक़त है। बस अपनी भाषा में बोलें और काम पाएं।',
      ta: 'இனி இல்லை. வாய்ஸ்ஹையர் மூலம் உங்கள் குரலே உங்கள் அடையாளம். தட்டச்சு செய்யாமல் பேசி வேலை பெறுங்கள்.',
      te: 'ఇకపై కాదు. వాయిస్‌హైర్ ద్వారా మీ గొంతే మీ రెజ్యూమ్. టైప్ చేయకుండా మాట్లాడి వెంటనే దరఖాస్తు చేసుకోండి.',
    },
  },
  {
    id: 'act3',
    number: '3',
    pillTitle: '3. Instant Jobs',
    title: 'INSTANT HIRING',
    subtitle: 'Direct Employer Calls & Fair Wages',
    startSec: 18,
    endSec: 27,
    theme: 'jobs',
    voiceovers: {
      en: 'Verified local jobs. Direct employer calls. Instant hiring. Welcome to VoiceHire, the future of accessible work.',
      kn: 'ಖಚಿತ ದೈನಂದಿನ ಉದ್ಯೋಗಗಳು. ಮಾಲೀಕರಿಂದ ನೇರ ಕರೆಗಳು. ಉದ್ಯೋಗ ಮಿತ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ.',
      hi: 'सत्यापित स्थानीय नौकरियां। नियोक्ताओं से सीधे फोन। वॉयसहायर में आपका स्वागत है।',
      ta: 'உறுதி செய்யப்பட்ட உள்ளூர் வேலைகள். முதலாளிகளிடமிருந்து நேரடி அழைப்புகள். வாய்ஸ்ஹையருக்கு வரவேற்கிறோம்.',
      te: 'ధృవీకరించబడిన స్థానిక ఉద్యోగాలు. యజమానుల నుండి నేరుగా ఫోన్ కాల్స్. వాయిస్‌హైర్‌కు స్వాగతం.',
    },
  },
]

const TOTAL_DURATION = 27

export default function CinematicIntro({ isOpen = true, onClose }) {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [showSubtitles, setShowSubtitles] = useState(true)

  // Language auto-detection state
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('voicehire_lang') || 'en'
  })
  const [detectedLocation, setDetectedLocation] = useState('Detecting location...')

  const currentActIndexRef = useRef(-1)

  // 1. Automatic Location & Regional Language Detection on Mount
  useEffect(() => {
    const detectRegionalLanguage = () => {
      try {
        const stored = localStorage.getItem('voicehire_lang')
        if (stored) {
          setLang(stored)
          setDetectedLocation('User Preference')
          return
        }

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        const browserLocale = navigator.language || navigator.userLanguage || ''

        // Check browser language tag first (e.g. kn, hi, ta, te)
        if (browserLocale.startsWith('kn')) {
          setLang('kn')
          setDetectedLocation('Karnataka Region (ಕನ್ನಡ)')
          return
        }
        if (browserLocale.startsWith('hi')) {
          setLang('hi')
          setDetectedLocation('Northern Region (हिंदी)')
          return
        }
        if (browserLocale.startsWith('ta')) {
          setLang('ta')
          setDetectedLocation('Tamil Nadu (தமிழ்)')
          return
        }
        if (browserLocale.startsWith('te')) {
          setLang('te')
          setDetectedLocation('Andhra/Telangana (తెలుగు)')
          return
        }

        // Check Indian Timezone -> Default to Kannada for Karnataka hub or English
        if (tz.includes('Calcutta') || tz.includes('Kolkata')) {
          // If Geolocation is accessible, check Karnataka latitude/longitude coordinates
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const lat = pos.coords.latitude
                const lon = pos.coords.longitude
                // Karnataka boundary roughly 11.5°N - 18.5°N, 74°E - 78.5°E
                if (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.8) {
                  setLang('kn')
                  setDetectedLocation('Bengaluru / Karnataka (ಕನ್ನಡ)')
                  localStorage.setItem('voicehire_lang', 'kn')
                } else {
                  setLang('hi')
                  setDetectedLocation('India (हिंदी)')
                }
              },
              () => {
                // Default to Kannada / English for Bengaluru platform
                setLang('kn')
                setDetectedLocation('Bengaluru Hub (ಕನ್ನಡ)')
              },
              { timeout: 3000 }
            )
          } else {
            setLang('kn')
            setDetectedLocation('India (ಕನ್ನಡ)')
          }
        } else {
          setLang('en')
          setDetectedLocation('Global (English)')
        }
      } catch (err) {
        setLang('en')
        setDetectedLocation('Standard')
      }
    }

    detectRegionalLanguage()
  }, [])

  // Current Act computation
  const activeAct =
    ACTS.find((act) => currentTime >= act.startSec && currentTime < act.endSec) || ACTS[ACTS.length - 1]
  const currentActIndex = ACTS.findIndex((a) => a.id === activeAct.id)

  // Text-To-Speech SpeechSynthesis in detected regional language
  const speakActNarration = (act, targetLang = lang) => {
    if (isMuted || !('speechSynthesis' in window)) return

    try {
      window.speechSynthesis.cancel()
      const textToSpeak = act.voiceovers[targetLang] || act.voiceovers.en
      const utterance = new SpeechSynthesisUtterance(textToSpeak)

      const langMap = {
        en: 'en-IN',
        kn: 'kn-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
      }
      utterance.lang = langMap[targetLang] || 'en-IN'
      utterance.rate = 0.95
      utterance.pitch = 0.9

      // Pick localized voice if browser supports it
      const voices = window.speechSynthesis.getVoices()
      const match = voices.find((v) => v.lang.startsWith(targetLang) || v.lang.includes(langMap[targetLang]))
      if (match) utterance.voice = match

      window.speechSynthesis.speak(utterance)
    } catch (e) {}
  }

  // Act change triggers sound cues and voiceover
  useEffect(() => {
    if (!isPlaying) return

    if (currentActIndex !== currentActIndexRef.current && currentActIndex !== -1) {
      currentActIndexRef.current = currentActIndex
      const act = ACTS[currentActIndex]

      if (audioUnlocked && !isMuted) {
        speakActNarration(act, lang)
        if (act.id === 'act1') audioEngine.playBoom()
        else if (act.id === 'act2') audioEngine.playWhoosh()
        else if (act.id === 'act3') audioEngine.playBoom()
      }
    }
  }, [currentActIndex, isPlaying, audioUnlocked, isMuted, lang])

  // Master Timeline (0s to 27s)
  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TOTAL_DURATION) {
          setIsPlaying(false)
          return TOTAL_DURATION
        }
        return Math.min(TOTAL_DURATION, +(prev + 0.25).toFixed(2))
      })
    }, 250)

    return () => clearInterval(interval)
  }, [isOpen, isPlaying])

  // Auto advance to Sign Up page when intro finishes (strictly after Act 3 concludes)
  useEffect(() => {
    if (currentTime >= TOTAL_DURATION) {
      const autoTimer = setTimeout(() => {
        handleProceedToSignUp()
      }, 2500)
      return () => clearTimeout(autoTimer)
    }
  }, [currentTime])

  const handleUserInteraction = () => {
    if (!audioUnlocked) {
      audioEngine.init()
      setAudioUnlocked(true)
      if (activeAct) speakActNarration(activeAct, lang)
    }
  }

  const handleProceedToSignUp = () => {
    audioEngine.cleanup()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (onClose) onClose()
    else navigate('/register')
  }

  const handleLanguageChange = (newLang) => {
    setLang(newLang)
    localStorage.setItem('voicehire_lang', newLang)
    if (activeAct && audioUnlocked && !isMuted) {
      speakActNarration(activeAct, newLang)
    }
  }

  if (!isOpen) return null

  const progressPercent = Math.min(100, (currentTime / TOTAL_DURATION) * 100)

  return (
    <div
      onClick={handleUserInteraction}
      className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* ===================================================================
          TOP CINEMATIC BAR: Logo, Clean Pills (No Truncation), Language & Skip
          =================================================================== */}
      <div className="relative z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Mic className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">
                Voice<span className="text-[#3B82F6]">Hire</span>
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-[#60A5FA] border border-blue-500/30">
                &lt; 30s Story
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              {detectedLocation}
            </p>
          </div>
        </div>

        {/* Center: Clean Progress Stage Pills (Non-Truncated) */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.08] backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl">
          {ACTS.map((act) => {
            const isActive = activeAct.id === act.id
            return (
              <button
                key={act.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUserInteraction()
                  setCurrentTime(act.startSec)
                  currentActIndexRef.current = -1
                  setIsPlaying(true)
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {act.pillTitle}
              </button>
            )
          })}
        </div>

        {/* Right: Audio Toggle, Language Pill Selector, Skip to Sign Up */}
        <div className="flex items-center gap-2">
          {/* Quick Language Pill Switcher */}
          <div className="flex items-center bg-white/[0.08] border border-white/10 rounded-xl p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400 mx-1.5" />
            {[
              { code: 'en', label: 'EN' },
              { code: 'kn', label: 'ಕನ್ನಡ' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'ta', label: 'தமிழ்' },
              { code: 'te', label: 'తెలుగు' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLanguageChange(item.code)
                }}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  lang === item.code ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsMuted(!isMuted)
              audioEngine.setMuted(!isMuted)
              if (!isMuted && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel()
              } else if (isMuted && activeAct) {
                speakActNarration(activeAct, lang)
              }
            }}
            className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Skip directly to Step 2: Sign Up */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleProceedToSignUp()
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs transition-all shadow-md shadow-blue-500/30 cursor-pointer"
          >
            <span>Skip to Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================================================================
          STAGE CANVAS: Visual Storytelling Driven by the 3 Acts
          =================================================================== */}
      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        {/* Soft Ambient Background Orbs */}
        <div
          className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
            activeAct.id === 'act1'
              ? 'bg-rose-900/25 -top-20 -left-20'
              : activeAct.id === 'act2'
              ? 'bg-blue-600/30 top-1/4 -right-20'
              : 'bg-emerald-600/25 top-1/3 left-1/4'
          }`}
        />

        <AnimatePresence mode="wait">
          {/* ACT 1: The Problem */}
          {activeAct.id === 'act1' && (
            <motion.div
              key="act1"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-center space-y-6 relative z-10"
            >
              <div className="inline-flex p-4 rounded-3xl bg-rose-500/10 border border-rose-500/25 text-rose-400 shadow-2xl">
                <Lock className="w-12 h-12 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black tracking-widest text-rose-400 uppercase">
                  Act 1 • The Old Barrier
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                  Employment Was Built for Text.
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-300">
                  Complicated forms. Résumé uploads. Language barriers that shut out skilled tradesmen.
                </p>
              </div>
            </motion.div>
          )}

          {/* ACT 2: Voice Power */}
          {activeAct.id === 'act2' && (
            <motion.div
              key="act2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-center space-y-6 relative z-10"
            >
              <div className="relative inline-flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="absolute -inset-4 rounded-full bg-blue-500/30 blur-xl"
                />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 border-2 border-white/20">
                  <Mic className="w-12 h-12 stroke-[2.5]" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black tracking-widest text-blue-400 uppercase">
                  Act 2 • The Voice Revolution
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                  Your Voice Is Your Résumé.
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-300">
                  Speak in Kannada, Hindi, Tamil, Telugu, or English. No typing required.
                </p>
              </div>
            </motion.div>
          )}

          {/* ACT 3: Instant Jobs & Climax CTA */}
          {activeAct.id === 'act3' && (
            <motion.div
              key="act3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl text-center space-y-6 relative z-10"
            >
              <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-2xl">
                <Sparkles className="w-12 h-12 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
                  Act 3 • Verified Results
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                  Your Voice. Real Jobs. Instant Hiring.
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-300">
                  Direct connections between verified workers and licensed employers across India.
                </p>
              </div>

              {/* Action Buttons to Transition into Step 2: Sign Up */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleProceedToSignUp}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Continue to Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          BOTTOM CINEMATIC CONTROLS: Subtitles in Localized Language & Timeline
          =================================================================== */}
      <div className="relative z-30 p-4 sm:p-6 bg-gradient-to-t from-black via-black/85 to-transparent space-y-3">
        {/* Dynamic Regional Subtitles */}
        {showSubtitles && (
          <div className="max-w-3xl mx-auto px-6 py-3 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl text-center shadow-2xl">
            <p className="text-sm sm:text-base font-bold text-white tracking-wide leading-relaxed">
              "{activeAct.voiceovers[lang] || activeAct.voiceovers.en}"
            </p>
          </div>
        )}

        {/* Master Timeline Scrubber (< 30s) */}
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleUserInteraction()
              setIsPlaying(!isPlaying)
              if (isPlaying && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel()
              } else if (!isPlaying && activeAct) {
                speakActNarration(activeAct, lang)
              }
            }}
            className="w-9 h-9 rounded-xl bg-white/[0.1] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <span className="text-xs font-mono font-bold text-slate-400 w-16 shrink-0">
            0:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 0:27
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation()
              handleUserInteraction()
              const rect = e.currentTarget.getBoundingClientRect()
              const clickX = e.clientX - rect.left
              const ratio = Math.max(0, Math.min(1, clickX / rect.width))
              const newTime = +(ratio * TOTAL_DURATION).toFixed(2)
              setCurrentTime(newTime)
              currentActIndexRef.current = -1
            }}
            className="flex-1 h-2 rounded-full bg-white/[0.15] relative cursor-pointer group"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md shadow-blue-500 scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleUserInteraction()
              setCurrentTime(0)
              currentActIndexRef.current = -1
              setIsPlaying(true)
            }}
            className="w-9 h-9 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Replay Story"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
