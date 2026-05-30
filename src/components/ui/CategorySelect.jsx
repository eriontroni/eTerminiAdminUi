import { useState, useEffect } from 'react'
import { getCategories } from '../../api/categoriesApi'

export default function CategorySelect({ value, onChange, required }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    setLoading(true)
    getCategories()
      .then(r => setCategories(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Kategoria {required && '*'}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={loading}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-60"
      >
        <option value="">
          {loading ? 'Duke ngarkuar...' : '— Zgjidh kategorinë —'}
        </option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
