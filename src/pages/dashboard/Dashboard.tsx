import { useEffect, useState } from "react"
import { getAppointments } from "../../services/appointmentService"
import { getClients } from "../../services/clientService"
import { CalendarDays, CheckCircle2, Clock, DollarSign, Calendar, Users, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

import type Appointment from "../../models/Appointment"
import type Client from "../../models/Client"

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([
          getAppointments(setAppointments),
          getClients(setClients),
        ])
      } catch (error) {
        console.error("Erro ao carregar dashboard", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Carregando...
      </div>
    )
  }

  // ── Derivações ──────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0]

  const todayAppointments = appointments.filter((a) => a.date === today)
  const completed = todayAppointments.filter((a) => a.status === "completed")
  const pending = todayAppointments.filter((a) => a.status === "scheduled")

  const todayRevenue = completed.reduce(
    (sum, a) => sum + (a.service_price ?? 0),
    0
  )

  const nextAppointments = todayAppointments
    .filter((a) => a.status === "scheduled")
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .slice(0, 4)

  const recentClients = clients.slice(0, 4)

  const pendingConfirmation = appointments.filter(
    (a) => a.status === "scheduled" && a.date >= today
  )

  // ── Helpers ─────────────────────────────────────────────────
  const initials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const formatTime = (time: string) => time.slice(0, 5)

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })

  const statusLabel: Record<string, string> = {
    scheduled: "Agendado",
    completed: "Concluído",
    cancelled: "Cancelado",
    no_show: "Não compareceu",
  }

  const statusColor: Record<string, string> = {
    scheduled: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    completed: "bg-green-500/20 text-green-400 border border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
    no_show: "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30",
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Bem-vindo de volta! Aqui está o resumo do dia.</p>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-400 text-xs mb-1">Agendamentos Hoje</p>
              <p className="text-3xl font-bold text-white">{todayAppointments.length}</p>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <span>↗</span> {pending.length} pendentes hoje
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <CalendarDays size={18} className="text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-400 text-xs mb-1">Concluídos</p>
              <p className="text-3xl font-bold text-white">{completed.length}</p>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <span>↗</span> hoje
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-400 text-xs mb-1">Pendentes</p>
              <p className="text-3xl font-bold text-white">{pending.length}</p>
              <p className="text-zinc-400 text-xs mt-2">próximas horas</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Clock size={18} className="text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-400 text-xs mb-1">Receita do Dia</p>
              <p className="text-3xl font-bold text-white">R$ {formatCurrency(todayRevenue)}</p>
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <span>↗</span> serviços concluídos
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <DollarSign size={18} className="text-yellow-400" />
            </div>
          </div>
        </div>

      </div>

      {/* PRÓXIMOS AGENDAMENTOS + CLIENTES RECENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* PRÓXIMOS AGENDAMENTOS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Proximos Agendamentos</h2>
            <Calendar size={18} className="text-yellow-400" />
          </div>

          {nextAppointments.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-6">Nenhum agendamento para hoje</p>
          ) : (
            <div className="space-y-3">
              {nextAppointments.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-400 text-xs font-bold">{formatTime(a.start_time)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {a.client?.name ?? "Cliente"}
                    </p>
                    <p className="text-zinc-400 text-xs truncate">{a.service_name}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0 ${statusColor[a.status]}`}>
                    {statusLabel[a.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CLIENTES RECENTES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Clientes Recentes</h2>
            <Users size={18} className="text-yellow-400" />
          </div>

          {recentClients.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-6">Nenhum cliente cadastrado</p>
          ) : (
            <div className="space-y-3">
              {recentClients.map((c) => {
                const visits = c.appointments?.length ?? 0
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-xs font-bold">{initials(c.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{c.name}</p>
                      <p className="text-zinc-400 text-xs truncate">{c.vehicle_model || "—"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm font-bold">{visits}</p>
                      <p className="text-zinc-400 text-xs">visitas</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* BANNER PENDENTES */}
      {pendingConfirmation.length > 0 && (
        <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              Voce tem {pendingConfirmation.length} agendamento{pendingConfirmation.length > 1 ? "s" : ""} pendente{pendingConfirmation.length > 1 ? "s" : ""} de confirmacao
            </p>
            <p className="text-zinc-400 text-xs mt-0.5">Revise e confirme os agendamentos para garantir o atendimento.</p>
          </div>
          <button
            onClick={() => navigate("/appointments")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-all flex-shrink-0"
          >
            Ver Agendamentos
          </button>
        </div>
      )}

    </div>
  )
}