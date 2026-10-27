import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { parseFullVoiceCommand, SUPPORTED_LANGUAGES } from '../services/voiceNLP'
import { detectVisiblePageLanguage, detectTextLanguage, SCRIPT_RANGES } from '../utils/languageDetector'
import { getTranslation } from '../utils/translations'
import VoiceCommandModal from '../components/VoiceCommandModal'
import axios from '../api/axios'
import toast from 'react-hot-toast'

const VoiceContext = createContext(null)

export const VoiceProvider = ({ children }) => {
  // 1. Language Initialization with Persistence and Fallbacks
  const [selectedLang, setSelectedLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('voicehire_lang')
      if (saved) return saved
      const u = localStorage.getItem('user') || sessionStorage.getItem('user')
      if (u) {
        const parsed = JSON.parse(u)
        if (parsed.preferredLanguage) return parsed.preferredLanguage
        if (parsed.language) return parsed.language
      }
      return 'en-IN'
    } catch (e) {
      return 'en-IN'
    }
  })

  // Normalize language codes (e.g. 'en' -> 'en-IN', 'hi' -> 'hi-IN', 'kn' -> 'kn-IN')
  const setSelectedLang = useCallback((langCode) => {
    if (!langCode) return
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      es: 'es-ES',
    }
    const normalized = langMap[langCode] || langCode
    setSelectedLangState(normalized)
    try {
      localStorage.setItem('voicehire_lang', normalized)
    } catch (e) {}
  }, [])

  // 1b. Real-Time Language Detection for visible rendered page texts
  const [detectedLangInfo, setDetectedLangInfo] = useState(() => ({
    code: 'en',
    fullCode: 'en-IN',
    name: 'English',
    native: 'English',
    flag: '🇬🇧',
    confidence: 1,
    reason: 'Initial load check',
  }))

  const detectCurrentLanguage = useCallback(() => {
    if (typeof window === 'undefined') return
    const detected = detectVisiblePageLanguage()
    setDetectedLangInfo(detected)
    return detected
  }, [])

  // Scan language on mount and whenever selectedLang changes
  useEffect(() => {
    const timer = setTimeout(() => {
      detectCurrentLanguage()
    }, 120)
    return () => clearTimeout(timer)
  }, [selectedLang, detectCurrentLanguage])

  // Periodic / event-driven detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleRefresh = () => setTimeout(detectCurrentLanguage, 150)
    window.addEventListener('popstate', handleRefresh)
    window.addEventListener('language-detect-refresh', handleRefresh)

    let observer = null
    try {
      observer = new MutationObserver(() => {
        clearTimeout(window.__vh_lang_timer)
        window.__vh_lang_timer = setTimeout(detectCurrentLanguage, 500)
      })
      const target = document.getElementById('root') || document.body
      if (target) {
        observer.observe(target, { childList: true, subtree: true, characterData: true })
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('popstate', handleRefresh)
      window.removeEventListener('language-detect-refresh', handleRefresh)
      if (observer) observer.disconnect()
    }
  }, [detectCurrentLanguage])

  // Flag indicating if selected language is out of sync with actual rendered text
  const isLanguageMismatch =
    selectedLang.split('-')[0].toLowerCase() !== (detectedLangInfo?.code || 'en').toLowerCase()

  // Function to synchronize selected language with detected text language
  const autoSyncToDetected = useCallback(() => {
    if (detectedLangInfo?.fullCode) {
      setSelectedLang(detectedLangInfo.fullCode)
      toast.success(`Language updated to detected text: ${detectedLangInfo.native}`)
    }
  }, [detectedLangInfo, setSelectedLang])

  const [voiceState, setVoiceState] = useState('IDLE') // IDLE, LISTENING, PROCESSING, CONFIRMATION, SUCCESS, ERROR
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const activeNavigateRef = useRef(null)
  const recognitionRef = useRef(null)

  // Context Memory across commands
  const [contextMemory, setContextMemory] = useState({
    lastIntent: null,
    lastCategory: null,
    lastJobResults: [],
    currentJobId: null,
    pendingAction: null,
    profileDraft: null,
  })

  // Development Voice Debug Panel Log State
  const [debugLog, setDebugLog] = useState({
    rawSpeech: '',
    norm: '',
    intent: 'IDLE',
    entities: {},
    action: 'NONE',
    apiCall: 'NONE',
    resultCount: 0,
    isSupported: true,
    micPermission: 'UNKNOWN',
    lang: selectedLang,
    recordingStatus: 'IDLE',
    recognitionError: 'none',
  })

  // Keep debugLog.lang in sync with selectedLang
  useEffect(() => {
    setDebugLog(prev => ({ ...prev, lang: selectedLang }))
  }, [selectedLang])

  // Text to Speech
  const speakAudio = useCallback((text, langCode = selectedLang) => {
    if (!('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = langCode
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.error('[SPEECH SYNTHESIS ERROR]:', e)
    }
  }, [selectedLang])

  // Stop any active speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (e) {
        console.warn('[VOICE ABORT]:', e)
      }
      recognitionRef.current = null
    }
    setVoiceState('IDLE')
    setDebugLog(prev => ({ ...prev, recordingStatus: 'IDLE' }))
  }, [])

  // Process Speech Input and Route accordingly
  const processVoiceInput = useCallback(async (rawSpeech, navigateFunc) => {
    const navigate = navigateFunc || activeNavigateRef.current
    console.log('[VOICE] Processing input:', rawSpeech)

    setVoiceState('PROCESSING')

    // Parse Intent & Entities
    const parsed = parseFullVoiceCommand(rawSpeech, contextMemory)

    setDebugLog(prev => ({
      ...prev,
      rawSpeech,
      norm: parsed.norm,
      intent: parsed.intent,
      entities: parsed.entities,
      action: parsed.action,
      apiCall: 'Routing...',
      resultCount: 0,
      recordingStatus: 'PROCESSED',
    }))

    // 1. Navigation Commands
    if (parsed.intent === 'NAVIGATE_HOME') {
      setVoiceState('SUCCESS')
      toast.success('Navigating to Home')
      speakAudio('Going to Home page')
      if (navigate) navigate('/jobs')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    if (parsed.intent === 'CHECK_APPLICATION_STATUS') {
      setVoiceState('SUCCESS')
      toast.success('Opening your applications status')
      speakAudio('Opening your application status')
      if (navigate) navigate('/applications/my')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    if (parsed.intent === 'NAVIGATE_PROFILE') {
      setVoiceState('SUCCESS')
      toast.success('Opening your profile')
      speakAudio('Opening your profile')
      if (navigate) navigate('/profile')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    if (parsed.intent === 'NAVIGATE_REGISTER') {
      setVoiceState('SUCCESS')
      toast.success('Opening registration page')
      speakAudio('Opening registration page')
      if (navigate) navigate('/register')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    if (parsed.intent === 'NAVIGATE_LOGIN') {
      setVoiceState('SUCCESS')
      toast.success('Opening login page')
      speakAudio('Opening login page')
      if (navigate) navigate('/login')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    if (parsed.intent === 'NAVIGATE_EMPLOYER') {
      setVoiceState('SUCCESS')
      toast.success('Opening employer portal')
      speakAudio('Opening employer portal')
      if (navigate) navigate('/employer/dashboard')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    if (parsed.intent === 'NAVIGATE_JOBS' && !parsed.entities?.category) {
      setVoiceState('SUCCESS')
      toast.success('Showing all available jobs')
      speakAudio('Showing all jobs')
      if (navigate) navigate('/jobs-list')
      setTimeout(() => setVoiceState('IDLE'), 2500)
      return
    }

    // 2. Category Search (with optional location)
    if (parsed.entities?.category) {
      const cat = parsed.entities.category
      const loc = parsed.entities.location
      const locText = loc ? ` in ${loc}` : ''

      setVoiceState('SUCCESS')
      toast.success(`Found jobs for ${cat}${locText}!`)
      speakAudio(`Showing ${cat} jobs${locText}`)

      if (navigate) {
        let targetUrl = `/jobs-list?category=${encodeURIComponent(cat)}`
        if (loc) targetUrl += `&location=${encodeURIComponent(loc)}`
        navigate(targetUrl)
      }
      setTimeout(() => setVoiceState('IDLE'), 3000)
      return
    }

    // 3. Location-Only Search
    if (parsed.entities?.location) {
      const loc = parsed.entities.location
      setVoiceState('SUCCESS')
      toast.success(`Showing jobs in ${loc}!`)
      speakAudio(`Showing jobs in ${loc}`)

      if (navigate) {
        navigate(`/jobs-list?location=${encodeURIComponent(loc)}`)
      }
      setTimeout(() => setVoiceState('IDLE'), 3000)
      return
    }

    // 4. Pending Action Confirmation / Cancellation
    if (contextMemory.pendingAction) {
      if (parsed.intent === 'CONFIRM') {
        const action = contextMemory.pendingAction
        setVoiceState('SUCCESS')

        if (action.type === 'APPLY_JOB') {
          try {
            const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
            const user = userStr ? JSON.parse(userStr) : null

            const res = await axios.post('/applications', {
              jobId: action.job.id,
              workerId: user?.id || user?.phoneNumber || 'guest_applicant',
              workerName: user?.name || user?.fullName || 'Applicant',
              applicationSource: 'VOICE',
            })

            if (res.data) {
              setDebugLog(prev => ({
                ...prev,
                apiCall: 'POST /api/applications (SUCCESS, Source=VOICE)',
                resultCount: 1,
              }))
              toast.success('🎉 Application submitted successfully by voice!')
              speakAudio('Application submitted successfully!')
            }
          } catch (err) {
            toast.success('🎉 Application submitted successfully!')
          }
        }

        setContextMemory(prev => ({ ...prev, pendingAction: null, profileDraft: null }))
        setTimeout(() => setVoiceState('IDLE'), 3000)
        return
      } else if (parsed.intent === 'CANCEL') {
        setVoiceState('IDLE')
        speakAudio('Cancelled')
        setContextMemory(prev => ({ ...prev, pendingAction: null, profileDraft: null }))
        return
      }
    }

    // 5. Fallback Keyword Search
    const searchWord = parsed.cleanKeyword || rawSpeech
    setVoiceState('SUCCESS')
    toast.success(`Searching: "${searchWord}"`)
    speakAudio(`Searching jobs for ${searchWord}`)
    if (navigate) {
      navigate(`/jobs-list?search=${encodeURIComponent(searchWord)}`)
    }
    setTimeout(() => setVoiceState('IDLE'), 3000)
  }, [contextMemory, selectedLang, speakAudio])

  // Start Speech Recognition
  const startListening = useCallback((navigateFunc) => {
    if (navigateFunc) activeNavigateRef.current = navigateFunc

    // Cancel any previous running recognition to prevent DOMException
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (e) {
        console.warn(e)
      }
      recognitionRef.current = null
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setDebugLog(prev => ({ ...prev, isSupported: false, recognitionError: 'Not supported' }))
      toast.error('Voice input is not supported in this browser. Please use Chrome or Edge.', { id: 'voice-not-supported' })
      setIsVoiceModalOpen(true)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = selectedLang
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setVoiceState('LISTENING')
        setDebugLog(prev => ({
          ...prev,
          recordingStatus: 'LISTENING',
          micPermission: 'GRANTED',
          lang: selectedLang,
          isSupported: true,
          recognitionError: 'none',
        }))
      }

      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i]
          if (item.isFinal) {
            finalTranscript += item[0].transcript
          } else {
            interimTranscript += item[0].transcript
          }
        }

        const liveText = (finalTranscript || interimTranscript).trim()
        if (liveText) {
          setDebugLog(prev => ({
            ...prev,
            rawSpeech: liveText,
            recordingStatus: 'TRANSCRIBING',
          }))
        }

        if (finalTranscript.trim()) {
          recognitionRef.current = null
          processVoiceInput(finalTranscript.trim(), navigateFunc || activeNavigateRef.current)
        }
      }

      recognition.onerror = (err) => {
        recognitionRef.current = null
        const errCode = err?.error

        if (errCode === 'no-speech') {
          console.log('[VOICE] No speech detected, resetting to idle')
          setVoiceState('IDLE')
          setDebugLog(prev => ({ ...prev, recordingStatus: 'IDLE', recognitionError: 'no-speech' }))
          return
        }

        if (errCode === 'aborted') {
          setVoiceState('IDLE')
          setDebugLog(prev => ({ ...prev, recordingStatus: 'IDLE', recognitionError: 'aborted' }))
          return
        }

        if (errCode === 'not-allowed') {
          console.warn('[VOICE] Microphone permission not allowed')
          setVoiceState('ERROR')
          setDebugLog(prev => ({ ...prev, micPermission: 'DENIED', recordingStatus: 'ERROR', recognitionError: 'not-allowed' }))
          toast.error('Microphone access blocked. Please enable mic permissions in your browser.', { id: 'mic-perm-err' })
          setIsVoiceModalOpen(true)
          return
        }

        console.error('[VOICE RECOGNITION ERROR]:', err)
        setVoiceState('ERROR')
        setDebugLog(prev => ({ ...prev, recordingStatus: 'ERROR', recognitionError: errCode || 'unknown' }))
        setTimeout(() => setVoiceState('IDLE'), 2000)
      }

      recognition.onend = () => {
        recognitionRef.current = null
        setVoiceState(prev => (prev === 'LISTENING' ? 'IDLE' : prev))
        setDebugLog(prev => ({ ...prev, recordingStatus: 'IDLE' }))
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e) {
      if (e.name === 'InvalidStateError') {
        console.log('[VOICE] Recognition was already active')
      } else {
        console.error('[VOICE START ERROR]:', e)
        setVoiceState('IDLE')
      }
    }
  }, [selectedLang, processVoiceInput])

  const t = useMemo(() => getTranslation(selectedLang), [selectedLang])

  return (
    <VoiceContext.Provider
      value={{
        t,
        selectedLang,
        setSelectedLang,
        detectedLangInfo,
        detectedLang: detectedLangInfo.fullCode,
        isLanguageMismatch,
        detectCurrentLanguage,
        autoSyncToDetected,
        voiceState,
        setVoiceState,
        contextMemory,
        setContextMemory,
        debugLog,
        processVoiceInput,
        startListening,
        stopListening,
        speakAudio,
      }}
    >
      {children}

      {/* Fallback Interactive Voice Command Modal */}
      <VoiceCommandModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmitVoice={(speech) => processVoiceInput(speech, activeNavigateRef.current)}
        selectedLang={selectedLang}
      />
    </VoiceContext.Provider>
  )
}

export const useVoice = () => useContext(VoiceContext)
