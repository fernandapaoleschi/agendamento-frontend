import type Log from "../models/Log"
import { api, authHeader } from "./api"

// 🔎 LISTAR LOGS
export const buscarLogs = async (setDados: Function) => {
  const resposta = await api.get<Log[]>(
    "/logs",
    authHeader()
  )
  setDados(resposta.data)
}