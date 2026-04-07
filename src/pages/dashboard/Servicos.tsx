import { useEffect, useState } from "react"
import {
  buscarServices,
  cadastrarService,
  atualizarService,
  deletarService,
} from "../../services/serviceService"
import type Service from "../../models/Service"

type FormData = {
  name: string
  price: number
  duration: number
  description?: string
  is_active: boolean
}

const EMPTY_FORM: FormData = {
  name: "",
  price: 0,
  duration: 0,
  description: "",
  is_active: true,
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState<"criar" | "editar" | null>(null)
  const [selected, setSelected] = useState<Service | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      await buscarServices(setServices)
    } finally {
      setLoading(false)
    }
  }

  const openCriar = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setModal("criar")
  }

  const openEditar = (service: Service) => {
    setSelected(service)
    setForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description,
      is_active: service.is_active,
    })
    setModal("editar")
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === "criar") {
        await cadastrarService(form, (novo: Service) => {
          setServices(prev => [novo, ...prev])
        })
      } else if (modal === "editar" && selected) {
        await atualizarService(selected.id, form, (atualizado: Service) => {
          setServices(prev =>
            prev.map(s => (s.id === atualizado.id ? atualizado : s))
          )
        })
      }
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    await deletarService(confirmDelete.id)
    setServices(prev => prev.filter(s => s.id !== confirmDelete.id))
    setConfirmDelete(null)
  }

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Carregando serviços...
      </div>
    )
  }

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-zinc-400 text-sm">
            Gerencie os serviços oferecidos
          </p>
        </div>

        <button
          onClick={openCriar}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          + Novo Serviço
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map(service => (
          <div
            key={service.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative hover:border-yellow-500/40 transition"
          >
            {/* STATUS */}
            <span
              className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-md ${
                service.is_active
                  ? "bg-green-500/20 text-green-400"
                  : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {service.is_active ? "Ativo" : "Inativo"}
            </span>

            {/* ICON */}
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
              🔧
            </div>

            {/* NAME */}
            <h2 className="font-semibold text-lg mb-1">
              {service.name}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-zinc-400 text-sm mb-4">
              {service.description || "Sem descrição"}
            </p>

            {/* PRICE */}
            <p className="text-yellow-500 text-xl font-bold">
              {formatPrice(service.price)}
            </p>

            {/* DURATION */}
            <p className="text-zinc-500 text-xs mt-1">
              ⏱ {service.duration} min
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => openEditar(service)}
                className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => setConfirmDelete(service)}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {modal === "criar" ? "Novo Serviço" : "Editar Serviço"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Nome"
                className="w-full bg-zinc-800 p-2 rounded"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />

              <input
                type="number"
                placeholder="Preço"
                className="w-full bg-zinc-800 p-2 rounded"
                value={form.price}
                onChange={e =>
                  setForm(f => ({ ...f, price: Number(e.target.value) }))
                }
              />

              <input
                type="number"
                placeholder="Duração (min)"
                className="w-full bg-zinc-800 p-2 rounded"
                value={form.duration}
                onChange={e =>
                  setForm(f => ({ ...f, duration: Number(e.target.value) }))
                }
              />

              <textarea
                placeholder="Descrição"
                className="w-full bg-zinc-800 p-2 rounded"
                value={form.description}
                onChange={e =>
                  setForm(f => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2 bg-zinc-700 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-yellow-500 text-black rounded"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl">
            <p className="mb-4">
              Excluir <b>{confirmDelete.name}</b>?
            </p>

            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}