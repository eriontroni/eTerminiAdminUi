import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { createWorker } from '../../api/workersApi'
import TenantSelect      from '../../components/ui/TenantSelect'
import InstitutionSelect from '../../components/ui/InstitutionSelect'
import DepartmentSelect  from '../../components/ui/DepartmentSelect'
import { useToast } from '../../components/ui/Toast'

const emptyForm = {
  firstName: '', lastName: '', email: '', password: '',
  phoneNumber: '', title: '', tenantId: '', institutionId: '', departmentId: ''
}

export default function WorkerCreate() {
  const [form, setForm]       = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const navigate              = useNavigate()
  const { addToast }          = useToast()

  const set = (key) => (e) => {
    const value = e.target.value
    setForm(f => {
      if (key === 'tenantId')      return { ...f, tenantId: value, institutionId: '', departmentId: '' }
      if (key === 'institutionId') return { ...f, institutionId: value, departmentId: '' }
      return { ...f, [key]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { institutionId, ...payload } = form
      await createWorker(payload)
      addToast('Punëtori u shtua me sukses!')
      navigate('/workers')
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/workers')} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shto Punëtor</h1>
          <p className="text-slate-500 text-sm">Regjistro anëtar të ri të stafit</p>
        </div>
      </div>

      {error && <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Emri *"    value={form.firstName} onChange={set('firstName')} required placeholder="Ardian" />
          <Field label="Mbiemri *" value={form.lastName}  onChange={set('lastName')}  required placeholder="Berisha" />
        </div>
        <Field label="Email *"        value={form.email}       onChange={set('email')}       required type="email"    placeholder="ardian@klinika.com" />
        <Field label="Fjalëkalimi *"  value={form.password}    onChange={set('password')}    required type="password" placeholder="Min. 6 karaktere" />
        <Field label="Telefoni"       value={form.phoneNumber} onChange={set('phoneNumber')}           placeholder="+383 44 000 000" />
        <Field label="Titulli *"      value={form.title}       onChange={set('title')}       required  placeholder="Mjek Specialist, Infermier..." />

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Vendosja në Sistem</p>
          <div className="space-y-4">
            <TenantSelect
              value={form.tenantId}
              onChange={set('tenantId')}
              required
            />
            <InstitutionSelect
              tenantId={form.tenantId}
              value={form.institutionId}
              onChange={set('institutionId')}
              required
            />
            <DepartmentSelect
              institutionId={form.institutionId}
              value={form.departmentId}
              onChange={set('departmentId')}
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/workers')} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Anulo
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:from-blue-500 hover:to-indigo-500 transition-all">
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
