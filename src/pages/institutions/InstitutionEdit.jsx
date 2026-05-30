import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, MapPin } from 'lucide-react'
import { getInstitution, updateInstitution } from '../../api/institutionsApi'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useToast } from '../../components/ui/Toast'
import CategorySelect from '../../components/ui/CategorySelect'

export default function InstitutionEdit() {
  const { id }            = useParams()
  const navigate          = useNavigate()
  const { addToast }      = useToast()
  const [form, setForm]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getInstitution(id)
      .then(res => setForm({
        tenantId:    res.data.tenantId,
        categoryId:  res.data.categoryId ?? '',
        name:        res.data.name,
        description: res.data.description ?? '',
        city:        res.data.city,
        address:     res.data.address ?? '',
        phoneNumber: res.data.phoneNumber ?? '',
        email:       res.data.email ?? '',
      }))
      .catch(() => setError('Institucioni nuk u gjet.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateInstitution(id, form)
      addToast('Institucioni u përditësua me sukses!')
      navigate('/institutions')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/institutions')} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edito Institucionin</h1>
          <p className="text-slate-500 text-sm">Ndrysho të dhënat e institucionit</p>
        </div>
      </div>

      {error && <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Komuna</label>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            {form.city}
          </div>
        </div>

        <CategorySelect
          value={form.categoryId}
          onChange={set('categoryId')}
          required
        />

        <Field label="Emri *" value={form.name} onChange={set('name')} required />
        <Field label="Përshkrimi" value={form.description} onChange={set('description')} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Adresa" value={form.address} onChange={set('address')} />
          <Field label="Telefoni" value={form.phoneNumber} onChange={set('phoneNumber')} />
        </div>
        <Field label="Email" value={form.email} onChange={set('email')} type="email" />

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/institutions')} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Anulo
          </button>
          <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:from-blue-500 hover:to-indigo-500">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Ruaj Ndryshimet
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, required, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
      />
    </div>
  )
}
