import React, { useState, useEffect } from 'react'
import { PROFESSIONS } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import axios from '../api/axios'
import { CheckCircle2, Clock, MapPin, IndianRupee, Mic, FileCheck, RefreshCw } from 'lucide-react'

export default function MyApplicationsPage() {
  const { selectedLang } = useVoice()
  const t = getTranslation(selectedLang)

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTab, setFilterTab] = useState('ALL') // ALL, VOICE, MANUAL

  useEffect(() => {
    fetchMyApplications()
  }, [])

  const fetchMyApplications = async () => {
    setLoading(true)
    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : { id: 'worker_1' }

      const res = await axios.get(`/applications/worker/${user.id || 'worker_1'}`)
      if (res.data && Array.isArray(res.data)) {
        setApplications(res.data)
      } else {
        setApplications(getMockApplications())
      }
    } catch (e) {
      console.error(e)
      setApplications(getMockApplications())
    } finally {
      setLoading(false)
    }
  }

  const getMockApplications = () => [
    {
      id: 'app_1',
      jobTitle: 'Professional Driver (Private Car & Cab)',
      category: 'DRIVER',
      location: 'Bengaluru',
      dailyWage: 1200,
      applicationSource: 'VOICE',
      appliedAt: '2026-08-23',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'app_2',
      jobTitle: 'Furniture Carpenter (Modular Work)',
      category: 'CARPENTER',
      location: 'Bengaluru',
      dailyWage: 1100,
      applicationSource: 'MANUAL',
      appliedAt: '2026-08-20',
      status: 'SHORTLISTED',
    },
  ]

  const filteredApps = applications.filter((app) => {
    if (filterTab === 'VOICE') return app.applicationSource === 'VOICE'
    if (filterTab === 'MANUAL') return app.applicationSource !== 'VOICE'
    return true
  })

  const getStatusIndex = (status) => {
    switch (status) {
      case 'APPLIED': return 0
      case 'UNDER_REVIEW': return 1
      case 'SHORTLISTED': return 2
      case 'SELECTED': return 3
      default: return 1
    }
  }

  const timelineSteps = [
    { id: 0, label: t.statusTimeline.applied },
    { id: 1, label: t.statusTimeline.underReview },
    { id: 2, label: t.statusTimeline.shortlisted },
    { id: 3, label: t.statusTimeline.selected },
  ]

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Title */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{t.myApplications}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Track your job applications and status
          </p>
        </div>
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <FileCheck className="w-8 h-8" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setFilterTab('ALL')}
          className={`flex-1 py-3 font-extrabold text-sm sm:text-base rounded-xl transition-all ${
            filterTab === 'ALL'
              ? 'bg-white text-slate-900 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.allTab}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('VOICE')}
          className={`flex-1 py-3 font-extrabold text-sm sm:text-base rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            filterTab === 'VOICE'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.voiceTab}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('MANUAL')}
          className={`flex-1 py-3 font-extrabold text-sm sm:text-base rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            filterTab === 'MANUAL'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.manualTab}
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-100 shadow-sm space-y-3">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg font-black text-slate-800">Loading Applications...</p>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="space-y-6">
          {filteredApps.map((app) => {
            const profCategory = (app.category || 'DRIVER').toUpperCase()
            const prof = PROFESSIONS[profCategory] || PROFESSIONS.DRIVER
            const currentStepIdx = getStatusIndex(app.status)

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg space-y-6 relative overflow-hidden"
              >
                {/* Application Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${prof.color}20, ${prof.color}40)`,
                        borderColor: prof.color,
                      }}
                    >
                      <span>{prof.icon}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">{app.jobTitle}</h3>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2 mt-0.5">
                        <MapPin className="w-4 h-4 text-blue-600" /> {app.location}
                        <span>•</span>
                        <IndianRupee className="w-4 h-4 text-emerald-600" /> ₹{app.dailyWage}/day
                      </p>
                    </div>
                  </div>

                  {app.applicationSource === 'VOICE' ? (
                    <span className="px-3.5 py-1.5 bg-blue-100 text-blue-800 font-extrabold text-xs rounded-full border border-blue-300 flex items-center gap-1 shrink-0">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>Applied by Voice</span>
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-full border border-slate-300 shrink-0">
                      Manual Application
                    </span>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Application Status</p>
                  <div className="flex items-center justify-between relative">
                    {/* Connecting Progress Line */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-4 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${(currentStepIdx / (timelineSteps.length - 1)) * 90}%`,
                      }}
                    />

                    {timelineSteps.map((step) => {
                      const isCompleted = step.id <= currentStepIdx
                      const isCurrent = step.id === currentStepIdx

                      return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white border-emerald-200 shadow-md'
                                : 'bg-white text-slate-400 border-slate-300'
                            } ${isCurrent ? 'ring-4 ring-emerald-200 scale-110' : ''}`}
                          >
                            {isCompleted ? '✓' : step.id + 1}
                          </div>
                          <span className={`text-xs font-extrabold mt-1.5 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-200 shadow-lg space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
            📋
          </div>
          <h3 className="text-2xl font-black text-slate-900">No applications found</h3>
          <p className="text-base text-slate-500 font-semibold">
            You haven't applied for any jobs yet. Use voice search to find work!
          </p>
        </div>
      )}
    </div>
  )
}
