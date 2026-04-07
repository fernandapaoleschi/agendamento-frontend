import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wrench,
  UserCog,
  UserCircle,
  ClipboardList,
  ChevronLeft,
  Shield,
} from "lucide-react"

interface SidebarProps {
  onNavigate?: () => void
  onLogout?: () => void
}

export default function Sidebar({ onNavigate, onLogout }: SidebarProps) {
const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Agendamentos", path: "/agendamentos", icon: CalendarDays },
  { name: "Clientes", path: "/clientes", icon: Users },
  { name: "Serviços", path: "/servicos", icon: Wrench },
  { name: "Profissionais", path: "/profissionais", icon: UserCog },
  { name: "Usuários", path: "/usuarios", icon: UserCircle },
  { name: "Logs", path: "/logs", icon: ClipboardList },
]

  return (
    <div className="w-64 h-screen bg-zinc-950 text-white flex flex-col">

      {/* LOGO */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="text-black" />
        </div>
        <div>
          <div className="font-bold text-base leading-tight tracking-wide">AutoSchedule</div>
          <div className="text-xs text-zinc-400 mt-0.5">Pro Admin</div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {menu.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium
                ${
                  isActive
                    ? "bg-yellow-500 text-black"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-1">
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-150"
          >
            Sair
          </button>
        )}
        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all duration-150">
          <ChevronLeft size={16} />
          Recolher
        </button>
      </div>
    </div>
  )
}