import { useTenants } from '../../hooks/useTenants'

export default function TenantSelect({ value, onChange, required }) {
  const { tenants, loading } = useTenants()

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Tenant (Komuna) {required && '*'}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={loading}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-60"
      >
        <option value="">
          {loading ? 'Duke ngarkuar...' : '— Zgjidh komunën —'}
        </option>
        {tenants.map(t => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  )
}
