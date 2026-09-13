import { useCallback, useEffect, useState } from 'react'
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  toggleInstitution,
  deleteInstitution,
} from '../api/institutionsApi'

export function useInstitutions() {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getInstitutions()
      setInstitutions(res.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getInstitutions()
        if (!cancelled) setInstitutions(res.data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  const create = useCallback(async (data) => {
    const res = await createInstitution(data)
    setInstitutions(prev => [...prev, res.data])
    return res.data
  }, [])

  const update = useCallback(async (id, data) => {
    const res = await updateInstitution(id, data)
    setInstitutions(prev => prev.map(i => i.id === id ? res.data : i))
    return res.data
  }, [])

  const toggle = useCallback(async (id) => {
    const res = await toggleInstitution(id)
    setInstitutions(prev => prev.map(i => i.id === id ? res.data : i))
    return res.data
  }, [])

  const remove = useCallback(async (id) => {
    await deleteInstitution(id)
    setInstitutions(prev => prev.filter(i => i.id !== id))
  }, [])

  return { institutions, loading, error, fetch: load, create, update, toggle, remove }
}
