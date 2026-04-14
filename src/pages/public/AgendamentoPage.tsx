import { useState } from "react"
import StepServico from "../../componentes/public/steps/StepServico"
import StepData from "../../componentes/public/steps/StepData"
import StepDados from "../../componentes/public/steps/StepDados"
import StepConfirmacao from "../../componentes/public/steps/StepConfirmacao"

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
}

export interface FormData {
  service: Service | null
  date: string
  start_time: string
  end_time: string
  name: string
  phone: string
  email: string
  vehicle_plate: string
  vehicle_model: string
  payment_method: string
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Serviço" },
  { label: "Data/Hora" },
  { label: "Seus Dados" },
  { label: "Confirmação" },
]

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center py-8 px-4">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={stepNumber} className="flex items-center">

            {/* STEP */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${
                    isCompleted
                      ? "bg-yellow-500 border-yellow-500 text-black"
                      : isActive
                      ? "border-yellow-500 text-yellow-500"
                      : "border-zinc-600 text-zinc-500"
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive || isCompleted ? "text-yellow-500" : "text-zinc-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* LINE */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-[2px] w-12 sm:w-20 mx-2 ${
                  isCompleted ? "bg-yellow-500" : "bg-zinc-700"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function AgendamentoPage() {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<FormData>({
    service: null,
    date: "",
    start_time: "",
    end_time: "",
    name: "",
    phone: "",
    email: "",
    vehicle_plate: "",
    vehicle_model: "",
    payment_method: "pix",
  })

  const next = () => setStep((s) => Math.min(s + 1, 4))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const update = (fields: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }

  const stepProps = { formData, update, next, back }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* NAVBAR */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white">AutoSchedule Pro</p>
            <p className="text-xs text-zinc-400">Agendamento Premium</p>
          </div>
        </div>

        <span className="text-sm text-zinc-400">
          Precisa de ajuda?{" "}
          <span className="text-yellow-500 font-semibold">(11) 99999-9999</span>
        </span>
      </header>

      {/* STEPPER */}
      <Stepper currentStep={step} />

      {/* STEPS */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        {step === 1 && <StepServico {...stepProps} />}
        {step === 2 && <StepData {...stepProps} />}
        {step === 3 && <StepDados {...stepProps} />}
        {step === 4 && <StepConfirmacao {...stepProps} />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 px-6 py-4 flex items-center justify-between text-xs text-zinc-500">
        <span>© 2024 AutoSchedule Pro. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-300">Termos</a>
          <a href="#" className="hover:text-zinc-300">Privacidade</a>
        </div>
      </footer>
    </div>
  )
}