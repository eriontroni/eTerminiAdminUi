import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Search, Pencil, Power, Trash2, ArrowLeft, Layers } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import StatusBadge   from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useServices }    from '../../hooks/useServices'
import { useToast }       from '../../components/ui/Toast'
import { useAuth }        from '../../context/AuthContext'
import { PERMISSIONS }    from '../../lib/permissions'
import { getInstitution } from '../../api/institutionsApi'
import { getDepartmentsByInstitution } from '../../api/departmentsApi'

export default function ServicesList() {
  const { institutionId, departmentId } = useParams()
  const { services, loading, error, toggle, remove } = useServices(departmentId)
  const [institutionName, setInstitutionName] = useState('')
  const [departmentName,  setDepartmentName]  = useState('')
  const [search, setSearch]           = useState('')
  const [confirmToggle, setConfirmToggle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [actioning, setActioning]     = useState(false)
  const navigate          = useNavigate()
  const { addToast }      = useToast()
  const { hasPermission } = useAuth()

  useEffect(() => {
    getInstitution(institutionId)
      .then(r => setInstitutionName(r.data.name))
      .catch(() => {})
    getDepartmentsByInstitution(institutionId)
      .then(r => {
        const dept = (r.data || []).find(d => d.id === departmentId)
        if (dept) setDepartmentName(dept.name)
      })
      .catch(() => {})
  }, [institutionId, departmentId])

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.categoryName.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async () => {
    setActioning(true)
    try {
      await toggle(confirmToggle.id)
      addToast(`Shërbimi u ${confirmToggle.isActive ? 'çaktivizua' : 'aktivizua'} me sukses.`)
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
      addToast('Shërbimi u fshi me sukses.')
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setActioning(false)
      setConfirmDelete(null)
    }
  }

  const columns = [
    {
      key: 'name', label: 'Emri',
      render: r => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-900">{r.name}</span>
        </div>
      ),
    },
    { key: 'categoryName',    label: 'Kategoria',     render: r => <span className="text-slate-600">{r.categoryName}</span> },
    { key: 'durationMinutes', label: 'Kohëzgjatja',   render: r => <span className="text-slate-500">{r.durationMinutes} min</span> },
    { key: 'isActive',        label: 'Statusi',        render: r => <StatusBadge active={r.isActive} /> },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex items-center gap-2 justify-end">
          {hasPermission(PERMISSIONS.services.createUpdate) && (
            <>
              <button
                onClick={() => navigate(`/institutions/${institutionId}/departments/${departmentId}/services/${r.id}/edit`)}
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
          {hasPermission(PERMISSIONS.services.delete) && (
            <button
              onClick={() => setConfirmDelete(r)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Fshi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/institutions/${institutionId}/departments`)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Shërbimet</h1>
            {(institutionName || departmentName) && (
              <p className="text-slate-500 text-sm mt-0.5">
                {[institutionName, departmentName].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
        {hasPermission(PERMISSIONS.services.createUpdate) && (
          <button
            onClick={() => navigate(`/institutions/${institutionId}/departments/${departmentId}/services/create`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Shto Shërbim
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko sipas emrit ose kategorisë..."
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
        emptyMessage="Nuk u gjet asnjë shërbim."
      />

      {confirmToggle && (
        <ConfirmDialog
          title={confirmToggle.isActive ? 'Çaktivizo Shërbimin' : 'Aktivizo Shërbimin'}
          message={`A jeni i sigurt që dëshironi të ${confirmToggle.isActive ? 'çaktivizoni' : 'aktivizoni'} shërbimin "${confirmToggle.name}"?`}
          onConfirm={handleToggle}
          onCancel={() => setConfirmToggle(null)}
          loading={actioning}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Fshi Shërbimin"
          message={`A jeni i sigurt që dëshironi të fshini shërbimin "${confirmDelete.name}"? Ky veprim është i pakthyeshëm.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={actioning}
        />
      )}
    </div>
  )
}
