import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

function Home() {
  const { loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // console.log(isAuthenticated, loading, navigate, location.pathname)
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>
  }

  return (
    <div>
      <Link to="/login">
        <Button variant="link" className="cursor-pointer">Login</Button>
      </Link>
    </div>
  )
}

export default Home
