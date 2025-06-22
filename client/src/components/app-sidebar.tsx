import { Link } from "react-router-dom"
import NavUser from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "./ui/sidebar"
import { Activity, Apple, Dumbbell, Home } from "lucide-react"

function AppSidebar({ ...props }) {
  const items = [
    { title: "Dashboard", to: "/dashboard", icon: Home },
    { title: "Exercise", to: "/exercise", icon: Dumbbell },
    { title: "Diet Plan", to: "/diet-plan", icon: Apple },
  ]

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <Link to="/dashboard">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Activity />
                <span className="text-2xl font-semibold tracking-widest">FitCare</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator orientation="horizontal" className="m-0"/>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Link key={item.title} to={item.to}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <item.icon />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar