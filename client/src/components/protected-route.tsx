import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if(loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
