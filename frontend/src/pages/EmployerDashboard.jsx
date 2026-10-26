import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import AudioButton from '../components/AudioButton'
import ApplicationDetailModal from '../components/ApplicationDetailModal'
import { PlusCircle, Briefcase, Users, CheckCircle, XCircle, Clock, Building2, MapPin, DollarSign, Eye, Calendar, UserCheck, Search, X, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('POST_JOB') // 'POST_JOB' | 'APPLICANTS'
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAppModal, setSelectedAppModal] = useState(null)
  const [scheduleInterviewApp, setScheduleInterviewApp] = useState(null)

  // Interview Form State
  const [interviewDate, setInterviewDate] = useState('2026-09-28')
  const [interviewTime, setInterviewTime] = useState('10:30 AM')
  const [interviewMode, setInterviewMode] = useState('In Person')
  const [interviewLocation, setInterviewLocation] = useState('Bengaluru Main Office')
  const [employerMessage, setEmployerMessage] = useState('Please bring your ID proof and relevant work certificates.')

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('DRIVER')
  const [location, setLocation] = useState('Bengaluru')
  const [minSalary, setMinSalary] = useState('18000')
  const [maxSalary, setMaxSalary] = useState('22000')
  const [salaryType, setSalaryType] = useState('MONTHLY')
  const [experience, setExperience] = useState('2 years')
  const [description, setDescription] = useState('')

  const categories = [
    { code: 'DRIVER', name: 'Driver (गाड़ी ड्राइवर)' },
    { code: 'CARPENTER', name: 'Carpenter (बढ़ई)' },
    { code: 'PAINTER', name: 'Painter (पेंटर)' },
    { code: 'ELECTRICIAN', name: 'Electrician (इलेक्ट्रीशियन)' },
    { code: 'PLUMBER', name: 'Plumber (प्लम्बर)' },
    { code: 'MASON', name: 'Mason (राजमिस्त्री)' },
    { code: 'COOK', name: 'Cook (रसोइया)' },
    { code: 'CLEANER', name: 'Cleaner (सफाई वाला)' },
    { code: 'DELIVERY_WORKER', name: 'Delivery Rider' },
    { code: 'LOADER', name: 'Loader / Helper' },
    { code: 'SECURITY_GUARD', name: 'Security Guard' },
  ]

  useEffect(() => {
    fetchEmployerData()
  }, [])

  const fetchEmployerData = async () => {
    setLoading(true)
    try {
      const jRes = await axios.get('/jobs')
      const jobsList = Array.isArray(jRes?.data) 
        ? jRes.data 
        : (Array.isArray(jRes?.data?.jobs) ? jRes.data.jobs : (Array.isArray(jRes?.data?.data) ? jRes.data.data : []))
      setJobs(jobsList)

      const aRes = await axios.get('/employer/applications')
      const appsList = Array.isArray(aRes?.data) 
        ? aRes.data 
        : (Array.isArray(aRes?.data?.applications) ? aRes.data.applications : (Array.isArray(aRes?.data?.data) ? aRes.data.data : []))
      if (appsList.length > 0) {
        setApplications(appsList)
      } else {
        // Fallback mock applications if database has no entries
        setApplications(getMockEmployerApplications())
      }
    } catch (err) {
      console.error(err)
      setJobs([])
      setApplications(getMockEmployerApplications())
    } finally {
      setLoading(false)
    }
  }

  const getMockEmployerApplications = () => [
    {
      id: 'app_carp_1',
      jobId: 'job_carp_1',
      jobTitle: 'Wood Carpenter (ಮರಗೆಲಸ / Carpenter)',
      workerId: 'worker_1',
      workerName: 'Rajesh Kumar',
      workerPhone: '9876543210',
      category: 'CARPENTER',
      jobLocation: 'Bengaluru',
      dailyWage: 1200,
      experience: '2 years',
      applicationSource: 'VOICE',
      appliedAt: Date.now() - 86400000 * 2,
      status: 'UNDER_REVIEW',
    },
    {
      id: 'app_drv_1',
      jobId: 'job_drv_1',
      jobTitle: 'Personal Car Driver (गाड़ी ड्राइवर)',
      workerId: 'worker_2',
      workerName: 'Ramesh Kumar',
      workerPhone: '9812345678',
      category: 'DRIVER',
      jobLocation: 'Bengaluru',
      dailyWage: 18000,
      salaryType: 'MONTHLY',
      experience: '5 years',
      applicationSource: 'MANUAL',
      appliedAt: Date.now() - 86400000 * 4,
      status: 'APPLIED',
    },
  ]

  const handlePostJob = async (e) => {
    e.preventDefault()
    if (!title || !description) {
      toast.error('Please enter job title and description.')
      return
    }

    try {
      const response = await axios.post('/jobs', {
        title,
        category,
        location,
        minSalary: parseInt(minSalary) || 15000,
        maxSalary: parseInt(maxSalary) || 20000,
        salaryType,
        experience,
        workersRequired: 2,
        joiningDate: 'Immediate',
        description,
        employerName: 'Verified Employer',
      })

      if (response.data.success) {
        toast.success('🎉 Job posted successfully!')
        setTitle('')
        setDescription('')
        fetchEmployerData()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.')
    }
  }

  const handleUpdateStatus = async (appId, newStatus, extraData = {}) => {
    try {
      const res = await axios.put(`/applications/${appId}/status`, {
        status: newStatus,
        ...extraData,
      })

      if (res.data && res.data.success) {
        toast.success(`Application status updated to ${newStatus}!`)
        fetchEmployerData()
        if (scheduleInterviewApp) setScheduleInterviewApp(null)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status.'
      toast.error(msg)
    }
  }

  const handleScheduleInterviewSubmit = (e) => {
    e.preventDefault()
    if (!scheduleInterviewApp) return

    handleUpdateStatus(scheduleInterviewApp.id, 'INTERVIEW_SCHEDULED', {
      interviewDate,
      interviewTime,
      interviewMode,
      interviewLocation,
      employerMessage,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
      case 'PENDING':
        return <span className="bg-sky-400/10 text-sky-300 font-extrabold text-xs px-3 py-1 rounded-full border border-sky-400/30">Applied</span>
      case 'UNDER_REVIEW':
        return <span className="bg-amber-400/10 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-400/30">Under Review</span>
      case 'INTERVIEW_SCHEDULED':
      case 'SHORTLISTED':
        return <span className="bg-purple-400/10 text-purple-300 font-extrabold text-xs px-3 py-1 rounded-full border border-purple-400/30">Interview Scheduled</span>
      case 'HIRED':
      case 'SELECTED':
        return <span className="bg-emerald-400/10 text-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-400/30">Hired</span>
      case 'REJECTED':
        return <span className="bg-rose-400/10 text-rose-300 font-extrabold text-xs px-3 py-1 rounded-full border border-rose-400/30">Rejected</span>
      default:
        return <span className="bg-white/5 text-slate-300 font-extrabold text-xs px-3 py-1 rounded-full border border-white/10">{status}</span>
    }
  }

  const safeApplications = Array.isArray(applications) ? applications : []
  const safeCategories = Array.isArray(categories) ? categories : []

  return (
    <div className="min-h-screen pb-24">
      {/* Dashboard Title */}
      <div className="bg-white/[0.035] backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-8 shadow-glass-edge mb-8 border border-white/10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/4 w-96 h-32 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-black px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> Employer Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-emerald-300">
              Hire Skilled Local Workers
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">
              Post jobs and manage candidate application progress & interview schedules.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('POST_JOB')}
              className={`px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'POST_JOB'
                  ? 'btn-primary text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              Post Job
            </button>
            <button
              onClick={() => setActiveTab('APPLICANTS')}
              className={`px-5 py-3 rounded-2xl font-black text-sm transition-all ${
                activeTab === 'APPLICANTS'
                  ? 'btn-primary text-white shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              Applicants ({safeApplications.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Post Job */}
      {activeTab === 'POST_JOB' && (
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-glass-edge border border-white/10 text-white">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2.5">
            <PlusCircle className="w-6 h-6 text-amber-400" />
            <span>Create Worker Job Listing</span>
          </h2>

          <form onSubmit={handlePostJob} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Household Driver Required"
                className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Work Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                >
                  {safeCategories.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0c0c0e] text-white">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Min Wage (₹)</label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Max Wage (₹)</label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Salary Type</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                >
                  <option value="MONTHLY" className="bg-[#0c0c0e] text-white">Monthly</option>
                  <option value="DAILY" className="bg-[#0c0c0e] text-white">Daily</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Job Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify duties, working hours, food/room availability..."
                rows={4}
                className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-base font-black rounded-2xl shadow-cyan-500/20 transition-all text-white">
              Publish Job Listing
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Applicants Management */}
      {activeTab === 'APPLICANTS' && (
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-glass-edge border border-white/10 space-y-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                <Users className="w-6 h-6 text-amber-400" />
                <span>Manage Worker Applications</span>
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Control candidate status from Applied → Review → Interview → Hired / Rejected
              </p>
            </div>
            <button
              onClick={fetchEmployerData}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              🔄 Refresh List
            </button>
          </div>

          <div className="space-y-4">
            {safeApplications.length > 0 ? (
              safeApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-[#0c0c0e]/80 rounded-3xl p-6 border border-white/10 shadow-glass-edge flex flex-col space-y-4 transition-all hover:border-amber-400/30"
                >
                  {/* Card Main Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <h3 className="text-xl font-black text-white">{app.workerName || 'Worker Applicant'}</h3>
                        {getStatusBadge(app.status)}

                        {app.applicationSource === 'VOICE' ? (
                          <span className="bg-amber-400/10 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                            🎤 Voice App
                          </span>
                        ) : (
                          <span className="bg-white/5 text-slate-400 font-bold text-xs px-2.5 py-0.5 rounded-full border border-white/10">
                            🖱️ Manual App
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-slate-300 mt-1">
                        Job: <span className="text-amber-300 font-bold">{app.jobTitle}</span>
                        {app.experience && <span className="text-slate-400 font-medium ml-2">• Experience: {app.experience}</span>}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0 transition-all"
                    >
                      <Eye className="w-4 h-4 text-amber-400" /> View Application
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Change Status:</span>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {/* Move to Review */}
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'UNDER_REVIEW')}
                        disabled={app.status === 'REJECTED' || app.status === 'HIRED'}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          app.status === 'UNDER_REVIEW'
                            ? 'bg-amber-400/30 text-amber-300 border border-amber-400/50 shadow'
                            : 'bg-white/5 text-slate-300 hover:bg-amber-400/10 hover:text-amber-300 border border-white/10 disabled:opacity-40'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> Move to Review
                      </button>

                      {/* Schedule Interview */}
                      <button
                        onClick={() => setScheduleInterviewApp(app)}
                        disabled={app.status === 'REJECTED' || app.status === 'HIRED'}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          app.status === 'INTERVIEW_SCHEDULED'
                            ? 'bg-purple-400/30 text-purple-300 border border-purple-400/50 shadow'
                            : 'bg-white/5 text-slate-300 hover:bg-purple-400/10 hover:text-purple-300 border border-white/10 disabled:opacity-40'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                      </button>

                      {/* Hire */}
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                        disabled={app.status === 'REJECTED'}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          app.status === 'HIRED'
                            ? 'bg-emerald-400/30 text-emerald-300 border border-emerald-400/50 shadow'
                            : 'bg-white/5 text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-300 border border-white/10 disabled:opacity-40'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Hire Candidate
                      </button>

                      {/* Reject */}
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        disabled={app.status === 'REJECTED'}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          app.status === 'REJECTED'
                            ? 'bg-rose-400/30 text-rose-300 border border-rose-400/50 shadow'
                            : 'bg-white/5 text-slate-300 hover:bg-rose-400/10 hover:text-rose-300 border border-white/10 disabled:opacity-40'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-white/[0.02] rounded-3xl border border-white/10 space-y-2">
                <Users className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-black text-white">No applications received yet</h3>
                <p className="text-xs font-semibold text-slate-400">
                  Applications submitted by workers will appear here for review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleInterviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-[#0c0c0e] w-full max-w-lg rounded-3xl shadow-glass-edge border border-white/10 p-6 sm:p-8 space-y-5 my-8 text-white relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" /> Schedule Candidate Interview
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Applicant: <span className="text-amber-300 font-bold">{scheduleInterviewApp.workerName}</span> ({scheduleInterviewApp.jobTitle})
                </p>
              </div>
              <button
                onClick={() => setScheduleInterviewApp(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Interview Date</label>
                  <input
                    type="text"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="Ex. 28 September 2026"
                    className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Interview Time</label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="Ex. 10:30 AM"
                    className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Interview Mode</label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
                >
                  <option value="In Person" className="bg-[#0c0c0e] text-white">In Person (Face to Face)</option>
                  <option value="Phone Call" className="bg-[#0c0c0e] text-white">Phone Call</option>
                  <option value="Video Call" className="bg-[#0c0c0e] text-white">Video Call</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Interview Location / Link</label>
                <input
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  placeholder="Address or Google Meet Link"
                  className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Instructions / Note for Worker</label>
                <textarea
                  value={employerMessage}
                  onChange={(e) => setEmployerMessage(e.target.value)}
                  placeholder="Ex. Please bring your driving license or ID proof."
                  rows={3}
                  className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleInterviewApp(null)}
                  className="btn-secondary flex-1 py-3 rounded-xl text-sm font-extrabold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-3 rounded-xl text-sm font-black text-white shadow-cyan-500/20"
                >
                  Confirm & Send Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedAppModal && (
        <ApplicationDetailModal
          application={selectedAppModal}
          onClose={() => setSelectedAppModal(null)}
        />
      )}
    </div>
  )
}

export default EmployerDashboard

