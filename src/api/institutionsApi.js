import api from './axiosInstance'

export const getInstitutions   = ()         => api.get('/admin/institutions')
export const getInstitution    = (id)       => api.get(`/admin/institutions/${id}`)
export const createInstitution = (data)     => api.post('/admin/institutions', data)
export const updateInstitution = (id, data) => api.put(`/admin/institutions/${id}`, data)
export const toggleInstitution = (id)       => api.patch(`/admin/institutions/${id}/toggle-active`)
export const deleteInstitution = (id)       => api.delete(`/admin/institutions/${id}`)
