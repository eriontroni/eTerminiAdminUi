import { useCallback, useEffect, useState } from 'react'
import {
  getWorkers,
  createWorker,
  updateWorker,
  toggleWorker,
  assignInstitution,
  deleteWorker,
} from '../api/workersApi'

export function useWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getWorkers()
      setWorkers(res.data)
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
        const res = await getWorkers()
        if (!cancelled) setWorkers(res.data)
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
    const res = await createWorker(data)
    setWorkers(prev => [...prev, res.data])
    return res.data
  }, [])

  const update = useCallback(async (id, data) => {
    const res = await updateWorker(id, data)
    setWorkers(prev => prev.map(w => w.id === id ? res.data : w))
    return res.data
  }, [])

  const toggle = useCallback(async (id) => {
    const res = await toggleWorker(id)
    setWorkers(prev => prev.map(w => w.id === id ? res.data : w))
    return res.data
  }, [])

  const assign = useCallback(async (id, data) => {
    const res = await assignInstitution(id, data)
    setWorkers(prev => prev.map(w => w.id === id ? res.data : w))
    return res.data
  }, [])

  const remove = useCallback(async (id) => {
    await deleteWorker(id)
    setWorkers(prev => prev.filter(w => w.id !== id))
  }, [])

  return { workers, loading, error, fetch: load, create, update, toggle, assign, remove }
}
