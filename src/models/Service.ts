import type Appointment from "./Appointment"

export default interface Service {
  id: number
  name: string
  price: number
  duration: number
  description?: string
  is_active: boolean

  // 🔗 opcional (nem sempre vem do backend)
  appointments?: Appointment[]
}