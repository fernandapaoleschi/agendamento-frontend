import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log("🔑 TOKEN:", config.url, token ? "TEM TOKEN" : "SEM TOKEN")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes("/auth/login")

    if (error.response?.status === 401 && !isLoginRoute) {
      sessionStorage.setItem("ultimo_erro_401", error.config?.url ?? "desconhecido")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api