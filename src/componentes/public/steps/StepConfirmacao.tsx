import { useState } from "react"
import { api } from "../../../services/api"
import type { FormData } from "../../../pages/public/AgendamentoPage"

type Props = {
  formData: FormData
  back: () => void
}

export default function StepConfirmacao({ formData, back }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)

      // 🔹 1. CRIAR CLIENTE
      const clientRes = await api.post("/clients", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        vehicle_plate: formData.vehicle_plate,
        vehicle_model: formData.vehicle_model,
      })

      const client_id = clientRes.data.id

      if (!client_id) {
        throw new Error("Cliente não criado")
      }

      // 🔹 2. CRIAR AGENDAMENTO
      await api.post("/appointments", {
        client_id,
        professional_id: 1, // depois a gente melhora isso
        service_id: formData.service?.id,

        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,

        payment_method: formData.payment_method,
      })

      setSuccess(true)

    } catch (err: any) {
      console.log("ERRO COMPLETO:", err)
      console.log("DATA:", err.response?.data)

      alert("Erro ao finalizar agendamento")
    } finally {
      setLoading(false)
    }
  }

  // ─── SUCCESS ─────────────────────────────────────────────

  if (success) {
    return (
      <div className="text-center space-y-6 max-w-md">
        <div className="text-green-500 text-5xl">✅</div>

        <h1 className="text-2xl font-bold">
          Agendamento realizado!
        </h1>

        <p className="text-zinc-400">
          Seu horário foi reservado com sucesso.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="bg-yellow-500 text-black px-6 py-2 rounded-lg"
        >
          Fazer novo agendamento
        </button>
      </div>
    )
  }

  // ─── NORMAL ─────────────────────────────────────────────

  return (
    <div className="w-full max-w-3xl space-y-8">

      <div className="text-center">
        <h1 className="text-2xl font-bold">Confirmação</h1>
        <p className="text-zinc-400 mt-2">
          Revise seus dados antes de confirmar
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3 text-sm">

        <p><span className="text-zinc-400">Serviço:</span> {formData.service?.name}</p>
        <p><span className="text-zinc-400">Data:</span> {formData.date}</p>
        <p><span className="text-zinc-400">Horário:</span> {formData.start_time} → {formData.end_time}</p>

        <hr className="border-zinc-800" />

        <p><span className="text-zinc-400">Nome:</span> {formData.name}</p>
        <p><span className="text-zinc-400">Telefone:</span> {formData.phone}</p>
        <p><span className="text-zinc-400">Veículo:</span> {formData.vehicle_model}</p>
        <p><span className="text-zinc-400">Placa:</span> {formData.vehicle_plate}</p>

        <hr className="border-zinc-800" />

        <p><span className="text-zinc-400">Pagamento:</span> {formData.payment_method}</p>

      </div>

      <div className="flex justify-between mt-6">

        <button
          onClick={back}
          className="px-6 py-2 text-zinc-400 hover:text-white"
        >
          Voltar
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`
            px-6 py-2 rounded-lg font-medium transition
            ${
              loading
                ? "bg-zinc-700 text-zinc-400"
                : "bg-yellow-500 text-black"
            }
          `}
        >
          {loading ? "Agendando..." : "Confirmar agendamento"}
        </button>

      </div>
    </div>
  )
}