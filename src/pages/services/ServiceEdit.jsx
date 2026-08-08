import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { getServiceById, updateService } from '../../api/servicesApi'
import { useToast }   from '../../components/ui/Toast'
import CategorySelect from '../../components/ui/CategorySelect'

export default function ServiceEdit() {
  const { institutionId, departmentId, id } = useParams()
  const [form, setForm]       = useState({ categoryId: '', name: '', description: '', durationMinutes: 30 })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]     = useState(null)
  const navigate              = useNavigate()
  const { addToast }          = useToast()

  useEffect(() => {
    getServiceById(id)
      .then(r => {
        const s = r.data
        setForm({
          categoryId:      s.categoryId,
          name:            s.name,
          description:     s.description ?? '',
          durationMinutes: s.durationMinutes,
        })
      })
      .catch(() => setError('Shërbimi nuk u gjet.'))
      .finally(() => setFetching(false))
  }, [id])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleDuration = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val)) setForm(f => ({ ...f, durationMinutes: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await updateService(id, { ...form, durationMinutes: Number(form.durationMinutes) })
      addToast('Shërbimi u përditësua me sukses!')
      navigate(`/institutions/${institutionId}/departments/${departmentId}/services`)
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
      Duke ngarkuar...
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/institutions/${institutionId}/departments/${departmentId}/services`)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edito Shërbimin</h1>
          <p className="text-slate-500 text-sm">Ndrysho të dhënat e shërbimit</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 space-y-5">
        <CategorySelect value={form.categoryId} onChange={set('categoryId')} required />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri *</label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Përshkrimi</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Kohëzgjatja: <span className="text-blue-600 font-semibold">{form.durationMinutes} min</span>
          </label>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={form.durationMinutes}
            onChange={handleDuration}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>5 min</span>
            <span>120 min</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/institutions/${institutionId}/departments/${departmentId}/services`)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Anulo
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Ruaj Ndryshimet
          </button>
        </div>
      </form>
    </div>
  )
}
