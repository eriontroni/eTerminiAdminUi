import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { createInstitution } from '../../api/institutionsApi'
import { useTenants } from '../../hooks/useTenants'
import { useToast } from '../../components/ui/Toast'
import CategorySelect from '../../components/ui/CategorySelect'

const emptyForm = { tenantId: '', categoryId: '', name: '', description: '', city: '', address: '', phoneNumber: '', email: '' }

export default function InstitutionCreate() {
  const [form, setForm]       = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const navigate              = useNavigate()
  const { addToast }          = useToast()
  const { tenants, loading: tenantsLoading } = useTenants()

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleTenantChange = (e) => {
    const id     = e.target.value
    const tenant = tenants.find(t => t.id === id)
    setForm(f => ({ ...f, tenantId: id, city: tenant?.name ?? '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createInstitution(form)
      addToast('Institucioni u krijua me sukses!')
      navigate('/institutions')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/institutions')} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shto Institucion</h1>
          <p className="text-slate-500 text-sm">Plotëso të dhënat e institucionit të ri</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Komuna *</label>
          <select
            value={form.tenantId}
            onChange={handleTenantChange}
            required
            disabled={tenantsLoading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-60"
          >
            <option value="">
              {tenantsLoading ? 'Duke ngarkuar...' : '— Zgjidh komunën —'}
            </option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <CategorySelect
          value={form.categoryId}
          onChange={set('categoryId')}
          required
        />

        <Field label="Emri *" value={form.name} onChange={set('name')} required placeholder="Klinika Universitare" />
        <Field label="Përshkrimi" value={form.description} onChange={set('description')} placeholder="Përshkrim i shkurtër" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Adresa" value={form.address} onChange={set('address')} placeholder="Rr. Nënë Tereza" />
          <Field label="Telefoni" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+383 44 000 000" />
        </div>
        <Field label="Email" value={form.email} onChange={set('email')} type="email" placeholder="info@institucioni.com" />

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/institutions')} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
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
