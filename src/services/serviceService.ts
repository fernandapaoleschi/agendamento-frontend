import type Service from "../models/Service"
import { api, authHeader } from "./api"

// 🔎 LISTAR
export const buscarServices = async (setDados: Function) => {
  const resposta = await api.get<Service[]>(
    "/services",
    authHeader()
  )
  setDados(resposta.data)
}

// ➕ CRIAR
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

// ✏️ ATUALIZAR
export const atualizarService = async (
  id: number,
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.put<Service>(
    `/services/${id}`,
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ❌ DELETAR
export const deletarService = async (id: number) => {
  await api.delete(`/services/${id}`, authHeader())
}