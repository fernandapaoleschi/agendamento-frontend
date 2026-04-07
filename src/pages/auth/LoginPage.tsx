import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../services/api"

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data
      localStorage.setItem("token", token)
      if (user) {
  localStorage.setItem("user", JSON.stringify(user))
}
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#c9960c]/40 flex items-center justify-center shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"
              stroke="#c9960c"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-white leading-tight">AutoSchedule Pro</p>
          <p className="text-sm text-zinc-400 leading-tight">Painel Administrativo</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-1">
          Entrar no Sistema
        </h1>
        <p className="text-sm text-zinc-400 text-center mb-7">
          Digite suas credenciais para acessar o painel
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9960c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c9960c]/70 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9960c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                className="w-full px-4 py-3 pr-11 rounded-lg bg-[#1a1a1a] border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c9960c]/70 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ERRO */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9960c] hover:bg-[#b8870b] disabled:opacity-60 text-black font-semibold py-3 rounded-lg transition-colors mt-1"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </div>

      {/* Footer */}
      <p className="text-xs text-zinc-600 mt-8">
        © 2024 AutoSchedule Pro. Todos os direitos reservados.
      </p>
    </div>
  )
}