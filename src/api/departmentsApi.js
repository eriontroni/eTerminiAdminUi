import api from './axiosInstance'

export const getDepartmentsByInstitution = (institutionId) =>
  api.get('/admin/departments', { params: { institutionId } })
