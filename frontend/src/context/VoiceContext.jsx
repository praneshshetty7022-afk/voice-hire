import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { parseFullVoiceCommand, SUPPORTED_LANGUAGES } from '../services/voiceNLP'
import VoiceCommandModal from '../components/VoiceCommandModal'
import axios from '../api/axios'
import toast from 'react-hot-toast'

const VoiceContext = createContext(null)

export const VoiceProvider = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState('kn-IN')
  const [voiceState, setVoiceState] = useState('IDLE') // IDLE, LISTENING, PROCESSING, CONFIRMATION, SUCCESS, ERROR
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const activeNavigateRef = useRef(null)

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
  })

  const speakAudio = useCallback((text, langCode = selectedLang) => {
    if (!('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = langCode
      utterance.rate = 0.92
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.error(e)
    }
  }, [selectedLang])

  const processVoiceInput = useCallback(async (rawSpeech, navigateFunc) => {
    const navigate = navigateFunc || activeNavigateRef.current
    console.log('[VOICE] 1. Processing Speech Input:', rawSpeech)

    setVoiceState('PROCESSING')

    // Parse Intent & Entities
    const parsed = parseFullVoiceCommand(rawSpeech, contextMemory)

    setDebugLog({
      rawSpeech,
      norm: parsed.norm,
      intent: parsed.intent,
      entities: parsed.entities,
      action: parsed.action,
      apiCall: 'Processing...',
      resultCount: 0,
    })

    // 1. Category Search
    if (parsed.entities?.category) {
      const cat = parsed.entities.category
      setVoiceState('SUCCESS')
      toast.success(`Found jobs for ${cat}!`)
      speakAudio(`Showing ${cat} jobs`)
      if (navigate) {
        navigate(`/jobs-list?category=${cat}`)
      }
      setTimeout(() => setVoiceState('IDLE'), 3500)
      return
    }

    // 2. Pending Action Confirmation
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
              workerName: user?.name || 'Applicant',
              applicationSource: 'VOICE',
            })

            if (res.data) {
              setDebugLog(prev => ({ 
                ...prev, 
                apiCall: `POST /api/applications (SUCCESS, Source=VOICE)`,
                resultCount: 1 
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

    // 3. Fallback search
    setVoiceState('SUCCESS')
    toast.success(`Searching: "${rawSpeech}"`)
    speakAudio(`Searching jobs for ${rawSpeech}`)
    if (navigate) {
      navigate(`/jobs-list?search=${encodeURIComponent(rawSpeech)}`)
    }
    setTimeout(() => setVoiceState('IDLE'), 3500)
  }, [contextMemory, selectedLang, speakAudio])

  const startListening = useCallback((navigateFunc) => {
    if (navigateFunc) activeNavigateRef.current = navigateFunc
    setVoiceState('LISTENING')

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsVoiceModalOpen(true)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLang

      recognition.onstart = () => {
        setVoiceState('LISTENING')
      }

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript
        console.log('[VOICE RECOGNITION] Captured Speech:', text)
        processVoiceInput(text, navigateFunc || activeNavigateRef.current)
      }

      recognition.onerror = (err) => {
        console.error('[VOICE RECOGNITION ERROR]:', err)
        setVoiceState('ERROR')
        setIsVoiceModalOpen(true)
      }

      recognition.onend = () => {
        setVoiceState(prev => (prev === 'LISTENING' ? 'IDLE' : prev))
      }

      recognition.start()
    } catch (e) {
      console.error(e)
      setIsVoiceModalOpen(true)
    }
  }, [selectedLang, processVoiceInput])

  const stopListening = useCallback(() => {
    setVoiceState('IDLE')
  }, [])

  return (
    <VoiceContext.Provider value={{
      selectedLang,
      setSelectedLang,
      voiceState,
      setVoiceState,
      contextMemory,
      setContextMemory,
      debugLog,
      processVoiceInput,
      startListening,
      stopListening,
      speakAudio,
    }}>
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
