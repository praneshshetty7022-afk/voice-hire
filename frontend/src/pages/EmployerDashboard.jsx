import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Building2,
  Phone,
  Eye,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [jobsRes, appsRes] = await Promise.allSettled([
        api.get('/jobs'),
        api.get('/applications/employer'),
      ])

      if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value.data)) {
        setJobs(jobsRes.value.data)
      }

      if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value.data)) {
        setApplicants(appsRes.value.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'
    try {
      await api.put(`/jobs/${jobId}`, { status: nextStatus })
      toast.success(`Job marked as ${nextStatus}`)
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId || j.id === jobId ? { ...j, status: nextStatus } : j))
      )
    } catch (e) {
      toast.error('Could not update job status.')
    }
  }

  // Calculated Stats
  const activeJobs = jobs.filter((j) => j.status !== 'CLOSED').length
  const totalApplicants = applicants.length
  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED').length
  const hiredCount = applicants.filter((a) => a.status === 'HIRED').length

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Employer Portal</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.companyName || user?.fullName || 'Hiring Partner'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            Manage your worker hiring pipeline, post open job requisitions, and listen to spoken candidate applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/employer/post-job"
            className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post New Job</span>
          </Link>

          <Link
            to="/employer/applicants"
            className="px-5 py-3 rounded-2xl bg-white/[0.1] hover:bg-white/[0.18] border border-white/20 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Manage Candidates</span>
          </Link>
        </div>
      </div>

      {/* 4 Key Hiring Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-black/30">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {activeJobs}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Active Job Listings</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-black/30">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalApplicants}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Total Applicants</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-black/30">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {shortlistedCount}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Shortlisted / Interview</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-black/30">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {hiredCount}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Hired Candidates</p>
        </div>
      </div>

      {/* Posted Job Listings Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Your Published Job Listings
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Live listings active on the worker job board
            </p>
          </div>

          <Link
            to="/employer/post-job"
            className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
          >
            <span>Create new listing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#151C2C] border border-slate-200/80 dark:border-white/10">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No jobs posted yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Publish your first listing to start receiving voice applications from workers.
            </p>
            <Link
              to="/employer/post-job"
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs"
            >
              Post a Job Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const jobId = job._id || job.id
              const isClosed = job.status === 'CLOSED'

              return (
                <div
                  key={jobId}
                  className={`p-5 rounded-3xl bg-white dark:bg-[#151C2C] border transition-all flex flex-col justify-between ${
                    isClosed
                      ? 'border-slate-200 dark:border-white/5 opacity-60'
                      : 'border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-black/30 hover:border-blue-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        {job.category}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(jobId, job.status)}
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                          isClosed
                            ? 'bg-slate-100 text-slate-500 dark:bg-white/[0.08]'
                            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        }`}
                      >
                        {isClosed ? 'Closed' : 'Active'}
                      </button>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span>₹{job.dailyWage}/day</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      <span>{job.applicantsCount || 0} Applicants</span>
                    </span>

                    <Link
                      to="/employer/applicants"
                      className="text-xs font-black text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
