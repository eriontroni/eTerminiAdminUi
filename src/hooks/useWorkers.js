import { useState, useEffect } from 'react'
import { getWorkers, createWorker, updateWorker, toggleWorker, assignInstitution } from '../api/workersApi'

export function useWorkers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = async () => {
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
  }

  useEffect(() => { fetch() }, [])

  const create = async (data) => {
    const res = await createWorker(data)
    setWorkers(prev => [...prev, res.data])
    return res.data
  }

  const update = async (id, data) => {
    const res = await updateWorker(id, data)
    setWorkers(prev => prev.map(w => w.id === id ? res.data : w))
    return res.data
  }

  const toggle = async (id) => {
    const res = await toggleWorker(id)
    setWorkers(prev => prev.map(w => w.id === id ? res.data : w))
    return res.data
  }

  const assign = async (id, data) => {
    const res = await assignInstitution(id, data)
    setWorkers(prev => prev.map(w => w.id === id ? res.data : w))
    return res.data
  }

  return { workers, loading, error, fetch, create, update, toggle, assign }
}
