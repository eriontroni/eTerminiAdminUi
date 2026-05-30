import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Power, ShieldCheck, UserCog } from 'lucide-react'
import DataTable     from '../../components/ui/DataTable'
import StatusBadge   from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useAdministrators } from '../../hooks/useAdministrators'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { PERMISSIONS } from '../../lib/permissions'

export default function AdministratorsList() {
  const { admins, loading, error, toggle } = useAdministrators()
  const { hasPermission } = useAuth()
  const [confirm, setConfirm]   = useState(null)
  const [toggling, setToggling] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const canCreate = hasPermission(PERMISSIONS.administrators.createUpdate)

  const handleToggle = async () => {
    setToggling(true)
    try {
      await toggle(confirm.id)
      addToast('Statusi u përditësua me sukses.')
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message, 'error')
    } finally {
      setToggling(false)
      setConfirm(null)
    }
  }

  const columns = [
    {
      key: 'fullName', label: 'Emri',
      render: r => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <UserCog className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="font-semibold text-slate-900">{r.fullName}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email', render: r => <span className="text-slate-500 text-xs">{r.email}</span> },
    {
      key: 'roleName', label: 'Roli',
      render: r => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${r.isSuperAdmin ? 'text-violet-700 bg-violet-50 border-violet-200' : 'text-indigo-700 bg-indigo-50 border-indigo-200'}`}>
          {r.isSuperAdmin && <ShieldCheck className="w-3 h-3" />}
          {r.roleName}
        </span>
      )
    },
    { key: 'isActive', label: 'Statusi', render: r => <StatusBadge active={r.isActive} /> },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex justify-end">
          <button
            onClick={() => setConfirm(r)}
            disabled={r.isSuperAdmin || !canCreate}
            className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${r.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
            title={r.isSuperAdmin ? 'SuperAdmin nuk çaktivizohet' : (r.isActive ? 'Çaktivizo' : 'Aktivizo')}
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
          <h1 className="text-2xl font-bold text-slate-900">Administratorët</h1>
          <p className="text-slate-500 text-sm mt-1">{admins.length} administratorë gjithsej</p>
        </div>
        {canCreate && (
          <button
            onClick={() => navigate('/administrators/create')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Shto Administrator
          </button>
        )}
      </div>

      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <DataTable columns={columns} data={admins} loading={loading} emptyMessage="Nuk u gjet asnjë administrator." />

      {confirm && (
        <ConfirmDialog
          title={confirm.isActive ? 'Çaktivizo Administratorin' : 'Aktivizo Administratorin'}
          message={`A jeni i sigurt për "${confirm.fullName}"?`}
          onConfirm={handleToggle}
          onCancel={() => setConfirm(null)}
          loading={toggling}
        />
      )}
    </div>
  )
}
