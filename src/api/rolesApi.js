import api from './axiosInstance'

export const getRoles             = ()          => api.get('/admin/roles')
export const getRole              = (id)        => api.get(`/admin/roles/${id}`)
export const createRole           = (data)      => api.post('/admin/roles', data)
export const updateRole           = (id, data)  => api.put(`/admin/roles/${id}`, data)
export const deleteRole           = (id)        => api.delete(`/admin/roles/${id}`)
export const getPermissionCatalog = ()          => api.get('/admin/roles/permissions-catalog')
