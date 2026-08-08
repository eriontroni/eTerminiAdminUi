import { useCallback, useEffect, useState } from 'react'
import {
  getServicesByInstitution,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
} from '../api/servicesApi'

export function useServices(institutionId, includeInactive = false) {
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const load = useCallback(async () => {
    if (!institutionId) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await getServicesByInstitution(institutionId, includeInactive)
      setServices(data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Ngarkimi dështoi.')
    } finally {
      setLoading(false)
    }
  }, [institutionId, includeInactive])

  useEffect(() => { load() }, [load])

  const create = async (dto) => {
    const { data } = await createService(dto)
    setServices(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }

  const update = async (id, dto) => {
    const { data } = await updateService(id, dto)
    setServices(prev => prev.map(s => s.id === id ? data : s))
    return data
  }

  const remove = async (id) => {
    await deleteService(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  const toggle = async (id) => {
    const { data } = await toggleServiceActive(id)
    setServices(prev => prev.map(s => s.id === id ? data : s))
    return data
  }

  return { services, loading, error, create, update, remove, toggle, reload: load }
}
