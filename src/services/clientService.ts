import type Client from "../models/Client"
import { api, authHeader } from "./api"

// 🔎 LISTAR
export const buscarClients = async (setDados: Function) => {
  const resposta = await api.get<Client[]>(
    "/clients",
    authHeader()
  )
  setDados(resposta.data)
}

// ➕ CRIAR
export const cadastrarClient = async (
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.post<Client>(
    "/clients",
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ✏️ ATUALIZAR
export const atualizarClient = async (
  id: number,
  dados: Object,
  setDados: Function
) => {
  const resposta = await api.put<Client>(
    `/clients/${id}`,
    dados,
    authHeader()
  )
  setDados(resposta.data)
}

// ❌ DELETAR
export const deletarClient = async (id: number) => {
  await api.delete(`/clients/${id}`, authHeader())
}