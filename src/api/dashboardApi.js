import api from './axiosInstance'

export const getDashboardStats        = () => api.get('/admin/dashboard/stats')
export const getActiveAppointments    = () => api.get('/admin/dashboard/active-appointments')
