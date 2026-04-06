import type Client from "./Client"
import type Service from "./Service"
import type Professional from "./Professional"

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show"

export default interface Appointment {
  id: number

  // 🔗 RELAÇÕES
  client: Client | null
  service: Service | null
  professional: Professional | null

  // 🔗 IDS
  client_id: number
  service_id: number
  professional_id: number

  // 📅 DATA
  date: string
  start_time: string
  end_time: string

  // 💾 SNAPSHOT
  service_name: string
  service_price: number
  service_duration: number

  // 💰 PAGAMENTO
  payment_method: string

  // 📊 STATUS
  status: AppointmentStatus

  // 🕒
  created_at: string
}