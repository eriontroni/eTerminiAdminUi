import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Power } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import StatusBadge   from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useInstitutions } from '../../hooks/useInstitutions'
import { useToast } from '../../components/ui/Toast'

export default function InstitutionsList() {
  const { institutions, loading, error, toggle } = useInstitutions()
  const [search, setSearch]       = useState('')
  const [confirm, setConfirm]     = useState(null)
  const [toggling, setToggling]   = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const filtered = institutions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.city.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async () => {
    setToggling(true)
    try {
      await toggle(confirm.id)
      addToast(`Institucioni u ${confirm.isActive ? 'çaktivizua' : 'aktivizua'} me sukses.`)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setToggling(false)
      setConfirm(null)
    }
  }

  const columns = [
    { key: 'name',       label: 'Emri',         render: r => <span className="font-semibold text-slate-900">{r.name}</span> },
    { key: 'city',       label: 'Qyteti' },
    { key: 'branchCount',label: 'Degët',         render: r => <span className="text-slate-500">{r.branchCount}</span> },
    { key: 'workerCount',label: 'Punëtorët',     render: r => <span className="text-slate-500">{r.workerCount}</span> },
    { key: 'isActive',   label: 'Statusi',       render: r => <StatusBadge active={r.isActive} /> },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => navigate(`/institutions/${r.id}/edit`)}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edito"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirm(r)}
            className={`p-2 rounded-lg transition-colors ${r.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
            title={r.isActive ? 'Çaktivizo' : 'Aktivizo'}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institucionet</h1>
          <p className="text-slate-500 text-sm mt-1">{institutions.length} institucione gjithsej</p>
        </div>
        <button
          onClick={() => navigate('/institutions/create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Shto Institucion
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko sipas emrit ose qytetit..."
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
        emptyMessage="Nuk u gjet asnjë institucion."
      />

      {confirm && (
        <ConfirmDialog
          title={confirm.isActive ? 'Çaktivizo Institucionin' : 'Aktivizo Institucionin'}
          message={`A jeni i sigurt që dëshironi të ${confirm.isActive ? 'çaktivizoni' : 'aktivizoni'} institucionin "${confirm.name}"?`}
          onConfirm={handleToggle}
          onCancel={() => setConfirm(null)}
          loading={toggling}
        />
      )}
    </div>
  )
}
