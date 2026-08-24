import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import { ShieldCheck, Plus, List, Trash2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export const AdminDashboard = () => {
  const [categories, setCategories] = useState([])
  const [jobs, setJobs] = useState([])
  const [newCatCode, setNewCatCode] = useState('')
  const [newCatName, setNewCatName] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const cRes = await axios.get('/categories')
      setCategories(cRes.data || [])
      const jRes = await axios.get('/jobs')
      setJobs(jRes.data || [])
    } catch (err) {
      console.error(err)
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

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border-4 border-emerald-500">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" /> Admin Console
        </div>
        <h1 className="text-3xl font-black">Category & Job Administration</h1>
        <p className="text-emerald-200 text-sm mt-1">Manage skilled worker categories and monitor live platform jobs.</p>
      </div>

      {/* Categories Admin */}
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

      {/* Jobs Management */}
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
    </div>
  )
}

export default AdminDashboard
