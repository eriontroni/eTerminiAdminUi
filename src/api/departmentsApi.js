import api from './axiosInstance'

export const getDepartmentsByInstitution = (institutionId) =>
  api.get('/admin/departments', { params: { institutionId } })

export const getAdminDepartments = (institutionId) =>
  api.get('/admin/departments', { params: { institutionId, includeInactive: true } })

export const createDepartment       = (data)     => api.post('/admin/departments', data)
export const updateDepartment       = (id, data) => api.put(`/admin/departments/${id}`, data)
export const deleteDepartment       = (id)       => api.delete(`/admin/departments/${id}`)
export const toggleDepartmentActive = (id)       => api.patch(`/admin/departments/${id}/toggle-active`)
