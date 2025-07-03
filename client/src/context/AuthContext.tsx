// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { getToken, setToken, removeToken } from "@/lib/token"
import { useFitcareForm } from "@/hooks/use-fitcare-form"

interface AuthContextType {
  user: any
  accessToken: string | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

interface User {
  _id: string
  name: string
  email: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() => getToken())

  const decodeUser = (token: string) => {
    try {
      const decoded: User = jwtDecode(token)
      setUser({ _id: decoded._id, email: decoded.email, name: decoded.name })
    } catch {
      setUser(null)
    }
  }

  const login = (token: string) => {
    setToken(token)
    setAccessToken(token)
    decodeUser(token)
  }

  const logout = () => {
    if (!accessToken && !user) return; // already logged out
    removeToken();
    setAccessToken(null);
    setUser(null);
    useFitcareForm.getState().resetForm();
  };


  const silentRefresh = async () => {
    try {
      const res = await axios.post("/api/refresh-token", {}, { withCredentials: true })
      login(res.data.accessToken)
    } catch {
      logout()
    }
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const { exp } = jwtDecode<{ exp: number }>(accessToken)
        if (exp * 1000 < Date.now()) {
          await silentRefresh()
        } else {
          decodeUser(accessToken)
        }
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [accessToken])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
