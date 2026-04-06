import type Appointment from "./Appointment"
import type Client from "./Client"

export type LogAction =
  | "created"
  | "updated"
  | "cancelled"
  | "completed"
  | "no_show"

export default interface Log {
  id: number

  appointment: Appointment | null
  client: Client | null

  action: LogAction

  data_snapshot: Record<string, any>

  created_at: string
}