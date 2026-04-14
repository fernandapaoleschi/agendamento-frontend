type StepperProps = {
  currentStep: number
}

const steps = [
  "Serviço",
  "Data/Hora",
  "Seus Dados",
  "Confirmação",
]

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className="flex items-center flex-wrap justify-center">

        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex items-center">

              {/* STEP */}
              <div className="flex flex-col items-center">

                {/* CIRCLE */}
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-yellow-500 border-yellow-500 text-black"
                        : isActive
                        ? "border-yellow-500 text-yellow-500"
                        : "border-zinc-700 text-zinc-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* LABEL */}
                <span
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${
                      isActive || isCompleted
                        ? "text-yellow-500"
                        : "text-zinc-500"
                    }
                  `}
                >
                  {step}
                </span>
              </div>

              {/* LINE */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-[2px] w-8 sm:w-12 md:w-20 mx-2 transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-yellow-500"
                        : "bg-zinc-700"
                    }
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}