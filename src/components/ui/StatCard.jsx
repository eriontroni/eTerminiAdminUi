export default function StatCard({ icon: Icon, label, value, accent = 'blue', trend }) {
  const accents = {
    blue:    { ring: 'ring-blue-200',    bg: 'bg-blue-50',    text: 'text-blue-600',    grad: 'from-blue-500 to-indigo-600' },
    indigo:  { ring: 'ring-indigo-200',  bg: 'bg-indigo-50',  text: 'text-indigo-600',  grad: 'from-indigo-500 to-violet-600' },
    violet:  { ring: 'ring-violet-200',  bg: 'bg-violet-50',  text: 'text-violet-600',  grad: 'from-violet-500 to-purple-600' },
    emerald: { ring: 'ring-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-600', grad: 'from-emerald-500 to-teal-600' },
  }
  const c = accents[accent] ?? accents.blue

  return (
    <div className={`bg-white rounded-3xl p-6 ring-1 ${c.ring} shadow-sm hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.grad} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value ?? '—'}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      {trend && <p className="text-xs text-emerald-600 font-semibold mt-2">{trend}</p>}
    </div>
  )
}
