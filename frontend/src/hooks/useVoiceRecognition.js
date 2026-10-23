import { useState, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export const SUPPORTED_LANGUAGES = [
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', speakPrompt: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಧ್ವನಿಯಿಂದ ಕೆಲಸ ಹುಡುಕಿ.' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳', speakPrompt: 'नमस्ते! बोलकर काम खोजें।' },
  { code: 'en-IN', name: 'English', flag: '🇬🇧', speakPrompt: 'Hello! Speak to find jobs.' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳', speakPrompt: 'ನಮಸ್ಕಾರಂ! ಮಾಟ್ಲಾಡಿ ಉದ್ಯೋಗಂ ವೆತಕಂಡಿ.' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳', speakPrompt: 'வணக்கம்! குரல் மூலம் வேலை தேடலாம்.' },
  { code: 'ml-IN', name: 'മലയാളം (Malayalam)', flag: '🇮🇳', speakPrompt: 'നമസ്കാരം! ശബ്ദത്താൽ ജോലി കണ്ടെത്തൂ.' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳', speakPrompt: 'नमस्कार! बोलून काम शोधा.' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳', speakPrompt: 'নমস্কার! কথা বলে কাজ খুঁজুন।' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', speakPrompt: 'નમસ્તે! બોલીને કામ શોધો.' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳', speakPrompt: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਬੋਲ ਕੇ ਕੰਮ ਲੱਭੋ।' },
  { code: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳', speakPrompt: 'ନମସ୍କାର! କହି କାମ ଖୋଜନ୍ତು।' },
]

export const useVoiceRecognition = (options = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [micPermission, setMicPermission] = useState('UNKNOWN')
  const recognitionRef = useRef(null)

  const {
    language = 'en-IN',
    onResult = null,
    onError = null,
  } = options

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) {}
        recognitionRef.current = null
      }
    }
  }, [])

  const checkMicrophoneAccess = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicPermission('DENIED')
      const msg = 'Microphone is not available. Check your device settings.'
      setError(msg)
      toast.error(msg)
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicPermission('GRANTED')
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (err) {
      setMicPermission('DENIED')
      const msg = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? 'Microphone permission is required.'
        : 'Microphone is not available. Check your device settings.'
      setError(msg)
      toast.error(msg)
      return false
    }
  }

  const startListening = useCallback(async () => {
    setTranscript('')
    setError(null)

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      const errorMessage = 'SpeechRecognition is not supported in this browser. Please use Google Chrome.'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }

    const hasMic = await checkMicrophoneAccess()
    if (!hasMic) {
      if (onError) onError('not-allowed')
      return false
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) {}
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        console.log(`[VOICE] SpeechRecognition session started in language: ${language}`)
      }

      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const textChunk = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += textChunk
          } else {
            interimTranscript += textChunk
          }
        }

        const recognizedText = (finalTranscript || interimTranscript).trim()
        if (recognizedText) {
          console.log('[VOICE] Speech result captured:', recognizedText)
          setTranscript(recognizedText)
          if (onResult && finalTranscript.trim()) {
            onResult(finalTranscript.trim())
          }
        }
      }

      recognition.onerror = (event) => {
        console.error('[VOICE] SpeechRecognition error:', event.error)
        let errMsg = 'Voice input recognition error. Please try again.'
        if (event.error === 'not-allowed') {
          errMsg = 'Microphone permission is required.'
        } else if (event.error === 'no-speech') {
          errMsg = "I didn't hear anything. Please try again."
        } else if (event.error === 'audio-capture') {
          errMsg = 'Microphone is not available. Check your device settings.'
        } else if (event.error === 'network' || event.error === 'service-not-allowed') {
          errMsg = 'Voice recognition network service unavailable.'
        } else if (event.error === 'aborted') {
          errMsg = 'Voice session aborted.'
        }

        setError(event.error || errMsg)
        setIsListening(false)
        if (onError) onError(event.error)
        else if (event.error !== 'aborted') toast.error(errMsg)
      }

      recognition.onend = () => {
        setIsListening(false)
        console.log('[VOICE] SpeechRecognition session ended')
      }

      recognition.start()
      return true
    } catch (err) {
      console.error('[VOICE EXCEPTION]:', err)
      setError(err.message)
      toast.error(`Speech failed: ${err.message}`)
      return false
    }
  }, [language, onResult, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (e) {}
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return {
    isListening,
    transcript,
    error,
    micPermission,
    startListening,
    stopListening,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  }
}

