export default function StatCard({ icon: Icon, label, value, accent = 'blue', trend }) {
  const accents = {
    blue:    { ring: 'ring-[#d8d1c5]', bg: 'bg-[#ebe6dc]', text: 'text-[#9e302b]', icon: 'bg-[#c9473d]' },
    indigo:  { ring: 'ring-[#d8d1c5]', bg: 'bg-[#ebe6dc]', text: 'text-[#9e302b]', icon: 'bg-[#c9473d]' },
    violet:  { ring: 'ring-[#d8d1c5]', bg: 'bg-[#ebe6dc]', text: 'text-[#9e302b]', icon: 'bg-[#c9473d]' },
    emerald: { ring: 'ring-[#b7d3c4]', bg: 'bg-[#e7f0eb]', text: 'text-[#2e7358]', icon: 'bg-[#2e7358]' },
  }
  const c = accents[accent] ?? accents.blue

  return (
    <div className={`bg-white rounded-3xl p-6 ring-1 ${c.ring} shadow-[4px_4px_0_#d8d1c5]`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value ?? '—'}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      {trend && <p className="text-xs text-emerald-600 font-semibold mt-2">{trend}</p>}
    </div>
  )
}
