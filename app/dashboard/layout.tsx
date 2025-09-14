import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Topbar from "@/components/Topbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-sidebar">
          <AppSidebar />
          <main className="flex-1 m-2 bg-white rounded-md border border-neutral-200 flex flex-col min-h-0">
            <Topbar />
            <div className="flex-1 min-h-0 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
}
  
