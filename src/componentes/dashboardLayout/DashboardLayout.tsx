import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "../sidebar/SideBar"// ajuste o caminho conforme seu projeto

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  let user = null
  try {
    const userString = localStorage.getItem("user")
    if (userString && userString !== "undefined") {
      user = JSON.parse(userString)
    }
  } catch {
    user = null
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col lg:ml-64">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <button
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="font-semibold text-white">Painel Administrativo</h1>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-right">
              <p className="text-white font-medium">{user?.name || "Administrador"}</p>
              <p className="text-zinc-400 text-xs">{user?.email || "admin@autoschedule.com"}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  )
}