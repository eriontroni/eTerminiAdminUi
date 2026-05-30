import { useState, useEffect, useCallback } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoriesApi'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getCategories()
      setCategories(res.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gabim gjatë ngarkimit të kategorive.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = useCallback(async (data) => {
    const res = await createCategory(data)
    setCategories(prev => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)))
    return res.data
  }, [])

  const update = useCallback(async (id, data) => {
    const res = await updateCategory(id, data)
    setCategories(prev => prev.map(c => c.id === id ? res.data : c))
    return res.data
  }, [])

  const remove = useCallback(async (id) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  return { categories, loading, error, fetch, create, update, remove }
}
