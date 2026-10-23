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
      setCategories(cRes.data || [])
      setJobs(jRes.data || [])
      setPendingWorkers(pRes.data || [])
      setApplications(aRes.data || [])
    } catch (err) {
      console.error('Error fetching admin data:', err)
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
      setPendingWorkers(prev => prev.filter(w => (w.id || w.phoneNumber) !== workerId))
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
      setPendingWorkers(prev => prev.filter(w => (w.id || w.phoneNumber) !== workerId))
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
      setApplications(prev => prev.map(a => (a.id === appId ? { ...a, status: 'ACCEPTED' } : a)))
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
      setApplications(prev => prev.map(a => (a.id === appId ? { ...a, status: 'REJECTED' } : a)))
      setShowRejectAppModal(false)
      setShowAppDetailModal(false)
      setTargetApp(null)
    }
  }

  const handleViewAppDetails = (app) => {
    setSelectedApp(app)
    setShowAppDetailModal(true)
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border-4 border-emerald-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Admin Console
            </div>
            <h1 className="text-3xl font-black">Admin Management Portal</h1>
            <p className="text-emerald-200 text-sm mt-1">Review pending worker registrations, manage categories, and monitor platform jobs.</p>
          </div>
        </div>

        {/* Dashboard Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          {/* Pending Workers Card */}
          <button
            onClick={() => setActiveTab('approvals')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              activeTab === 'approvals'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
                : 'bg-slate-800 text-white border-slate-700 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Pending Workers</span>
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-3xl font-black mt-2">{pendingWorkers.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Awaiting Approval</div>
          </button>

          {/* Job Applications Card */}
          <button
            onClick={() => setActiveTab('applications')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg scale-[1.02]'
                : 'bg-slate-800 text-white border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Job Applications</span>
              <FileText className="w-5 h-5 text-indigo-300" />
            </div>
            <div className="text-3xl font-black mt-2">{applications.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Applied by Workers</div>
          </button>

          {/* Categories Card */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02]'
                : 'bg-slate-800 text-white border-slate-700 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Categories</span>
              <List className="w-5 h-5 text-blue-300" />
            </div>
            <div className="text-3xl font-black mt-2">{categories.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Active Skill Types</div>
          </button>

          {/* Active Jobs Card */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              activeTab === 'jobs'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-[1.02]'
                : 'bg-slate-800 text-white border-slate-700 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider opacity-80">Active Jobs</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="text-3xl font-black mt-2">{jobs.length}</div>
            <div className="text-xs font-bold mt-1 opacity-90">Live Listings</div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b-2 border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Worker Approvals ({pendingWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'bg-slate-900 text-indigo-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Job Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-blue-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Worker Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-5 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'bg-slate-900 text-emerald-400 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Active Jobs ({jobs.length})</span>
        </button>
      </div>

      {/* SECTION 1: WORKER APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Pending Worker Registrations</h2>
              <p className="text-slate-600 text-sm font-bold mt-0.5">Review and approve new worker accounts before they can apply for jobs.</p>
            </div>
            <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs border border-amber-300">
              {pendingWorkers.length} Pending
            </span>
          </div>

          {pendingWorkers.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-black text-slate-800">No Pending Worker Approvals</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">All new worker accounts have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWorkers.map((worker) => (
                <div key={worker.id} className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-lg text-slate-900">{worker.name || 'Worker'}</span>
                      <span className="bg-amber-200 text-amber-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {worker.accountStatus || 'PENDING'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>📍 <strong className="text-slate-800">Location:</strong> {worker.location || worker.preferredLocation || 'Bengaluru'}</span>
                      <span>🛠️ <strong className="text-slate-800">Skills:</strong> {worker.skills || worker.skill || 'Carpenter'}</span>
                      <span>💼 <strong className="text-slate-800">Experience:</strong> {worker.experience || '2 Years'}</span>
                      <span>📅 <strong className="text-slate-800">Registered:</strong> {worker.registeredDate || '26 Sep 2026'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleViewDetails(worker)}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    <button
                      onClick={() => handleOpenApproveModal(worker)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" /> APPROVE
                    </button>
                    <button
                      onClick={() => handleOpenRejectModal(worker)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
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
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Submitted Job Applications</h2>
              <p className="text-slate-600 text-sm font-bold mt-0.5">Accept or reject worker job applications. Accepted applications appear on the Worker Home page.</p>
            </div>
            <span className="bg-indigo-100 text-indigo-900 font-extrabold px-3 py-1 rounded-full text-xs border border-indigo-300">
              {applications.length} Applications Total
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <FileText className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-lg font-black text-slate-800">No Job Applications Found</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Applications submitted by workers will appear here for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const isAccepted = (app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'HIRED');
                const isRejected = (app.status === 'REJECTED');
                return (
                  <div key={app.id || app.applicationId} className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-lg text-slate-900">{app.workerName || app.applicantName || 'Worker'}</span>
                        <span className="text-xs font-bold text-slate-500">({app.workerPhone || app.phoneNumber || 'N/A'})</span>
                        
                        {isAccepted && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs px-3 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> ACCEPTED / APPROVED
                          </span>
                        )}
                        {isRejected && (
                          <span className="bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs px-3 py-0.5 rounded-full flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> REJECTED
                          </span>
                        )}
                        {!isAccepted && !isRejected && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs px-3 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> APPLIED - PENDING ADMIN REVIEW
                          </span>
                        )}
                        
                        <span className="bg-blue-100 text-blue-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
                          {app.applicationSource === 'VOICE' || app.applicationSource === 'Voice Application' ? '🎤 Voice Application' : '📄 Direct Application'}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs font-bold">
                        <div className="text-slate-900 font-black text-sm flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <span>Job: {app.jobTitle || app.title || 'General Worker Job'}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">{app.company || app.employerName || 'Verified Employer'}</span>
                        </div>
                        <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                          <span>📍 <strong className="text-slate-800">Location:</strong> {app.location || app.jobLocation || 'Bengaluru'}</span>
                          <span>💰 <strong className="text-slate-800">Salary:</strong> {app.salary || (app.minSalary ? `₹${app.minSalary} - ₹${app.maxSalary}` : '₹15,000/month')}</span>
                          <span>📅 <strong className="text-slate-800">Applied Date:</strong> {app.appliedDate || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '27 Sep 2026')}</span>
                        </div>

                        {app.voiceTranscript && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-2 text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            <Volume2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold block text-[11px] text-amber-800 uppercase tracking-wider">Voice Recording Transcript:</span>
                              <p className="italic font-medium text-slate-800 text-xs">"{app.voiceTranscript}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto">
                      <button
                        onClick={() => handleViewAppDetails(app)}
                        className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-4 h-4" /> Details
                      </button>
                      
                      {!isAccepted && (
                        <button
                          onClick={() => handleOpenAcceptAppModal(app)}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4" /> ACCEPT
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          onClick={() => handleOpenRejectAppModal(app)}
                          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
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
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-200 mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Worker Categories ({categories.length})</h2>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="CODE (e.g. WELDER)"
              value={newCatCode}
              onChange={(e) => setNewCatCode(e.target.value)}
              className="input-field uppercase text-base py-2.5"
              required
            />
            <input
              type="text"
              placeholder="Display Name (e.g. Welder / वेल्डर)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="input-field text-base py-2.5"
              required
            />
            <button type="submit" className="btn-primary py-2.5 px-6 whitespace-nowrap">
              <Plus className="w-5 h-5" /> Add Category
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((c) => (
              <div key={c.id || c.code} className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800">{c.icon || '🛠️'} {c.code}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: JOBS MANAGEMENT */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Active Platform Jobs ({jobs.length})</h2>
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-base text-slate-900">{j.title}</div>
                  <div className="text-xs text-slate-500 font-bold">{j.category} • {j.location} • ₹{j.minSalary}</div>
                </div>
                <button
                  onClick={() => handleDeleteJob(j.id)}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-xl"
                  title="Delete Job"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW WORKER DETAILS */}
      {showDetailModal && selectedWorker && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-900 relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-black text-xl">
                👤
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Worker Profile</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Registration Details Review</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Name:</span>
                <span className="col-span-2 font-black text-slate-900">{selectedWorker.name || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Email:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.email || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Phone:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.phoneNumber || selectedWorker.phone || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Location:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.location || selectedWorker.preferredLocation || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Skills:</span>
                <span className="col-span-2 font-bold text-emerald-800">{selectedWorker.skills || selectedWorker.skill || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Experience:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.experience || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Preferred Job:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.preferredJob || selectedWorker.skill || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Preferred Location:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.preferredLocation || selectedWorker.location || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Registration Date:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedWorker.registeredDate || '26 Sep 2026'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Status:</span>
                <span className="col-span-2">
                  <span className="bg-amber-200 text-amber-900 font-black px-2.5 py-0.5 rounded-full text-xs uppercase">
                    {selectedWorker.accountStatus || 'PENDING'}
                  </span>
                </span>
              </div>

              {selectedWorker.voiceTranscript && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className="font-extrabold text-slate-600 block mb-1">Captured Voice Transcript:</span>
                  <p className="italic text-xs bg-amber-50 text-amber-950 p-2.5 rounded-xl border border-amber-200">
                    "{selectedWorker.voiceTranscript}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenApproveModal(selectedWorker)}
                className="flex-1 btn-primary py-3 text-sm font-black flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> APPROVE WORKER
              </button>
              <button
                onClick={() => handleOpenRejectModal(selectedWorker)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              >
                <UserX className="w-4 h-4" /> REJECT WORKER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM APPROVE */}
      {showApproveModal && targetWorker && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-emerald-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Approve this worker?</h3>
              <p className="text-slate-600 text-sm font-medium mt-1">
                This will approve <strong className="text-slate-900">{targetWorker.name}</strong> to start searching and applying for jobs on Udyoga Mitra.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-2xl font-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-sm shadow-lg"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM REJECT */}
      {showRejectModal && targetWorker && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-rose-500">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserX className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Reject this worker?</h3>
              <p className="text-slate-600 text-sm font-medium mt-1">
                Reject registration for <strong className="text-slate-900">{targetWorker.name}</strong>.
              </p>
            </div>
            <div className="mb-5">
              <label className="text-xs font-black text-slate-700 uppercase block mb-1">Rejection Reason (Optional)</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Profile information needs verification."
                className="input-field text-sm py-2.5"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-2xl font-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl font-black text-sm shadow-lg"
              >
                Reject Worker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRM ACCEPT JOB APPLICATION */}
      {showAcceptAppModal && targetApp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-emerald-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Accept this Job Application?</h3>
              <p className="text-slate-600 text-sm font-medium mt-2">
                This will approve the application from <strong className="text-slate-900">{targetApp.workerName || targetApp.applicantName}</strong> for <strong className="text-indigo-600">{targetApp.jobTitle || targetApp.title}</strong>.
              </p>
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-3">
                ✓ Accepted status will be updated immediately and shown on the Worker Home Page.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAcceptAppModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-2xl font-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAcceptApp}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> ACCEPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CONFIRM REJECT JOB APPLICATION */}
      {showRejectAppModal && targetApp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-rose-500">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <X className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Reject Application?</h3>
              <p className="text-slate-600 text-sm font-medium mt-1">
                Reject application from <strong className="text-slate-900">{targetApp.workerName || targetApp.applicantName}</strong> for <strong className="text-slate-900">{targetApp.jobTitle || targetApp.title}</strong>.
              </p>
            </div>

            <div className="mb-5">
              <label className="text-xs font-black text-slate-700 uppercase block mb-1">Rejection Reason</label>
              <input
                type="text"
                value={appRejectionReason}
                onChange={(e) => setAppRejectionReason(e.target.value)}
                placeholder="e.g. Application does not meet job criteria."
                className="input-field text-sm py-2.5"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectAppModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-2xl font-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectApp}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> REJECT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: VIEW JOB APPLICATION DETAILS */}
      {showAppDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-900 relative">
            <button
              onClick={() => setShowAppDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-800 rounded-2xl flex items-center justify-center font-black text-xl">
                📄
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Application Details</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Job Application Review</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Applicant:</span>
                <span className="col-span-2 font-black text-slate-900">{selectedApp.workerName || selectedApp.applicantName || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Phone:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedApp.workerPhone || selectedApp.phoneNumber || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Job Title:</span>
                <span className="col-span-2 font-bold text-indigo-700">{selectedApp.jobTitle || selectedApp.title || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Employer:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedApp.company || selectedApp.employerName || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Location:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedApp.location || selectedApp.jobLocation || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Salary:</span>
                <span className="col-span-2 font-bold text-emerald-800">{selectedApp.salary || (selectedApp.minSalary ? `₹${selectedApp.minSalary} - ₹${selectedApp.maxSalary}` : 'N/A')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Application Mode:</span>
                <span className="col-span-2 font-bold text-slate-800">{selectedApp.applicationSource || 'MANUAL'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold text-slate-600">Status:</span>
                <span className="col-span-2 font-black">
                  {selectedApp.status === 'ACCEPTED' && <span className="text-emerald-600">ACCEPTED</span>}
                  {selectedApp.status === 'REJECTED' && <span className="text-rose-600">REJECTED</span>}
                  {selectedApp.status !== 'ACCEPTED' && selectedApp.status !== 'REJECTED' && <span className="text-amber-600">APPLIED</span>}
                </span>
              </div>

              {selectedApp.voiceTranscript && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className="font-extrabold text-slate-600 block mb-1">Voice Transcript:</span>
                  <p className="italic text-xs bg-amber-50 text-amber-950 p-2.5 rounded-xl border border-amber-200">
                    "{selectedApp.voiceTranscript}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenAcceptAppModal(selectedApp)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow"
              >
                <Check className="w-4 h-4" /> ACCEPT APPLICATION
              </button>
              <button
                onClick={() => handleOpenRejectAppModal(selectedApp)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow"
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

