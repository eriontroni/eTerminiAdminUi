import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ShieldCheck, Lock } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useRoles } from '../../hooks/useRoles'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { PERMISSIONS } from '../../lib/permissions'

export default function RolesList() {
  const { roles, loading, error, remove } = useRoles()
  const { hasPermission } = useAuth()
  const [confirm, setConfirm]   = useState(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const canCreate = hasPermission(PERMISSIONS.administrators.createUpdate)
  const canDelete = hasPermission(PERMISSIONS.administrators.delete)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await remove(confirm.id)
      addToast(`Roli "${confirm.name}" u fshi me sukses.`)
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setDeleting(false)
      setConfirm(null)
    }
  }

  const columns = [
    {
      key: 'name', label: 'Emri i rolit',
      render: r => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span className="font-semibold text-slate-900">{r.name}</span>
          {r.isSystem && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
              <Lock className="w-2.5 h-2.5" /> Sistem
            </span>
          )}
        </div>
      )
    },
    { key: 'description', label: 'Përshkrimi', render: r => <span className="text-slate-500">{r.description || '—'}</span> },
    { key: 'permissions', label: 'Leje', render: r => <span className="text-slate-500">{r.isSystem ? 'Të gjitha' : `${r.permissions.length}`}</span> },
    { key: 'adminCount', label: 'Administratorë', render: r => <span className="text-slate-500">{r.adminCount}</span> },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => navigate(`/roles/${r.id}/edit`)}
            disabled={r.isSystem || !canCreate}
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            title={r.isSystem ? 'Rolet e sistemit nuk editohen' : 'Edito'}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirm(r)}
            disabled={r.isSystem || !canDelete}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
            title={r.isSystem ? 'Rolet e sistemit nuk fshihen' : 'Fshi'}
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
          <h1 className="text-2xl font-bold text-slate-900">Menaxhimi i Roleve</h1>
          <p className="text-slate-500 text-sm mt-1">{roles.length} role gjithsej</p>
        </div>
        {canCreate && (
          <button
            onClick={() => navigate('/roles/create')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Shto Rol
          </button>
        )}
      </div>

      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <DataTable columns={columns} data={roles} loading={loading} emptyMessage="Nuk u gjet asnjë rol." />

      {confirm && (
        <ConfirmDialog
          title="Fshi Rolin"
          message={`A jeni i sigurt që dëshironi të fshini rolin "${confirm.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
