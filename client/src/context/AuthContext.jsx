import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [org, setOrg]         = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('sb_token')
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(r => { setUser(r.data.user); setOrg(r.data.org) })
      .catch(() => localStorage.removeItem('sb_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    localStorage.setItem('sb_token', r.data.token)
    setUser(r.data.user)
    setOrg(r.data.org)
    return r.data
  }

  const register = async (name, email, password, orgName, orgType) => {
    const r = await api.post('/auth/register', { name, email, password, orgName, orgType })
    localStorage.setItem('sb_token', r.data.token)
    setUser(r.data.user)
    setOrg(r.data.org)
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('sb_token')
    setUser(null)
    setOrg(null)
  }

  const refreshOrg = async () => {
    const r = await api.get('/orgs/mine')
    setOrg(r.data)
    return r.data
  }

  const updateOrg = (updated) => setOrg(updated)

  return (
    <AuthContext.Provider value={{ user, org, loading, login, register, logout, refreshOrg, updateOrg, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
