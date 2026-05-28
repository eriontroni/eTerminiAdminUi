import { useState, useEffect } from 'react'
import { getInstitutions } from '../../api/institutionsApi'

export default function InstitutionSelect({ tenantId, value, onChange, required }) {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading]           = useState(false)

  useEffect(() => {
    if (!tenantId) { setInstitutions([]); return }
    setLoading(true)
    getInstitutions()
      .then(r => setInstitutions(r.data.filter(i => i.tenantId === tenantId && i.isActive)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tenantId])

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Institucioni {required && '*'}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={!tenantId || loading}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-60"
      >
        <option value="">
          {!tenantId ? '— Zgjidh komunën së pari —' : loading ? 'Duke ngarkuar...' : '— Zgjidh institucionin —'}
        </option>
        {institutions.map(i => (
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
      </select>
    </div>
  )
}
