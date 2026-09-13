import { useCallback, useEffect, useState } from 'react'
import { getTenants, createTenant, deleteTenant } from '../api/tenantsApi'

export function useTenants() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getTenants()
      .then(r => { if (!cancelled) setTenants(r.data.filter(t => t.isActive)) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { tenants, loading }
}

export function useTenantsAdmin() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await getTenants()
      setTenants(r.data)
      setError(null)
    } catch (e) {
      setError(e.response?.data?.message ?? e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await getTenants()
        if (!cancelled) { setTenants(r.data); setError(null) }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message ?? e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const create = useCallback(async (dto) => {
    const r = await createTenant(dto)
    setTenants(prev => [...prev, r.data].sort((a, b) => a.name.localeCompare(b.name)))
    return r.data
  }, [])

  const remove = useCallback(async (id) => {
    await deleteTenant(id)
    setTenants(prev => prev.filter(t => t.id !== id))
  }, [])

  return { tenants, loading, error, reload: load, create, remove }
}
