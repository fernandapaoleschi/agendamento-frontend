import type Service from "../models/Service"
import { api, authHeader } from "./api"

//
// 🔓 =======================
// PUBLIC (SEM TOKEN)
// =======================
//

export const getAllServices = async (): Promise<Service[]> => {
  const response = await api.get<Service[]>("/services")
  return response.data
}

export const getServiceById = async (id: number): Promise<Service> => {
  const response = await api.get<Service>(`/services/${id}`)
  return response.data
}

//
// 🔒 =======================
// ADMIN (COM TOKEN)
// =======================
//

// LISTAR (admin)
export const buscarServices = async (setDados: Function) => {
  const resposta = await api.get<Service[]>(
    "/services",
    authHeader()
  )
  setDados(resposta.data)
}

// CRIAR
export const cadastrarService = async (
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.post<Service>(
    "/services",
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ATUALIZAR
export const atualizarService = async (
  id: number,
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.patch<Service>(
    `/services/${id}`,
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// DELETAR
export const deletarService = async (id: number) => {
  await api.delete(`/services/${id}`, authHeader())
}