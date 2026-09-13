import { useCallback, useEffect, useState } from 'react'
import {
  getAdminDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentActive,
} from '../api/departmentsApi'

export function useDepartments(institutionId) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const load = useCallback(async () => {
    if (!institutionId) {
      setDepartments([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminDepartments(institutionId)
      setDepartments(res.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
    } finally {
      setLoading(false)
    }
  }, [institutionId])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!institutionId) {
        if (!cancelled) { setDepartments([]); setLoading(false) }
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await getAdminDepartments(institutionId)
        if (!cancelled) setDepartments(res.data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [institutionId])

  const create = useCallback(async (data) => {
    const res = await createDepartment({ ...data, institutionId })
    setDepartments(prev => [...prev, res.data])
    return res.data
  }, [institutionId])

  const update = useCallback(async (id, data) => {
    const res = await updateDepartment(id, data)
    setDepartments(prev => prev.map(d => d.id === id ? res.data : d))
    return res.data
  }, [])

  const remove = useCallback(async (id) => {
    await deleteDepartment(id)
    setDepartments(prev => prev.filter(d => d.id !== id))
  }, [])

  const toggle = useCallback(async (id) => {
    const res = await toggleDepartmentActive(id)
    setDepartments(prev => prev.map(d => d.id === id ? res.data : d))
    return res.data
  }, [])

  return { departments, loading, error, fetch: load, create, update, remove, toggle }
}
