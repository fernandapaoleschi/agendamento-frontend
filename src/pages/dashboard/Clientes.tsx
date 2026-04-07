import { useEffect, useState } from "react"
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../services/clientService"
import type Client from "../../models/Client"

type FormData = {
  name: string
  phone: string
  email: string
  vehicle_plate: string
  vehicle_model: string
}

const EMPTY_FORM: FormData = {
  name: "",
  phone: "",
  email: "",
  vehicle_plate: "",
  vehicle_model: "",
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

function Avatar({ name }: { name: string }) {
  const colors = [
    "bg-blue-600", "bg-purple-600", "bg-emerald-600",
    "bg-orange-600", "bg-pink-600", "bg-cyan-600",
  ]
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {getInitials(name)}
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR")
}

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modal, setModal] = useState<"criar" | "editar" | null>(null)
  const [selected, setSelected] = useState<Client | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const close = () => setMenuOpen(null)
    window.addEventListener("click", close)
    return () => window.removeEventListener("click", close)
  }, [])

  const load = async () => {
    try {
      await getClients(setClients)
    } finally {
      setLoading(false)
    }
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicle_plate.toLowerCase().includes(search.toLowerCase())
  )

  const openCriar = () => {
    setForm(EMPTY_FORM)
    setSelected(null)
    setModal("criar")
  }

  const openEditar = (client: Client) => {
    setSelected(client)
    setForm({
      name: client.name,
      phone: client.phone,
      email: client.email,
      vehicle_plate: client.vehicle_plate,
      vehicle_model: client.vehicle_model,
    })
    setModal("editar")
    setMenuOpen(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === "criar") {
        await createClient(form, (novo) => {
          setClients(prev => [novo, ...prev])
        })
      } else if (modal === "editar" && selected) {
        await updateClient(selected.id, form, (atualizado) => {
          setClients(prev => prev.map(c => c.id === atualizado.id ? atualizado : c))
        })
      }
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    await deleteClient(confirmDelete.id)
    setClients(prev => prev.filter(c => c.id !== confirmDelete.id))
    setConfirmDelete(null)
    setMenuOpen(null)
  }

  const inputClass = "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
  const labelClass = "block text-xs text-zinc-400 mb-1"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-zinc-400 text-sm">Gerencie os clientes cadastrados no sistema</p>
        </div>
        <button
          onClick={openCriar}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg text-sm"
        >
          + Novo Cliente
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative w-full max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
        />
      </div>

      {/* TABELA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-zinc-400 font-medium">Cliente</th>
              <th className="px-4 py-3 text-left text-zinc-400 font-medium">Contato</th>
              <th className="px-4 py-3 text-left text-zinc-400 font-medium">Veículo</th>
              <th className="px-4 py-3 text-left text-zinc-400 font-medium">Cadastro</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-300">{c.email}</p>
                    <p className="text-zinc-500 text-xs">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-300">{c.vehicle_model}</p>
                    <p className="text-zinc-500 text-xs">{c.vehicle_plate}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setMenuOpen(menuOpen === c.id ? null : c.id)
                      }}
                      className="text-zinc-400 hover:text-white px-2 py-1 rounded"
                    >
                      ···
                    </button>
                    {menuOpen === c.id && (
                      <div
                        onClick={e => e.stopPropagation()}
                        className="absolute right-4 top-10 z-10 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl w-36 py-1"
                      >
                        <button
                          onClick={() => openEditar(c)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 text-zinc-200"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => { setConfirmDelete(c); setMenuOpen(null) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 text-red-400"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CRIAR / EDITAR */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5">
              {modal === "criar" ? "Novo Cliente" : "Editar Cliente"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nome</label>
                <input className={inputClass} placeholder="João Silva" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefone</label>
                  <input className={inputClass} placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} placeholder="joao@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Modelo do veículo</label>
                  <input className={inputClass} placeholder="Gol" value={form.vehicle_model} onChange={e => setForm(f => ({ ...f, vehicle_model: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Placa</label>
                  <input className={inputClass} placeholder="ABC1234" value={form.vehicle_plate} onChange={e => setForm(f => ({ ...f, vehicle_plate: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold mb-2">Excluir cliente</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Tem certeza que deseja excluir <span className="text-white font-medium">{confirmDelete.name}</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm"
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