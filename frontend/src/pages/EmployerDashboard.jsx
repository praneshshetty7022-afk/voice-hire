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
      setJobs(jRes.data || [])

      const aRes = await axios.get('/employer/applications')
      if (aRes.data && Array.isArray(aRes.data) && aRes.data.length > 0) {
        setApplications(aRes.data)
      } else {
        // Fallback mock applications if database has no entries
        setApplications(getMockEmployerApplications())
      }
    } catch (err) {
      console.error(err)
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
      workerName: 'Pranesh Shetty',
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
        return <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-3 py-1 rounded-full border border-blue-300">Applied</span>
      case 'UNDER_REVIEW':
        return <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300">Under Review</span>
      case 'INTERVIEW_SCHEDULED':
      case 'SHORTLISTED':
        return <span className="bg-purple-100 text-purple-800 font-extrabold text-xs px-3 py-1 rounded-full border border-purple-300">Interview Scheduled</span>
      case 'HIRED':
      case 'SELECTED':
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-300">Hired</span>
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 font-extrabold text-xs px-3 py-1 rounded-full border border-rose-300">Rejected</span>
      default:
        return <span className="bg-slate-100 text-slate-700 font-extrabold text-xs px-3 py-1 rounded-full">{status}</span>
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Dashboard Title */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border-4 border-emerald-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-black px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> Employer Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Hire Skilled Local Workers
            </h1>
            <p className="text-emerald-200 font-medium text-base mt-1">
              Post jobs and manage candidate application progress & interview schedules.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('POST_JOB')}
              className={`px-5 py-3 rounded-2xl font-black text-base transition-all ${
                activeTab === 'POST_JOB' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-200'
              }`}
            >
              Post Job
            </button>
            <button
              onClick={() => setActiveTab('APPLICANTS')}
              className={`px-5 py-3 rounded-2xl font-black text-base transition-all ${
                activeTab === 'APPLICANTS' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-200'
              }`}
            >
              Applicants ({applications.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Post Job */}
      {activeTab === 'POST_JOB' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <PlusCircle className="w-7 h-7 text-emerald-600" />
            <span>Create Worker Job Listing</span>
          </h2>

          <form onSubmit={handlePostJob} className="space-y-4">
            <div>
              <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Household Driver Required"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Work Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Min Wage (₹)</label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Max Wage (₹)</label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Salary Type</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  className="input-field font-semibold"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="DAILY">Daily</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 uppercase mb-1">Job Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify duties, working hours, food/room availability..."
                rows={4}
                className="input-field text-base"
                required
              />
            </div>

            <button type="submit" className="w-full btn-primary py-4 text-xl font-black">
              Publish Job Listing
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Applicants Management */}
      {activeTab === 'APPLICANTS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-slate-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b-2 border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-7 h-7 text-emerald-600" />
                <span>Manage Worker Applications</span>
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Control candidate status from Applied → Review → Interview → Hired / Rejected
              </p>
            </div>
            <button
              onClick={fetchEmployerData}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl text-sm transition-all"
            >
              🔄 Refresh List
            </button>
          </div>

          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-200 shadow-md flex flex-col space-y-4 transition-all hover:border-slate-300"
                >
                  {/* Card Main Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-2xl font-black text-slate-900">{app.workerName || 'Worker Applicant'}</h3>
                        {getStatusBadge(app.status)}

                        {app.applicationSource === 'VOICE' ? (
                          <span className="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-300">
                            🎤 Voice App
                          </span>
                        ) : (
                          <span className="bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
                            🖱️ Manual App
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-extrabold text-slate-700 mt-1">
                        Job: <span className="text-emerald-700">{app.jobTitle}</span>
                        {app.experience && <span className="text-slate-500 font-semibold ml-2">• Experience: {app.experience}</span>}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedAppModal(app)}
                      className="px-4 py-2 bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-900 font-black rounded-xl text-sm flex items-center gap-1.5 shadow-sm shrink-0"
                    >
                      <Eye className="w-4 h-4 text-blue-600" /> View Application
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-400 uppercase">Change Status:</span>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {/* Move to Review */}
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'UNDER_REVIEW')}
                        disabled={app.status === 'REJECTED' || app.status === 'HIRED'}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                          app.status === 'UNDER_REVIEW'
                            ? 'bg-amber-600 text-white shadow'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200 disabled:opacity-40'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> Move to Review
                      </button>

                      {/* Schedule Interview */}
                      <button
                        onClick={() => setScheduleInterviewApp(app)}
                        disabled={app.status === 'REJECTED' || app.status === 'HIRED'}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                          app.status === 'INTERVIEW_SCHEDULED'
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-purple-100 text-purple-900 hover:bg-purple-200 disabled:opacity-40'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                      </button>

                      {/* Hire */}
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                        disabled={app.status === 'REJECTED'}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                          app.status === 'HIRED'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 disabled:opacity-40'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Hire Candidate
                      </button>

                      {/* Reject */}
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        disabled={app.status === 'REJECTED'}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                          app.status === 'REJECTED'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-rose-100 text-rose-900 hover:bg-rose-200 disabled:opacity-40'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-slate-200 space-y-2">
                <Users className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-black text-slate-800">No applications received yet</h3>
                <p className="text-sm font-semibold text-slate-500">
                  Applications submitted by workers will appear here for review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleInterviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-purple-300 p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-600" /> Schedule Candidate Interview
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  Applicant: <span className="text-purple-700">{scheduleInterviewApp.workerName}</span> ({scheduleInterviewApp.jobTitle})
                </p>
              </div>
              <button
                onClick={() => setScheduleInterviewApp(null)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">Interview Date</label>
                  <input
                    type="text"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="Ex. 28 September 2026"
                    className="input-field text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">Interview Time</label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="Ex. 10:30 AM"
                    className="input-field text-sm font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Interview Mode</label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="input-field text-sm font-bold"
                >
                  <option value="In Person">In Person (Face to Face)</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Video Call">Video Call</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Interview Location / Link</label>
                <input
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  placeholder="Address or Google Meet Link"
                  className="input-field text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase mb-1">Instructions / Note for Worker</label>
                <textarea
                  value={employerMessage}
                  onChange={(e) => setEmployerMessage(e.target.value)}
                  placeholder="Ex. Please bring your driving license or ID proof."
                  rows={3}
                  className="input-field text-sm font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleInterviewApp(null)}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl text-base shadow-lg"
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

