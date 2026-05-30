import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useDepartments } from '../../hooks/useDepartments'
import { useToast } from '../../components/ui/Toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function DepartmentEdit() {
  const { institutionId, id } = useParams()
  const { departments, loading: depsLoading, update } = useDepartments(institutionId)
  const [name, setName]           = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const navigate                  = useNavigate()
  const { addToast }              = useToast()

  useEffect(() => {
    if (depsLoading) return
    const dept = departments.find(d => d.id === id)
    if (dept) {
      setName(dept.name)
      setDescription(dept.description ?? '')
    } else {
      setError('Departamenti nuk u gjet.')
    }
  }, [departments, depsLoading, id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Emri i departamentit është i detyrueshëm.'); return }
    setLoading(true)
    setError(null)
    try {
      await update(id, { name: name.trim(), description: description.trim() || undefined })
      addToast('Departamenti u përditësua me sukses!')
      navigate(`/institutions/${institutionId}/departments`)
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  if (depsLoading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/institutions/${institutionId}/departments`)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edito Departamentin</h1>
          <p className="text-slate-500 text-sm">Ndrysho të dhënat e departamentit</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="p.sh. Kirurgji, Pediatri..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Përshkrimi</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Përshkrim i shkurtër (opsional)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/institutions/${institutionId}/departments`)}
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
            Ruaj ndryshimet
          </button>
        </div>
      </form>
    </div>
  )
}
