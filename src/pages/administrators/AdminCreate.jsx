import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import { createAdministrator } from '../../api/administratorsApi'
import { useRoles } from '../../hooks/useRoles'
import { useToast } from '../../components/ui/Toast'

const emptyForm = { firstName: '', lastName: '', email: '', password: '', phoneNumber: '', roleId: '' }

export default function AdminCreate() {
  const [form, setForm]       = useState(emptyForm)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const navigate              = useNavigate()
  const { addToast }          = useToast()
  const { roles, loading: rolesLoading } = useRoles()

  const assignableRoles = roles.filter(r => !r.isSystem)
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createAdministrator(form)
      addToast('Administratori u krijua me sukses!')
      navigate('/administrators')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/administrators')} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shto Administrator</h1>
          <p className="text-slate-500 text-sm">Krijo një administrator dhe cakto rolin e tij</p>
        </div>
      </div>

      {error && <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Emri *" value={form.firstName} onChange={set('firstName')} required placeholder="Filan" />
          <Field label="Mbiemri *" value={form.lastName} onChange={set('lastName')} required placeholder="Fisteku" />
        </div>

        <Field label="Email *" value={form.email} onChange={set('email')} type="email" required placeholder="admin@etermini.com" />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Fjalëkalimi *</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              placeholder="Të paktën 6 karaktere"
              className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
            <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Field label="Telefoni" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+383 44 000 000" />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Roli *</label>
          <select
            value={form.roleId}
            onChange={set('roleId')}
            required
            disabled={rolesLoading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-60"
          >
            <option value="">{rolesLoading ? 'Duke ngarkuar...' : '— Zgjidh rolin —'}</option>
            {assignableRoles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {!rolesLoading && assignableRoles.length === 0 && (
            <p className="text-amber-600 text-xs mt-1.5">Nuk ka role të disponueshme. Krijo një rol te "Menaxhimi i Roleve" më parë.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/administrators')} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Anulo
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Ruaj
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, required, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
      />
    </div>
  )
}
