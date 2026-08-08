import api from './axiosInstance'

export const getServicesByInstitution = (institutionId, includeInactive = false) =>
  api.get('/admin/services', { params: { institutionId, includeInactive } })

export const getServiceById = (id) =>
  api.get(`/admin/services/${id}`)

export const createService = (dto) =>
  api.post('/admin/services', dto)

export const updateService = (id, dto) =>
  api.put(`/admin/services/${id}`, dto)

export const deleteService = (id) =>
  api.delete(`/admin/services/${id}`)

export const toggleServiceActive = (id) =>
  api.patch(`/admin/services/${id}/toggle-active`)
