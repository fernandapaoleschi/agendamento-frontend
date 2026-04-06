import axios, { type AxiosRequestConfig } from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const authHeader = (): AxiosRequestConfig => {
  const token = localStorage.getItem("token")

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
}