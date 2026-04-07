import { useEffect, useState } from "react"
import { getAppointments, updateAppointmentStatus } from "../../services/appointmentService"
import KanbanBoard from "../../componentes/appointment/KanbanBoard"

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
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
      {initials}
    </div>
  )
}

function formatCurrency(value?: number | string) {
  const n = Number(value)
  if (isNaN(n)) return "R$ --"
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function Agendamento() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<"kanban" | "table">("kanban")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      await getAppointments(setAppointments)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateAppointmentStatus(id, status, () => {})

      // 🔥 atualização instantânea (UX melhor)
      setAppointments(prev =>
        prev.map(a =>
          a.id === id ? { ...a, status } : a
        )
      )
    } catch (error) {
      console.error("Erro ao atualizar status", error)
    }
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
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-zinc-400 text-sm">Gerencie todos os agendamentos</p>
        </div>

        <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">
          + Novo Agendamento
        </button>
      </div>

      {/* TOGGLE */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setView("kanban")}
          className={`px-3 py-1.5 rounded-md text-sm ${
            view === "kanban"
              ? "bg-yellow-500 text-black"
              : "text-zinc-400"
          }`}
        >
          Kanban
        </button>

        <button
          onClick={() => setView("table")}
          className={`px-3 py-1.5 rounded-md text-sm ${
            view === "table"
              ? "bg-yellow-500 text-black"
              : "text-zinc-400"
          }`}
        >
          Tabela
        </button>
      </div>

      {/* KANBAN */}
      {view === "kanban" && (
        <KanbanBoard
          appointments={appointments}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* TABELA */}
      {view === "table" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-zinc-400">Cliente</th>
                <th className="px-4 py-3 text-left text-zinc-400">Serviço</th>
                <th className="px-4 py-3 text-left text-zinc-400">Data</th>
                <th className="px-4 py-3 text-left text-zinc-400">Placa</th>
                <th className="px-4 py-3 text-left text-zinc-400">Valor</th>
                <th className="px-4 py-3 text-left text-zinc-400">Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {appointments.map(a => {
                const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.no_show

                return (
                  <tr key={a.id} className="border-t border-zinc-800">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Avatar name={a.client?.name} />
                      {a.client?.name}
                    </td>

                    <td className="px-4 py-3">{a.service_name}</td>
                    <td className="px-4 py-3">{a.date} {a.start_time}</td>
                    <td className="px-4 py-3">{a.client?.vehicle_plate}</td>

                    <td className="px-4 py-3 text-yellow-400 font-bold">
                      {formatCurrency(a.service_price)}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleStatusChange(a.id, "completed")}
                        className="text-green-400"
                      >
                        ✔
                      </button>

                      <button
                        onClick={() => handleStatusChange(a.id, "cancelled")}
                        className="text-red-400"
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}