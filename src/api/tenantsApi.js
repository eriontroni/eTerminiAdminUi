import api from './axiosInstance'

export const getTenants    = ()        => api.get('/admin/tenants')
export const createTenant  = (dto)     => api.post('/admin/tenants', dto)
export const deleteTenant  = (id)      => api.delete(`/admin/tenants/${id}`)
