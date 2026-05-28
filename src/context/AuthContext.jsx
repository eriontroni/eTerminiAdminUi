import { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin } from '../api/authApi'

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

    if (data.role !== 'SuperAdmin') {
      throw new Error('Qasja e refuzuar. Vetëm SuperAdmin mund të hyjë.')
    }

    localStorage.setItem('adminAccessToken',  data.accessToken)
    localStorage.setItem('adminRefreshToken', data.refreshToken)
    localStorage.setItem('adminUser',         JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminRefreshToken')
    localStorage.removeItem('adminUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
