import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, user } = response.data

      // salva token
      localStorage.setItem("token", token)

      // (opcional) salvar user
      localStorage.setItem("user", JSON.stringify(user))

      navigate("/dashboard")
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Email ou senha inválidos")
      } else {
        setError("Erro ao fazer login")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm bg-zinc-900 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* SENHA */}
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-yellow-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERRO */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}