import api from './axiosInstance'

export const getAdministrators   = ()     => api.get('/admin/administrators')
export const createAdministrator = (data) => api.post('/admin/administrators', data)
export const toggleAdministrator = (id)   => api.patch(`/admin/administrators/${id}/toggle-active`)
