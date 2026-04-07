import { useEffect, useState } from "react"
import { getAppointments, updateAppointmentStatus } from "../../services/appointmentService"
import type Appointment from "../../models/Appointment"

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  scheduled: { label: "Agendados",     color: "bg-yellow-500/10 border-yellow-500/20", dot: "bg-yellow-400" },
  completed: { label: "Concluídos",    color: "bg-green-500/10 border-green-500/20",   dot: "bg-green-400"  },
  cancelled: { label: "Cancelados",    color: "bg-red-500/10 border-red-500/20",       dot: "bg-red-500"    },
  no_show:   { label: "Não Compareceu",color: "bg-zinc-700/20 border-zinc-600/30",     dot: "bg-zinc-400"   },
}

function getInitials(name?: string) {
  if (!name) return "?"
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

function Avatar({ name }: { name?: string }) {
  const initials = getInitials(name)
  const colors = [
    "bg-blue-600", "bg-purple-600", "bg-emerald-600",
    "bg-orange-600", "bg-pink-600", "bg-cyan-600",
  ]
  const color = colors[(initials.charCodeAt(0) || 0) % colors.length]
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

function formatCurrency(value?: number | string) {
  const n = Number(value)
  if (isNaN(n)) return "R$ --"
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function AppointmentCard({
  appointment,
  onStatusChange,
}: {
  appointment: Appointment
  onStatusChange: (id: number, status: string) => void
}) {
  const a = appointment
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2 hover:border-zinc-600 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="text-zinc-500 cursor-grab text-xs">⠿⠿</div>
        <Avatar name={a.client?.name} />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-white leading-tight truncate">{a.client?.name ?? "—"}</p>
          <p className="text-xs text-zinc-400 truncate">{a.service_name}</p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1 text-xs text-zinc-400">
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        {a.date} {a.start_time && `, ${a.start_time}`}
      </div>

      {/* Plate + price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="1" y="7" width="22" height="11" rx="2"/><path d="M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2"/>
          </svg>
          <span className="font-mono">{(a as any).plate ?? (a as any).vehicle_plate ?? "—"}</span>
        </div>
        <span className="text-yellow-400 font-bold text-sm">{formatCurrency(a.service_price)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-zinc-800">
        <button
          onClick={() => onStatusChange(a.id, "completed")}
          title="Concluir"
          className="flex-1 flex items-center justify-center gap-1 text-xs text-green-400 hover:bg-green-400/10 rounded-lg py-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 13l4 4L19 7"/>
          </svg>
          Concluir
        </button>
        <button
          onClick={() => onStatusChange(a.id, "cancelled")}
          title="Cancelar"
          className="flex-1 flex items-center justify-center gap-1 text-xs text-red-400 hover:bg-red-400/10 rounded-lg py-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function Agendamento() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<"kanban" | "table">("kanban")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        await getAppointments(setAppointments)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStatusChange = async (id: number, status: string) => {
    await updateAppointmentStatus(id, status, () => {})
    await getAppointments(setAppointments)
  }

  const grouped = {
    scheduled: appointments.filter(a => a.status === "scheduled"),
    completed: appointments.filter(a => a.status === "completed"),
    cancelled: appointments.filter(a => a.status === "cancelled"),
    no_show:   appointments.filter(a => a.status === "no_show"),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Gerencie todos os agendamentos do sistema</p>
        </div>
        <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <span className="text-lg leading-none">+</span>
          Novo Agendamento
        </button>
      </div>

      {/* VIEW TOGGLE */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setView("kanban")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "kanban" ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/>
          </svg>
          Kanban
        </button>
        <button
          onClick={() => setView("table")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "table" ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M3 6h18M3 10h18M3 14h18M3 18h18"/>
          </svg>
          Tabela
        </button>
      </div>

      {/* KANBAN */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {(Object.entries(grouped) as [string, Appointment[]][]).map(([status, list]) => {
            const cfg = STATUS_CONFIG[status]
            return (
              <div key={status} className={`border rounded-xl p-4 space-y-3 ${cfg.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <h2 className="font-semibold text-sm">{cfg.label}</h2>
                  </div>
                  <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2 py-0.5 rounded-full">
                    {list.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {list.length === 0 ? (
                    <p className="text-zinc-600 text-xs text-center py-4">Nenhum agendamento</p>
                  ) : (
                    list.map(a => (
                      <AppointmentCard key={a.id} appointment={a} onStatusChange={handleStatusChange} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* TABLE */}
      {view === "table" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-400 font-medium px-4 py-3">Cliente</th>
                <th className="text-left text-zinc-400 font-medium px-4 py-3">Serviço</th>
                <th className="text-left text-zinc-400 font-medium px-4 py-3">Data / Hora</th>
                <th className="text-left text-zinc-400 font-medium px-4 py-3">Placa</th>
                <th className="text-left text-zinc-400 font-medium px-4 py-3">Valor</th>
                <th className="text-left text-zinc-400 font-medium px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.no_show
                return (
                  <tr key={a.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.client?.name} />
                        <span className="font-medium">{a.client?.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{a.service_name}</td>
                    <td className="px-4 py-3 text-zinc-300">{a.date} {a.start_time}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300 text-xs">
                      {(a as any).plate ?? (a as any).vehicle_plate ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 font-bold">{formatCurrency(a.service_price)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(a.id, "completed")}
                          className="text-green-400 hover:bg-green-400/10 p-1.5 rounded-lg transition-colors"
                          title="Concluir"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusChange(a.id, "cancelled")}
                          className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <p className="text-center text-zinc-600 py-12">Nenhum agendamento encontrado</p>
          )}
        </div>
      )}
    </div>
  )
}