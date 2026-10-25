import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { Mic, MicOff, Eye, EyeOff } from 'lucide-react'

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await axios.post('/auth/login', data)
      
      // Handle response format
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        toast.success('Login successful!')
        
        // Redirect based on user role
        const role = response.data.user.role.toLowerCase()
        // For now, redirect to jobs page since dashboards aren't implemented yet
        navigate('/jobs')
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const startVoiceInput = async (field) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice recognition is not supported in this browser.')
      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Microphone is not available. Check your device settings.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      toast.error('Microphone permission is required.')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        let text = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript
        }
        const cleanText = text.trim()
        if (cleanText) {
          if (field === 'email') {
            setValue('email', cleanText.toLowerCase().replace(/\s+/g, ''))
          } else if (field === 'all') {
            const parts = cleanText.toLowerCase().split('password')
            if (parts.length > 0) {
              setValue('email', parts[0].trim().replace(/\s+/g, ''))
            }
            if (parts.length > 1) {
              setValue('password', parts[1].trim())
            }
          }
          toast.success('Voice input captured')
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission is required.')
        } else if (event.error !== 'aborted') {
          toast.error(`Voice recognition error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (e) {
      console.error(e)
      setIsListening(false)
      toast.error('Failed to start voice input')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Light Field Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/[0.035] backdrop-blur-2xl border border-white/10 shadow-glass-edge rounded-3xl p-8 sm:p-10 text-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wider uppercase mb-3">
              ✨ LUXURY EDITION
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] mb-2 tracking-tight">
              VoiceHire
            </h1>
            <p className="text-slate-400 text-xs font-semibold tracking-wide">
              ಉದ್ಯೋಗ ಮಿತ್ರ • Multi-lingual Employment Platform
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all text-sm pr-11 shadow-inner"
                  placeholder="Enter your email"
                />
                <button
                  type="button"
                  onClick={() => startVoiceInput('email')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                >
                  {isListening ? <Mic className="w-5 h-5 text-amber-400 animate-pulse" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-[#0c0c0e]/80 border border-white/10 focus:border-amber-400/50 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all text-sm pr-11 shadow-inner"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1.5 font-semibold">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-amber-400 focus:ring-amber-400/30 w-4 h-4" />
                <span className="ml-2 text-slate-400 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-black rounded-2xl shadow-liquid-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold ml-1 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Or continue with voice
            </p>
            <button
              type="button"
              onClick={() => startVoiceInput('all')}
              className="w-full btn-secondary py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-white/10 hover:border-amber-400/40 text-slate-200 font-extrabold text-sm transition-all"
            >
              {isListening ? <MicOff className="w-5 h-5 text-amber-400 animate-pulse" /> : <Mic className="w-5 h-5 text-amber-400" />}
              <span>{isListening ? 'Listening...' : 'Voice Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
