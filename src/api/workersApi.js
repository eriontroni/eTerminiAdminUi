import api from './axiosInstance'

export const getWorkers        = ()         => api.get('/admin/workers')
export const getWorker         = (id)       => api.get(`/admin/workers/${id}`)
export const createWorker      = (data)     => api.post('/admin/workers', data)
export const updateWorker      = (id, data) => api.put(`/admin/workers/${id}`, data)
export const toggleWorker      = (id)       => api.patch(`/admin/workers/${id}/toggle-active`)
export const assignInstitution = (id, data) => api.patch(`/admin/workers/${id}/assign-institution`, data)
