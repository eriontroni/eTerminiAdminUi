import { useState, useEffect } from 'react'
import { FileText, Users } from 'lucide-react'
import DataTable   from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import { getSystemLogs, getSystemUsers } from '../../api/systemApi'

const ROLE_COLORS = {
  SuperAdmin:       'text-violet-700 bg-violet-50 border-violet-200',
  InstitutionAdmin: 'text-blue-700 bg-blue-50 border-blue-200',
  Staff:            'text-indigo-700 bg-indigo-50 border-indigo-200',
  Citizen:          'text-slate-600 bg-slate-50 border-slate-200',
}

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_COLORS[role] ?? ROLE_COLORS.Citizen}`}>
      {role}
    </span>
  )
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('sq-AL', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function SystemAdmin() {
  const [tab, setTab]     = useState('logs')
  const [logs, setLogs]   = useState([])
  const [users, setUsers] = useState([])
  const [loadingLogs, setLoadingLogs]   = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (tab === 'logs' && logs.length === 0) {
      setLoadingLogs(true)
      getSystemLogs()
        .then(r => setLogs(r.data))
        .catch(() => setError('Gabim gjatë ngarkimit të logs.'))
        .finally(() => setLoadingLogs(false))
    }
    if (tab === 'users' && users.length === 0) {
      setLoadingUsers(true)
      getSystemUsers()
        .then(r => setUsers(r.data))
        .catch(() => setError('Gabim gjatë ngarkimit të përdoruesve.'))
        .finally(() => setLoadingUsers(false))
    }
  }, [tab])

  const logColumns = [
    { key: 'action',     label: 'Aksioni',    render: r => <span className="font-medium text-slate-800">{r.action}</span> },
    { key: 'entityName', label: 'Entiteti' },
    { key: 'entityId',   label: 'ID',         render: r => <span className="text-xs text-slate-400 font-mono">{r.entityId ?? '—'}</span> },
    { key: 'ipAddress',  label: 'IP',         render: r => <span className="text-xs text-slate-400">{r.ipAddress ?? '—'}</span> },
    { key: 'createdAt',  label: 'Data',       render: r => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ]

  const userColumns = [
    { key: 'fullName',  label: 'Emri',      render: r => <span className="font-semibold text-slate-900">{r.fullName}</span> },
    { key: 'email',     label: 'Email',     render: r => <span className="text-slate-500 text-xs">{r.email}</span> },
    { key: 'role',      label: 'Roli',      render: r => <RoleBadge role={r.role} /> },
    { key: 'isActive',  label: 'Statusi',   render: r => <StatusBadge active={r.isActive} /> },
    { key: 'createdAt', label: 'Regjistruar', render: r => <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrimi i Sistemit</h1>
        <p className="text-slate-500 text-sm mt-1">Logs dhe menaxhim i përdoruesve</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 w-fit">
        {[
          { key: 'logs',  icon: FileText, label: 'Audit Logs' },
          { key: 'users', icon: Users,    label: 'Përdoruesit' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setError(null) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === key
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {tab === 'logs'  && <DataTable columns={logColumns}  data={logs}  loading={loadingLogs}  emptyMessage="Nuk ka audit logs." />}
      {tab === 'users' && <DataTable columns={userColumns} data={users} loading={loadingUsers} emptyMessage="Nuk ka përdorues." />}
    </div>
  )
}
