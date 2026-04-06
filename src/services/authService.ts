import { api } from "./api"

// 🔐 LOGIN
export const login = async (
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.post("/auth/login", dados)

  if (resposta.data.token) {
    localStorage.setItem("token", resposta.data.token)
  }

  setDados(resposta.data)
}

// 🚪 LOGOUT
export const logout = () => {
  localStorage.removeItem("token")
}