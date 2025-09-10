import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <Sidebar/>
            {children}
        </div>
    )
}