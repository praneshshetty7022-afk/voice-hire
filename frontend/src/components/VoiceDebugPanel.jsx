import React, { useState } from 'react'
import { useVoice } from '../context/VoiceContext'
import { Terminal, ChevronDown, ChevronUp, Cpu, Database, Activity } from 'lucide-react'

export const VoiceDebugPanel = () => {
  const { debugLog, voiceState, contextMemory } = useVoice()
  const [isOpen, setIsOpen] = useState(true)

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border-2 border-emerald-500 font-mono text-xs overflow-hidden">
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-950 px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-slate-800"
      >
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>VOICE DEBUG PANEL (Dev Mode)</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Log Inspector */}
      {isOpen && (
        <div className="p-3 space-y-2">
          
          {/* Voice State Badge */}
          <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Pipeline State:
            </span>
            <span className={`font-black px-2 py-0.5 rounded text-[10px] uppercase ${
              voiceState === 'PROCESSING' ? 'bg-amber-500 text-slate-950 animate-pulse' :
              voiceState === 'CONFIRMATION' ? 'bg-purple-600 text-white animate-bounce' :
              voiceState === 'SUCCESS' ? 'bg-emerald-600 text-white' :
              voiceState === 'ERROR' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {voiceState}
            </span>
          </div>

          {/* Raw Speech */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-bold">1. Raw Speech Input:</div>
            <div className="text-emerald-300 font-bold text-sm truncate">
              {debugLog.rawSpeech ? `"${debugLog.rawSpeech}"` : '(Waiting for voice input...)'}
            </div>
          </div>

          {/* Normalized Speech */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-bold">2. Normalized Speech:</div>
            <div className="text-amber-200 font-bold truncate">
              {debugLog.norm || 'N/A'}
            </div>
          </div>

          {/* Detected Intent */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-bold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> 3. Detected Intent:
            </div>
            <div className="text-cyan-300 font-black text-xs uppercase">
              {debugLog.intent}
            </div>
          </div>

          {/* Extracted Entities */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-bold">4. Extracted Entities:</div>
            <div className="text-emerald-400 text-[11px] bg-slate-900 p-1.5 rounded mt-1 overflow-x-auto">
              {JSON.stringify({
                category: debugLog.entities.category || 'ALL',
                location: debugLog.entities.location || 'ALL',
                jobNumber: debugLog.entities.jobNumber || null,
                name: debugLog.entities.name || null,
                experience: debugLog.entities.experience || null
              }, null, 2)}
            </div>
          </div>

          {/* Triggered API */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-bold flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-yellow-400" /> 5. Action / API:
            </div>
            <div className="text-yellow-300 font-bold text-xs truncate">
              {debugLog.apiCall}
            </div>
          </div>

          {/* Context Memory Job Results & Current Selected Job ID */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Context Jobs:</span>
              <span className="text-emerald-400 font-bold">{contextMemory.lastJobResults.length} Jobs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Job ID:</span>
              <span className="text-amber-300 font-bold">{contextMemory.currentJobId || 'None'}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default VoiceDebugPanel
