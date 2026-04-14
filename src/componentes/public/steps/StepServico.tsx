import { useEffect, useState } from "react"
import { api } from "../../../services/api"
import type { FormData } from "../../../pages/public/AgendamentoPage"

// 🔥 ideal: mover isso pra /models depois
interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

interface Props {
  formData: FormData
  update: (fields: Partial<FormData>) => void
  next: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}min` : `${h}h`
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function StepServico({ formData, update, next }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    api
      .get<Service[]>("/services")
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.error(err)
        setError("Erro ao carregar serviços. Tente novamente.")
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (service: Service) => {
    update({ service })
  }

  const isSelected = (service: Service) =>
    formData.service?.id === service.id

  return (
    <div className="w-full max-w-4xl">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Escolha o Serviço
        </h1>
        <p className="text-zinc-400 mt-2">
          Selecione o serviço que deseja agendar
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* ERRO */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-yellow-500 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* LISTA */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => {
            const selected = isSelected(service)

            return (
              <button
                key={service.id}
                onClick={() => handleSelect(service)}
                className={`
                  text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  hover:scale-[1.02]
                  ${
                    selected
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Ícone */}
                    <div
                      className={`p-2 rounded-lg ${
                        selected ? "bg-yellow-500/20" : "bg-zinc-800"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          selected ? "text-yellow-500" : "text-zinc-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>

                    <span
                      className={`font-semibold text-sm ${
                        selected ? "text-white" : "text-zinc-200"
                      }`}
                    >
                      {service.name}
                    </span>
                  </div>

                  {/* RADIO */}
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                      ${selected ? "border-yellow-500" : "border-zinc-600"}
                    `}
                  >
                    {selected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    )}
                  </div>
                </div>

                <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-yellow-500 font-bold text-base">
                    {formatPrice(service.price)}
                  </span>

                  <span className="flex items-center gap-1 text-zinc-400 text-xs">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatDuration(service.duration)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* BOTÃO */}
      <div className="flex justify-end mt-8">
        <button
          onClick={() => {
            if (!formData.service) return
            next()
          }}
          disabled={!formData.service}
          className={`
            px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200
            ${
              formData.service
                ? "bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer"
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