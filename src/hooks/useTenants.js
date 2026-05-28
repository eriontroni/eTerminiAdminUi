import { useState, useEffect } from 'react'
import { getTenants } from '../api/tenantsApi'

export function useTenants() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenants()
      .then(r => setTenants(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { tenants, loading }
}
