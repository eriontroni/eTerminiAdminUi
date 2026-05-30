import { useState, useEffect, useCallback } from 'react'
import { getRoles, deleteRole } from '../api/rolesApi'

export function useRoles() {
  const [roles, setRoles]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getRoles()
      setRoles(res.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit të roleve.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const remove = useCallback(async (id) => {
    await deleteRole(id)
    setRoles(prev => prev.filter(r => r.id !== id))
  }, [])

  return { roles, loading, error, fetch, remove }
}
