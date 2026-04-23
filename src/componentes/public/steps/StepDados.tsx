import type { FormData } from "../../../pages/public/AgendamentoPage"

type Props = {
  formData: FormData
  update: (fields: Partial<FormData>) => void
  next: () => void
  back: () => void
}

const PLATE_REGEX = /^[A-Z0-9]{7,8}$/

const normalizePlate = (plate: string) =>
  plate
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8)

export default function StepDados({ formData, update, next, back }: Props) {
  const normalizedPlate = normalizePlate(formData.vehicle_plate)
  const hasPlateError = formData.vehicle_plate.length > 0 && !PLATE_REGEX.test(normalizedPlate)

  const isValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    normalizedPlate &&
    PLATE_REGEX.test(normalizedPlate) &&
    formData.vehicle_model.trim()

  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Seus Dados</h1>
        <p className="text-zinc-400 mt-2">
          Preencha suas informações para concluir o agendamento
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NOME */}
        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400">Nome</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            placeholder="Seu nome completo"
          />
        </div>

        {/* TELEFONE */}
        <div>
          <label className="text-sm text-zinc-400">Telefone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            placeholder="(81) 99999-9999"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-zinc-400">Email (opcional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            placeholder="email@email.com"
          />
        </div>

        {/* PLACA */}
        <div>
          <label className="text-sm text-zinc-400">Placa</label>
          <input
            type="text"
            value={formData.vehicle_plate}
            onChange={(e) => update({ vehicle_plate: normalizePlate(e.target.value) })}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            placeholder="ABC1D23"
          />
          {hasPlateError && (
            <p className="text-xs text-red-400 mt-1">
              A placa deve conter de 7 a 8 caracteres alfanuméricos.
            </p>
          )}
        </div>

        {/* MODELO */}
        <div>
          <label className="text-sm text-zinc-400">Modelo do veículo</label>
          <input
            type="text"
            value={formData.vehicle_model}
            onChange={(e) => update({ vehicle_model: e.target.value })}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            placeholder="Gol 2020"
          />
        </div>
      </div>

      {/* PAGAMENTO */}
      <div>
        <p className="text-sm text-zinc-400 mb-3">Forma de pagamento</p>

        <div className="flex gap-3">
          {["pix", "dinheiro", "cartao"].map((method) => {
            const selected = formData.payment_method === method

            return (
              <button
                key={method}
                onClick={() => update({ payment_method: method })}
                className={`
                  px-4 py-2 rounded-lg text-sm border transition
                  ${
                    selected
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                  }
                `}
              >
                {method.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

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
          disabled={!isValid}
          className={`
            px-6 py-2 rounded-lg font-medium transition
            ${
              isValid
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
