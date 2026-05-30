import { useState, useEffect, useCallback } from 'react'
import { getAdministrators, toggleAdministrator } from '../api/administratorsApi'

export function useAdministrators() {
  const [admins, setAdmins]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAdministrators()
      setAdmins(res.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit të administratorëve.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const toggle = useCallback(async (id) => {
    await toggleAdministrator(id)
    await fetch()
  }, [fetch])

  return { admins, loading, error, fetch, toggle }
}
