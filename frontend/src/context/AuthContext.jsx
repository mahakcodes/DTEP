import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('dtep_token')
    const storedUser = localStorage.getItem('dtep_user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('dtep_token')
        localStorage.removeItem('dtep_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((authData) => {
    const { token: newToken, user: newUser } = authData
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('dtep_token', newToken)
    localStorage.setItem('dtep_user', JSON.stringify(newUser))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('dtep_token')
    localStorage.removeItem('dtep_user')
  }, [])

  const isAuthenticated = Boolean(token && user)

  const hasRole = useCallback((roles) => {
    if (!user) return false
    if (Array.isArray(roles)) return roles.includes(user.role)
    return user.role === roles
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
