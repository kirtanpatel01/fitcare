import { LogOut, User2 } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
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
            <SidebarMenuButton className="w-full cursor-pointer">
              <User2 />
              {user && user?.name}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full cursor-pointer">
            <LogOut />
            Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export default NavUser