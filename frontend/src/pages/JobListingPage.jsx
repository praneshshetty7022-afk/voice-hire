import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PROFESSIONS, CITIES } from '../styles/theme'
import { useVoice } from '../context/VoiceContext'
import { getTranslation } from '../utils/translations'
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
    if (searchParams.get('action') === 'voice-apply' && jobs.length > 0 && !voiceApplyJob) {
      setVoiceApplyJob(jobs[0])
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
      if (res.data && Array.isArray(res.data)) {
        let filtered = res.data
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{activeProf ? activeProf.icon : '🔎'}</span>
            <h1 className="text-3xl font-black text-slate-900">
              {activeProf ? activeProf.title : t.viewAllJobs}
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {jobs.length} {t.jobsAvailable} • {selectedCity === 'ALL' ? t.allCities : selectedCity}
          </p>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[280px]">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search work..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* City Chips Filter */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1">
          <MapPin className="w-4 h-4 text-blue-600" /> Select City / స్థలం
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCity('ALL')}
            className={`px-4 py-2 rounded-2xl font-extrabold text-sm border-2 shrink-0 transition-all ${
              selectedCity === 'ALL'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Cities
          </button>
          {CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelectedCity(city.name)}
              className={`px-4 py-2 rounded-2xl font-extrabold text-sm border-2 shrink-0 transition-all ${
                selectedCity === city.name
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {city.name} ({city.native[selectedLang.split('-')[0]] || city.name})
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1">
          <Filter className="w-4 h-4 text-blue-600" /> Profession Category
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL')
              setSearchParams({})
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm border-2 shrink-0 transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Professions
          </button>
          {Object.entries(PROFESSIONS).map(([key, prof]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedCategory(key)
                setSearchParams({ category: key })
              }}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm border-2 shrink-0 flex items-center gap-2 transition-all ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{prof.icon}</span>
              <span>{prof.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-100 shadow-sm space-y-3">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg font-black text-slate-800">Loading Available Jobs...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id || job._id}
              job={job}
              onApplyVoice={(j) => setVoiceApplyJob(j)}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-200 shadow-lg space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto text-4xl">
            🚗
          </div>
          <h3 className="text-2xl font-black text-slate-900">No jobs available here right now</h3>
          <p className="text-base text-slate-500 font-semibold max-w-md mx-auto">
            Try searching nearby cities or select another profession category.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setSelectedCity('ALL')}
              className="px-6 py-3 bg-blue-600 text-white font-extrabold rounded-2xl shadow-md"
            >
              Search Nearby
            </button>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="px-6 py-3 bg-slate-100 text-slate-800 font-extrabold rounded-2xl"
            >
              Choose Another Work
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
