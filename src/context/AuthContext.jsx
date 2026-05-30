import { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin, refreshAdminSession } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('adminUser')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore corrupt data */ }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const { data } = await loginAdmin(credentials)

    // Çdo admin (SuperAdmin ose me rol) me leje lejohet të hyjë.
    const isSuperAdmin = data.role === 'SuperAdmin'
    if (!isSuperAdmin && (!data.permissions || data.permissions.length === 0)) {
      throw new Error('Qasja e refuzuar. Nuk keni leje administrative.')
    }

    const sessionUser = {
      email:       data.email,
      fullName:    data.fullName,
      role:        data.role,
      roleName:    data.roleName ?? data.role,
      isSuperAdmin,
      permissions: data.permissions ?? [],
      adminRoleId: data.adminRoleId ?? null,
    }

    localStorage.setItem('adminAccessToken',  data.accessToken)
    localStorage.setItem('adminRefreshToken', data.refreshToken)
    localStorage.setItem('adminUser',         JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('adminUser')
    setUser(null)
  }

  const refreshSession = async () => {
    const storedRefreshToken = localStorage.getItem('adminRefreshToken')
    if (!storedRefreshToken) return

    const { data } = await refreshAdminSession(storedRefreshToken)
    const isSuperAdmin = data.role === 'SuperAdmin'

    const sessionUser = {
      email:       data.email,
      fullName:    data.fullName,
      role:        data.role,
      roleName:    data.roleName ?? data.role,
      isSuperAdmin,
      permissions: data.permissions ?? [],
      adminRoleId: data.adminRoleId ?? null,
    }

    localStorage.setItem('adminAccessToken',  data.accessToken)
    localStorage.setItem('adminRefreshToken', data.refreshToken)
    localStorage.setItem('adminUser',         JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  const hasPermission = (code) => {
    if (!user) return false
    if (user.isSuperAdmin) return true
    if (!code) return true
    return user.permissions?.includes(code) ?? false
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
