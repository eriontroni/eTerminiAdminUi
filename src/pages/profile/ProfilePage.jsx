import { useState } from 'react'
import { KeyRound, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react'
import { changePassword } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function ProfilePage() {
  const { user }          = useAuth()
  const { addToast }      = useToast()
  const [form, setForm]   = useState(emptyForm)
  const [show, setShow]   = useState({ current: false, next: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const toggleShow = (key) => setShow(s => ({ ...s, [key]: !s[key] }))

  const initials = user?.fullName
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'SA'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setError('Fjalëkalimi i ri dhe konfirmimi nuk përputhen.')
      return
    }
    if (form.newPassword.length < 6) {
      setError('Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      })
      addToast(res.data.message)
      setForm(emptyForm)
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profili Im</h1>
        <p className="text-slate-500 text-sm mt-1">Menaxho të dhënat e llogarisë</p>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-slate-900 font-semibold text-base">{user?.fullName}</p>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wide">SuperAdmin</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">Ndrysho Fjalëkalimin</h2>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            label="Fjalëkalimi Aktual *"
            value={form.currentPassword}
            onChange={set('currentPassword')}
            show={show.current}
            onToggle={() => toggleShow('current')}
            required
          />
          <PasswordField
            label="Fjalëkalimi i Ri *"
            value={form.newPassword}
            onChange={set('newPassword')}
            show={show.next}
            onToggle={() => toggleShow('next')}
            required
          />
          <PasswordField
            label="Konfirmo Fjalëkalimin e Ri *"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            show={show.confirm}
            onToggle={() => toggleShow('confirm')}
            required
          />

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Save className="w-4 h-4" />
              }
              Ruaj Fjalëkalimin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PasswordField({ label, value, onChange, show, onToggle, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
