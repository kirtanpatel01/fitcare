// components/layouts/ProtectedLayout.tsx
import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import AppSidebar from './app-sidebar'
import SiteHeader from './site-header'

export default function ProtectedLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing)*45)",
          "--header-height": "calc(var(--spacing)*12.2)"
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
