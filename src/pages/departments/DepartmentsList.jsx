import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Search, Pencil, Power, Trash2, ArrowLeft } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import StatusBadge   from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useDepartments } from '../../hooks/useDepartments'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { PERMISSIONS } from '../../lib/permissions'
import { getInstitution } from '../../api/institutionsApi'

export default function DepartmentsList() {
  const { institutionId }         = useParams()
  const { departments, loading, error, toggle, remove } = useDepartments(institutionId)
  const [institutionName, setInstitutionName] = useState('')
  const [search, setSearch]       = useState('')
  const [confirmToggle, setConfirmToggle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [actioning, setActioning] = useState(false)
  const navigate                  = useNavigate()
  const { addToast }              = useToast()
  const { hasPermission }         = useAuth()

  useEffect(() => {
    getInstitution(institutionId)
      .then(r => setInstitutionName(r.data.name))
      .catch(() => {})
  }, [institutionId])

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async () => {
    setActioning(true)
    try {
      await toggle(confirmToggle.id)
      addToast(`Departamenti u ${confirmToggle.isActive ? 'çaktivizua' : 'aktivizua'} me sukses.`)
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setActioning(false)
      setConfirmToggle(null)
    }
  }

  const handleDelete = async () => {
    setActioning(true)
    try {
      await remove(confirmDelete.id)
      addToast('Departamenti u fshi me sukses.')
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setActioning(false)
      setConfirmDelete(null)
    }
  }

  const columns = [
    { key: 'name',        label: 'Emri',        render: r => <span className="font-semibold text-slate-900">{r.name}</span> },
    { key: 'description', label: 'Përshkrimi',  render: r => <span className="text-slate-500">{r.description ?? '—'}</span> },
    { key: 'isActive',    label: 'Statusi',      render: r => <StatusBadge active={r.isActive} /> },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex items-center gap-2 justify-end">
          {hasPermission(PERMISSIONS.departments.createUpdate) && (
            <>
              <button
                onClick={() => navigate(`/institutions/${institutionId}/departments/${r.id}/edit`)}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edito"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmToggle(r)}
                className={`p-2 rounded-lg transition-colors ${r.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                title={r.isActive ? 'Çaktivizo' : 'Aktivizo'}
              >
                <Power className="w-4 h-4" />
              </button>
            </>
          )}
          {hasPermission(PERMISSIONS.departments.delete) && (
            <button
              onClick={() => setConfirmDelete(r)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Fshi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/institutions')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Departamentet</h1>
            {institutionName && (
              <p className="text-slate-500 text-sm mt-0.5">{institutionName}</p>
            )}
          </div>
        </div>
        {hasPermission(PERMISSIONS.departments.createUpdate) && (
          <button
            onClick={() => navigate(`/institutions/${institutionId}/departments/create`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Shto Departament
          </button>
        )}
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
        emptyMessage="Nuk u gjet asnjë departament."
      />

      {confirmToggle && (
        <ConfirmDialog
          title={confirmToggle.isActive ? 'Çaktivizo Departamentin' : 'Aktivizo Departamentin'}
          message={`A jeni i sigurt që dëshironi të ${confirmToggle.isActive ? 'çaktivizoni' : 'aktivizoni'} departamentin "${confirmToggle.name}"?`}
          onConfirm={handleToggle}
          onCancel={() => setConfirmToggle(null)}
          loading={actioning}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Fshi Departamentin"
          message={`A jeni i sigurt që dëshironi të fshini departamentin "${confirmDelete.name}"? Ky veprim është i pakthyeshëm.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={actioning}
        />
      )}
    </div>
  )
}
