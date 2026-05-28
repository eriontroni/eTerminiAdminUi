import { useState, useEffect } from 'react'
import { getDepartmentsByInstitution } from '../../api/departmentsApi'

export default function DepartmentSelect({ institutionId, value, onChange, required }) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    if (!institutionId) { setDepartments([]); return }
    setLoading(true)
    getDepartmentsByInstitution(institutionId)
      .then(r => setDepartments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [institutionId])

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Departamenti {required && '*'}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={!institutionId || loading}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-60"
      >
        <option value="">
          {!institutionId ? '— Zgjidh institucionin së pari —' : loading ? 'Duke ngarkuar...' : '— Zgjidh departamentin —'}
        </option>
        {departments.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  )
}
