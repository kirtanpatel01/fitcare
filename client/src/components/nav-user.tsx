import { LogOut, User2 } from "lucide-react"
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar"
import { Button } from "./ui/button"
import { Link, useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

function NavUser() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    try {
      setIsLoggingOut(true)
      const res = await api.post('/user/logout')
      if (res.status === 200) {
        logout()
        toast.success('Logged out successfully.')
        navigate('/login')
      } else {
        toast.error('Logout failed')
        return
      }
    } catch (error) {
      console.log("Error while logging out", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to={'/profile'}>
            <Button variant={'outline'} className="w-full cursor-pointer">
              <User2 />
              {user && user?.name}
            </Button>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Button 
            variant={'destructive'} 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="w-full cursor-pointer">
            <LogOut />
            Logout
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export default NavUser