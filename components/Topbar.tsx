import { SidebarTrigger } from "./ui/sidebar";

export default function Topbar(){
    return(
        <div className="flex items-center px-2 py-2 border-b border-neutral-200 gap-4">
            <SidebarTrigger/>
            <div className="border h-4"></div>
            <h1 className="font-medium">Make Invoices</h1>
        </div>
    )
}