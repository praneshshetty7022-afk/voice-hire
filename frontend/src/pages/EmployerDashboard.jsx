import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import AudioButton from '../components/AudioButton'
import { PlusCircle, Briefcase, Users, CheckCircle, XCircle, Clock, Building2, MapPin, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

export const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('POST_JOB') // 'POST_JOB' | 'APPLICANTS'
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)

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
      const aRes = await axios.get('/applications/my?workerId=worker_1')
      setApplications(aRes.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status: newStatus })
      toast.success(`Application status updated to ${newStatus}!`)
      fetchEmployerData()
    } catch (err) {
      toast.error('Failed to update status.')
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
              Post jobs for drivers, painters, plumbers, carpenters, cooks & helpers.
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

      {/* Tab 2: Applicants */}
      {activeTab === 'APPLICANTS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            <span>Manage Worker Applications</span>
          </h2>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-900">{app.workerName || 'Worker Applicant'}</h3>
                    {app.applicationSource === 'VOICE' ? (
                      <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-300">
                        🎤 Voice App
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-700 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                        🖱️ Manual App
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-600">Applied for: <span className="text-emerald-700">{app.jobTitle}</span></p>
                  <p className="text-xs font-semibold text-slate-500">Status: <span className="font-extrabold text-amber-700">{app.status}</span></p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" /> Select
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerDashboard
