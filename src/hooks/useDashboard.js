import { useState, useEffect } from 'react'
import { getDashboardStats, getActiveAppointments } from '../api/dashboardApi'

export function useDashboard() {
  const [stats, setStats]                   = useState(null)
  const [activeAppointments, setActiveApps] = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          getDashboardStats(),
          getActiveAppointments(),
        ])
        setStats(statsRes.data)
        setActiveApps(appsRes.data)
      } catch (err) {
        setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { stats, activeAppointments, loading, error }
}
