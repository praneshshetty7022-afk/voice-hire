import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PROFESSIONS, CITIES } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
import { getLocalizedProfessionBadge } from '../utils/jobLocalization'
import JobCard from '../components/JobCard'
import VoiceApplyModal from '../components/VoiceApplyModal'
import axios from '../api/axios'
import { Search, MapPin, Filter, Briefcase, RefreshCw, X } from 'lucide-react'

export default function JobListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  const { selectedLang } = useVoice()
  const t = getTranslation(selectedLang)

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'ALL')
  const [selectedCity, setSelectedCity] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState(searchParam || '')
  const [voiceApplyJob, setVoiceApplyJob] = useState(null)

  useEffect(() => {
    const cat = searchParams.get('category') || 'ALL'
    const city = searchParams.get('location') || 'ALL'
    const srch = searchParams.get('search') || ''
    setSelectedCategory(cat)
    setSelectedCity(city)
    setSearchQuery(srch)
  }, [searchParams])

  useEffect(() => {
    fetchJobs()
  }, [selectedCategory, selectedCity, searchQuery])

  useEffect(() => {
    const safeJobs = Array.isArray(jobs) ? jobs : []
    if (searchParams.get('action') === 'voice-apply' && safeJobs.length > 0 && !voiceApplyJob) {
      setVoiceApplyJob(safeJobs[0])
    }
  }, [searchParams, jobs])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let url = '/jobs'
      const params = new URLSearchParams()
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory)
      if (selectedCity !== 'ALL') params.append('location', selectedCity)
      
      const queryStr = params.toString()
      if (queryStr) url += `?${queryStr}`

      const res = await axios.get(url)
      const rawList = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.jobs) ? res.data.jobs : (Array.isArray(res?.data?.data) ? res.data.data : null))

      if (rawList) {
        let filtered = rawList
        if (selectedCategory !== 'ALL') {
          filtered = filtered.filter(j => (j.category || '').toUpperCase() === selectedCategory.toUpperCase())
        }
        if (selectedCity !== 'ALL') {
          filtered = filtered.filter(j => (j.location || '').toLowerCase() === selectedCity.toLowerCase())
        }
        if (searchQuery) {
          const lowerQ = searchQuery.toLowerCase()
          const terms = lowerQ.split(/\s+/).filter(t => t.length > 1 && !['job', 'jobs', 'in', 'for', 'need', 'show', 'find', 'want', 'काम', 'नौकरी', 'ಕೆಲಸ', 'ಉದ್ಯೋಗ', 'ఉద్యోగం', 'வேலை'].includes(t))
          if (terms.length > 0) {
            filtered = filtered.filter(j => 
              terms.some(t => 
                (j.title || '').toLowerCase().includes(t) ||
                (j.category || '').toLowerCase().includes(t) ||
                (j.location || '').toLowerCase().includes(t)
              )
            )
          }
        }
        setJobs(filtered)
      } else {
        setJobs(getMockSeedJobs(selectedCategory, selectedCity, searchQuery))
      }
    } catch (e) {
      console.error(e)
      setJobs(getMockSeedJobs(selectedCategory, selectedCity, searchQuery))
    } finally {
      setLoading(false)
    }
  }

  const getMockSeedJobs = (cat, city, srch) => {
    const seed = [
      { id: '1', title: 'Professional Driver (Private Car & Cab)', category: 'DRIVER', location: 'Bengaluru', dailyWage: 1200, workTime: '8 AM – 6 PM', experience: '2+ Years', employerName: 'Nandi Motors' },
      { id: '2', title: 'Commercial Truck & Van Driver', category: 'DRIVER', location: 'Mysuru', dailyWage: 1400, workTime: '9 AM – 7 PM', experience: '3+ Years', employerName: 'Express Logistics' },
      { id: '3', title: 'Furniture Carpenter (Modular Work)', category: 'CARPENTER', location: 'Bengaluru', dailyWage: 1100, workTime: '9 AM – 6 PM', experience: '1+ Years', employerName: 'WoodCraft Interior' },
      { id: '3b', title: 'Royal Heritage Wood Carpenter', category: 'CARPENTER', location: 'Mysuru', dailyWage: 1250, workTime: '9 AM – 6 PM', experience: '2+ Years', employerName: 'Mysore Woodworks' },
      { id: '4', title: 'Interior House Painter (Wall Texture)', category: 'PAINTER', location: 'Bengaluru', dailyWage: 1000, workTime: '9 AM – 5 PM', experience: '2+ Years', employerName: 'Apex Paints' },
      { id: '4b', title: 'Residential Wall Painter', category: 'PAINTER', location: 'Mysuru', dailyWage: 1100, workTime: '9 AM – 5 PM', experience: '1+ Years', employerName: 'Heritage Decorators' },
      { id: '5', title: 'Residential Wiring Electrician', category: 'ELECTRICIAN', location: 'Mangaluru', dailyWage: 1300, workTime: '9 AM – 6 PM', experience: '2+ Years', employerName: 'PowerFix Solutions' },
      { id: '6', title: 'Plumber & Sanitary Technician', category: 'PLUMBER', location: 'Bengaluru', dailyWage: 1150, workTime: '9 AM – 6 PM', experience: '1+ Years', employerName: 'AquaCare Services' },
      { id: '7', title: 'Construction Mason (Brick & Concrete)', category: 'MASON', location: 'Hubballi', dailyWage: 1250, workTime: '8 AM – 5 PM', experience: '3+ Years', employerName: 'Shri Builders' },
      { id: '8', title: 'Restaurant South Indian Cook', category: 'COOK', location: 'Bengaluru', dailyWage: 1350, workTime: '7 AM – 3 PM', experience: '2+ Years', employerName: 'Udupi Sagar Hotel' },
      { id: '8b', title: 'Traditional Household & Hotel Cook', category: 'COOK', location: 'Mysuru', dailyWage: 1300, workTime: '7 AM – 3 PM', experience: '2+ Years', employerName: 'Chamundi Caterers' },
      { id: '9', title: 'Office & Apartment Deep Cleaner', category: 'CLEANER', location: 'Bengaluru', dailyWage: 950, workTime: '9 AM – 5 PM', experience: 'Freshers Allowed', employerName: 'CleanPro Facility' },
    ]

    return seed.filter((j) => {
      const matchCat = cat === 'ALL' || j.category.toUpperCase() === cat.toUpperCase()
      const matchCity = city === 'ALL' || j.location.toLowerCase() === city.toLowerCase()

      let matchSearch = true
      if (srch) {
        const cleanSearch = srch.toLowerCase()
        const terms = cleanSearch.split(/\s+/).filter(t => t.length > 1 && !['job', 'jobs', 'in', 'for', 'need', 'show', 'find', 'want', 'काम', 'नौकरी', 'ಕೆಲಸ', 'ಉದ್ಯೋಗ', 'ఉద్యోగం', 'వేట', 'வேலை'].includes(t))

        if (terms.length > 0) {
          matchSearch = terms.some(term => 
            j.title.toLowerCase().includes(term) ||
            j.category.toLowerCase().includes(term) ||
            j.location.toLowerCase().includes(term) ||
            j.employerName.toLowerCase().includes(term)
          )
        } else {
          matchSearch = j.title.toLowerCase().includes(cleanSearch) || j.category.toLowerCase().includes(cleanSearch)
        }
      }

      return matchCat && matchCity && matchSearch
    })
  }

  const activeProf = PROFESSIONS[selectedCategory]
  const safeJobs = Array.isArray(jobs) ? jobs : []

  return (
    <div className="space-y-6 pb-12 relative z-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_10px_35px_rgba(37,99,235,0.06)] border border-blue-100/90 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-200/60 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{activeProf ? activeProf.icon : '🔎'}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeProf ? getLocalizedProfessionBadge(selectedCategory, activeProf.title, selectedLang) : t.viewAllJobs}
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {jobs.length} {t.jobsAvailable} • <span className="text-blue-700 font-bold">{selectedCity === 'ALL' ? t.allCities : selectedCity}</span>
          </p>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchWorkPlaceholder || 'Search work...'}
            className="w-full pl-11 pr-9 py-3 bg-white border border-blue-200/80 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* City Chips Filter */}
      <div className="space-y-2">
        <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest px-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {t.selectCityLabel || 'Select City'}
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCity('ALL')}
            className={`px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm border shrink-0 transition-all ${
              selectedCity === 'ALL'
                ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black border-blue-400/40 shadow-md'
                : 'bg-white text-slate-600 border-blue-200/80 hover:bg-blue-50 hover:text-blue-900 shadow-sm'
            }`}
          >
            {t.allCities || 'All Cities'}
          </button>
          {(Array.isArray(CITIES) ? CITIES : []).map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelectedCity(city.name)}
              className={`px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm border shrink-0 transition-all ${
                selectedCity === city.name
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black border-blue-400/40 shadow-md'
                  : 'bg-white text-slate-600 border-blue-200/80 hover:bg-blue-50 hover:text-blue-900 shadow-sm'
              }`}
            >
              {city.name} ({city.native[selectedLang.split('-')[0]] || city.name})
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-2">
        <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest px-1 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-blue-600" /> {t.professionCategoryLabel || 'Profession Category'}
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL')
              setSearchParams({})
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm border shrink-0 transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                : 'bg-white text-slate-600 border-blue-200/80 hover:bg-blue-50 hover:text-blue-900 shadow-sm'
            }`}
          >
            {t.allProfessions || 'All Professions'}
          </button>
          {Object.entries(PROFESSIONS || {}).map(([key, prof]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedCategory(key)
                setSearchParams({ category: key })
              }}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm border shrink-0 flex items-center gap-2 transition-all ${
                selectedCategory === key
                  ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                  : 'bg-white text-slate-600 border-blue-200/80 hover:bg-blue-50 hover:text-blue-900 shadow-sm'
              }`}
            >
              <span>{prof.icon}</span>
              <span>{getLocalizedProfessionBadge(key, prof.title, selectedLang)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white/85 backdrop-blur-2xl rounded-3xl border border-blue-100/90 shadow-[0_10px_35px_rgba(37,99,235,0.06)] space-y-3">
          <RefreshCw className="w-9 h-9 animate-spin text-blue-600 mx-auto" />
          <p className="text-base font-black text-slate-900">{t.loadingJobs || 'Loading Available Jobs...'}</p>
        </div>
      ) : safeJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeJobs.map((job) => (
            <JobCard
              key={job.id || job._id}
              job={job}
              onApplyVoice={(j) => setVoiceApplyJob(j)}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="p-12 text-center bg-white/85 backdrop-blur-2xl rounded-3xl border border-blue-100/90 shadow-[0_10px_35px_rgba(37,99,235,0.06)] space-y-4 text-slate-800">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-200 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-sm">
            🚗
          </div>
          <h3 className="text-2xl font-black text-slate-900">{t.noJobsHereTitle || 'No jobs available here right now'}</h3>
          <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">
            {t.noJobsHereDesc || 'Try searching nearby cities or select another profession category.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setSelectedCity('ALL')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-black rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              {t.searchNearby || 'Search Nearby'}
            </button>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="px-6 py-3 bg-white text-slate-700 font-extrabold rounded-2xl border border-blue-200 hover:bg-blue-50 transition-all text-sm shadow-sm"
            >
              {t.chooseAnotherWork || 'Choose Another Work'}
            </button>
          </div>
        </div>
      )}

      {/* Voice Application Modal */}
      {voiceApplyJob && (
        <VoiceApplyModal
          job={voiceApplyJob}
          onClose={() => setVoiceApplyJob(null)}
          onSuccess={() => setVoiceApplyJob(null)}
        />
      )}
    </div>
  )
}
