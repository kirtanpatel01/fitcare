// src/pages/landing/AuthRedirect.tsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

function AuthRedirect() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return;

    // Important: Only navigate if path is still "/"
    if (window.location.pathname === '/') {
      if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return <div className="text-center mt-10 text-lg">Redirecting...</div>
}

export default AuthRedirect
