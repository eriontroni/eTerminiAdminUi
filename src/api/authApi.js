import api from './axiosInstance'

export const loginAdmin = (data) => api.post('/admin/auth/login', data)
