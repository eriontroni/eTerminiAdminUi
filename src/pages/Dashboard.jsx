import { Building2, Users, Calendar, UserCheck, Clock } from 'lucide-react'
import StatCard      from '../components/ui/StatCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useDashboard } from '../hooks/useDashboard'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('sq-AL', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

const statusClass = {
  'Konfirmuar': 'bg-emerald-50 text-emerald-700',
  'Në pritje':  'bg-amber-50  text-amber-700',
}

export default function Dashboard() {
  const { stats, activeAppointments, loading, error } = useDashboard()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Pasqyrë e sistemit eTermini</p>
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard icon={Building2}  label="Institucionet"         value={stats.institutionCount}  accent="blue" />
            <StatCard icon={Users}      label="Punëtorët"             value={stats.workerCount}       accent="indigo" />
            <StatCard icon={Calendar}   label="Terminet Gjithsej"     value={stats.appointmentCount}  accent="violet" />
            <StatCard icon={UserCheck}  label="Përdorues Aktivë"      value={stats.activeUserCount}   accent="emerald" trend={`${stats.todayAppointments} sot`} />
          </div>

          {/* Terminet aktive */}
          <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Terminet Aktive
              </h2>
              {activeAppointments.length > 0 && (
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  {activeAppointments.length}
                </span>
              )}
            </div>
            {activeAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Pacienti</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Mjeku</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Statusi</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Shënime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeAppointments.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-900">{a.patientName}</td>
                        <td className="px-6 py-3 text-slate-600">{a.doctorName ?? '—'}</td>
                        <td className="px-6 py-3 text-slate-500">
                          {a.appointmentDate ? formatDate(a.appointmentDate) : '—'}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClass[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-400 max-w-xs truncate">{a.notes ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">Nuk ka termine aktive.</div>
            )}
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Aktiviteti i Fundit</h2>
            </div>
            {stats.recentActivity?.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentActivity.map((a, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{a.action}</p>
                      <p className="text-xs text-slate-400">{a.entity}{a.entityId ? ` · ${a.entityId}` : ''}</p>
                    </div>
                    <time className="text-xs text-slate-400 shrink-0">{formatDate(a.at)}</time>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">Nuk ka aktivitet të fundit.</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
