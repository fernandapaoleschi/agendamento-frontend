import { useEffect, useState } from "react"
import type Log from "../../models/Log"
import api, { authHeader } from "../../services/api"

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await api.get("/logs", authHeader())
      console.log("LOGS:", res.data)
      setLogs(res.data)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("pt-BR")

  // 🎯 Label + cor da ação
  const getActionLabel = (action: string) => {
    switch (action) {
      case "created":
        return { label: "Criação", color: "bg-green-500/10 text-green-400" }
      case "updated":
        return { label: "Atualização", color: "bg-blue-500/10 text-blue-400" }
      case "cancelled":
        return { label: "Cancelado", color: "bg-red-500/10 text-red-400" }
      case "completed":
        return { label: "Concluído", color: "bg-emerald-500/10 text-emerald-400" }
      default:
        return { label: action, color: "bg-zinc-700 text-zinc-400" }
    }
  }

  // 🧠 Mensagem inteligente
  const getMessage = (log: Log) => {
    if (log.action === "created") {
      if (log.appointment && log.client) {
        return `Agendamento criado para ${log.client.name}`
      }
      if (log.client) {
        return `Novo cliente cadastrado: ${log.client.name}`
      }
    }

    if (log.action === "updated") {
      return `Agendamento #${log.appointment?.id} atualizado`
    }

    if (log.action === "cancelled") {
      return `Agendamento #${log.appointment?.id} cancelado`
    }

    if (log.action === "completed") {
      return `Agendamento #${log.appointment?.id} concluído`
    }

    return "Ação realizada no sistema"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Carregando logs...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Logs do Sistema</h1>
        <p className="text-sm text-zinc-400">
          Histórico de ações realizadas no sistema
        </p>
      </div>

      {/* LIST */}
      <div className="bg-[#0B0B0B] border border-zinc-800 rounded-2xl p-4 space-y-4 max-h-[600px] overflow-y-auto">

        {logs.map(log => {
          const action = getActionLabel(log.action)

          return (
            <div
              key={log.id}
              className="flex gap-4 items-start bg-black border border-zinc-800 rounded-xl p-4 hover:border-yellow-500/20 transition"
            >
              {/* ICON */}
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                {log.action === "created" && "👤"}
                {log.action === "updated" && "🔧"}
                {log.action === "cancelled" && "📅"}
                {log.action === "completed" && "✅"}
              </div>

              {/* CONTENT */}
              <div className="flex-1 space-y-1">

                {/* TOP */}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className={`px-2 py-0.5 rounded ${action.color}`}>
                    {action.label}
                  </span>

                  <span>{formatDate(log.created_at)}</span>
                </div>

                {/* MESSAGE */}
                <p className="text-sm text-white">
                  {getMessage(log)}
                </p>

{/* ENTITY */}
<div className="text-xs text-zinc-500">
  {log.client && `👤 ${log.client.name}`}
  {log.client && log.appointment && " • "}
  {log.appointment && `📅 #${log.appointment.id}`}
</div>

{log.data_snapshot && (
  <div className="text-xs text-zinc-400 space-y-1 mt-2">

    {log.data_snapshot.date && (
      <p>📅 {new Date(log.data_snapshot.date).toLocaleDateString("pt-BR")}</p>
    )}

    {log.data_snapshot.start_time && (
      <p>⏰ {log.data_snapshot.start_time} - {log.data_snapshot.end_time}</p>
    )}

    {log.data_snapshot.service && (
      <p>🛠 Serviço: {log.data_snapshot.service}</p>
    )}

    {log.data_snapshot.professional && (
      <p>👨‍🔧 Profissional: {log.data_snapshot.professional}</p>
    )}

    {log.data_snapshot.price && (
      <p>💰 R$ {log.data_snapshot.price}</p>
    )}

    {log.data_snapshot.duration && (
      <p>⏱ {log.data_snapshot.duration} min</p>
    )}

  </div>
)}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}