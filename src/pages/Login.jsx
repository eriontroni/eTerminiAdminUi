import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fffdf8] border border-[#d8d1c5] p-8 sm:p-10 shadow-[7px_7px_0_#d8d1c5]">
      {/* Header */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-[#c9473d] flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-semibold text-[#17212b] mb-1">Hyrje administrative</h2>
        <p className="text-[#5d6870] text-sm">Qasja e kufizuar vetëm për ekipin administrues</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#46535b] mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            placeholder="admin@example.com"
            className="w-full px-4 py-3 rounded-xl bg-[#f5f2eb] border border-[#d8d1c5] text-[#17212b] placeholder-[#8d989c] focus:outline-none focus:ring-2 focus:ring-[#c9473d]/20 focus:border-[#c9473d] transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#46535b] mb-1.5">Fjalëkalimi</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 rounded-xl bg-[#f5f2eb] border border-[#d8d1c5] text-[#17212b] placeholder-[#8d989c] focus:outline-none focus:ring-2 focus:ring-[#c9473d]/20 focus:border-[#c9473d] transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d989c] hover:text-[#17212b] transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-6 rounded-xl bg-[#c9473d] hover:bg-[#9e302b] text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Hyr në sistem
            </>
          )}
        </button>
      </form>
    </div>
  )
}
