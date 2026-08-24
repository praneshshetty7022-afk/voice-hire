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
  const recognitionRef = useRef(null)

  const {
    language = 'kn-IN',
    onResult = null,
    onError = null,
  } = options

  const startListening = useCallback(() => {
    // Clear previous transcript & state before starting new session
    setTranscript('')
    setError(null)

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      const errorMessage = 'Voice recognition is not supported in this browser. Please use Chrome/Edge or manual search.'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = language

      recognition.onstart = () => {
        setIsListening(true)
        console.log('[VOICE] SpeechRecognition session started')
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        
        if (!finalTranscript) {
          finalTranscript = event.results[0][0].transcript
        }

        const text = finalTranscript.trim()
        console.log('[VOICE] Final Speech Result Captured:', text)
        setTranscript(text)
        if (onResult && text) onResult(text)
      }

      recognition.onerror = (event) => {
        console.error('[VOICE] Speech recognition error:', event.error)
        const errMsg = event.error === 'not-allowed'
          ? 'Microphone permission denied. Please allow microphone access in browser settings.'
          : `Voice error: ${event.error}`
        setError(errMsg)
        setIsListening(false)
        if (onError) onError(event.error)
        else toast.error(errMsg)
      }

      recognition.onend = () => {
        setIsListening(false)
        console.log('[VOICE] SpeechRecognition session ended')
      }

      recognition.start()
      return true
    } catch (err) {
      setError(err.message)
      toast.error(`Speech failed: ${err.message}`)
      return false
    }
  }, [language, onResult, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  }
}
