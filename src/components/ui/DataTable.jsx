import LoadingSpinner from './LoadingSpinner'

export default function DataTable({ columns, data, loading, emptyMessage = 'Nuk ka të dhëna.' }) {
  if (loading) return <LoadingSpinner />

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 shadow-[4px_4px_0_#d8d1c5]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#ebe6dc] border-b border-slate-200">
            {columns.map(col => (
              <th key={col.key} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, i) => (
            <tr key={row.id ?? i} className="bg-white hover:bg-[#f0ece4] transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-5 py-4 text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
