import { useState, useEffect } from 'react'
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

  const fetch = async () => {
    if (!institutionId) return
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
  }

  useEffect(() => { fetch() }, [institutionId])

  const create = async (data) => {
    const res = await createDepartment({ ...data, institutionId })
    setDepartments(prev => [...prev, res.data])
    return res.data
  }

  const update = async (id, data) => {
    const res = await updateDepartment(id, data)
    setDepartments(prev => prev.map(d => d.id === id ? res.data : d))
    return res.data
  }

  const remove = async (id) => {
    await deleteDepartment(id)
    setDepartments(prev => prev.filter(d => d.id !== id))
  }

  const toggle = async (id) => {
    const res = await toggleDepartmentActive(id)
    setDepartments(prev => prev.map(d => d.id === id ? res.data : d))
    return res.data
  }

  return { departments, loading, error, fetch, create, update, remove, toggle }
}
