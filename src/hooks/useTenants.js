import { useState, useEffect, useCallback } from 'react'
import { getTenants, createTenant, deleteTenant } from '../api/tenantsApi'

export function useTenants() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenants()
      .then(r => setTenants(r.data.filter(t => t.isActive)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { tenants, loading }
}

export function useTenantsAdmin() {
  const [tenants, setTenants]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    getTenants()
      .then(r => { setTenants(r.data); setError(null) })
      .catch(e => setError(e.response?.data?.message ?? e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (dto) => {
    const r = await createTenant(dto)
    setTenants(prev => [...prev, r.data].sort((a, b) => a.name.localeCompare(b.name)))
    return r.data
  }, [])

  const remove = useCallback(async (id) => {
    await deleteTenant(id)
    setTenants(prev => prev.filter(t => t.id !== id))
  }, [])

  return { tenants, loading, error, create, remove }
}
