import type Appointment from "./Appointment"

export default interface Professional {
  id: number
  name: string
  phone: string
  available_days: string[]
  is_active: boolean

  // 🔗 opcional
  appointments?: Appointment[]
}