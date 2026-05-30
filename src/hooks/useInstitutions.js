import { useState, useEffect } from 'react'
import { getInstitutions, createInstitution, updateInstitution, toggleInstitution, deleteInstitution } from '../api/institutionsApi'

export function useInstitutions() {
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetch = async () => {
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
  }

  useEffect(() => { fetch() }, [])

  const create = async (data) => {
    const res = await createInstitution(data)
    setInstitutions(prev => [...prev, res.data])
    return res.data
  }

  const update = async (id, data) => {
    const res = await updateInstitution(id, data)
    setInstitutions(prev => prev.map(i => i.id === id ? res.data : i))
    return res.data
  }

  const toggle = async (id) => {
    const res = await toggleInstitution(id)
    setInstitutions(prev => prev.map(i => i.id === id ? res.data : i))
    return res.data
  }

  const remove = async (id) => {
    await deleteInstitution(id)
    setInstitutions(prev => prev.filter(i => i.id !== id))
  }

  return { institutions, loading, error, fetch, create, update, toggle, remove }
}
