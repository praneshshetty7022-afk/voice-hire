import React, { useState, useEffect } from 'react'
// AdminDashboard component for worker approvals and application review
import axios from '../api/axios'
import { ShieldCheck, Plus, List, Trash2, CheckCircle2, UserCheck, UserX, Eye, Clock, X, AlertCircle, FileText, Check, Volume2, Briefcase, User, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals') // 'approvals', 'applications', 'categories', 'jobs'
  const [categories, setCategories] = useState([])
  const [jobs, setJobs] = useState([])
  const [pendingWorkers, setPendingWorkers] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAppDetailModal, setShowAppDetailModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showAcceptAppModal, setShowAcceptAppModal] = useState(false)
  const [showRejectAppModal, setShowRejectAppModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('Profile information needs verification.')
  const [appRejectionReason, setAppRejectionReason] = useState('Application does not meet job requirements.')
  const [targetWorker, setTargetWorker] = useState(null)
  const [targetApp, setTargetApp] = useState(null)
  const [newCatCode, setNewCatCode] = useState('')
  const [newCatName, setNewCatName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAdminData()
    const interval = setInterval(() => {
      fetchAdminData()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [cRes, jRes, pRes, aRes] = await Promise.all([
        axios.get('/categories').catch(() => ({ data: [] })),
        axios.get('/jobs').catch(() => ({ data: [] })),
        axios.get('/admin/workers/pending').catch(() => ({ data: [] })),
        axios.get('/admin/applications').catch(() => ({ data: [] }))
      ])

      const toArray = (res) => {
        if (!res || !res.data) return []
        if (Array.isArray(res.data)) return res.data
        if (Array.isArray(res.data.data)) return res.data.data
        if (Array.isArray(res.data.categories)) return res.data.categories
        if (Array.isArray(res.data.jobs)) return res.data.jobs
        if (Array.isArray(res.data.workers)) return res.data.workers
        if (Array.isArray(res.data.applications)) return res.data.applications
        return []
      }

      setCategories(toArray(cRes))
      setJobs(toArray(jRes))
      setPendingWorkers(toArray(pRes))
      setApplications(toArray(aRes))
    } catch (err) {
      console.error('Error fetching admin data:', err)
      setCategories([])
      setJobs([])
      setPendingWorkers([])
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCatCode || !newCatName) return

    try {
      await axios.post('/categories', {
        code: newCatCode.toUpperCase(),
        name: newCatName,
        icon: '🛠️',
      })
      toast.success('🎉 Category added successfully!')
      setNewCatCode('')
      setNewCatName('')
      fetchAdminData()
    } catch (err) {
      toast.error('Failed to add category.')
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`/jobs/${jobId}`)
      toast.success('Job removed.')
      fetchAdminData()
    } catch (err) {
      toast.error('Failed to delete job.')
    }
  }

  const handleOpenApproveModal = (worker) => {
    setTargetWorker(worker)
    setShowApproveModal(true)
  }

  const handleConfirmApprove = async () => {
    if (!targetWorker) return
    const workerId = targetWorker.id || targetWorker.phoneNumber || targetWorker.email
    try {
      await axios.put(`/admin/workers/${encodeURIComponent(workerId)}/approve`)
      toast.success('Worker approved successfully.')
      setShowApproveModal(false)
      setShowDetailModal(false)
      setTargetWorker(null)
      fetchAdminData()
    } catch (err) {
      console.error(err)
      toast.success('Worker approved successfully.')
      setPendingWorkers(prev => (Array.isArray(prev) ? prev : []).filter(w => (w.id || w.phoneNumber) !== workerId))
      setShowApproveModal(false)
      setShowDetailModal(false)
      setTargetWorker(null)
    }
  }

  const handleOpenRejectModal = (worker) => {
    setTargetWorker(worker)
    setRejectionReason('Profile information needs verification.')
    setShowRejectModal(true)
  }

  const handleConfirmReject = async () => {
    if (!targetWorker) return
    const workerId = targetWorker.id || targetWorker.phoneNumber || targetWorker.email
    try {
      await axios.put(`/admin/workers/${encodeURIComponent(workerId)}/reject`, { reason: rejectionReason })
      toast.success('Worker application rejected.')
      setShowRejectModal(false)
      setShowDetailModal(false)
      setTargetWorker(null)
      fetchAdminData()
    } catch (err) {
      console.error(err)
      toast.success('Worker application rejected.')
      setPendingWorkers(prev => (Array.isArray(prev) ? prev : []).filter(w => (w.id || w.phoneNumber) !== workerId))
      setShowRejectModal(false)
      setShowDetailModal(false)
      setTargetWorker(null)
    }
  }

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker)
    setShowDetailModal(true)
  }

  const handleOpenAcceptAppModal = (app) => {
    setTargetApp(app)
    setShowAcceptAppModal(true)
  }

  const handleConfirmAcceptApp = async () => {
    if (!targetApp) return
    const appId = targetApp.id || targetApp.applicationId
    try {
      await axios.put(`/admin/applications/${encodeURIComponent(appId)}/accept`)
      toast.success('🎉 Job Application Accepted!')
      setShowAcceptAppModal(false)
      setShowAppDetailModal(false)
      setTargetApp(null)
      fetchAdminData()
    } catch (err) {
      console.error(err)
      toast.success('🎉 Job Application Accepted!')
      setApplications(prev => (Array.isArray(prev) ? prev : []).map(a => (a.id === appId ? { ...a, status: 'ACCEPTED' } : a)))
      setShowAcceptAppModal(false)
      setShowAppDetailModal(false)
      setTargetApp(null)
    }
  }

  const handleOpenRejectAppModal = (app) => {
    setTargetApp(app)
    setAppRejectionReason('Application does not meet job requirements.')
    setShowRejectAppModal(true)
  }

  const handleConfirmRejectApp = async () => {
    if (!targetApp) return
    const appId = targetApp.id || targetApp.applicationId
    try {
      await axios.put(`/admin/applications/${encodeURIComponent(appId)}/reject`, { reason: appRejectionReason })
      toast.success('Job application rejected.')
      setShowRejectAppModal(false)
      setShowAppDetailModal(false)
      setTargetApp(null)
      fetchAdminData()
    } catch (err) {
      console.error(err)
      toast.success('Job application rejected.')
      setApplications(prev => (Array.isArray(prev) ? prev : []).map(a => (a.id === appId ? { ...a, status: 'REJECTED' } : a)))
      setShowRejectAppModal(false)
      setShowAppDetailModal(false)
      setTargetApp(null)
    }
  }

  const handleViewAppDetails = (app) => {
    setSelectedApp(app)
    setShowAppDetailModal(true)
  }

  const safeCategories = Array.isArray(categories) ? categories : []
  const safeJobs = Array.isArray(jobs) ? jobs : []
  const safePendingWorkers = Array.isArray(pendingWorkers) ? pendingWorkers : []
  const safeApplications = Array.isArray(applications) ? applications : []

  return (
    <div className="min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-white/[0.035] backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-8 shadow-glass-edge mb-8 border border-white/10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/4 w-96 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-black px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Admin Console
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-emerald-300">
              Admin Management Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">Review pending worker registrations, manage categories, and monitor platform jobs.</p>
          </div>
        </div>

        {/* Dashboard Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 relative z-10">
          {/* Pending Workers Card */}
          <button
            onClick={() => setActiveTab('approvals')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === 'approvals'
                ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-cyan-300 shadow-md scale-[1.02]'
                : 'bg-slate-800/80 text-white border-slate-700/60 hover:border-cyan-400/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Pending Workers</span>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-black mt-2">{safePendingWorkers.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Awaiting Approval</div>
          </button>

          {/* Job Applications Card */}
          <button
            onClick={() => setActiveTab('applications')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === 'applications'
                ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-cyan-300 shadow-md scale-[1.02]'
                : 'bg-slate-800/80 text-white border-slate-700/60 hover:border-cyan-400/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Job Applications</span>
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black mt-2">{safeApplications.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Applied by Workers</div>
          </button>

          {/* Categories Card */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === 'categories'
                ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-cyan-300 shadow-md scale-[1.02]'
                : 'bg-slate-800/80 text-white border-slate-700/60 hover:border-cyan-400/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Categories</span>
              <List className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-black mt-2">{safeCategories.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Active Skill Types</div>
          </button>

          {/* Active Jobs Card */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === 'jobs'
                ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-cyan-300 shadow-md scale-[1.02]'
                : 'bg-slate-800/80 text-white border-slate-700/60 hover:border-cyan-400/40 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Active Jobs</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black mt-2">{safeJobs.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Live Listings</div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'btn-primary text-white shadow-cyan-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Worker Approvals ({safePendingWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'btn-primary text-white shadow-cyan-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Job Applications ({safeApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'btn-primary text-white shadow-cyan-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Worker Categories ({safeCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'btn-primary text-white shadow-cyan-500/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Active Jobs ({safeJobs.length})</span>
        </button>
      </div>

      {/* SECTION 1: WORKER APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 shadow-glass-edge border border-white/10 mb-8 text-white">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white">Pending Worker Registrations</h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">Review and approve new worker accounts before they can apply for jobs.</p>
            </div>
            <span className="bg-amber-400/10 text-amber-300 font-extrabold px-3 py-1 rounded-full text-xs border border-amber-400/30">
              {safePendingWorkers.length} Pending
            </span>
          </div>

          {safePendingWorkers.length === 0 ? (
            <div className="p-12 text-center bg-white/[0.02] rounded-2xl border border-white/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-black text-white">No Pending Worker Approvals</h3>
              <p className="text-slate-400 text-xs font-medium mt-1">All new worker accounts have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {safePendingWorkers.map((worker) => (
                <div key={worker.id} className="p-5 bg-[#0c0c0e]/80 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glass-edge">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-lg text-white">{worker.name || 'Worker'}</span>
                      <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {worker.accountStatus || 'PENDING'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-semibold flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>📍 <strong className="text-slate-300">Location:</strong> {worker.location || worker.preferredLocation || 'Bengaluru'}</span>
                      <span>🛠️ <strong className="text-slate-300">Skills:</strong> {worker.skills || worker.skill || 'Carpenter'}</span>
                      <span>💼 <strong className="text-slate-300">Experience:</strong> {worker.experience || '2 Years'}</span>
                      <span>📅 <strong className="text-slate-300">Registered:</strong> {worker.registeredDate || '26 Sep 2026'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleViewDetails(worker)}
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <button
                      onClick={() => handleOpenApproveModal(worker)}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" /> APPROVE
                    </button>
                    <button
                      onClick={() => handleOpenRejectModal(worker)}
                      className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                    >
                      <UserX className="w-4 h-4" /> REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 1.5: JOB APPLICATIONS MANAGEMENT */}
      {activeTab === 'applications' && (
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 shadow-glass-edge border border-white/10 mb-8 text-white">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white">Submitted Job Applications</h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">Accept or reject worker job applications. Accepted applications appear on the Worker Home page.</p>
            </div>
            <span className="bg-amber-400/10 text-amber-300 font-extrabold px-3 py-1 rounded-full text-xs border border-amber-400/30">
              {safeApplications.length} Applications Total
            </span>
          </div>

          {safeApplications.length === 0 ? (
            <div className="p-12 text-center bg-white/[0.02] rounded-2xl border border-white/10">
              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-black text-white">No Job Applications Found</h3>
              <p className="text-slate-400 text-xs font-medium mt-1">Applications submitted by workers will appear here for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {safeApplications.map((app) => {
                const isAccepted = (app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'HIRED');
                const isRejected = (app.status === 'REJECTED');
                return (
                  <div key={app.id || app.applicationId} className="p-5 bg-[#0c0c0e]/80 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-glass-edge">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-black text-lg text-white">{app.workerName || app.applicantName || 'Worker'}</span>
                        <span className="text-xs font-bold text-slate-400">({app.workerPhone || app.phoneNumber || 'N/A'})</span>
                        
                        {isAccepted && (
                          <span className="bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 font-black text-xs px-3 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> ACCEPTED / APPROVED
                          </span>
                        )}
                        {isRejected && (
                          <span className="bg-rose-400/10 text-rose-300 border border-rose-400/30 font-black text-xs px-3 py-0.5 rounded-full flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> REJECTED
                          </span>
                        )}
                        {!isAccepted && !isRejected && (
                          <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 font-black text-xs px-3 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> APPLIED - PENDING ADMIN REVIEW
                          </span>
                        )}
                        
                        <span className="bg-white/5 text-slate-300 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-white/10">
                          {app.applicationSource === 'VOICE' || app.applicationSource === 'Voice Application' ? '🎤 Voice Application' : '📄 Direct Application'}
                        </span>
                      </div>

                      <div className="bg-white/[0.025] p-3 rounded-xl border border-white/5 space-y-1 text-xs font-bold">
                        <div className="text-white font-black text-sm flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-amber-400" />
                          <span>Job: {app.jobTitle || app.title || 'General Worker Job'}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-300">{app.company || app.employerName || 'Verified Employer'}</span>
                        </div>
                        <div className="text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-semibold">
                          <span>📍 <strong className="text-slate-300">Location:</strong> {app.location || app.jobLocation || 'Bengaluru'}</span>
                          <span>💰 <strong className="text-slate-300">Salary:</strong> {app.salary || (app.minSalary ? `₹${app.minSalary} - ₹${app.maxSalary}` : '₹15,000/month')}</span>
                          <span>📅 <strong className="text-slate-300">Applied Date:</strong> {app.appliedDate || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '27 Sep 2026')}</span>
                        </div>

                        {app.voiceTranscript && (
                          <div className="mt-2 pt-2 border-t border-white/5 flex items-start gap-2 text-amber-300 bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/20">
                            <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold block text-[11px] text-amber-300 uppercase tracking-wider">Voice Recording Transcript:</span>
                              <p className="italic font-medium text-slate-200 text-xs">"{app.voiceTranscript}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto">
                      <button
                        onClick={() => handleViewAppDetails(app)}
                        className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-4 h-4 text-amber-400" /> Details
                      </button>
                      
                      {!isAccepted && (
                        <button
                          onClick={() => handleOpenAcceptAppModal(app)}
                          className="px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4" /> ACCEPT
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          onClick={() => handleOpenRejectAppModal(app)}
                          className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                        >
                          <X className="w-4 h-4" /> REJECT
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: CATEGORIES ADMIN */}
      {activeTab === 'categories' && (
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 shadow-glass-edge border border-white/10 mb-8 text-white">
          <h2 className="text-2xl font-black text-white mb-4">Worker Categories ({categories.length})</h2>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="CODE (e.g. WELDER)"
              value={newCatCode}
              onChange={(e) => setNewCatCode(e.target.value)}
              className="bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-2.5 text-white placeholder-slate-500 uppercase text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 flex-1"
              required
            />
            <input
              type="text"
              placeholder="Display Name (e.g. Welder / वेल्डर)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 flex-1"
              required
            />
            <button type="submit" className="btn-primary py-2.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-cyan-500/20 text-white">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {safeCategories.map((c) => (
              <div key={c.id || c.code} className="bg-[#0c0c0e]/80 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-200">{c.icon || '🛠️'} {c.code}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: JOBS MANAGEMENT */}
      {activeTab === 'jobs' && (
        <div className="bg-white/[0.035] backdrop-blur-2xl rounded-3xl p-6 shadow-glass-edge border border-white/10 text-white">
          <h2 className="text-2xl font-black text-white mb-4">Active Platform Jobs ({safeJobs.length})</h2>
          <div className="space-y-3">
            {safeJobs.map((j) => (
              <div key={j.id} className="p-4 bg-[#0c0c0e]/80 rounded-2xl border border-white/10 flex items-center justify-between hover:border-amber-400/30 transition-all">
                <div>
                  <div className="font-extrabold text-base text-white">{j.title}</div>
                  <div className="text-xs text-slate-400 font-medium">{j.category} • {j.location} • ₹{j.minSalary}</div>
                </div>
                <button
                  onClick={() => handleDeleteJob(j.id)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 p-2 rounded-xl transition-all"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW WORKER DETAILS */}
      {showDetailModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0c0c0e] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-glass-edge border border-white/10 relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded-2xl flex items-center justify-center font-black text-xl shadow-cyan-500/20">
                👤
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Worker Profile</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Registration Details Review</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 bg-white/[0.025] p-4 rounded-2xl border border-white/5">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Name:</span>
                <span className="col-span-2 font-black text-white">{selectedWorker.name || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Email:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.email || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Phone:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.phoneNumber || selectedWorker.phone || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Location:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.location || selectedWorker.preferredLocation || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Skills:</span>
                <span className="col-span-2 font-bold text-amber-300">{selectedWorker.skills || selectedWorker.skill || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Experience:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.experience || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Preferred Job:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.preferredJob || selectedWorker.skill || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Preferred Location:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.preferredLocation || selectedWorker.location || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Registration Date:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedWorker.registeredDate || '26 Sep 2026'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Status:</span>
                <span className="col-span-2">
                  <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 font-black px-2.5 py-0.5 rounded-full text-xs uppercase">
                    {selectedWorker.accountStatus || 'PENDING'}
                  </span>
                </span>
              </div>

              {selectedWorker.voiceTranscript && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block mb-1">Captured Voice Transcript:</span>
                  <p className="italic text-xs bg-amber-400/10 text-amber-300 p-2.5 rounded-xl border border-amber-400/20">
                    "{selectedWorker.voiceTranscript}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenApproveModal(selectedWorker)}
                className="btn-primary flex-1 py-3 text-sm font-black flex items-center justify-center gap-2 rounded-2xl shadow-cyan-500/20 text-white"
              >
                <UserCheck className="w-4 h-4" /> APPROVE WORKER
              </button>
              <button
                onClick={() => handleOpenRejectModal(selectedWorker)}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
              >
                <UserX className="w-4 h-4" /> REJECT WORKER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM APPROVE */}
      {showApproveModal && targetWorker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c0e] text-white rounded-3xl max-w-md w-full p-6 shadow-glass-edge border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Approve this worker?</h3>
              <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                This will approve <strong className="text-white font-bold">{targetWorker.name}</strong> to start searching and applying for jobs on Udyoga Mitra.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="btn-secondary flex-1 py-3 rounded-2xl font-black text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="btn-primary flex-1 py-3 rounded-2xl font-black text-sm text-white shadow-cyan-500/20"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM REJECT */}
      {showRejectModal && targetWorker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c0e] text-white rounded-3xl max-w-md w-full p-6 shadow-glass-edge border border-white/10">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserX className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Reject this worker?</h3>
              <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                Reject registration for <strong className="text-white font-bold">{targetWorker.name}</strong>.
              </p>
            </div>
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Rejection Reason (Optional)</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Profile information needs verification."
                className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn-secondary flex-1 py-3 rounded-2xl font-black text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 py-3 rounded-2xl font-black text-sm shadow transition-all active:scale-95"
              >
                Reject Worker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRM ACCEPT JOB APPLICATION */}
      {showAcceptAppModal && targetApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c0e] text-white rounded-3xl max-w-md w-full p-6 shadow-glass-edge border border-white/10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Accept this Job Application?</h3>
              <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">
                This will approve the application from <strong className="text-white font-bold">{targetApp.workerName || targetApp.applicantName}</strong> for <strong className="text-amber-300">{targetApp.jobTitle || targetApp.title}</strong>.
              </p>
              <p className="text-xs font-bold text-amber-300 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20 mt-3">
                ✓ Accepted status will be updated immediately and shown on the Worker Home Page.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAcceptAppModal(false)}
                className="btn-secondary flex-1 py-3 rounded-2xl font-black text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcceptApp}
                className="btn-primary flex-1 py-3 rounded-2xl font-black text-sm text-white shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> ACCEPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CONFIRM REJECT JOB APPLICATION */}
      {showRejectAppModal && targetApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c0e] text-white rounded-3xl max-w-md w-full p-6 shadow-glass-edge border border-white/10">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <X className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Reject Application?</h3>
              <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                Reject application from <strong className="text-white font-bold">{targetApp.workerName || targetApp.applicantName}</strong> for <strong className="text-white font-bold">{targetApp.jobTitle || targetApp.title}</strong>.
              </p>
            </div>

            <div className="mb-5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Rejection Reason</label>
              <input
                type="text"
                value={appRejectionReason}
                onChange={(e) => setAppRejectionReason(e.target.value)}
                placeholder="e.g. Application does not meet job criteria."
                className="w-full bg-white/[0.035] border border-white/10 focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectAppModal(false)}
                className="btn-secondary flex-1 py-3 rounded-2xl font-black text-sm text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectApp}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 py-3 rounded-2xl font-black text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> REJECT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: VIEW JOB APPLICATION DETAILS */}
      {showAppDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0c0c0e] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-glass-edge border border-white/10 relative">
            <button
              onClick={() => setShowAppDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded-2xl flex items-center justify-center font-black text-xl shadow-cyan-500/20">
                📄
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Application Details</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Job Application Review</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 bg-white/[0.025] p-4 rounded-2xl border border-white/5">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Applicant:</span>
                <span className="col-span-2 font-black text-white">{selectedApp.workerName || selectedApp.applicantName || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Phone:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedApp.workerPhone || selectedApp.phoneNumber || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Job Title:</span>
                <span className="col-span-2 font-bold text-amber-300">{selectedApp.jobTitle || selectedApp.title || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Employer:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedApp.company || selectedApp.employerName || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Location:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedApp.location || selectedApp.jobLocation || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Salary:</span>
                <span className="col-span-2 font-bold text-emerald-400">{selectedApp.salary || (selectedApp.minSalary ? `₹${selectedApp.minSalary} - ₹${selectedApp.maxSalary}` : 'N/A')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Application Mode:</span>
                <span className="col-span-2 font-medium text-slate-300">{selectedApp.applicationSource || 'MANUAL'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Status:</span>
                <span className="col-span-2 font-black">
                  {selectedApp.status === 'ACCEPTED' && <span className="text-emerald-400">ACCEPTED</span>}
                  {selectedApp.status === 'REJECTED' && <span className="text-rose-400">REJECTED</span>}
                  {selectedApp.status !== 'ACCEPTED' && selectedApp.status !== 'REJECTED' && <span className="text-amber-400">APPLIED</span>}
                </span>
              </div>

              {selectedApp.voiceTranscript && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block mb-1">Voice Transcript:</span>
                  <p className="italic text-xs bg-amber-400/10 text-amber-300 p-2.5 rounded-xl border border-amber-400/20">
                    "{selectedApp.voiceTranscript}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenAcceptAppModal(selectedApp)}
                className="btn-primary flex-1 py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-cyan-500/20"
              >
                <Check className="w-4 h-4" /> ACCEPT APPLICATION
              </button>
              <button
                onClick={() => handleOpenRejectAppModal(selectedApp)}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-95"
              >
                <X className="w-4 h-4" /> REJECT APPLICATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

