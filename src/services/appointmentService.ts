import type Appointment from "../models/Appointment"
import { api } from "./api"

// 🔎 LISTAR
export const getAppointments = async (
  setDados: (data: Appointment[]) => void
) => {
  try {
    const resposta = await api.get<Appointment[]>("/appointments")
    setDados(resposta.data)
  } catch (err: any) {
    if (err.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login" // redireciona se token expirou
    }
    throw err
  }
}

// 🔎 BUSCAR POR ID
export const getAppointmentById = async (
  id: number,
  setDados: (data: Appointment) => void
) => {
  const resposta = await api.get<Appointment>(`/appointments/${id}`)
  setDados(resposta.data)
}

// ➕ CRIAR
export const createAppointment = async (
  dados: any,
  setDados: (data: Appointment) => void
) => {
  const resposta = await api.post<Appointment>("/appointments", dados)
  setDados(resposta.data)
}

// ✏️ STATUS
export const updateAppointmentStatus = async (
  id: number,
  status: string,
  setDados: (data: Appointment) => void
) => {
  const resposta = await api.put<Appointment>(
    `/appointments/${id}/status`,
    { status }
  )
  setDados(resposta.data)
}

// ❌ DELETE
export const deleteAppointment = async (id: number) => {
  await api.delete(`/appointments/${id}`)
}