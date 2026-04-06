import type Professional from "../models/Professional"
import { api, authHeader } from "./api"

// 🔎 LISTAR
export const buscarProfessionals = async (setDados: Function) => {
  const resposta = await api.get<Professional[]>(
    "/professionals",
    authHeader()
  )
  setDados(resposta.data)
}

// ➕ CRIAR
export const cadastrarProfessional = async (
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.post<Professional>(
    "/professionals",
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ✏️ ATUALIZAR
export const atualizarProfessional = async (
  id: number,
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.put<Professional>(
    `/professionals/${id}`,
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ❌ DELETAR
export const deletarProfessional = async (id: number) => {
  await api.delete(`/professionals/${id}`, authHeader())
}