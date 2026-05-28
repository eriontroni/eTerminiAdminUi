import { useState, useEffect } from 'react'
import { getDashboardStats } from '../api/dashboardApi'

export function useDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboardStats()
        setStats(res.data)
      } catch (err) {
        setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { stats, loading, error }
}
