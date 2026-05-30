import { useState } from 'react'
import { Plus, Trash2, Search, MapPin, X, Save } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useTenantsAdmin } from '../../hooks/useTenants'
import { useToast } from '../../components/ui/Toast'

export default function TenantsList() {
  const { tenants, loading, error, create, remove } = useTenantsAdmin()
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [confirm, setConfirm]     = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const { addToast } = useToast()

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await remove(confirm.id)
      addToast(`Qyteti "${confirm.name}" u fshi me sukses.`)
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setDeleting(false)
      setConfirm(null)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Emri',
      render: r => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="font-semibold text-slate-900">{r.name}</span>
        </div>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      render: r => <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{r.slug}</span>
    },
    {
      key: 'actions',
      label: '',
      render: r => (
        <div className="flex justify-end">
          <button
            onClick={() => setConfirm(r)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Fshi qytetin"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Qytetet</h1>
          <p className="text-slate-500 text-sm mt-1">{tenants.length} qytete gjithsej</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Shto Qytet
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko sipas emrit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
        />
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Nuk u gjet asnjë qytet."
      />

      {confirm && (
        <ConfirmDialog
          title="Fshi Qytetin"
          message={`A jeni i sigurt që dëshironi të fshini qytetin "${confirm.name}"? Ky veprim nuk mund të kthehet.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
          loading={deleting}
        />
      )}

      {showModal && (
        <AddTenantModal
          onSave={async (name) => {
            await create({ name })
            addToast(`Qyteti "${name}" u shtua me sukses!`)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

function AddTenantModal({ onSave, onClose }) {
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onSave(name.trim())
    } catch (err) {
      setError(err.response?.data?.message ?? err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md ring-1 ring-slate-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Shto Qytet</h2>
            <p className="text-slate-500 text-sm">Vendos emrin e qytetit të ri</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Emri i Qytetit *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              placeholder="p.sh. Prishtinë"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Anulo
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Save className="w-4 h-4" />
              }
              Ruaj
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
