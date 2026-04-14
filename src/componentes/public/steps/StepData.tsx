import { useEffect, useState } from "react"
import type { FormData } from "../../../pages/public/AgendamentoPage"

type Props = {
  formData: FormData
  update: (fields: Partial<FormData>) => void
  next: () => void
  back: () => void
}

// ─── Helpers ─────────────────────────────────────────────────

function generateTimeSlots() {
  const slots = []
  for (let h = 8; h <= 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`)
    if (h !== 18) slots.push(`${String(h).padStart(2, "0")}:30`)
  }
  return slots
}

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number)
  const date = new Date()
  date.setHours(h)
  date.setMinutes(m + minutes)

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`
}

// ─── Component ───────────────────────────────────────────────

export default function StepData({ formData, update, next, back }: Props) {
  const [slots, setSlots] = useState<string[]>([])

  useEffect(() => {
    setSlots(generateTimeSlots())
  }, [])

  const handleSelectTime = (time: string) => {
    if (!formData.service) return

    const end = addMinutes(time, formData.service.duration)

    update({
      start_time: time,
      end_time: end,
    })
  }

  return (
    <div className="w-full max-w-4xl space-y-8">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Escolha Data e Horário</h1>
        <p className="text-zinc-400 mt-2">
          Selecione quando deseja realizar o serviço
        </p>
      </div>

      {/* DATA */}
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">
          Data
        </label>

        <input
          type="date"
          value={formData.date}
          onChange={(e) => update({ date: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white"
        />
      </div>

      {/* HORÁRIOS */}
      <div>
        <p className="text-sm text-zinc-400 mb-3">Horários disponíveis</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {slots.map((time) => {
            const selected = formData.start_time === time

            return (
              <button
                key={time}
                onClick={() => handleSelectTime(time)}
                className={`
                  py-2 rounded-lg text-sm transition
                  ${
                    selected
                      ? "bg-yellow-500 text-black"
                      : "bg-zinc-900 border border-zinc-800 hover:border-yellow-500"
                  }
                `}
              >
                {time}
              </button>
            )
          })}
        </div>
      </div>

      {/* RESUMO */}
      {formData.start_time && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300">
          <p>
            <span className="text-zinc-400">Início:</span>{" "}
            {formData.start_time}
          </p>
          <p>
            <span className="text-zinc-400">Fim:</span>{" "}
            {formData.end_time}
          </p>
        </div>
      )}

      {/* BOTÕES */}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          className="px-6 py-2 text-zinc-400 hover:text-white"
        >
          Voltar
        </button>

        <button
          onClick={next}
          disabled={!formData.date || !formData.start_time}
          className={`
            px-6 py-2 rounded-lg font-medium transition
            ${
              formData.date && formData.start_time
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}