import { useState, useEffect } from 'react'
import { getDashboardStats, getActiveAppointments } from '../api/dashboardApi'

export function useDashboard() {
  const [stats, setStats]                   = useState(null)
  const [activeAppointments, setActiveApps] = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          getDashboardStats(),
          getActiveAppointments(),
        ])
        if (!cancelled) {
          setStats(statsRes.data)
          setActiveApps(appsRes.data)
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  return { stats, activeAppointments, loading, error }
}
