import type Appointment from "../models/Appointment"
import { api, authHeader } from "./api"

// 🔎 LISTAR
export const buscarAppointments = async (
  setDados: Function
) => {
  const resposta = await api.get<Appointment[]>(
    "/appointments",
    authHeader()
  )
  setDados(resposta.data)
}

// 🔎 BUSCAR POR ID
export const buscarAppointmentPorId = async (
  id: number,
  setDados: Function
) => {
  const resposta = await api.get<Appointment>(
    `/appointments/${id}`,
    authHeader()
  )
  setDados(resposta.data)
}

// ➕ CRIAR
export const cadastrarAppointment = async (
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.post<Appointment>(
    "/appointments",
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ✏️ ATUALIZAR STATUS
export const atualizarStatusAppointment = async (
  id: number,
  status: string,
  setDados: Function
) => {
  const resposta = await api.put<Appointment>(
    `/appointments/${id}/status`,
    { status },
    authHeader()
  )
  setDados(resposta.data)
}

// ❌ DELETAR
export const deletarAppointment = async (id: number) => {
  await api.delete(`/appointments/${id}`, authHeader())
}