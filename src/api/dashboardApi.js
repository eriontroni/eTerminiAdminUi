import api from './axiosInstance'

export const getDashboardStats = () => api.get('/admin/dashboard/stats')
