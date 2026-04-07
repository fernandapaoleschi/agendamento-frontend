import { useEffect, useState } from "react"
import { api, authHeader } from "../../services/api"
import type User from "../../models/User"

type UserExtended = User & {
  name: string
  role: "admin" | "user" | "professional"
  created_at: string
}

const getInitials = (name?: string, email?: string) => {
  if (name && name.trim().length > 0) {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  // fallback usando email
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }

  return "U"
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR")

export default function Users() {
  const [users, setUsers] = useState<UserExtended[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await api.get("/users", authHeader())
      setUsers(res.data)
    } finally {
      setLoading(false)
    }
  }

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
      case "professional":
        return "bg-green-500/10 text-green-400 border border-green-500/20"
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Carregando usuários...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-zinc-400">
            Gerencie os usuários do sistema
          </p>
        </div>

        <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg text-sm">
          + Novo Usuário
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#0B0B0B] border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">

          {/* HEAD */}
          <thead>
            <tr className="text-left text-zinc-400 border-b border-zinc-800">
              <th className="px-6 py-4 font-medium">Usuário</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Função</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Criado em</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map(user => (
              <tr
                key={user.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
              >
                {/* USER */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold text-xs">
                      {getInitials(user.name)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-zinc-300">
                  {user.email}
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-md text-xs ${getRoleStyle(user.role)}`}>
                    {user.role === "admin"
                      ? "Administrador"
                      : user.role === "professional"
                      ? "Profissional"
                      : "Usuário"}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-md text-xs">
                    {user.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>

                {/* DATE */}
                <td className="px-6 py-4 text-zinc-400">
                  {formatDate(user.created_at)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}