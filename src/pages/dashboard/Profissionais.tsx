import { useEffect, useState } from "react"
import {
  buscarProfessionals,
  cadastrarProfessional,
  atualizarProfessional,
  deletarProfessional,
} from "../../services/professionalService"
import type Professional from "../../models/Professional"

type FormData = {
  name: string
  phone: string
  available_days: string[]
  is_active: boolean
}

const EMPTY_FORM: FormData = {
  name: "",
  phone: "",
  available_days: [],
  is_active: true,
}

// 👇 iniciais do avatar
const getInitials = (name: string) =>
  name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

export default function Professionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState<"criar" | "editar" | null>(null)
  const [selected, setSelected] = useState<Professional | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState<Professional | null>(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      await buscarProfessionals(setProfessionals)
    } finally {
      setLoading(false)
    }
  }

  const openCriar = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setModal("criar")
  }

  const openEditar = (p: Professional) => {
    setSelected(p)
    setForm({
      name: p.name,
      phone: p.phone,
      available_days: p.available_days,
      is_active: p.is_active,
    })
    setModal("editar")
  }

  const handleSave = async () => {
    if (modal === "criar") {
      await cadastrarProfessional(form, (novo: Professional) => {
        setProfessionals(prev => [novo, ...prev])
      })
    } else if (modal === "editar" && selected) {
      await atualizarProfessional(selected.id, form, (atualizado: Professional) => {
        setProfessionals(prev =>
          prev.map(p => (p.id === atualizado.id ? atualizado : p))
        )
      })
    }
    setModal(null)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    await deletarProfessional(confirmDelete.id)
    setProfessionals(prev => prev.filter(p => p.id !== confirmDelete.id))
    setConfirmDelete(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Carregando profissionais...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Profissionais</h1>
          <p className="text-sm text-zinc-400">
            Gerencie a equipe de profissionais
          </p>
        </div>

        <button
          onClick={openCriar}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg text-sm"
        >
          + Novo Profissional
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {professionals.map(p => (
          <div
            key={p.id}
            className="bg-[#0B0B0B] border border-zinc-800 rounded-2xl p-6 hover:border-yellow-500/30 transition"
          >
            {/* TOP */}
            <div className="flex items-start justify-between mb-5">
              
              {/* AVATAR */}
              <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold text-sm">
                {getInitials(p.name)}
              </div>

              {/* STATUS */}
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  p.is_active
                    ? "bg-green-500/10 text-green-400"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {p.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>

            {/* NAME */}
            <h2 className="font-semibold text-white mb-2">
              {p.name}
            </h2>

            {/* SERVICE (mock enquanto não vem da API) */}
            <p className="text-yellow-500 text-sm mb-3">
              🔧 Serviço não vinculado
            </p>

            {/* CONTACT */}
            <div className="space-y-1 text-sm text-zinc-400">
              <p>📧 profissional@email.com</p>
              <p>📞 {p.phone}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => openEditar(p)}
                className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => setConfirmDelete(p)}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">
            <h2 className="mb-4 font-semibold">
              {modal === "criar" ? "Novo Profissional" : "Editar"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Nome"
                className="w-full bg-zinc-800 p-2 rounded"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />

              <input
                placeholder="Telefone"
                className="w-full bg-zinc-800 p-2 rounded"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 bg-zinc-700 py-2 rounded">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 bg-yellow-500 py-2 rounded text-black">
                Salvar
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