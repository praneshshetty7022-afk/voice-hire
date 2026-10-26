import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Building2,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function PostJobPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('DRIVER')
  const [location, setLocation] = useState('Bengaluru')
  const [workTime, setWorkTime] = useState('8:00 AM – 6:00 PM')
  const [experience, setExperience] = useState('2+ Years')
  const [dailyWage, setDailyWage] = useState('1200')
  const [salaryType, setSalaryType] = useState('Daily')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('Valid Trade ID, Punctuality, Local route experience')
  const [loading, setLoading] = useState(false)

  const TRADES = [
    { code: 'DRIVER', label: 'Commercial / Private Driver' },
    { code: 'CARPENTER', label: 'Modular Interior Carpenter' },
    { code: 'ELECTRICIAN', label: 'Licensed Electrician & Wireman' },
    { code: 'PLUMBER', label: 'Sanitary & Pipe Plumber' },
    { code: 'COOK', label: 'Residential / Commercial Cook' },
    { code: 'PAINTER', label: 'Wall Painter & Surface Polisher' },
    { code: 'HELPER', label: 'Warehouse & Construction Helper' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !dailyWage) {
      toast.error('Please enter a Job Title and Daily Wage.')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/jobs', {
        title: title.trim(),
        category,
        location: location.trim(),
        workTime,
        experience,
        dailyWage: Number(dailyWage),
        salaryType,
        description: description.trim(),
        requirements: requirements.split(',').map((r) => r.trim()),
      })

      if (res.data?.success || res.data?.job) {
        toast.success('Job listing published live to workers!')
        navigate('/employer/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not post job.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Quick preset template filler
  const applyPreset = (presetCategory, presetTitle, presetWage, presetDesc) => {
    setCategory(presetCategory)
    setTitle(presetTitle)
    setDailyWage(presetWage)
    setDescription(presetDesc)
    toast.success(`Loaded template: ${presetTitle}`)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header & Breadcrumb */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Link to="/employer/dashboard" className="hover:text-[#2563EB]">
              Employer Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#2563EB] dark:text-[#60A5FA]">Post New Job</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Worker Job Listing
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Post in 2 minutes. Local workers will be notified instantly via audio alerts.
          </p>
        </div>

        {/* Templates Dropdown Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset(
                'DRIVER',
                'Private Car & City Delivery Driver',
                '1250',
                'Need safe driver with commercial license for full-time daily routes across Bengaluru.'
              )
            }
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-white/[0.06] text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-white/10 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
          >
            + Driver Template
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset(
                'CARPENTER',
                'Modular Interior Furniture Carpenter',
                '1300',
                'Skilled modular woodwork assembler needed for residential flat furnishing.'
              )
            }
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-white/[0.06] text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-white/10 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer"
          >
            + Carpenter Template
          </button>
        </div>
      </div>

      {/* Main Post Job Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#151C2C] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/40 space-y-6"
      >
        {/* Job Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Job Title
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Commercial Van Driver or Furniture Carpenter"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:border-[#2563EB] outline-none"
            />
          </div>
        </div>

        {/* Trade Category & City Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Trade Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
            >
              {TRADES.map((t) => (
                <option key={t.code} value={t.code} className="dark:bg-[#151C2C]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Work Location / City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru (Koramangala, Whitefield, etc.)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Work Timings & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Daily Work Timings
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={workTime}
                onChange={(e) => setWorkTime(e.target.value)}
                placeholder="8:00 AM – 6:00 PM"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Required Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
            >
              <option value="Fresher / Any">Fresher / Any</option>
              <option value="1+ Years">1+ Years</option>
              <option value="2+ Years">2+ Years</option>
              <option value="3+ Years">3+ Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
          </div>
        </div>

        {/* Wage & Salary Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Daily Wage Amount (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
              <input
                type="number"
                required
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                placeholder="1200"
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Payout Frequency
            </label>
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
            >
              <option value="Daily">Daily Payout</option>
              <option value="Monthly">Monthly Fixed</option>
            </select>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Job Description & Responsibilities
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the day-to-day work so voice-listening workers can clearly understand the role."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white outline-none resize-none"
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Key Requirements (Comma-separated)
          </label>
          <input
            type="text"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Valid Driving License, Own Smartphone, Clean Record"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black text-base shadow-xl shadow-blue-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <span>Publishing Job Listing...</span>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              <span>Publish Job Listing to Workers</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
