import api from './axiosInstance'

export const getTenants = () => api.get('/admin/tenants')
