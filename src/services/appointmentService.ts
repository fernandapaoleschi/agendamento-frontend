import type Appointment from "../models/Appointment"
import { api, authHeader } from "./api"

// 🔎 LISTAR
export const getAppointments = async (
  setDados: (data: Appointment[]) => void
) => {
  const resposta = await api.get<Appointment[]>(
    "/appointments",
    authHeader()
  )
  setDados(resposta.data)
}

// 🔎 BUSCAR POR ID
export const getAppointmentById = async (
  id: number,
  setDados: (data: Appointment) => void
) => {
  const resposta = await api.get<Appointment>(
    `/appointments/${id}`,
    authHeader()
  )
  setDados(resposta.data)
}

// ➕ CRIAR
export const createAppointment = async (
  dados: any,
  setDados: (data: Appointment) => void
) => {
  const resposta = await api.post<Appointment>(
    "/appointments",
    dados,
    authHeader()
  )
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
    { status },
    authHeader()
  )
  setDados(resposta.data)
}

// ❌ DELETE
export const deleteAppointment = async (id: number) => {
  await api.delete(`/appointments/${id}`, authHeader())
}