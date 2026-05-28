import api from './axiosInstance'

export const getSystemLogs  = (page = 1, pageSize = 50) =>
  api.get('/admin/system/logs', { params: { page, pageSize } })

export const getSystemUsers = () => api.get('/admin/system/users')
