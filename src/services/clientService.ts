import type Client from "../models/Client"
import { api } from "./api"

// 🔎 LISTAR
export const getClients = async (
  setDados: (data: Client[]) => void
) => {
  const resposta = await api.get<Client[]>("/clients")
  setDados(resposta.data)
}

// ➕ CRIAR
export const createClient = async (
  dados: any,
  setDados: (data: Client) => void
) => {
  const resposta = await api.post<Client>("/clients", dados)
  setDados(resposta.data)
}

// ✏️ ATUALIZAR
export const updateClient = async (
  id: number,
  dados: any,
  setDados: (data: Client) => void
) => {
  const resposta = await api.put<Client>(`/clients/${id}`, dados)
  setDados(resposta.data)
}

// ❌ DELETAR
export const deleteClient = async (id: number) => {
  await api.delete(`/clients/${id}`)
}