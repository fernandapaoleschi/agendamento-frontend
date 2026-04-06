import type Appointment from "./Appointment"

export default interface Client {
  id: number
  name: string
  phone: string
  email: string
  vehicle_plate: string
  vehicle_model: string
  created_at: string

  // 🔗 RELAÇÃO
  appointments?: Appointment[]
}