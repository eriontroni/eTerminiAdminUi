import api from './axiosInstance'

export const loginAdmin          = (data)          => api.post('/admin/auth/login', data)
export const refreshAdminSession = (refreshToken)  => api.post('/admin/auth/refresh', { refreshToken })
export const changePassword      = (data)          => api.patch('/admin/auth/change-password', data)
